import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { describeDbError } from "@/lib/db-errors";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .max(30, "Username maksimal 30 karakter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore."),
  email: z.string().trim().toLowerCase().email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(72, "Password maksimal 72 karakter."),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Data tidak valid.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { username, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { username: { equals: username, mode: "insensitive" } },
        ],
      },
      select: { email: true, provider: true },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email) {
        const hint =
          existingUser.provider === "google"
            ? " Akun ini terhubung dengan Akun Google — silakan masuk menggunakan tombol Akun Google."
            : " Silakan masuk atau gunakan email lain.";
        return NextResponse.json({ error: `Email sudah terdaftar.${hint}` }, { status: 409 });
      }
      return NextResponse.json(
        { error: "Username sudah digunakan. Silakan pilih username lain." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        provider: "credentials",
      },
      select: { id: true, username: true, email: true, createdAt: true },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil! Silakan masuk.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    const info = describeDbError(error);
    console.error(`[register] ${info.code}:`, error);
    return NextResponse.json({ error: info.message, code: info.code }, { status: info.status });
  }
}
