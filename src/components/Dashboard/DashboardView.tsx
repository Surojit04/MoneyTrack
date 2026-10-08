import React from 'react';
import { MonthData, CategoryBudget, Transaction } from '../../types';
import { OverviewCards } from './OverviewCards';
import { SmartHealthCard } from './SmartHealthCard';
import { DonutChart } from './DonutChart';
import { SavingsCard } from './SavingsCard';
import { CategoryBudgetCard } from './CategoryBudgetCard';
import { RechargeCard } from './RechargeCard';
import { MonthlySummary } from './MonthlySummary';
import { Sparkles, Plus, Receipt } from 'lucide-react';
import { formatMonthName } from '../../utils/currency';

interface DashboardViewProps {
  monthData: MonthData;
  onOpenAddExpense: (defaultCategoryId?: string, defaultType?: 'expense' | 'savings') => void;
  onEditExpense: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  monthData,
  onOpenAddExpense,
  onEditExpense,
  onDeleteTransaction,
  onNavigateToTab,
}) => {
  const { salary, savingsTarget, categories, transactions, monthKey } = monthData;

  // Compute savings
  const totalSaved = transactions
    .filter((t) => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  // Compute total expenses
  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Available to spend:
  // Prompt definition:
  // "Available to Spend ₹4,000" (When Salary ₹10,000, Savings ₹6,000, Spent ₹0)
  // Available to spend = Salary - Savings - Total Spent
  const availableToSpend = Math.max(0, salary - savingsTarget - totalSpent);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Welcome & Subtitle */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatMonthName(monthKey)}
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monthly Money Overview
          </p>
        </div>

        <button
          onClick={() => onOpenAddExpense()}
          className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* 1. Overview Cards (Salary, Savings, Spent, Available to Spend) */}
      <OverviewCards
        salary={salary}
        totalSaved={totalSaved}
        totalSpent={totalSpent}
        availableToSpend={availableToSpend}
        onEditBudgetClick={() => onNavigateToTab('settings')}
      />

      {/* 2. Smart Money Status Card */}
      <SmartHealthCard
        salary={salary}
        savingsTarget={savingsTarget}
        totalSaved={totalSaved}
        totalSpent={totalSpent}
        categories={categories}
        transactions={transactions}
      />

      {/* 3. Donut / Pie Breakdown */}
      <DonutChart
        salary={salary}
        savingsTarget={savingsTarget}
        totalSaved={totalSaved}
        categories={categories}
        transactions={transactions}
      />

      {/* 4. Dedicated Savings Section */}
      <SavingsCard
        savingsTarget={savingsTarget}
        totalSaved={totalSaved}
        transactions={transactions}
        onAddDepositClick={() => onOpenAddExpense('savings', 'savings')}
        onDeleteTransaction={onDeleteTransaction}
      />

      {/* Category Budgets Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Budgets
          </h3>
          <span className="text-xs text-slate-400">
            {categories.length} active budgets
          </span>
        </div>

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

      {/* 7. Dedicated Phone Recharge Section */}
      <RechargeCard
        transactions={transactions}
        onAddRechargeClick={() => onOpenAddExpense('recharge', 'expense')}
        onDeleteTransaction={onDeleteTransaction}
      />

      {/* 10. Monthly Summary Card */}
      <MonthlySummary
        salary={salary}
        totalSaved={totalSaved}
        savingsTarget={savingsTarget}
        categories={categories}
        transactions={transactions}
      />
    </div>
  );
};
