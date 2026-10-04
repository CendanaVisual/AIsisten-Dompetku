import { Prisma } from "@prisma/client";

export interface DbErrorInfo {
  status: number;
  message: string;
  code: string;
}

/**
 * Menerjemahkan error Prisma/database menjadi pesan yang jelas untuk pengguna
 * tanpa membocorkan detail internal (connection string, stack trace, dll).
 */
export function describeDbError(error: unknown): DbErrorInfo {
  if (!process.env.DATABASE_URL) {
    return {
      status: 503,
      code: "DB_NOT_CONFIGURED",
      message:
        "Database belum dikonfigurasi di server (DATABASE_URL kosong). Hubungi admin untuk menambahkannya di Environment Variables Vercel.",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      code: error.errorCode ?? "DB_INIT_FAILED",
      message: "Server tidak dapat terhubung ke database. Silakan coba beberapa saat lagi.",
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return { status: 409, code: error.code, message: "Data sudah terdaftar (duplikat)." };
      case "P2021":
      case "P2022":
        return {
          status: 503,
          code: error.code,
          message: "Struktur tabel database belum siap. Admin perlu menjalankan `npx prisma db push`.",
        };
      case "P1001":
      case "P1002":
        return { status: 503, code: error.code, message: "Database tidak dapat dijangkau. Coba lagi nanti." };
      default:
        return { status: 500, code: error.code, message: "Terjadi kesalahan pada database." };
    }
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return { status: 500, code: "DB_PANIC", message: "Mesin database mengalami gangguan. Coba lagi." };
  }

  return { status: 500, code: "UNKNOWN", message: "Terjadi kesalahan internal pada server." };
}
