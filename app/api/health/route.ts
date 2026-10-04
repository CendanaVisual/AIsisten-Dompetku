import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { describeDbError } from "@/lib/db-errors";
import { isAppleEnabled, isGoogleEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Endpoint diagnostik: GET /api/health
 * Mengecek konfigurasi environment & koneksi database tanpa membocorkan nilai rahasia.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "auto (VERCEL_URL)",
    GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
    GOOGLE_LOGIN: isGoogleEnabled,
    APPLE_LOGIN: isAppleEnabled,
  };

  let database: { ok: boolean; latencyMs?: number; code?: string; message?: string };
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.user.count();
    database = { ok: true, latencyMs: Date.now() - started };
  } catch (error) {
    const info = describeDbError(error);
    console.error("[health] database check failed:", error);
    database = { ok: false, code: info.code, message: info.message };
  }

  const ok = database.ok && env.DATABASE_URL && env.NEXTAUTH_SECRET;

  return NextResponse.json(
    { status: ok ? "ok" : "degraded", env, database, timestamp: new Date().toISOString() },
    { status: ok ? 200 : 503 }
  );
}
