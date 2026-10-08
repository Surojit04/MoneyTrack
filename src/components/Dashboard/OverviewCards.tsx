import React from 'react';
import { Wallet, PiggyBank, ArrowDownRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface OverviewCardsProps {
  salary: number;
  totalSaved: number;
  totalSpent: number;
  availableToSpend: number;
  onEditBudgetClick?: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  salary,
  totalSaved,
  totalSpent,
  availableToSpend,
  onEditBudgetClick,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 1. Monthly Salary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monthly Salary
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatINR(salary)}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            100% of income pool
          </p>
        </div>
      </div>

      {/* 2. Total Savings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Total Savings
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers tracking-tight">
            {formatINR(totalSaved)}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            Protected & locked
          </p>
        </div>
      </div>

      {/* 3. Total Spent */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
            Total Spent
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatINR(totalSpent)}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            All categories combined
          </p>
        </div>
      </div>

      {/* 4. Available to Spend */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-4 shadow-md shadow-blue-500/20 text-white flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-100">
            Available to Spend
          </span>
          <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
            <span className="font-bold text-xs">₹</span>
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono-numbers tracking-tight">
            {formatINR(availableToSpend)}
          </div>
          <p className="text-[11px] text-blue-100 mt-0.5">
            Remaining unspent pool
          </p>
        </div>
      </div>
    </div>
  );
};
