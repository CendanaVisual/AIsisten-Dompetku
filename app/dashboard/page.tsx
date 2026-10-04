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
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-sm text-slate-500 font-medium">
          Memuat ringkasan keuangan AIsisten Dompetku...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>AI Flash NLP Aktif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {session.user?.name || "Pengguna"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Semua transaksi Anda diisolasi secara mandiri dan aman di database Neon PostgreSQL. Anda dapat mencatat transaksi lewat tombol atau mengetik langsung di AIsisten Chat.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            title="Segarkan data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-md hover:bg-emerald-50 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 text-emerald-700" />
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
