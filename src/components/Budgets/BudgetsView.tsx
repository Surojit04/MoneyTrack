import React, { useState } from 'react';
import { Plus, WalletCards, Sparkles, Check, AlertCircle, Trash2 } from 'lucide-react';
import { MonthData, CategoryBudget, Transaction } from '../../types';
import { CategoryBudgetCard } from '../Dashboard/CategoryBudgetCard';
import { formatINR } from '../../utils/currency';

interface BudgetsViewProps {
  monthData: MonthData;
  onUpdateBudgets: (newCategories: CategoryBudget[]) => void;
  onOpenAddExpense: (defaultCategoryId?: string, defaultType?: 'expense' | 'savings') => void;
  onEditExpense: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  monthData,
  onUpdateBudgets,
  onOpenAddExpense,
  onEditExpense,
  onDeleteTransaction,
}) => {
  const { salary, savingsTarget, categories, transactions } = monthData;
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  // Compute total allocation
  const totalAllocated = savingsTarget + categories.reduce((sum, c) => sum + c.budget, 0);
  const remainingAllocation = salary - totalAllocated;

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || Number(newCatBudget) <= 0) return;

    const newCategory: CategoryBudget = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      budget: Number(newCatBudget),
      icon: 'FolderOpen',
      color: newCatColor,
      isDefault: false,
    };

    onUpdateBudgets([...categories, newCategory]);
    setNewCatName('');
    setNewCatBudget('');
    setShowAddCustomModal(false);
  };

  const PRESET_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monthly Budgets
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Allocation & Spending Targets
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Allocation Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Salary Allocation
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
            Target: {formatINR(salary)}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-extrabold font-mono-numbers">
            {formatINR(totalAllocated)}
          </span>
          <span className="text-xs text-slate-400">
            allocated of {formatINR(salary)}
          </span>
        </div>

        {/* Allocation Progress bar */}
        <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalAllocated > salary ? 'bg-rose-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, Math.round((totalAllocated / salary) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
          <span className="text-slate-400">
            {remainingAllocation >= 0 ? 'Remaining Buffer' : 'Overallocated'}
          </span>
          <span
            className={`font-bold font-mono-numbers ${
              remainingAllocation >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatINR(remainingAllocation)}
          </span>
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="space-y-3.5">
        {categories.map((category) => (
          <CategoryBudgetCard
            key={category.id}
            category={category}
            transactions={transactions}
            onAddExpenseClick={(catId) => onOpenAddExpense(catId, 'expense')}
            onEditExpenseClick={onEditExpense}
            onDeleteTransaction={onDeleteTransaction}
          />
        ))}
      </div>

      {/* Add Custom Category Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add Custom Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              e.g. Travel, Education, Shopping, Emergency fund
            </p>

            <form onSubmit={handleAddCustomCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel, Shopping, Fitness"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 1000"
                  value={newCatBudget}
                  onChange={(e) => setNewCatBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category Color
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCatColor(c)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        newCatColor === c ? 'scale-110 ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {newCatColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
