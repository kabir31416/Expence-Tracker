"use client";

import { useEffect, useState } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface DashboardData {
  totalExpense: number;
  totalTransactions: number;
  monthlyExpense: number;
  remainingBudget: number;
  dailySafeSpend: number;
}

export default function AnalyticsCards() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalExpense: 0,
    totalTransactions: 0,
    monthlyExpense: 0,
    remainingBudget: 0,
    dailySafeSpend: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/expense/dashboard`
      );

      const data = await res.json();

      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-3xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

      {/* Total Expense */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">

        <div className="absolute -right-6 -bottom-6 text-white/5">
          <FaWallet size={140} />
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-400">
          Total Expense
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          ৳ {dashboard.totalExpense.toLocaleString()} BDT
        </h2>

        <p className="mt-5 rounded-xl bg-white/10 px-3 py-2 text-xs inline-block">
          {dashboard.totalTransactions} Transactions
        </p>

      </div>

      {/* Monthly */}

      <div className="rounded-3xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <p className="text-xs uppercase tracking-widest text-slate-400">
            Monthly Expense
          </p>

          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <FaArrowUp />
          </div>

        </div>

        <h2 className="mt-3 text-3xl font-bold">
          ৳ {dashboard.monthlyExpense.toLocaleString()} BDT
        </h2>

        <div className="mt-5 h-2 rounded-full bg-slate-100">

          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{
              width: `${Math.min(
                (dashboard.monthlyExpense / 35000) * 100,
                100
              )}%`,
            }}
          />

        </div>

      </div>


      <div className="rounded-3xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <p className="text-xs uppercase tracking-widest text-slate-400">
            Monthly Budget 
          </p>

          <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
            <FaArrowDown />
          </div>

        </div>

        <h2 className="mt-3 text-3xl font-bold">
          ৳ 35,000 BDT
        </h2>

      </div>

    </div>
  );
}