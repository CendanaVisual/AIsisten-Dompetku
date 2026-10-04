import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const isGoogleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

/**
 * Buat username unik dari email untuk akun OAuth (Google).
 */
async function generateUniqueUsername(email: string): Promise<string> {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "pengguna";

  let candidate = base.length >= 3 ? base : `${base}_user`;
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.user.findUnique({ where: { username: candidate } });
    if (!exists) return candidate;
    candidate = `${base}_${Math.random().toString(36).slice(2, 7)}`;
  }
  return `${base}_${Date.now().toString(36)}`;
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email atau Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.identifier || !credentials?.password) {
        throw new Error("Mohon masukkan email/username dan password.");
      }

      const identifier = credentials.identifier.trim();

      let user;
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: "insensitive" } },
              { username: { equals: identifier, mode: "insensitive" } },
            ],
          },
        });
      } catch (error) {
        console.error("[auth] Database error saat login:", error);
        throw new Error("Server tidak dapat terhubung ke database. Coba beberapa saat lagi.");
      }

      if (!user) {
        throw new Error("Akun tidak ditemukan atau password salah.");
      }

      if (!user.password) {
        throw new Error("Akun ini terdaftar melalui Akun Google. Silakan masuk menggunakan tombol Akun Google.");
      }

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) {
        throw new Error("Akun tidak ditemukan atau password salah.");
      }

      return { id: user.id, name: user.username, email: user.email, image: user.image };
    },
  }),
];

if (isGoogleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === "credentials") return true;

      const email = user.email?.toLowerCase().trim();
      if (!email) return "/login?error=OAuthNoEmail";

      // Google menyertakan status verifikasi email jika tersedia
      if (
        account.provider === "google" &&
        (profile as { email_verified?: boolean } | undefined)?.email_verified === false
      ) {
        return "/login?error=OAuthEmailNotVerified";
      }

      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) {
          await prisma.user.create({
            data: {
              email,
              username: await generateUniqueUsername(email),
              name: user.name ?? null,
              image: user.image ?? null,
              provider: account.provider,
            },
          });
        } else if (!existing.image && user.image) {
          await prisma.user.update({
            where: { email },
            data: {
              image: user.image,
              name: existing.name || user.name || null,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("[auth] Gagal menyimpan akun OAuth:", error);
        return "/login?error=DatabaseError";
      }
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === "credentials") {
          token.id = user.id;
          token.username = user.name;
        } else {
          // Untuk OAuth, ambil ID dari database
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email!.toLowerCase().trim() },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
          }
        }
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = (token.username as string) ?? session.user.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-aisisten-dompetku-2026-generate-random",
};

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}
