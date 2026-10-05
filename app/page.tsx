"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Wallet,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Database,
  ArrowRight,
  CheckCircle2,
  Bot,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-emerald-500/10 dark:bg-gold-500/15 blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-gold-500/40 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-gold-300 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-gold-400" />
            <span>Didukung Smart AI & Database Terverifikasi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-gold-100 max-w-4xl mx-auto leading-[1.15]">
            Asisten Keuangan Cerdas{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:gold-text-glow bg-clip-text text-transparent">
              AIsisten Dompetku
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-gold-200/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Catat pengeluaran dan pemasukan semudah berkirim pesan santai.
            AI mengekstrak nominal, kategori, dan jenis transaksi secara otomatis
            langsung ke database Anda yang aman dan terisolasi.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Buka Dashboard Saya</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Mulai Sekarang Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-white/90 dark:bg-slate-900/90 px-8 py-3.5 text-sm font-bold text-slate-800 dark:text-gold-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Masuk ke Akun
                </Link>
              </>
            )}
          </div>

          {/* Interactive Chat Mockup Preview */}
          <div className="mt-14 max-w-3xl mx-auto luxury-card rounded-3xl p-5 sm:p-7 shadow-2xl text-left border border-slate-200 dark:border-gold-500/40">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-gold-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-gold-300 ml-2">
                  Live Preview: Pengenalan Bahasa Alami AI Flash
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/40 px-2.5 py-0.5 rounded-full">
                Database Synced
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 font-semibold text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm max-w-[85%]">
                  "Hari ini saya beli kopi harganya 25 ribu pakai uang tunai"
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-gold-100 rounded-2xl rounded-tl-none p-3.5 border border-slate-200/60 dark:border-gold-500/30 max-w-[85%] space-y-2">
                  <p>
                    Baik, pengeluaran sebesar <strong className="text-rose-600 dark:text-rose-400">Rp 25.000</strong> untuk <strong>Beli kopi pakai uang tunai</strong> (<em>Makanan & Minuman</em>) telah berhasil dicatat ke dompet Anda!
                  </p>
                  <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-gold-500/20 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-gold-400 font-medium">Status Database:</span>
                    <span className="text-emerald-700 dark:text-gold-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tersimpan di Database
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-gold-500/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:gold-text-glow">
              Dirancang untuk Kecepatan, Kenyamanan & Kemewahan
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-gold-300 font-medium">
              Fitur lengkap yang memudahkan siapa saja memantau arus kas pribadi tanpa ribet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-gold-200">
                AI Smart Canggih
              </h3>
              <p className="text-xs text-slate-600 dark:text-gold-400/80 leading-relaxed font-medium">
                Ekstraksi otomatis tipe transaksi, nominal dalam Rupiah, kategori, dan catatan secara presisi dari percakapan santai.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-gold-200">
                Isolasi Data Aman
              </h3>
              <p className="text-xs text-slate-600 dark:text-gold-400/80 leading-relaxed font-medium">
                Setiap akun diisolasi secara ketat & aman. Data keuangan Anda 100% privat dan tidak dapat diakses pengguna lain.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-gold-200">
                Grafik & Analitik Visual
              </h3>
              <p className="text-xs text-slate-600 dark:text-gold-400/80 leading-relaxed font-medium">
                Pantau pergerakan arus kas 6 bulan terakhir dan komposisi pengeluaran per kategori melalui grafik visual yang interaktif.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-gold-200">
                Cloud
              </h3>
              <p className="text-xs text-slate-600 dark:text-gold-400/80 leading-relaxed font-medium">
                Penyimpanan cloud serverless berkinerja tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-gold-500/25 py-8 text-center text-xs text-slate-500 dark:text-gold-400/70 font-medium">
        <p>© 2026 AIsisten Dompetku. Cendana Visual.</p>
      </footer>
    </div>
  );
}
