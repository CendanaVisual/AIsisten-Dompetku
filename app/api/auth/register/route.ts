import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .max(30, "Username maksimal 30 karakter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors[0]?.message || "Data tidak valid.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { username, email, password } = result.data;
    const cleanUsername = username.trim();
    const cleanEmail = email.toLowerCase().trim();

    // Cek apakah username atau email sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: "insensitive" } },
          { username: { equals: cleanUsername, mode: "insensitive" } },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === cleanEmail) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan login atau gunakan email lain." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Username sudah digunakan. Silakan pilih username lain." },
        { status: 409 }
      );
    }

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil! Silakan masuk.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
