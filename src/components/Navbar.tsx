import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Calendar, Sparkles } from 'lucide-react';
import { formatMonthName, getMonthOffset } from '../utils/currency';

interface NavbarProps {
  currentMonthKey: string;
  onMonthChange: (monthKey: string) => void;
  onOpenMonthPicker: () => void;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMonthKey,
  onMonthChange,
  onOpenMonthPicker,
  theme,
  onToggleTheme,
}) => {
  const prevMonth = getMonthOffset(currentMonthKey, -1);
  const nextMonth = getMonthOffset(currentMonthKey, 1);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Top row: Brand & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="font-extrabold text-base">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  MoneyTrack
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md">
                  PWA
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                My Personal Money Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Dark mode button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="mt-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-1 rounded-2xl border border-slate-100/80 dark:border-slate-800">
          <button
            onClick={() => onMonthChange(prevMonth)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={onOpenMonthPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors shadow-xs"
          >
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{formatMonthName(currentMonthKey)}</span>
          </button>

          <button
            onClick={() => onMonthChange(nextMonth)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Next Month"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
