"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ArrowRight, Receipt } from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

interface TransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  note: string | null;
  date: string;
}

interface RecentTransactionsProps {
  transactions: TransactionItem[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div className="luxury-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-gold-200 text-sm sm:text-base">
            Transaksi Terbaru
          </h3>
          <p className="text-xs text-slate-500 dark:text-gold-400/80">
            Aktivitas keuangan terakhir Anda
          </p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-gold-400 hover:text-emerald-700 dark:hover:text-gold-300 transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-gold-400/60">
          <Receipt className="h-10 w-10 text-slate-300 dark:text-gold-500/30 mb-2" />
          <p className="text-xs">Belum ada riwayat transaksi.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-gold-500/15">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    t.type === "INCOME"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/30"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 dark:border dark:border-rose-500/30"
                  }`}
                >
                  {t.type === "INCOME" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-gold-100">
                    {t.category}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-gold-400/70">
                    {t.note ? `${t.note} • ` : ""}
                    {formatDateIndo(t.date)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-xs sm:text-sm font-bold ${
                    t.type === "INCOME"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-rose-600 dark:text-rose-300"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {formatRupiah(t.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
