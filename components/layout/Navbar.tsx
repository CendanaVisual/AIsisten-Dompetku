"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                AIsisten
              </span>
              <span className="font-bold text-lg tracking-tight text-emerald-600">
                Dompetku
              </span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                AI Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block -mt-1">
              Asisten Keuangan Cerdas Mandiri
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        {session && (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/transactions"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/transactions"
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Receipt className="h-4 w-4" />
              <span>Transaksi</span>
            </Link>
          </nav>
        )}

        {/* Right side User / Auth state */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-slate-200" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-right">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {session.user.name || "Pengguna"}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[120px]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Daftar Akun
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
