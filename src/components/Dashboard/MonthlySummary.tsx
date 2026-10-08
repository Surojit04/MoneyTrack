import React from 'react';
import { Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { CategoryBudget, Transaction } from '../../types';
import { formatINR } from '../../utils/currency';

interface MonthlySummaryProps {
  salary: number;
  totalSaved: number;
  savingsTarget: number;
  categories: CategoryBudget[];
  transactions: Transaction[];
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  salary,
  totalSaved,
  savingsTarget,
  categories,
  transactions,
}) => {
  // Expenses calculations
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalSpending = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Recharge amount
  const rechargeSpent = transactions
    .filter((t) => t.type === 'expense' && t.categoryId === 'recharge')
    .reduce((sum, t) => sum + t.amount, 0);

  // Remaining Flexible Money calculation:
  // Salary - Savings (Protected) - Total Spending
  // If user hasn't deposited full savings yet, we base flexible money on (Salary - totalSaved - totalSpending)
  const remainingFlexibleMoney = salary - totalSaved - totalSpending;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Monthly Summary
          </h3>
          <p className="text-xs text-slate-400">
            Comprehensive financial reconciliation
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
        {/* Income */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Income / Salary
          </span>
          <span className="font-bold text-slate-900 dark:text-white font-mono-numbers text-sm">
            {formatINR(salary)}
          </span>
        </div>

        {/* Savings */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Savings Protected
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
              Locked
            </span>
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers text-sm">
            {formatINR(totalSaved)} <span className="text-slate-400 font-normal text-xs">/ {formatINR(savingsTarget)}</span>
          </span>
        </div>

        {/* Category Lines */}
        {categories.map((cat) => {
          const spent = transactions
            .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={cat.id} className="py-2.5 flex items-center justify-between">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {cat.name}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono-numbers">
                {formatINR(spent)} <span className="text-slate-400 font-normal">/ {formatINR(cat.budget)}</span>
              </span>
            </div>
          );
        })}

        {/* Phone Recharge */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            Phone Recharge
          </span>
          <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono-numbers">
            {formatINR(rechargeSpent)}
          </span>
        </div>

        {/* Total Spending */}
        <div className="py-2.5 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40 px-2 rounded-xl my-1">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Total Spending
          </span>
          <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono-numbers text-sm">
            {formatINR(totalSpending)}
          </span>
        </div>

        {/* Remaining Flexible Money */}
        <div className="pt-3 pb-1 flex items-center justify-between">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
              Remaining Flexible Money
            </span>
            <span className="text-[11px] text-slate-400">
              Salary - Savings - Actual Expenses
            </span>
          </div>
          <span
            className={`font-extrabold text-base sm:text-lg font-mono-numbers ${
              remainingFlexibleMoney >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatINR(remainingFlexibleMoney)}
          </span>
        </div>
      </div>
    </div>
  );
};
