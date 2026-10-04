"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatRupiah } from "@/lib/utils";

interface CashFlowItem {
  monthName: string;
  income: number;
  expense: number;
}

interface CategoryItem {
  name: string;
  value: number;
}

interface CashFlowChartProps {
  monthlyCashFlow: CashFlowItem[];
  categoryDistribution: CategoryItem[];
}

const COLORS = [
  "#10b981", // emerald
  "#d4af37", // royal gold
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
];

export default function CashFlowChart({
  monthlyCashFlow,
  categoryDistribution,
}: CashFlowChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[340px] rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-gold-500/20 animate-pulse" />
        <div className="h-[340px] rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-gold-500/20 animate-pulse" />
      </div>
    );
  }

  const customTooltipFormatter = (value: number) => [
    formatRupiah(value),
    "",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart: Pemasukan vs Pengeluaran 6 Bulan */}
      <div className="lg:col-span-2 luxury-card rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 dark:text-gold-200 text-sm sm:text-base">
            Arus Kas (6 Bulan Terakhir)
          </h3>
          <p className="text-xs text-slate-500 dark:text-gold-400/80">
            Perbandingan total pemasukan dan pengeluaran per bulan
          </p>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyCashFlow}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <XAxis
                dataKey="monthName"
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `${(val / 1000000).toFixed(0)} jt`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)} rb`
                    : `${val}`
                }
              />
              <Tooltip
                formatter={customTooltipFormatter}
                contentStyle={{
                  borderRadius: "16px",
                  borderColor: "rgba(212, 175, 55, 0.4)",
                  backgroundColor: "#0b0f19",
                  color: "#f5d061",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Bar
                dataKey="income"
                name="Pemasukan"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Pengeluaran"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Distribusi Pengeluaran per Kategori */}
      <div className="luxury-card rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 dark:text-gold-200 text-sm sm:text-base">
            Kategori Pengeluaran Bulan Ini
          </h3>
          <p className="text-xs text-slate-500 dark:text-gold-400/80">
            Alokasi pengeluaran berdasarkan pos kebutuhan
          </p>
        </div>

        <div className="h-[280px] w-full flex items-center justify-center">
          {categoryDistribution.length === 0 ? (
            <div className="text-center text-xs text-slate-400 dark:text-gold-400/60 py-10">
              Belum ada data pengeluaran bulan ini.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={customTooltipFormatter}
                  contentStyle={{
                    borderRadius: "16px",
                    borderColor: "rgba(212, 175, 55, 0.4)",
                    backgroundColor: "#0b0f19",
                    color: "#f5d061",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    paddingTop: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
