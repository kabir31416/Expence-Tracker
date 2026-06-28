"use client"

import { FaWallet, FaPlus, FaArrowUp, FaArrowDown, FaRegCalendarAlt } from "react-icons/fa";
import RecentActivities from "./components/RecentActivity";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AnalyticsCards from "./components/AnalyticsCards";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function Home() {

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const response = await fetch(`${baseUrl}/api/expence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save expense");
    }

    console.log("Successfully saved:", data);

    setFormData({
      title: "",
      amount: "",
      category: "Food",
      date: "",
    });

  } catch (error) {
    console.error("Network error:", error);
  }
};

  const fetchExpenses = async () => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/expence`
    );

    const res = await fetch(url.toString());

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch expenses");
    }

    setExpenses(data.spends || []);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
    fetchExpenses();
  }, []);




  return (
    <main className="min-h-screen bg-slate-50/50 p-4 text-slate-800 antialiased md:p-8 selection:bg-rose-500 selection:text-white">

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20">
                <FaWallet size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Finances
                </h1>
                <p className="text-sm font-medium text-slate-400">
                  Track and optimize your daily expenses
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm backdrop-blur-md sm:self-center">
            <div className="rounded-xl bg-slate-50 p-2 text-slate-500">
              <FaRegCalendarAlt size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today</p>
              <h2 className="text-sm font-semibold text-slate-700">28 June 2026</h2>
            </div>
          </div>
        </div>

        {/* Top Analytics Cards Grid */}
        <AnalyticsCards></AnalyticsCards>

        {/* Main Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Inputs Section */}
          <div className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              New Record
            </h3>

            <div className="space-y-4">

              <form onSubmit={handleSubmit}>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., AWS Subscription"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (৳)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5 appearance-none">
                      <option>Food</option>
                      <option>Transport</option>
                      <option>Shopping</option>
                      <option>Others</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5"
                  />
                </div>

                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition duration-300 hover:opacity-95 hover:shadow-xl active:scale-[0.98]">
                  <FaPlus size={12} />
                  Create Expense
                </button>
              </form>
            </div>
          </div>

          {/* History Section */}
          <Suspense>
            <RecentActivities></RecentActivities>
          </Suspense>
        </div>
      </div>
    </main>
  );
}