"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, PieChart, TrendingUp, TrendingDown, DollarSign, Calendar, List, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const FinanceChart = dynamic(() => import("./FinanceChart"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-muted">Loading chart...</div> });

type Expense = {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  date: Date;
};

type Income = {
  id: string;
  bookingReference: string;
  guestName: string;
  amountPaid: number;
  date: Date; // We use createdAt
};

type FinanceDashboardProps = {
  initialExpenses: Expense[];
  initialIncomes: Income[];
};

export default function FinanceDashboardContainer({ initialExpenses, initialIncomes }: FinanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  
  // Expenses Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    category: "Electricity",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Filters State for Detailed History
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());

  // Data processing for Overview (Home Dashboard)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentMonthIncome = useMemo(() => {
    return initialIncomes
      .filter(i => new Date(i.date).getFullYear() === currentYear && new Date(i.date).getMonth() === currentMonth)
      .reduce((sum, i) => sum + i.amountPaid, 0);
  }, [initialIncomes, currentYear, currentMonth]);

  const currentMonthExpense = useMemo(() => {
    return expenses
      .filter(e => new Date(e.date).getFullYear() === currentYear && new Date(e.date).getMonth() === currentMonth)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, currentYear, currentMonth]);

  const ytdIncome = useMemo(() => {
    return initialIncomes
      .filter(i => new Date(i.date).getFullYear() === currentYear)
      .reduce((sum, i) => sum + i.amountPaid, 0);
  }, [initialIncomes, currentYear]);

  const ytdExpense = useMemo(() => {
    return expenses
      .filter(e => new Date(e.date).getFullYear() === currentYear)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, currentYear]);

  const ytdProfit = ytdIncome - ytdExpense;

  // Prepare Chart Data
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(month => ({ name: month, Income: 0, Expense: 0 }));

    initialIncomes.forEach(i => {
      const d = new Date(i.date);
      if (d.getFullYear() === currentYear) {
        data[d.getMonth()].Income += i.amountPaid;
      }
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === currentYear) {
        data[d.getMonth()].Expense += e.amount;
      }
    });

    return data;
  }, [initialIncomes, expenses, currentYear]);

  // Handle Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount })
      });

      if (res.ok) {
        const data = await res.json();
        data.expense.date = new Date(data.expense.date);
        setExpenses([data.expense, ...expenses]);
        setIsAdding(false);
        setFormData({ ...formData, amount: "", description: "" });
      } else {
        alert("Failed to add expense");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const res = await fetch(`/api/admin/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  // Prepare filtered data for Detailed History
  const filteredIncomes = initialIncomes.filter(i => {
    const d = new Date(i.date);
    return d.getFullYear() === filterYear && d.getMonth() === filterMonth;
  });
  
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === filterYear && d.getMonth() === filterMonth;
  });

  const periodIncome = filteredIncomes.reduce((sum, i) => sum + i.amountPaid, 0);
  const periodExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const periodProfit = periodIncome - periodExpense;

  return (
    <div>
      {/* Top Navigation Tabs */}
      <div className="flex space-x-1 bg-cream/30 p-1 rounded-xl w-fit mb-8 border border-light-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === 'overview' 
              ? "bg-white text-forest shadow-sm" 
              : "text-muted hover:text-dark hover:bg-white/50"
          )}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Home Dashboard
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === 'history' 
              ? "bg-white text-forest shadow-sm" 
              : "text-muted hover:text-dark hover:bg-white/50"
          )}
        >
          <List className="w-4 h-4 mr-2" />
          Monthly & Yearly History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in duration-300">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-muted font-medium">This Month Income</h3>
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp className="w-5 h-5" /></div>
              </div>
              <div className="text-3xl font-bold text-dark">LKR {currentMonthIncome.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-muted font-medium">This Month Expenses</h3>
                <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
              </div>
              <div className="text-3xl font-bold text-dark">LKR {currentMonthExpense.toLocaleString()}</div>
            </div>

            <div className={cn(
              "p-6 rounded-2xl shadow-sm border",
              ytdProfit >= 0 ? "bg-forest/5 border-forest/20" : "bg-red-50 border-red-200"
            )}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={cn("font-medium", ytdProfit >= 0 ? "text-forest" : "text-red-700")}>YTD Net Profit</h3>
                <div className={cn("p-2 rounded-lg", ytdProfit >= 0 ? "bg-forest/10 text-forest" : "bg-red-100 text-red-700")}>
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className={cn("text-3xl font-bold", ytdProfit >= 0 ? "text-forest" : "text-red-700")}>
                LKR {ytdProfit.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-border mb-8">
            <h3 className="text-lg font-heading text-forest mb-6">Income vs Expenses ({currentYear})</h3>
            <div className="h-[400px] w-full">
              <FinanceChart data={chartData} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-in fade-in duration-300">
          
          {/* Filters & Add Expense */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="px-4 py-2 bg-white border border-light-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage/50"
              >
                {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className="px-4 py-2 bg-white border border-light-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage/50"
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="btn-primary py-2 flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>

          {/* Period Summary */}
          <div className="bg-forest/5 border border-forest/10 p-4 rounded-xl flex gap-8 mb-6">
            <div>
              <div className="text-xs text-muted uppercase tracking-wider font-semibold">Period Income</div>
              <div className="text-lg font-bold text-forest">LKR {periodIncome.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider font-semibold">Period Expense</div>
              <div className="text-lg font-bold text-red-600">LKR {periodExpense.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider font-semibold">Period Profit</div>
              <div className={cn("text-lg font-bold", periodProfit >= 0 ? "text-forest" : "text-red-600")}>
                LKR {periodProfit.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          {isAdding && (
            <div className="p-6 bg-white border border-light-border rounded-2xl mb-6 shadow-sm">
              <h3 className="font-heading text-forest mb-4">Record New Expense</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-light-border rounded-lg text-sm bg-cream/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-light-border rounded-lg text-sm bg-cream/30"
                  >
                    <option>Electricity</option>
                    <option>Water</option>
                    <option>Broadband</option>
                    <option>Maintenance</option>
                    <option>Staff Salary</option>
                    <option>Groceries</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Amount (LKR)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="e.g. 5000"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-light-border rounded-lg text-sm bg-cream/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-dark mb-1">Description (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Fixed AC"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-light-border rounded-lg text-sm bg-cream/30"
                    />
                    <button type="submit" className="btn-primary py-2 px-6 text-sm shrink-0">Save</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Two-Column Layout for Income and Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Income Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-border overflow-hidden">
              <div className="p-4 border-b border-light-border bg-green-50/50">
                <h3 className="font-heading text-forest flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                  Received Income
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-light-border text-left">
                      <th className="px-4 py-3 font-medium text-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-muted">Booking / Guest</th>
                      <th className="px-4 py-3 font-medium text-muted text-right">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border">
                    {filteredIncomes.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">No income recorded for this period.</td></tr>
                    ) : (
                      filteredIncomes.map((income) => (
                        <tr key={income.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-muted">{new Date(income.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-dark">{income.bookingReference}</div>
                            <div className="text-xs text-muted">{income.guestName}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-forest">
                            {income.amountPaid.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expense Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-border overflow-hidden">
              <div className="p-4 border-b border-light-border bg-red-50/50">
                <h3 className="font-heading text-red-700 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                  Expenses Log
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-light-border text-left">
                      <th className="px-4 py-3 font-medium text-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-muted">Details</th>
                      <th className="px-4 py-3 font-medium text-muted text-right">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border">
                    {filteredExpenses.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">No expenses recorded for this period.</td></tr>
                    ) : (
                      filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-muted">{new Date(expense.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-dark">{expense.category}</div>
                            {expense.description && <div className="text-xs text-muted">{expense.description}</div>}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-red-600 flex items-center justify-end gap-3">
                            {expense.amount.toLocaleString()}
                            <button 
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                              title="Delete Expense"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
