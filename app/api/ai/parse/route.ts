import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseTransactionWithAI } from "@/lib/ai";
import { describeDbError } from "@/lib/db-errors";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";
// Beri waktu cukup untuk cascade model AI di Vercel
export const maxDuration = 45;

const MAX_MESSAGE_LENGTH = 500;

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sesi berakhir, silakan login kembali." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Pesan terlalu panjang (maks. ${MAX_MESSAGE_LENGTH} karakter).` },
      { status: 400 }
    );
  }

  const result = await parseTransactionWithAI(message);

  // Pesan bukan transaksi → balas saja, JANGAN simpan apa pun ke database
  if (result.kind === "chat") {
    return NextResponse.json({ reply: result.reply, saved: false, engine: result.engine });
  }

  const parsed = result.data;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id, // isolasi data: selalu dari sesi, bukan dari input
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        note: parsed.note,
        date: new Date(parsed.date),
      },
    });

    const jenis = parsed.type === "INCOME" ? "Pemasukan" : "Pengeluaran";
    const reply = `Baik, ${jenis.toLowerCase()} sebesar ${formatRupiah(parsed.amount)} untuk ${parsed.note} (${parsed.category}) telah dicatat.`;

    return NextResponse.json({ reply, saved: true, transaction, parsed, engine: result.engine });
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[ai:parse] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}
