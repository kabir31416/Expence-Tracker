"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  FaPen,
  FaTrash,
  FaChartPie,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSave
} from "react-icons/fa";


interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function RecentActivities() {
  
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const category = searchParams.get("category") || "";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);


  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const fetchExpenses = async () => {
  try {
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const url = new URL(`${baseUrl}/api/expence`);

    if (search) {
      url.searchParams.append("search", search);
    }

    if (category) {
      url.searchParams.append("category", category);
    }

    const res = await fetch(url.toString());

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch expenses");
    }

    setExpenses(data.spends || []);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchExpenses();
  }, [search, category]);


  const openDeleteModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteExpense = async () => {
  if (!selectedExpense?._id) return;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const res = await fetch(
      `${baseUrl}/api/expence/${selectedExpense._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete expense");
    }

    setExpenses((prev) =>
      prev.filter((item) => item._id !== selectedExpense._id)
    );

  } catch (err) {
    console.error(err);

  } finally {
    setIsDeleteModalOpen(false);
    setSelectedExpense(null);
  }
};

  const handleUpdateExpense = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!selectedExpense?._id) return;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const res = await fetch(
      `${baseUrl}/api/expence/${selectedExpense._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updateFormData.title,
          amount: Number(updateFormData.amount),
          category: updateFormData.category,
          date: updateFormData.date,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update expense");
    }

    setExpenses((prev) =>
      prev.map((item) =>
        item._id === selectedExpense._id
          ? data.updatedExpense
          : item
      )
    );

    setIsUpdateModalOpen(false);
    setSelectedExpense(null);
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  const openUpdateModal = (expense: Expense) => {
    setSelectedExpense(expense);
    const formattedDate = expense.date ? new Date(expense.date).toISOString().split('T')[0] : "";
    
    setUpdateFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: formattedDate,
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
  };

  

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Food": return "bg-orange-50 border-orange-100 text-orange-600";
      case "Transport": return "bg-blue-50 border-blue-100 text-blue-600";
      case "Shopping": return "bg-purple-50 border-purple-100 text-purple-600";
      default: return "bg-slate-50 border-slate-100 text-slate-600";
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredExpenses = expenses.filter((item: Expense) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center text-slate-500 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2 relative">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FaChartPie className="text-slate-400" size={16} />
          Recent Activities
        </h3>
        <span className="w-fit rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
          Showing {filteredExpenses.length} of {expenses.length}
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5"
          />
        </div>

        <div className="relative min-w-[140px]">
          <FaFilter className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={12} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-8 pl-10 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/5 appearance-none cursor-pointer font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 font-semibold">Details</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((item: Expense) => (
                <tr key={item._id} className="group transition duration-200 hover:bg-slate-50/80">
                  <td className="py-3.5 pr-3">
                    <p className="font-semibold text-sm text-slate-700 group-hover:text-rose-600 transition">
                      {item.title}
                    </p>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-bold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-xs font-medium text-slate-400">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3.5 text-sm font-bold text-slate-800">
                    ৳{item.amount}
                  </td>
                  <td className="py-3.5">
                    <div className="flex justify-center gap-1.5">
                      <button 
                        onClick={() => openUpdateModal(item)} 
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >
                        <FaPen size={12} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(item)} 
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm font-medium text-slate-400">
                  No expenses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-slate-900">Confirm Delete</h4>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete <span className="font-semibold text-slate-700"> {selectedExpense?.title}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExpense}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm cursor-pointer font-semibold text-white hover:bg-rose-700 shadow-md shadow-rose-600/10 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <FaTimes size={16} />
            </button>
            <h4 className="text-lg font-bold text-slate-900 mb-5">Update Expense Record</h4>
            
            <form onSubmit={handleUpdateExpense} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  name="title"
                  value={updateFormData.title}
                  onChange={handleUpdateChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (৳)</label>
                  <input
                    type="number"
                    name="amount"
                    value={updateFormData.amount}
                    onChange={handleUpdateChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                  <select
                    name="category"
                    value={updateFormData.category}
                    onChange={handleUpdateChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:bg-white cursor-pointer"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
                <input
                  type="date"
                  name="date"
                  value={updateFormData.date}
                  onChange={handleUpdateChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:bg-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
                >
                  <FaSave size={12} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}