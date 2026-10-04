"use client";

import { useState, useEffect } from "react";
import { X, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatRupiah, TRANSACTION_CATEGORIES } from "@/lib/utils";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
    note: string | null;
    date: string;
  } | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TransactionModalProps) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Makanan & Minuman");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setNote(initialData.note || "");
      setDate(
        new Date(initialData.date).toISOString().split("T")[0]
      );
    } else {
      setType("EXPENSE");
      setAmount("");
      setCategory("Makanan & Minuman");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Nominal harus berupa angka valid lebih dari 0.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = initialData
        ? `/api/transactions/${initialData.id}`
        : `/api/transactions`;

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: numAmount,
          category,
          note,
          date,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan transaksi.");
      }

      // Dispatch global refresh event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("dompetku:refresh"));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="luxury-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-gold-500/40">
        {/* Top Gold Shimmer Trim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-gold-400 to-teal-500 dark:from-gold-600 dark:via-gold-300 dark:to-gold-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-gold-500/20 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-gold-200">
            {initialData ? "Edit Transaksi" : "Tambah Transaksi Manual"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-gold-400/60 dark:hover:bg-slate-850 dark:hover:text-gold-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-500/40 p-3 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          {/* Type Toggle: Pemasukan / Pengeluaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold transition-all ${
                  type === "EXPENSE"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-gold-300 dark:hover:bg-slate-700"
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold transition-all ${
                  type === "INCOME"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 dark:bg-gold-500 dark:text-slate-950"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-gold-300 dark:hover:bg-slate-700"
                }`}
              >
                <ArrowDownLeft className="h-4 w-4" />
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400 dark:text-gold-400/70">
                Rp
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                min="1"
                step="any"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-100 dark:focus:border-gold-400"
              />
            </div>
            {amount && !isNaN(parseFloat(amount)) && (
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-gold-400 font-semibold">
                Preview: {formatRupiah(parseFloat(amount))}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-100 dark:focus:border-gold-400"
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-900 dark:text-gold-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-100 dark:focus:border-gold-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gold-300 mb-1">
              Catatan / Deskripsi (Opsional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan siang bersama tim kantor"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-100 dark:focus:border-gold-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-gold-500/30 dark:text-gold-300 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 dark:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {initialData ? "Simpan Perubahan" : "Tambah Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
