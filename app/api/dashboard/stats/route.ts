import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Hitung tanggal awal dan akhir bulan ini
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 1));

    // Ambil semua transaksi pengguna
    const allTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let thisMonthIncome = 0;
    let thisMonthExpense = 0;

    const categoryExpenseMap: Record<string, number> = {};

    for (const t of allTransactions) {
      const amount = Number(t.amount);
      const isCurrentMonth = t.date >= startOfMonth && t.date < endOfMonth;

      if (t.type === "INCOME") {
        totalIncome += amount;
        if (isCurrentMonth) {
          thisMonthIncome += amount;
        }
      } else {
        totalExpense += amount;
        if (isCurrentMonth) {
          thisMonthExpense += amount;
          categoryExpenseMap[t.category] = (categoryExpenseMap[t.category] || 0) + amount;
        }
      }
    }

    const totalBalance = totalIncome - totalExpense;
    const thisMonthBalance = thisMonthIncome - thisMonthExpense;

    // Data grafik 6 bulan terakhir
    const monthlyCashFlow: Array<{ monthName: string; income: number; expense: number }> = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const mIdx = targetDate.getMonth();
      const y = targetDate.getFullYear();
      const mStart = new Date(Date.UTC(y, mIdx, 1));
      const mEnd = new Date(Date.UTC(y, mIdx + 1, 1));

      const inMonth = allTransactions.filter(
        (t) => t.date >= mStart && t.date < mEnd
      );

      const inc = inMonth
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const exp = inMonth
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyCashFlow.push({
        monthName: `${monthNames[mIdx]} ${y}`,
        income: inc,
        expense: exp,
      });
    }

    // Format distribusi kategori untuk pie chart
    const categoryDistribution = Object.entries(categoryExpenseMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Ambil 5 transaksi terbaru
    const recentTransactions = allTransactions.slice(0, 5);

    return NextResponse.json({
      totalBalance,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthBalance,
      transactionCount: allTransactions.length,
      monthlyCashFlow,
      categoryDistribution,
      recentTransactions,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Gagal memuat statistik." }, { status: 500 });
  }
}
