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
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors dark:border-gold-500/25 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-gold-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform dark:shadow-gold-500/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-gold-300">
                AIsisten
              </span>
              <span className="font-bold text-lg tracking-tight text-emerald-600 dark:gold-text-glow">
                Dompetku
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-gold-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-gold-300 dark:border dark:border-gold-500/40">
                AI Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gold-400/80 hidden sm:block -mt-1">
              Asisten Keuangan Cerdas Mandiri
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        {session && (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                pathname === "/dashboard"
                  ? "bg-emerald-50 text-emerald-700 shadow-sm dark:bg-gold-500/15 dark:text-gold-300 dark:border dark:border-gold-500/40"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gold-200/80 dark:hover:bg-slate-900 dark:hover:text-gold-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/transactions"
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                pathname === "/transactions"
                  ? "bg-emerald-50 text-emerald-700 shadow-sm dark:bg-gold-500/15 dark:text-gold-300 dark:border dark:border-gold-500/40"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gold-200/80 dark:hover:bg-slate-900 dark:hover:text-gold-100"
              }`}
            >
              <Receipt className="h-4 w-4" />
              <span>Transaksi</span>
            </Link>
          </nav>
        )}

        {/* Right side User / Theme Toggle / Auth state */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          ) : session ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 text-right">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-gold-300 dark:border-gold-500/30">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-gold-200 leading-tight">
                    {session.user.name || "Pengguna"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-gold-400/70 leading-tight truncate max-w-[120px]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
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
                className="rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors dark:text-gold-300 dark:hover:bg-slate-900"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition-all dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 dark:font-bold dark:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
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
