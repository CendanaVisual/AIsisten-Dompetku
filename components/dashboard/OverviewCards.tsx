"use client";

import { Wallet, ArrowDownLeft, ArrowUpRight, Activity } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface OverviewCardsProps {
  totalBalance: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  transactionCount: number;
}

export default function OverviewCards({
  totalBalance,
  thisMonthIncome,
  thisMonthExpense,
  transactionCount,
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Saldo */}
      <div className="luxury-card rounded-2xl p-5 transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gold-400">
            Total Saldo Bersih
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3
            className={`text-2xl font-bold tracking-tight ${
              totalBalance < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-900 dark:gold-text-glow"
            }`}
          >
            {formatRupiah(totalBalance)}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gold-400/80">
            Akumulasi seluruh transaksi mandiri
          </p>
        </div>
      </div>

      {/* Pemasukan Bulan Ini */}
      <div className="luxury-card rounded-2xl p-5 transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gold-400">
            Pemasukan Bulan Ini
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/30">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-teal-600 dark:text-emerald-300">
            {formatRupiah(thisMonthIncome)}
          </h3>
          <p className="mt-1 text-xs text-teal-700 dark:text-emerald-400/80 font-medium">
            Arus kas masuk bulan berjalan
          </p>
        </div>
      </div>

      {/* Pengeluaran Bulan Ini */}
      <div className="luxury-card rounded-2xl p-5 transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gold-400">
            Pengeluaran Bulan Ini
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 dark:border dark:border-rose-500/30">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-300">
            {formatRupiah(thisMonthExpense)}
          </h3>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-400/80 font-medium">
            Arus kas keluar bulan berjalan
          </p>
        </div>
      </div>

      {/* Jumlah Transaksi */}
      <div className="luxury-card rounded-2xl p-5 transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gold-400">
            Aktivitas Transaksi
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gold-200">
            {transactionCount}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gold-400/80">
            Total transaksi tercatat dalam sistem
          </p>
        </div>
      </div>
    </div>
  );
}
