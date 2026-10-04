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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.slate.50))]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Didukung AI Flash & PostgreSQL Neon</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Asisten Keuangan Cerdas{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              AIsisten Dompetku
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Catat pengeluaran dan pemasukan semudah berkirim pesan santai.
            AI mengekstrak nominal, kategori, dan jenis transaksi secara otomatis
            langsung ke database Anda yang aman dan terisolasi.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
              >
                <span>Buka Dashboard Saya</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <span>Mulai Sekarang Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Masuk ke Akun
                </Link>
              </>
            )}
          </div>

          {/* Interactive Chat Mockup Preview */}
          <div className="mt-14 max-w-3xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-2xl shadow-emerald-900/10 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 ml-2">
                  Live Preview: Pengenalan Bahasa Alami AI
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Database Synced
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-end">
                <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm max-w-[85%]">
                  "Hari ini saya beli kopi harganya 25 ribu pakai uang tunai"
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none p-3.5 border border-slate-200/60 max-w-[85%] space-y-2">
                  <p>
                    Baik! Pengeluaran sebesar <strong>Rp 25.000</strong> untuk <strong>Makanan & Minuman</strong> *(Catatan: Beli kopi uang tunai)* telah berhasil dicatat ke dompet Anda!
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Status Database:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tersimpan di Neon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Dirancang untuk Kecepatan, Kenyamanan & Keamanan
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Fitur lengkap yang memudahkan siapa saja memantau arus kas pribadi tanpa ribet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                AI Flash NLP Canggih
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ekstraksi otomatis tipe transaksi, nominal dalam Rupiah, kategori, dan catatan secara presisi dari percakapan santai.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Isolasi Data Aman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap akun diisolasi secara ketat dengan NextAuth & Bcrypt. Data keuangan Anda 100% privat dan tidak dapat diakses pengguna lain.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Grafik & Analitik Visual
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pantau pergerakan arus kas 6 bulan terakhir dan komposisi pengeluaran per kategori melalui grafik visual yang interaktif.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                PostgreSQL Neon Cloud
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyimpanan cloud serverless PostgreSQL berkinerja tinggi, siap dideploy langsung ke Vercel tanpa kendala cold start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-400">
        <p>© 2026 AIsisten Dompetku. Dibuat dengan Next.js 14, Tailwind CSS, PostgreSQL Neon & AI Flash.</p>
      </footer>
    </div>
  );
}
