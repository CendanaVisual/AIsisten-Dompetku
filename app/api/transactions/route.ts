import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive("Nominal harus lebih dari 0."),
  category: z.string().min(1, "Kategori wajib dipilih."),
  note: z.string().optional().default(""),
  date: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // INCOME or EXPENSE
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const month = searchParams.get("month"); // 1-12
    const year = searchParams.get("year"); // e.g. 2026
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Strict user isolation filter
    const whereClause: any = {
      userId: session.user.id,
    };

    if (type && (type === "INCOME" || type === "EXPENSE")) {
      whereClause.type = type;
    }

    if (category && category !== "ALL") {
      whereClause.category = category;
    }

    if (search && search.trim() !== "") {
      whereClause.OR = [
        { note: { contains: search.trim(), mode: "insensitive" } },
        { category: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const startDate = new Date(Date.UTC(y, m - 1, 1));
      const endDate = new Date(Date.UTC(y, m, 1));
      whereClause.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("GET Transactions Error:", error);
    return NextResponse.json({ error: "Gagal memuat transaksi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createTransactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Data tidak valid." },
        { status: 400 }
      );
    }

    const { type, amount, category, note, date } = result.data;
    const parsedDate = date ? new Date(date) : new Date();

    // Data isolation: strictly assign userId from session
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type,
        amount,
        category,
        note: note?.trim() || "",
        date: parsedDate,
      },
    });

    return NextResponse.json(
      {
        message: "Transaksi berhasil ditambahkan.",
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Transaction Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan transaksi." }, { status: 500 });
  }
}
