import React, { useState } from 'react';
import { 
  Settings2, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Moon, 
  Sun, 
  Monitor, 
  Save, 
  Check, 
  AlertTriangle,
  IndianRupee,
  Layers
} from 'lucide-react';
import { AppSettings, MonthData, CategoryBudget } from '../../types';
import { formatINR } from '../../utils/currency';
import { exportAllData, importAllData } from '../../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  monthData: MonthData;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateMonthData: (updatedData: MonthData) => void;
  onResetMonth: () => void;
  onClearAllData: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  monthData,
  onUpdateSettings,
  onUpdateMonthData,
  onResetMonth,
  onClearAllData,
  onShowToast,
}) => {
  // Form state for current month / default budgets
  const [salary, setSalary] = useState(String(monthData.salary));
  const [savingsTarget, setSavingsTarget] = useState(String(monthData.savingsTarget));
  
  // Category budgets mapping
  const [categories, setCategories] = useState<CategoryBudget[]>(
    JSON.parse(JSON.stringify(monthData.categories))
  );

  const [applyToDefaults, setApplyToDefaults] = useState(true);

  // Calculate live allocation numbers
  const numSalary = Number(salary) || 0;
  const numSavings = Number(savingsTarget) || 0;
  const numCategoriesTotal = categories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
  const totalAllocated = numSavings + numCategoriesTotal;
  const remainingAllocation = numSalary - totalAllocated;

  const handleCategoryBudgetChange = (id: string, newBudgetStr: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, budget: Number(newBudgetStr) || 0 } : c))
    );
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (numSalary <= 0) {
      onShowToast('Salary must be greater than 0', 'error');
      return;
    }

    const updatedMonth: MonthData = {
      ...monthData,
      salary: numSalary,
      savingsTarget: numSavings,
      categories,
    };

    onUpdateMonthData(updatedMonth);

    if (applyToDefaults) {
      const updatedSettings: AppSettings = {
        ...settings,
        defaultSalary: numSalary,
        defaultSavingsTarget: numSavings,
        defaultCategories: categories,
      };
      onUpdateSettings(updatedSettings);
    }

    onShowToast('Budget updated successfully!', 'success');
  };

  // Export JSON file
  const handleExport = () => {
    try {
      const dataStr = exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `moneytrack_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      onShowToast('Data exported successfully!', 'success');
    } catch {
      onShowToast('Export failed', 'error');
    }
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          onShowToast('Data imported successfully! Reloading...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } else {
          onShowToast('Invalid backup file', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Budget
        </h2>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Customize monthly salary, targets, theme, and backups
        </p>
      </div>

      {/* 1. Monthly Budget Configuration */}
      <form
        onSubmit={handleSaveBudget}
        className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Budget Allocation
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust plan for {monthData.monthKey}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Plan</span>
          </button>
        </div>

        {/* Monthly Salary */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            required
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Savings Amount */}
        <div>
          <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
            Savings Target (₹)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            required
            value={savingsTarget}
            onChange={(e) => setSavingsTarget(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-800 text-sm font-mono-numbers font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Budget Inputs */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Spending Categories
          </h4>

          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1 truncate">
                {cat.name}
              </span>
              <div className="w-32 shrink-0">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={cat.budget}
                  onChange={(e) => handleCategoryBudgetChange(cat.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono-numbers font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Calculation Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Total Allocated:</span>
            <span className="font-bold font-mono-numbers text-slate-900 dark:text-white">
              {formatINR(totalAllocated)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={remainingAllocation < 0 ? 'text-rose-500 font-bold' : 'text-slate-500'}>
              {remainingAllocation >= 0 ? 'Remaining Unallocated:' : 'Over-allocated:'}
            </span>
            <span
              className={`font-extrabold font-mono-numbers ${
                remainingAllocation >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatINR(remainingAllocation)}
            </span>
          </div>
        </div>

        {/* Apply as default checkbox */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={applyToDefaults}
            onChange={(e) => setApplyToDefaults(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Also apply these amounts as default for future months</span>
        </label>
      </form>

      {/* 2. Theme & Currency Preference */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Preferences
        </h3>

        {/* Theme Selector */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  onUpdateSettings({ ...settings, theme: t });
                  onShowToast(`Theme switched to ${t}`, 'info');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold capitalize flex items-center justify-center gap-1.5 transition-all ${
                  settings.theme === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                {t === 'system' && <Monitor className="w-3.5 h-3.5" />}
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Display */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Active Currency
          </span>
          <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            ₹ INR (Indian Rupee)
          </span>
        </div>
      </div>

      {/* 3. Data Backup, Export, Reset & Clear */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Data Management
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Reset Current Month */}
          <button
            onClick={onResetMonth}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Current Month ({monthData.monthKey})</span>
          </button>

          {/* Clear All Data */}
          <button
            onClick={onClearAllData}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
