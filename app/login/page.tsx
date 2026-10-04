"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Wallet,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const authError = searchParams.get("error");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authError) {
      if (authError === "OAuthAccountNotLinked") {
        setError("Email akun ini sudah terdaftar dengan metode lain. Silakan gunakan metode yang sesuai.");
      } else if (authError === "OAuthNoEmail") {
        setError("Akun tidak menyediakan alamat email. Silakan gunakan metode pendaftaran email.");
      } else {
        setError("Terjadi kesalahan saat masuk dengan akun sosial.");
      }
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Email/Username atau password salah.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setError(null);
    setIsOAuthLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err: any) {
      setError("Gagal menghubungkan akun. Silakan coba lagi.");
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors">
      {/* Background Luxury Ambient Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] h-[450px] w-[450px] rounded-full bg-emerald-500/10 dark:bg-gold-500/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[450px] w-[450px] rounded-full bg-teal-500/10 dark:bg-gold-600/15 blur-[120px] pointer-events-none animate-pulse" />

      {/* Top Floating Theme Toggle */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 flex items-center gap-3">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Luxury Glass Card */}
        <div className="luxury-card rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Top Gold Shimmer Trim */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-gold-400 to-teal-500 dark:from-gold-600 dark:via-gold-300 dark:to-gold-600" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-13 w-13 p-3 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-gold-500 text-white shadow-xl shadow-emerald-600/25 dark:shadow-gold-500/20 group hover:scale-105 transition-transform">
              <Wallet className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:gold-text-glow">
              Masuk ke AIsisten Dompetku
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gold-300/80 font-medium max-w-sm mx-auto">
              Kelola finansial Anda secara cerdas, mandiri, dan aman.
            </p>
          </div>

          {/* Registration Success Banner */}
          {registered && (
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-gold-500/15 dark:border-gold-500/40 p-3.5 text-xs text-emerald-800 dark:text-gold-200 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-gold-400" />
              <span>Akun berhasil didaftarkan! Silakan masuk dengan kredensial Anda.</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-500/40 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
              {error}
            </div>
          )}

          {/* Social Sign-In (Google & Apple/iCloud) */}
          <div className="space-y-2.5 mb-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={!!isOAuthLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all dark:border-gold-500/35 dark:bg-slate-900/90 dark:text-gold-200 dark:hover:bg-slate-800 dark:hover:border-gold-400"
            >
              {isOAuthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600 dark:text-gold-300" />
              ) : (
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Masuk dengan Akun Google</span>
            </button>

            {/* Apple / iCloud iPhone Button */}
            <button
              type="button"
              onClick={() => handleOAuthSignIn("apple")}
              disabled={!!isOAuthLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-900 bg-slate-950 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-900 active:scale-[0.99] transition-all dark:border-gold-500/35 dark:bg-black dark:text-gold-200 dark:hover:border-gold-400"
            >
              {isOAuthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin text-white dark:text-gold-300" />
              ) : (
                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.55.63-1.03 1.67-.9 2.68 1 .08 1.97-.42 2.59-1.17z" />
                </svg>
              )}
              <span>Masuk dengan Akun Apple (iCloud iPhone)</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-gold-500/25" />
            </div>
            <span className="relative bg-white/90 dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 dark:text-gold-400/80 uppercase tracking-wider">
              atau masuk dengan email / username
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
                Email atau Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-gold-400/60" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nama@email.com atau username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-gold-500/35 dark:bg-slate-900/80 dark:text-gold-100 dark:placeholder-gold-500/40 dark:focus:border-gold-400 dark:focus:ring-gold-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-gold-400/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-gold-500/35 dark:bg-slate-900/80 dark:text-gold-100 dark:placeholder-gold-500/40 dark:focus:border-gold-400 dark:focus:ring-gold-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:text-gold-400/70 dark:hover:text-gold-200 transition-colors"
                  title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all active:scale-[0.99] mt-3 dark:from-gold-600 dark:via-gold-500 dark:to-gold-600 dark:text-slate-950 dark:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white dark:text-slate-950" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Masuk Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-gold-300 font-medium">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-600 dark:text-gold-400 hover:underline underline-offset-4"
            >
              Daftar akun gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-gold-400" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
