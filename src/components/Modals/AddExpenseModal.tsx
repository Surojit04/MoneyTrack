import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  PiggyBank, 
  User, 
  Heart, 
  Home as HomeIcon, 
  Smartphone, 
  FolderOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CategoryBudget, Transaction } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  categories: CategoryBudget[];
  editingTransaction?: Transaction | null;
  defaultCategoryId?: string;
  defaultType?: 'expense' | 'savings';
  currentMonthKey: string;
  onSave: (data: {
    type: 'expense' | 'savings';
    categoryId: string;
    amount: number;
    title: string;
    date: string;
    note?: string;
    operator?: string;
    mobileNumber?: string;
  }) => void;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  categories,
  editingTransaction,
  defaultCategoryId = 'personal',
  defaultType = 'expense',
  currentMonthKey,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<'expense' | 'savings'>('expense');
  const [categoryId, setCategoryId] = useState<string>('personal');
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [operator, setOperator] = useState<string>('Jio');
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset when modal opens or edit changes
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type);
        setCategoryId(editingTransaction.categoryId);
        setAmount(String(editingTransaction.amount));
        setTitle(editingTransaction.title);
        setDate(editingTransaction.date);
        setNote(editingTransaction.note || '');
        setOperator(editingTransaction.operator || 'Jio');
      } else {
        setType(defaultType);
        setCategoryId(defaultCategoryId === 'savings' ? 'savings' : defaultCategoryId);
        setAmount('');
        setTitle(defaultType === 'savings' ? 'Savings Deposit' : '');
        // Default date matching the current month key
        const todayStr = new Date().toISOString().slice(0, 10);
        if (todayStr.startsWith(currentMonthKey)) {
          setDate(todayStr);
        } else {
          setDate(`${currentMonthKey}-07`); // Default to 7th of the selected month
        }
        setNote('');
        setOperator('Jio');
      }
      setError(null);
    }
  }, [isOpen, editingTransaction, defaultCategoryId, defaultType, currentMonthKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a description or name');
      return;
    }

    onSave({
      type,
      categoryId: type === 'savings' ? 'savings' : categoryId,
      amount: numAmount,
      title: title.trim(),
      date: date || `${currentMonthKey}-01`,
      note: note.trim() || undefined,
      operator: categoryId === 'recharge' ? operator : undefined,
    });

    onClose();
  };

  // Quick amount additions
  const QUICK_AMOUNTS = [30, 50, 100, 250, 299, 500, 1000];

  // Quick item chips based on category
  const getSuggestions = () => {
    if (type === 'savings') return ['Monthly Savings', 'Extra Savings', 'Bonus Deposit'];
    switch (categoryId) {
      case 'personal':
        return ['Tea', 'Coffee', 'Snacks', 'Travel', 'Personal item'];
      case 'girlfriend':
        return ['Dinner', 'Coffee', 'Gift', 'Movie', 'Weekend outing'];
      case 'home':
        return ['Groceries', 'Medicine', 'Household items', 'Electricity', 'Vegetables'];
      case 'recharge':
        return ['Monthly Recharge', 'Data Booster', 'Annual Plan'];
      default:
        return ['Shopping', 'Transport', 'Food', 'Bill'];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTransaction ? 'Edit Transaction' : 'Quick Add'}
            </h3>
            <p className="text-xs text-slate-400">
              {editingTransaction ? 'Update recorded entry' : 'Log an expense or savings deposit in seconds'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Expense vs Savings Type Pill */}
          {!editingTransaction && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  if (categoryId === 'savings') setCategoryId('personal');
                  setTitle('');
                }}
                className={`py-2 rounded-xl transition-all ${
                  type === 'expense'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('savings');
                  setCategoryId('savings');
                  setTitle('Savings Deposit');
                }}
                className={`py-2 rounded-xl transition-all ${
                  type === 'savings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Savings Deposit
              </button>
            </div>
          )}

          {/* Category Dropdown/Selector (if type === 'expense') */}
          {type === 'expense' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Default Core Categories */}
                {categories.map((c) => {
                  const isSelected = categoryId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left truncate ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}

                {/* Dedicated Phone Recharge Category */}
                <button
                  type="button"
                  onClick={() => setCategoryId('recharge')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left truncate ${
                    categoryId === 'recharge'
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 ring-1 ring-purple-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Phone Recharge</span>
                </button>
              </div>
            </div>
          )}

          {/* Amount Input with big numeric font */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-base">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-mono-numbers font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold font-mono-numbers whitespace-nowrap transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Name Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description / Name
            </label>
            <input
              type="text"
              required
              placeholder={
                type === 'savings'
                  ? 'Savings Deposit'
                  : categoryId === 'recharge'
                  ? 'Monthly Recharge'
                  : 'e.g. Tea, Coffee, Groceries'
              }
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Suggestions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5">
              {getSuggestions().map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTitle(s)}
                  className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-semibold whitespace-nowrap hover:bg-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Operator field (if phone recharge selected) */}
          {categoryId === 'recharge' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Operator / Provider (Optional)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Jio', 'Airtel', 'Vi', 'BSNL'].map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperator(op)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      operator === op
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cinema popcorn, evening snack, special plan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 ${
                type === 'savings'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {editingTransaction
                  ? 'Update Transaction'
                  : type === 'savings'
                  ? 'Record Savings Deposit'
                  : 'Save Expense'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
