import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Calendar, 
  PiggyBank, 
  User, 
  Heart, 
  Home as HomeIcon, 
  Smartphone, 
  FolderOpen,
  Plus,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { MonthData, Transaction, CategoryBudget } from '../../types';
import { formatINR, formatDateShort, formatMonthName } from '../../utils/currency';

interface TransactionListProps {
  monthData: MonthData;
  onEditExpense: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddExpense: (defaultCategoryId?: string, defaultType?: 'expense' | 'savings') => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  monthData,
  onEditExpense,
  onDeleteTransaction,
  onOpenAddExpense,
}) => {
  const { transactions, categories, monthKey } = monthData;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Build filter options
  const filterOptions = useMemo(() => {
    return [
      { id: 'all', label: 'All' },
      { id: 'personal', label: 'Personal' },
      { id: 'girlfriend', label: 'Me & My Girlfriend' },
      { id: 'home', label: 'Home' },
      { id: 'recharge', label: 'Phone Recharge' },
      { id: 'savings', label: 'Savings' },
      // Custom categories not in the standard list
      ...categories
        .filter((c) => !['personal', 'girlfriend', 'home'].includes(c.id))
        .map((c) => ({ id: c.id, label: c.name })),
    ];
  }, [categories]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'savings') {
          if (tx.type !== 'savings') return false;
        } else if (tx.categoryId !== selectedCategory) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesNote = tx.note?.toLowerCase().includes(query);
        const matchesOperator = tx.operator?.toLowerCase().includes(query);
        const matchesAmount = String(tx.amount).includes(query);
        if (!matchesTitle && !matchesNote && !matchesOperator && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedCategory, searchQuery]);

  // Category Icon & Name helper
  const getCategoryMeta = (categoryId: string, type: 'expense' | 'savings') => {
    if (type === 'savings') {
      return {
        name: 'Savings',
        color: '#10b981',
        icon: PiggyBank,
      };
    }

    if (categoryId === 'recharge') {
      return {
        name: 'Phone Recharge',
        color: '#8b5cf6',
        icon: Smartphone,
      };
    }

    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      let icon = FolderOpen;
      if (cat.id === 'personal') icon = User;
      if (cat.id === 'girlfriend') icon = Heart;
      if (cat.id === 'home') icon = HomeIcon;
      return {
        name: cat.name,
        color: cat.color,
        icon,
      };
    }

    return {
      name: categoryId,
      color: '#64748b',
      icon: FolderOpen,
    };
  };

  const totalFilteredAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Activity & Expenses
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {formatMonthName(monthKey)} • {transactions.length} entries
          </p>
        </div>

        <button
          onClick={() => onOpenAddExpense()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, note, or amount..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Horizontal Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {filterOptions.map((f) => {
          const isActive = selectedCategory === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-100 dark:border-slate-800'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Summary for current filter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-semibold">
        <span>Showing {filteredTransactions.length} items</span>
        <span className="font-mono-numbers">
          Total: <strong className="text-slate-900 dark:text-white">{formatINR(totalFilteredAmount)}</strong>
        </span>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800 my-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No expenses found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? 'Try adjusting your search query or filter.'
              : 'Start tracking your spending to understand where your money goes.'}
          </p>
          <button
            onClick={() => onOpenAddExpense()}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Expense</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => {
            const meta = getCategoryMeta(tx.categoryId, tx.type);
            const Icon = meta.icon;
            const isSavings = tx.type === 'savings';

            return (
              <div
                key={tx.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: meta.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </h4>
                      {tx.operator && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded">
                          {tx.operator}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {meta.name}
                      </span>
                      <span>•</span>
                      <span>{formatDateShort(tx.date)}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold font-mono-numbers block ${
                        isSavings
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isSavings ? '+' : ''}{formatINR(tx.amount)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {isSavings ? 'Savings' : 'Spent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-100 dark:border-slate-800 pl-2">
                    <button
                      onClick={() => onEditExpense(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
