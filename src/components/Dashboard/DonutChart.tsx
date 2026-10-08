import React, { useState } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CategoryBudget, Transaction } from '../../types';
import { formatINR } from '../../utils/currency';

interface DonutChartProps {
  salary: number;
  savingsTarget: number;
  totalSaved: number;
  categories: CategoryBudget[];
  transactions: Transaction[];
}

interface SliceData {
  id: string;
  label: string;
  value: number;
  color: string;
  percent: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  salary,
  savingsTarget,
  totalSaved,
  categories,
  transactions,
}) => {
  const [mode, setMode] = useState<'allocation' | 'actual'>('allocation');
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  // Compute slices for Allocation
  const allocationSlices: SliceData[] = [
    {
      id: 'savings',
      label: 'Savings',
      value: savingsTarget,
      color: '#10b981', // emerald
      percent: salary > 0 ? Math.round((savingsTarget / salary) * 100) : 0,
    },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      value: c.budget,
      color: c.color,
      percent: salary > 0 ? Math.round((c.budget / salary) * 100) : 0,
    })),
  ];

  // If there's unallocated salary
  const totalAllocated = savingsTarget + categories.reduce((sum, c) => sum + c.budget, 0);
  if (salary > totalAllocated) {
    const unallocated = salary - totalAllocated;
    allocationSlices.push({
      id: 'unallocated',
      label: 'Unallocated Buffer',
      value: unallocated,
      color: '#94a3b8', // slate
      percent: Math.round((unallocated / salary) * 100),
    });
  }

  // Compute slices for Actual Spending
  const actualSlices: SliceData[] = [];
  if (totalSaved > 0) {
    actualSlices.push({
      id: 'savings',
      label: 'Savings Done',
      value: totalSaved,
      color: '#10b981',
      percent: salary > 0 ? Math.round((totalSaved / salary) * 100) : 0,
    });
  }

  categories.forEach((cat) => {
    const catSpent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    if (catSpent > 0) {
      actualSlices.push({
        id: cat.id,
        label: cat.name,
        value: catSpent,
        color: cat.color,
        percent: salary > 0 ? Math.round((catSpent / salary) * 100) : 0,
      });
    }
  });

  // Phone recharge actual
  const rechargeSpent = transactions
    .filter((t) => t.type === 'expense' && t.categoryId === 'recharge')
    .reduce((sum, t) => sum + t.amount, 0);
  if (rechargeSpent > 0) {
    actualSlices.push({
      id: 'recharge',
      label: 'Phone Recharge',
      value: rechargeSpent,
      color: '#8b5cf6', // purple
      percent: salary > 0 ? Math.round((rechargeSpent / salary) * 100) : 0,
    });
  }

  const slices = mode === 'allocation' ? allocationSlices : actualSlices;
  const totalSliceValue = slices.reduce((sum, s) => sum + s.value, 0) || 1;

  // Generate SVG arcs
  let accumulatedAngle = 0;
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
      {/* Title & Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Money Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">
              {mode === 'allocation' ? 'Planned monthly allocation' : 'Actual spending breakdown'}
            </p>
          </div>
        </div>

        {/* Mode Pill Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-semibold">
          <button
            onClick={() => setMode('allocation')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === 'allocation'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => setMode('actual')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === 'actual'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Actual
          </button>
        </div>
      </div>

      {/* Donut Graphic & Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            {/* Background track circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Slices */}
            {slices.map((slice) => {
              const sliceRatio = slice.value / totalSliceValue;
              const strokeDasharray = `${sliceRatio * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedAngle * circumference;
              accumulatedAngle += sliceRatio;

              const isHovered = activeSlice === slice.id;

              return (
                <circle
                  key={slice.id}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveSlice(slice.id)}
                  onMouseLeave={() => setActiveSlice(null)}
                  onTouchStart={() => setActiveSlice(slice.id)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {activeSlice
                ? slices.find((s) => s.id === activeSlice)?.label
                : mode === 'allocation'
                ? 'Total Salary'
                : 'Total Placed'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono-numbers">
              {formatINR(
                activeSlice
                  ? slices.find((s) => s.id === activeSlice)?.value || 0
                  : mode === 'allocation'
                  ? salary
                  : totalSliceValue
              )}
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              {activeSlice
                ? `${slices.find((s) => s.id === activeSlice)?.percent}%`
                : '100%'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {slices.map((slice) => {
            const isHovered = activeSlice === slice.id;
            return (
              <div
                key={slice.id}
                onMouseEnter={() => setActiveSlice(slice.id)}
                onMouseLeave={() => setActiveSlice(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                  isHovered
                    ? 'bg-slate-100 dark:bg-slate-800 scale-101'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {slice.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers">
                    {formatINR(slice.value)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 w-8 text-right font-mono-numbers">
                    {slice.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
