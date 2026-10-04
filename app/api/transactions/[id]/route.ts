import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { describeDbError } from "@/lib/db-errors";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

const updateTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  amount: z.coerce
    .number()
    .positive("Nominal harus lebih dari 0.")
    .max(1_000_000_000_000, "Nominal terlalu besar.")
    .optional(),
  category: z.string().trim().min(1, "Kategori wajib diisi.").max(50).optional(),
  note: z.string().trim().max(300, "Catatan maksimal 300 karakter.").optional(),
  date: z.string().refine(isValidDate, "Format tanggal tidak valid.").optional(),
});

const unauthorized = () =>
  NextResponse.json({ error: "Sesi berakhir, silakan login kembali." }, { status: 401 });

const notFound = () =>
  NextResponse.json({ error: "Transaksi tidak ditemukan atau bukan milik Anda." }, { status: 404 });

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) return unauthorized();

    const transaction = await prisma.transaction.findFirst({
      where: { id: params.id, userId: session.user.id },
    });
    if (!transaction) return notFound();

    return NextResponse.json({ transaction });
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[transaction:GET] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) return unauthorized();

    const body = await req.json().catch(() => null);
    const result = updateTransactionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Data tidak valid." },
        { status: 400 }
      );
    }

    const { date, ...rest } = result.data;

    // updateMany + filter userId = update atomik yang hanya menyentuh data milik user ini
    const updated = await prisma.transaction.updateMany({
      where: { id: params.id, userId: session.user.id },
      data: { ...rest, ...(date ? { date: new Date(date) } : {}) },
    });
    if (updated.count === 0) return notFound();

    const transaction = await prisma.transaction.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Transaksi berhasil diperbarui.", transaction });
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[transaction:PUT] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) return unauthorized();

    const deleted = await prisma.transaction.deleteMany({
      where: { id: params.id, userId: session.user.id },
    });
    if (deleted.count === 0) return notFound();

    return NextResponse.json({ message: "Transaksi berhasil dihapus." });
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[transaction:DELETE] ${info.code}:`, error);
    return NextResponse.json({ error: info.message }, { status: info.status });
  }
}
