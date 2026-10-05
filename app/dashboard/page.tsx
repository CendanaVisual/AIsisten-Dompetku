"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import OverviewCards from "@/components/dashboard/OverviewCards";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TransactionModal from "@/components/transactions/TransactionModal";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router, fetchStats]);

  // Listen to global AI transaction creation event
  useEffect(() => {
    const handleGlobalRefresh = () => {
      fetchStats(true);
    };

    window.addEventListener("dompetku:refresh", handleGlobalRefresh);
    return () => {
      window.removeEventListener("dompetku:refresh", handleGlobalRefresh);
    };
  }, [fetchStats]);

  if (status === "loading" || (isLoading && !stats)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-gold-400" />
        <p className="text-sm text-slate-600 dark:text-gold-300 font-semibold">
          Memuat ringkasan keuangan AIsisten Dompetku...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Luxury Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-600/30 dark:border-gold-500/30 dark:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Shimmer Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-gold-400 to-teal-400 dark:from-gold-600 dark:via-gold-300 dark:to-gold-600" />

        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/25 dark:bg-gold-500/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-emerald-400/30 dark:border-gold-500/40 text-emerald-200 dark:text-gold-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300 dark:text-gold-400" />
            <span>AI Flash Aktif & Database Terhubung</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:gold-text-glow">
            Selamat Datang, {session.user?.name || "Pengguna"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 dark:text-gold-200/80 max-w-xl font-medium">
            Semua transaksi Anda diisolasi secara mandiri dan aman di Database. Anda dapat mencatat transaksi lewat tombol manual atau mengetik santai di AIsisten Chat.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-2xl bg-white/10 dark:bg-gold-500/10 dark:border dark:border-gold-500/30 px-3.5 py-2.5 text-xs font-semibold text-white dark:text-gold-300 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gold-500/20 transition-all"
            title="Segarkan data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-gold-500 dark:to-gold-600 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-slate-950 shadow-md hover:scale-[1.02] active:scale-95 transition-all dark:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <Plus className="h-4 w-4 text-emerald-700 dark:text-slate-950" />
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <OverviewCards
          totalBalance={stats.totalBalance || 0}
          thisMonthIncome={stats.thisMonthIncome || 0}
          thisMonthExpense={stats.thisMonthExpense || 0}
          transactionCount={stats.transactionCount || 0}
        />
      )}

      {/* Charts Section */}
      {stats && (
        <CashFlowChart
          monthlyCashFlow={stats.monthlyCashFlow || []}
          categoryDistribution={stats.categoryDistribution || []}
        />
      )}

      {/* Recent Transactions List */}
      {stats && (
        <RecentTransactions
          transactions={stats.recentTransactions || []}
        />
      )}

      {/* Manual Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchStats(true)}
      />
    </div>
  );
}
