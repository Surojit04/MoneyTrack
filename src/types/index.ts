export type CategoryType = 
  | 'savings'
  | 'personal'
  | 'girlfriend'
  | 'home'
  | 'recharge'
  | string;

export interface CategoryBudget {
  id: string; // 'personal' | 'girlfriend' | 'home' | custom id
  name: string;
  budget: number;
  icon: string;
  color: string; // hex or tailwind class
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  monthKey: string; // e.g. "2026-10"
  type: 'expense' | 'savings';
  categoryId: string; // 'personal', 'girlfriend', 'home', 'recharge', 'savings', or custom
  amount: number;
  title: string;
  date: string; // YYYY-MM-DD
  note?: string;
  operator?: string; // For phone recharge: Airtel, Jio, Vi, BSNL, etc.
  mobileNumber?: string;
  createdAt: number;
}

export interface MonthlyBudgetConfig {
  salary: number;
  savingsTarget: number;
  categories: CategoryBudget[];
  rechargeBudgetOption?: 'none' | 'personal' | 'home' | 'custom';
}

export interface MonthData {
  monthKey: string; // "2026-10"
  salary: number;
  savingsTarget: number;
  categories: CategoryBudget[];
  transactions: Transaction[];
}

export interface AppSettings {
  defaultSalary: number;
  defaultSavingsTarget: number;
  defaultCategories: CategoryBudget[];
  theme: 'light' | 'dark' | 'system';
  hasCompletedSetup: boolean;
}

export interface BudgetStatus {
  spent: number;
  budget: number;
  remaining: number;
  percentSpent: number;
  percentRemaining: number;
  status: 'green' | 'orange' | 'red' | 'exhausted' | 'over';
  statusLabel: string;
}

export type TabType = 'dashboard' | 'transactions' | 'budgets' | 'reports' | 'settings';
