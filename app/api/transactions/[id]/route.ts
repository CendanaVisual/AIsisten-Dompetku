import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  amount: z.number().positive("Nominal harus lebih dari 0.").optional(),
  category: z.string().min(1, "Kategori wajib diisi.").optional(),
  note: z.string().optional(),
  date: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id, // Isolasi data pengguna
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("GET Single Transaction Error:", error);
    return NextResponse.json({ error: "Gagal memuat transaksi." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const result = updateTransactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Data tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan transaksi adalah milik user yang sedang login
    const existing = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan atau bukan milik Anda." }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (result.data.type) dataToUpdate.type = result.data.type;
    if (result.data.amount) dataToUpdate.amount = result.data.amount;
    if (result.data.category) dataToUpdate.category = result.data.category;
    if (result.data.note !== undefined) dataToUpdate.note = result.data.note;
    if (result.data.date) dataToUpdate.date = new Date(result.data.date);

    const updated = await prisma.transaction.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Transaksi berhasil diperbarui.",
      transaction: updated,
    });
  } catch (error) {
    console.error("PUT Transaction Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui transaksi." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Pastikan hanya bisa menghapus data milik sendiri
    const existing = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan atau bukan milik Anda." }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaksi berhasil dihapus." });
  } catch (error) {
    console.error("DELETE Transaction Error:", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi." }, { status: 500 });
  }
}
