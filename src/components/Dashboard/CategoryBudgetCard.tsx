import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  Home as HomeIcon, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  AlertTriangle,
  FolderOpen,
  Edit2
} from 'lucide-react';
import { CategoryBudget, Transaction } from '../../types';
import { formatINR, getBudgetStatus, formatDateShort } from '../../utils/currency';

interface CategoryBudgetCardProps {
  category: CategoryBudget;
  transactions: Transaction[];
  onAddExpenseClick: (categoryId: string) => void;
  onEditExpenseClick?: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  category,
  transactions,
  onAddExpenseClick,
  onEditExpenseClick,
  onDeleteTransaction,
}) => {
  const [showExpenses, setShowExpenses] = useState(false);

  // Filter expenses belonging to this category
  const categoryExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.categoryId === category.id
  );

  const spent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
  const status = getBudgetStatus(category.budget, spent);

  // Map icon name to Lucide icon
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'user':
        return User;
      case 'heart':
        return Heart;
      case 'home':
        return HomeIcon;
      default:
        return FolderOpen;
    }
  };

  const IconComponent = getIcon(category.icon);

  // Status Styling according to Prompt:
  // Green: > 50% remaining
  // Orange: 20%–50% remaining
  // Red: < 20% remaining
  // Exhausted: Remaining = 0 ("Budget exhausted")
  // Over: Remaining < 0 ("⚠️ Over Budget")
  const statusBadgeConfig = {
    green: {
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
    },
    orange: {
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      textColor: 'text-amber-600 dark:text-amber-400',
      barColor: 'bg-amber-500',
    },
    red: {
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      textColor: 'text-rose-600 dark:text-rose-400',
      barColor: 'bg-rose-500',
    },
    exhausted: {
      badgeBg: 'bg-red-800 text-white',
      textColor: 'text-red-700 dark:text-red-400 font-extrabold',
      barColor: 'bg-red-700',
    },
    over: {
      badgeBg: 'bg-rose-600 text-white animate-pulse',
      textColor: 'text-rose-600 dark:text-rose-400 font-extrabold',
      barColor: 'bg-rose-600',
    },
  }[status.status];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: category.color }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {category.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Budget: {formatINR(category.budget)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAddExpenseClick(category.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Figures Row */}
      <div className="grid grid-cols-2 gap-3 my-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block">
            Spent
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatINR(spent)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {status.percentSpent}% of budget
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Remaining
          </span>
          <span
            className={`text-base font-mono-numbers ${statusBadgeConfig.textColor}`}
          >
            {formatINR(status.remaining)}
          </span>
          <div>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${statusBadgeConfig.badgeBg}`}
            >
              {status.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold mb-1">
          <span>{formatINR(spent)} / {formatINR(category.budget)} spent</span>
          <span>{status.percentSpent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${statusBadgeConfig.barColor}`}
            style={{ width: `${Math.min(100, status.percentSpent)}%` }}
          />
        </div>
      </div>

      {/* Warning message if over budget */}
      {status.status === 'over' && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-2.5 mb-3 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Exceeded by {formatINR(Math.abs(status.remaining))}. Slow down spending.</span>
        </div>
      )}

      {/* Expenses History Toggle */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowExpenses((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1"
        >
          <span>
            {categoryExpenses.length} {categoryExpenses.length === 1 ? 'Expense' : 'Expenses'}
          </span>
          {showExpenses ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showExpenses && (
          <div className="mt-2 space-y-2 animate-slide-up">
            {categoryExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No expenses logged for {category.name} yet.
              </p>
            ) : (
              categoryExpenses.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {tx.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDateShort(tx.date)} {tx.note && `• ${tx.note}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                      {formatINR(tx.amount)}
                    </span>
                    {onEditExpenseClick && (
                      <button
                        onClick={() => onEditExpenseClick(tx)}
                        className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
