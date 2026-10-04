"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Wallet,
  Loader2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Home,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan pendaftaran.");
      }

      setSuccess("Registrasi berhasil! Menyiapkan akun Anda...");
      setTimeout(() => {
        setIsNavigating(true);
        setTimeout(() => {
          router.push("/login?registered=1");
        }, 280);
      }, 900);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan internal pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    setError(null);
    setIsOAuthLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err: any) {
      setError("Gagal menghubungkan akun Google. Silakan coba lagi.");
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors">
      {/* Background Luxury Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/15 dark:bg-gold-500/20 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-teal-500/15 dark:bg-gold-600/20 blur-[130px] pointer-events-none animate-pulse" />

      {/* Top Floating Luxury Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-7 sm:left-8 sm:right-8 z-30 flex items-center justify-between">
        {/* Tombol Home / Beranda */}
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-md backdrop-blur-md hover:border-emerald-500 hover:text-emerald-700 hover:shadow-emerald-500/10 active:scale-95 transition-all dark:border-gold-500/40 dark:bg-slate-900/85 dark:text-gold-200 dark:hover:border-gold-400 dark:hover:text-gold-100 dark:hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          title="Kembali ke Beranda"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform dark:bg-gold-500/15 dark:text-gold-300">
            <Home className="h-3.5 w-3.5" />
          </div>
          <span>Beranda</span>
        </button>

        {/* Theme Toggle Button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Luxury Auth Card Container with Smooth Transition */}
      <div
        className={`relative w-full max-w-lg z-10 my-16 transition-all duration-300 ${
          isNavigating ? "luxury-page-exit" : "luxury-page-enter"
        }`}
      >
        <div className="luxury-card rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden luxury-shimmer-sweep">
          {/* Top Gold Shimmer Trim */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-gold-400 to-teal-500 dark:from-gold-600 dark:via-gold-300 dark:to-gold-600" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-14 w-14 p-3.5 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-gold-500 text-white shadow-xl shadow-emerald-600/30 dark:shadow-gold-500/25 group hover:scale-105 transition-transform">
              <Wallet className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:gold-text-glow">
              Daftar Akun Baru
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gold-300/80 font-medium max-w-sm mx-auto">
              Mulai kelola finansial mandiri dengan kecerdasan buatan kelas premium.
            </p>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-500/40 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-gold-500/15 dark:border-gold-500/40 p-3.5 text-xs text-emerald-800 dark:text-gold-200 font-medium flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-gold-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-In Button (Social Login Tunggal Google) */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleOAuthSignIn}
              disabled={isOAuthLoading || isLoading || isNavigating}
              className="w-full relative group flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.99] transition-all dark:border-gold-500/40 dark:bg-slate-900/90 dark:text-gold-200 dark:hover:bg-slate-800 dark:hover:border-gold-400 dark:hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              {isOAuthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600 dark:text-gold-300" />
              ) : (
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
              <span className="font-medium tracking-wide">
                {isOAuthLoading ? "Menghubungkan Akun Google..." : "Daftar langsung dengan Akun Google"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-gold-500/25" />
            </div>
            <span className="relative bg-white/95 dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 dark:text-gold-400/80 uppercase tracking-wider">
              atau daftar dengan formulir email
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-gold-400/60" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-gold-500/35 dark:bg-slate-900/80 dark:text-gold-100 dark:placeholder-gold-500/40 dark:focus:border-gold-400 dark:focus:ring-gold-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-gold-400/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-gold-500/35 dark:bg-slate-900/80 dark:text-gold-100 dark:placeholder-gold-500/40 dark:focus:border-gold-400 dark:focus:ring-gold-500/20"
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
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
                  placeholder="Minimal 8 karakter"
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

            {/* Confirm Password with Eye Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-gold-400/60" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-gold-500/35 dark:bg-slate-900/80 dark:text-gold-100 dark:placeholder-gold-500/40 dark:focus:border-gold-400 dark:focus:ring-gold-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:text-gold-400/70 dark:hover:text-gold-200 transition-colors"
                  title={showConfirmPassword ? "Sembunyikan Password" : "Lihat Password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button with Luxury Animation */}
            <button
              type="submit"
              disabled={isLoading || !!success || isNavigating}
              className="w-full group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all active:scale-[0.99] mt-3 dark:from-gold-600 dark:via-gold-500 dark:to-gold-600 dark:text-slate-950 dark:shadow-[0_0_22px_rgba(212,175,55,0.35)] dark:hover:shadow-[0_0_28px_rgba(212,175,55,0.5)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white dark:text-slate-950" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  <span>Daftar Akun Sekarang</span>
                  <ArrowRight className="h-4 w-4 ml-1 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation Switcher with Transition */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-gold-300 font-medium">
            Sudah memiliki akun?{" "}
            <button
              type="button"
              onClick={() => handleNavigate("/login")}
              className="font-bold text-emerald-600 dark:text-gold-400 hover:underline underline-offset-4 inline-flex items-center gap-1 group"
            >
              <span>Masuk di sini</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Luxury Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-gold-400/70 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-gold-400" />
          <span>Keamanan Data Terisolasi & Sandi Dienkripsi Bcrypt</span>
        </div>
      </div>
    </div>
  );
}
