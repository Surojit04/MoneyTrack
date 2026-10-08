import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CreditCard, 
  CalendarDays,
  Award
} from 'lucide-react';
import { MonthData, CategoryBudget, Transaction } from '../../types';
import { formatINR, formatMonthName } from '../../utils/currency';
import { getAllMonthKeys, loadMonthData } from '../../utils/storage';

interface ReportsViewProps {
  monthData: MonthData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ monthData }) => {
  const { salary, savingsTarget, categories, transactions, monthKey } = monthData;

  const totalSaved = transactions
    .filter((t) => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Category spending aggregation
  const categorySpendingList = categories.map((cat) => {
    const spent = expenseTransactions
      .filter((t) => t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      id: cat.id,
      name: cat.name,
      budget: cat.budget,
      spent,
      color: cat.color,
      percentOfTotal: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0,
      percentOfBudget: cat.budget > 0 ? Math.round((spent / cat.budget) * 100) : 0,
    };
  });

  // Include Phone Recharge in category breakdown
  const rechargeSpent = expenseTransactions
    .filter((t) => t.categoryId === 'recharge')
    .reduce((sum, t) => sum + t.amount, 0);

  if (rechargeSpent > 0) {
    categorySpendingList.push({
      id: 'recharge',
      name: 'Phone Recharge',
      budget: rechargeSpent, // or standalone
      spent: rechargeSpent,
      color: '#8b5cf6',
      percentOfTotal: totalSpent > 0 ? Math.round((rechargeSpent / totalSpent) * 100) : 0,
      percentOfBudget: 100,
    });
  }

  // Highest and lowest spending categories
  const nonZeroCategories = categorySpendingList.filter((c) => c.spent > 0);
  const sortedBySpending = [...categorySpendingList].sort((a, b) => b.spent - a.spent);
  const highestCategory = sortedBySpending[0]?.spent > 0 ? sortedBySpending[0] : null;
  const lowestCategory =
    nonZeroCategories.length > 0
      ? [...nonZeroCategories].sort((a, b) => a.spent - b.spent)[0]
      : null;

  // Average daily spending
  // Days elapsed in the month (e.g. October has 31 days)
  const [yearNum, monthNum] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const avgDailySpending = Math.round(totalSpent / (daysInMonth || 30));

  // Multi-month comparison trend
  const allKeys = getAllMonthKeys();
  const multiMonthTrend = allKeys.map((k) => {
    const mData = loadMonthData(k);
    const spent = mData.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const saved = mData.transactions
      .filter((t) => t.type === 'savings')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      key: k,
      label: formatMonthName(k).slice(0, 3) + ' ' + k.slice(2, 4),
      spent,
      saved,
    };
  });

  const maxTrendValue = Math.max(
    ...multiMonthTrend.map((t) => Math.max(t.spent, t.saved)),
    salary || 10000
  );

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Financial Reports
        </h2>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Analytics & Spending Patterns for {formatMonthName(monthKey)}
        </p>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Total Spent
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatINR(totalSpent)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            across {expenseTransactions.length} expenses
          </span>
        </div>

        {/* Total Saved */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
            Total Saved
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
            {formatINR(totalSaved)}
          </span>
          <span className="text-[10px] text-emerald-600/70 block mt-0.5">
            {savingsTarget > 0 ? `${Math.round((totalSaved / savingsTarget) * 100)}% of target` : 'Saved'}
          </span>
        </div>

        {/* Average Daily Spending */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mb-1">
            Avg Daily Spending
          </span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers">
            {formatINR(avgDailySpending)}/day
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            over {daysInMonth} days
          </span>
        </div>

        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-500 block mb-1">
            Highest Category
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
            {highestCategory ? highestCategory.name : 'None'}
          </span>
          <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 font-mono-numbers">
            {highestCategory ? formatINR(highestCategory.spent) : '₹0'}
          </span>
        </div>

        {/* Lowest Spending Category */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 block mb-1">
            Lowest Category
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
            {lowestCategory ? lowestCategory.name : 'None'}
          </span>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
            {lowestCategory ? formatINR(lowestCategory.spent) : '₹0'}
          </span>
        </div>
      </div>

      {/* Bar Chart: Category Spending vs Budget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Category Spending vs Budget
            </h3>
            <p className="text-[11px] text-slate-400">
              Visual utilization for {formatMonthName(monthKey)}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {categorySpendingList.map((cat) => {
            const isOver = cat.spent > cat.budget && cat.budget > 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </div>
                  <div className="font-mono-numbers text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatINR(cat.spent)}
                    </span>
                    <span className="text-slate-400"> / {formatINR(cat.budget)}</span>
                    <span
                      className={`ml-1.5 font-bold ${
                        isOver ? 'text-rose-500' : 'text-slate-500'
                      }`}
                    >
                      ({cat.percentOfBudget}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : ''
                    }`}
                    style={{
                      width: `${Math.min(100, cat.percentOfBudget)}%`,
                      backgroundColor: isOver ? undefined : cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Month Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Spending & Savings Trend
              </h3>
              <p className="text-[11px] text-slate-400">
                Comparing history across recorded months
              </p>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Chart */}
        <div className="pt-4">
          <div className="flex items-end justify-around h-36 border-b border-slate-100 dark:border-slate-800 gap-2 px-2">
            {multiMonthTrend.map((m) => {
              const spentHeight = maxTrendValue > 0 ? (m.spent / maxTrendValue) * 100 : 0;
              const savedHeight = maxTrendValue > 0 ? (m.saved / maxTrendValue) * 100 : 0;

              return (
                <div key={m.key} className="flex flex-col items-center gap-1 w-12">
                  <div className="w-full flex items-end justify-center gap-1.5 h-28">
                    {/* Spent bar */}
                    <div
                      className="w-3.5 bg-rose-500/80 rounded-t-sm transition-all duration-500"
                      style={{ height: `${Math.max(4, spentHeight)}%` }}
                      title={`Spent: ${formatINR(m.spent)}`}
                    />
                    {/* Saved bar */}
                    <div
                      className="w-3.5 bg-emerald-500/80 rounded-t-sm transition-all duration-500"
                      style={{ height: `${Math.max(4, savedHeight)}%` }}
                      title={`Saved: ${formatINR(m.saved)}`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Spent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
