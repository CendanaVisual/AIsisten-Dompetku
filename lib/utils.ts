import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}

export const TRANSACTION_CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Gaji & Pendapatan",
  "Investasi",
  "Hiburan",
  "Tagihan & Utilitas",
  "Kesehatan",
  "Pendidikan",
  "Lain-lain",
] as const;
