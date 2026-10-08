import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatMonthName } from '../utils/currency';

interface MonthPickerModalProps {
  isOpen: boolean;
  currentMonthKey: string;
  onSelectMonth: (monthKey: string) => void;
  onClose: () => void;
  availableMonths: string[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  currentMonthKey,
  onSelectMonth,
  onClose,
  availableMonths,
}) => {
  const [selectedYear, setSelectedYear] = useState(() => {
    const [y] = currentMonthKey.split('-');
    return Number(y) || 2026;
  });

  if (!isOpen) return null;

  const currentMonthNum = Number(currentMonthKey.split('-')[1]) || 10;
  const currentYearNum = Number(currentMonthKey.split('-')[0]) || 2026;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Month</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Navigator */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl mb-4">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-xs transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-base text-slate-900 dark:text-white font-mono-numbers">
            {selectedYear}
          </span>
          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-xs transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {MONTH_NAMES.map((name, index) => {
            const monthNumber = index + 1;
            const monthStr = String(monthNumber).padStart(2, '0');
            const key = `${selectedYear}-${monthStr}`;
            const isSelected = selectedYear === currentYearNum && monthNumber === currentMonthNum;
            const hasData = availableMonths.includes(key);

            return (
              <button
                key={monthStr}
                onClick={() => {
                  onSelectMonth(key);
                  onClose();
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold relative transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {name.slice(0, 3)}
                {hasData && (
                  <span
                    className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-blue-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick jump to October 2026 button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Current: {formatMonthName(currentMonthKey)}
          </span>
          <button
            onClick={() => {
              onSelectMonth('2026-10');
              onClose();
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Jump to Oct 2026
          </button>
        </div>
      </div>
    </div>
  );
};
