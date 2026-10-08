import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { CategoryBudget, Transaction } from '../../types';
import { formatINR } from '../../utils/currency';

interface SmartHealthCardProps {
  salary: number;
  savingsTarget: number;
  totalSaved: number;
  totalSpent: number;
  categories: CategoryBudget[];
  transactions: Transaction[];
}

export const SmartHealthCard: React.FC<SmartHealthCardProps> = ({
  salary,
  savingsTarget,
  totalSaved,
  totalSpent,
  categories,
  transactions,
}) => {
  // Determine over budget categories
  let overBudgetCategoriesCount = 0;
  categories.forEach((cat) => {
    const catSpent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    if (catSpent > cat.budget) {
      overBudgetCategoriesCount++;
    }
  });

  const availableSpendingBudget = Math.max(0, salary - savingsTarget);
  const spendingRatio =
    availableSpendingBudget > 0 ? totalSpent / availableSpendingBudget : 0;

  let title = "Excellent! You're staying within your budget.";
  let description = 'Your spending pace is healthy and well-balanced.';
  let type: 'excellent' | 'okay' | 'warning' | 'danger' = 'excellent';

  if (overBudgetCategoriesCount > 1) {
    title = "⚠️ You're over budget in multiple categories.";
    description = 'Immediate adjustment needed to avoid dipping into savings.';
    type = 'danger';
  } else if (overBudgetCategoriesCount === 1) {
    title = 'Careful! One category has exceeded its budget.';
    description = 'Keep non-essential spending minimal for the rest of the month.';
    type = 'warning';
  } else if (spendingRatio > 0.85) {
    title = 'Careful! Your monthly budget is getting low.';
    description = 'You have used more than 85% of your available spending money.';
    type = 'warning';
  } else if (spendingRatio > 0.5) {
    title = "You're doing okay. Keep an eye on your spending.";
    description = 'Midway through your budget. Track daily items closely.';
    type = 'okay';
  } else {
    title = "Excellent! You're staying within your budget.";
    description = 'Great financial discipline. Your planned savings are secure.';
    type = 'excellent';
  }

  const styles = {
    excellent: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50',
      iconBg: 'bg-emerald-500 text-white',
      badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40',
      Icon: CheckCircle2,
    },
    okay: {
      bg: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/50',
      iconBg: 'bg-blue-500 text-white',
      badge: 'text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/40',
      Icon: TrendingUp,
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50',
      iconBg: 'bg-amber-500 text-white',
      badge: 'text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40',
      Icon: AlertCircle,
    },
    danger: {
      bg: 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/50',
      iconBg: 'bg-rose-500 text-white',
      badge: 'text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-900/40',
      Icon: AlertTriangle,
    },
  }[type];

  const IconComponent = styles.Icon;

  return (
    <div
      className={`rounded-3xl p-4 border transition-all duration-300 shadow-xs flex items-start gap-3.5 ${styles.bg}`}
    >
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Money Health
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
            {type.toUpperCase()}
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          {title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
