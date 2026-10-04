"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Plus,
  Trash2,
  Edit2,
  Receipt,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";
import { formatRupiah, formatDateIndo, TRANSACTION_CATEGORIES } from "@/lib/utils";
import TransactionModal from "./TransactionModal";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  note: string | null;
  date: string;
  createdAt: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat daftar transaksi.");
      }

      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Listen to global AI chat transaction add event
  useEffect(() => {
    const handleGlobalRefresh = () => {
      fetchTransactions();
    };

    window.addEventListener("dompetku:refresh", handleGlobalRefresh);
    return () => {
      window.removeEventListener("dompetku:refresh", handleGlobalRefresh);
    };
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus transaksi.");
      }

      setDeleteConfirmId(null);
      fetchTransactions();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("dompetku:refresh"));
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Riwayat Transaksi
          </h1>
          <p className="text-sm text-slate-500">
            Kelola seluruh pemasukan dan pengeluaran secara mandiri dan aman.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTransaction(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Manual</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Type Filter */}
        <div className="md:col-span-4 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              typeFilter === "ALL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setTypeFilter("INCOME")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              typeFilter === "INCOME"
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTypeFilter("EXPENSE")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              typeFilter === "EXPENSE"
                ? "bg-rose-50 text-rose-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Kategori</option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm">Memuat data transaksi dari database...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center">
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-3 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Receipt className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">
              Belum Ada Transaksi Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
              Mulai catat transaksi secara manual dengan tombol di atas, atau gunakan widget chat AIsisten di pojok kanan bawah!
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      tx.type === "INCOME"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {tx.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          tx.type === "INCOME"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </div>
                    {tx.note && (
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {tx.note}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateIndo(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 sm:gap-6 text-right">
                  <div className="space-y-0.5">
                    <p
                      className={`font-bold text-sm sm:text-base ${
                        tx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(tx.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Konfirmasi Hapus
            </h3>
            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus catatan transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSuccess={fetchTransactions}
        initialData={selectedTransaction}
      />
    </div>
  );
}
