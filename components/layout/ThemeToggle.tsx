"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-xl border border-slate-200 dark:border-gold-500/30" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95 dark:border-gold-500/40 dark:bg-slate-900/80 dark:text-gold-300 dark:shadow-[0_0_15px_rgba(212,175,55,0.25)]"
      title={isDark ? "Ubah ke Tema Terang" : "Ubah ke Tema Gelap Emas"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-gold-400 animate-spin-slow transition-transform hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
