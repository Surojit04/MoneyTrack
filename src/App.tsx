import React, { useState, useEffect, useMemo } from 'react';
import { 
  loadSettings, 
  saveSettings, 
  loadMonthData, 
  saveMonthData, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
  resetMonthData, 
  clearAllData, 
  getAllMonthKeys 
} from './utils/storage';
import { 
  AppSettings, 
  MonthData, 
  Transaction, 
  CategoryBudget, 
  TabType 
} from './types';
import { getCurrentMonthKey } from './utils/currency';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/Dashboard/DashboardView';
import { TransactionList } from './components/Transactions/TransactionList';
import { BudgetsView } from './components/Budgets/BudgetsView';
import { ReportsView } from './components/Reports/ReportsView';
import { SettingsView } from './components/Settings/SettingsView';
import { AddExpenseModal } from './components/Modals/AddExpenseModal';
import { FirstTimeSetupModal } from './components/Modals/FirstTimeSetupModal';
import { MonthPickerModal } from './components/MonthPickerModal';
import { ConfirmDialog } from './components/Modals/ConfirmDialog';
import { Toast, ToastMessage } from './components/Toast';
import { Plus } from 'lucide-react';

export const App: React.FC = () => {
  // App state
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(() => {
    // Prompt sets focus on October 2026
    return '2026-10';
  });
  const [monthData, setMonthData] = useState<MonthData>(() => loadMonthData('2026-10'));
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultCategory, setAddModalDefaultCategory] = useState<string>('personal');
  const [addModalDefaultType, setAddModalDefaultType] = useState<'expense' | 'savings'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(() => !settings.hasCompletedSetup);

  // Confirmation dialogs state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Month Data when month changes
  useEffect(() => {
    setMonthData(loadMonthData(currentMonthKey));
  }, [currentMonthKey]);

  // Dark Mode management
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleToggleTheme = () => {
    const nextTheme: 'light' | 'dark' = settings.theme === 'dark' ? 'light' : 'dark';
    const updated: AppSettings = { ...settings, theme: nextTheme };
    setSettings(updated);
    saveSettings(updated);
    addToast(`Switched to ${nextTheme} mode`, 'info');
  };

  // Handle month switch
  const handleMonthChange = (newKey: string) => {
    setCurrentMonthKey(newKey);
    setMonthData(loadMonthData(newKey));
  };

  // Add or Edit Expense/Savings
  const handleOpenAddExpense = (
    defaultCat: string = 'personal',
    defaultType: 'expense' | 'savings' = 'expense'
  ) => {
    setEditingTransaction(null);
    setAddModalDefaultCategory(defaultCat);
    setAddModalDefaultType(defaultType);
    setIsAddModalOpen(true);
  };

  const handleOpenEditExpense = (tx: Transaction) => {
    setEditingTransaction(tx);
    setAddModalDefaultCategory(tx.categoryId);
    setAddModalDefaultType(tx.type);
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (data: {
    type: 'expense' | 'savings';
    categoryId: string;
    amount: number;
    title: string;
    date: string;
    note?: string;
    operator?: string;
  }) => {
    if (editingTransaction) {
      const updatedTx: Transaction = {
        ...editingTransaction,
        ...data,
      };
      updateTransaction(currentMonthKey, updatedTx);
      addToast('Transaction updated', 'success');
    } else {
      addTransaction(currentMonthKey, data);
      addToast(
        data.type === 'savings'
          ? `₹${data.amount} saved & protected!`
          : `Expense of ₹${data.amount} saved`,
        'success'
      );
    }
    // Refresh month data
    setMonthData(loadMonthData(currentMonthKey));
  };

  const handleDeleteTransaction = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Transaction?',
      message: 'Are you sure you want to delete this entry? This action cannot be undone.',
      confirmLabel: 'Delete',
      isDanger: true,
      onConfirm: () => {
        deleteTransaction(currentMonthKey, id);
        setMonthData(loadMonthData(currentMonthKey));
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        addToast('Transaction deleted', 'info');
      },
    });
  };

  // Budgets update
  const handleUpdateBudgets = (newCategories: CategoryBudget[]) => {
    const updated: MonthData = {
      ...monthData,
      categories: newCategories,
    };
    saveMonthData(currentMonthKey, updated);
    setMonthData(updated);
    addToast('Budgets updated', 'success');
  };

  // Settings update
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateMonthData = (updatedData: MonthData) => {
    saveMonthData(currentMonthKey, updatedData);
    setMonthData(updatedData);
  };

  // Reset current month
  const handleResetMonth = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Reset Month (${monthData.monthKey})?`,
      message:
        'This will clear all transactions for this specific month and reset budgets to default values. Other months will remain untouched.',
      confirmLabel: 'Reset Month',
      isDanger: true,
      onConfirm: () => {
        const fresh = resetMonthData(currentMonthKey);
        setMonthData(fresh);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        addToast(`Month ${currentMonthKey} reset`, 'info');
      },
    });
  };

  // Clear all data
  const handleClearAllData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Financial Data?',
      message:
        'Are you sure you want to permanently delete ALL recorded months, expenses, savings, and custom configurations? This cannot be undone.',
      confirmLabel: 'Clear Everything',
      isDanger: true,
      onConfirm: () => {
        clearAllData();
        const def = loadSettings();
        setSettings(def);
        const fresh = loadMonthData('2026-10');
        setMonthData(fresh);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        addToast('All data cleared', 'info');
      },
    });
  };

  // Onboarding setup completed
  const handleCompleteSetup = (data: {
    salary: number;
    savings: number;
    personal: number;
    girlfriend: number;
    home: number;
  }) => {
    const updatedCategories: CategoryBudget[] = [
      {
        id: 'personal',
        name: 'My Personal',
        budget: data.personal,
        icon: 'User',
        color: '#3b82f6',
        isDefault: true,
      },
      {
        id: 'girlfriend',
        name: 'Me & My Girlfriend',
        budget: data.girlfriend,
        icon: 'Heart',
        color: '#ec4899',
        isDefault: true,
      },
      {
        id: 'home',
        name: 'Home',
        budget: data.home,
        icon: 'Home',
        color: '#10b981',
        isDefault: true,
      },
    ];

    const updatedSettings: AppSettings = {
      ...settings,
      defaultSalary: data.salary,
      defaultSavingsTarget: data.savings,
      defaultCategories: updatedCategories,
      hasCompletedSetup: true,
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);

    const updatedMonth: MonthData = {
      ...monthData,
      salary: data.salary,
      savingsTarget: data.savings,
      categories: updatedCategories,
    };

    saveMonthData(currentMonthKey, updatedMonth);
    setMonthData(updatedMonth);
    setIsSetupModalOpen(false);
    addToast('Welcome to MoneyTrack! Plan activated.', 'success');
  };

  const availableMonths = useMemo(() => getAllMonthKeys(), [monthData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        currentMonthKey={currentMonthKey}
        onMonthChange={handleMonthChange}
        onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            monthData={monthData}
            onOpenAddExpense={handleOpenAddExpense}
            onEditExpense={handleOpenEditExpense}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'transactions' && (
          <TransactionList
            monthData={monthData}
            onEditExpense={handleOpenEditExpense}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddExpense={handleOpenAddExpense}
          />
        )}

        {currentTab === 'budgets' && (
          <BudgetsView
            monthData={monthData}
            onUpdateBudgets={handleUpdateBudgets}
            onOpenAddExpense={handleOpenAddExpense}
            onEditExpense={handleOpenEditExpense}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentTab === 'reports' && <ReportsView monthData={monthData} />}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            monthData={monthData}
            onUpdateSettings={handleUpdateSettings}
            onUpdateMonthData={handleUpdateMonthData}
            onResetMonth={handleResetMonth}
            onClearAllData={handleClearAllData}
            onShowToast={addToast}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) for Quick Add Expense */}
      <button
        onClick={() => handleOpenAddExpense()}
        aria-label="Add Expense"
        className="fixed right-5 bottom-20 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-90 text-white shadow-xl shadow-blue-500/35 flex items-center justify-center transition-all duration-200"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Mobile-first Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Add / Edit Expense Bottom Sheet Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        categories={monthData.categories}
        editingTransaction={editingTransaction}
        defaultCategoryId={addModalDefaultCategory}
        defaultType={addModalDefaultType}
        currentMonthKey={currentMonthKey}
        onSave={handleSaveTransaction}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
      />

      {/* Month Picker Modal */}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        currentMonthKey={currentMonthKey}
        onSelectMonth={handleMonthChange}
        onClose={() => setIsMonthPickerOpen(false)}
        availableMonths={availableMonths}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* First-Time Setup Modal */}
      <FirstTimeSetupModal
        isOpen={isSetupModalOpen}
        onCompleteSetup={handleCompleteSetup}
      />
    </div>
  );
};

export default App;
