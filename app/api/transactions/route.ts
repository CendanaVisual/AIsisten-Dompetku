import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { describeDbError } from "@/lib/db-errors";

export const dynamic = "force-dynamic";

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce
    .number()
    .positive("Nominal harus lebih dari 0.")
    .max(1_000_000_000_000, "Nominal terlalu besar."),
  category: z.string().trim().min(1, "Kategori wajib dipilih.").max(50),
  note: z.string().trim().max(300, "Catatan maksimal 300 karakter.").optional().default(""),
  date: z.string().refine(isValidDate, "Format tanggal tidak valid.").optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesi berakhir, silakan login kembali." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().slice(0, 100);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));
    const limitParam = Number(searchParams.get("limit"));
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 500;

    // Isolasi data: SELALU difilter dengan userId dari sesi
    const where: Prisma.TransactionWhereInput = { userId: session.user.id };

    if (type === "INCOME" || type === "EXPENSE") where.type = type;
    if (category && category !== "ALL") where.category = category;
    if (search) {
      where.OR = [
        { note: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }
    if (month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
      where.date = {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[transactions:GET] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesi berakhir, silakan login kembali." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const result = createTransactionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Data tidak valid." },
        { status: 400 }
      );
    }

    const { type, amount, category, note, date } = result.data;

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type,
        amount,
        category,
        note,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(
      { message: "Transaksi berhasil ditambahkan.", transaction },
      { status: 201 }
    );
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[transactions:POST] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}
