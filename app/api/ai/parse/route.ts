import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseTransactionWithAI } from "@/lib/ai";
import { formatRupiah } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // 1. Ekstraksi data transaksi menggunakan AI Flash NLP / Fallback Parser
    const parsed = await parseTransactionWithAI(message.trim());

    // 2. Simpan otomatis ke database PostgreSQL Neon dengan isolasi userId
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        note: parsed.note,
        date: parsed.date ? new Date(parsed.date) : new Date(),
      },
    });

    // 3. Susun respons konfirmasi ramah
    const jenisText = parsed.type === "INCOME" ? "pemasukan" : "pengeluaran";
    const reply = `Siap! Catatan ${jenisText} sebesar **${formatRupiah(parsed.amount)}** untuk kategori **${parsed.category}** *(Catatan: ${parsed.note})* telah otomatis tersimpan ke dompet Anda.`;

    return NextResponse.json({
      reply,
      transaction,
      parsed,
    });
  } catch (error: any) {
    console.error("AI Parse Route Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan AI. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
