import { AppSettings, MonthData, Transaction, CategoryBudget } from '../types';

export const DEFAULT_CATEGORIES: CategoryBudget[] = [
  {
    id: 'personal',
    name: 'My Personal',
    budget: 1000,
    icon: 'User',
    color: '#3b82f6', // blue
    isDefault: true,
  },
  {
    id: 'girlfriend',
    name: 'Me & My Girlfriend',
    budget: 1000,
    icon: 'Heart',
    color: '#ec4899', // pink
    isDefault: true,
  },
  {
    id: 'home',
    name: 'Home',
    budget: 2000,
    icon: 'Home',
    color: '#10b981', // emerald
    isDefault: true,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultSalary: 10000,
  defaultSavingsTarget: 6000,
  defaultCategories: DEFAULT_CATEGORIES,
  theme: 'light',
  hasCompletedSetup: true,
};

const SETTINGS_KEY = 'moneytrack_settings_v1';
const MONTHS_INDEX_KEY = 'moneytrack_months_index_v1';
const MONTH_KEY_PREFIX = 'moneytrack_month_v1_';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getAllMonthKeys(): string[] {
  try {
    const raw = localStorage.getItem(MONTHS_INDEX_KEY);
    if (!raw) {
      const initial = ['2026-10'];
      localStorage.setItem(MONTHS_INDEX_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.includes('2026-10')) {
      parsed.push('2026-10');
    }
    return parsed.sort();
  } catch (e) {
    console.error('Failed to load months index', e);
    return ['2026-10'];
  }
}

export function addMonthKeyToIndex(monthKey: string): void {
  try {
    const keys = getAllMonthKeys();
    if (!keys.includes(monthKey)) {
      keys.push(monthKey);
      keys.sort();
      localStorage.setItem(MONTHS_INDEX_KEY, JSON.stringify(keys));
    }
  } catch (e) {
    console.error('Failed to update months index', e);
  }
}

export function getInitialSampleTransactions(monthKey: string): Transaction[] {
  if (monthKey !== '2026-10') return [];
  const baseTimestamp = Date.now();
  return [
    {
      id: 'tx_seed_savings',
      monthKey: '2026-10',
      type: 'savings',
      categoryId: 'savings',
      title: 'Savings Deposit',
      amount: 6000,
      date: '2026-10-07',
      note: 'Target reached for October',
      createdAt: baseTimestamp - 300000,
    },
    {
      id: 'tx_seed_1',
      monthKey: '2026-10',
      type: 'expense',
      categoryId: 'personal',
      title: 'Tea',
      amount: 30,
      date: '2026-10-07',
      note: 'Evening tea with snack',
      createdAt: baseTimestamp - 240000,
    },
    {
      id: 'tx_seed_2',
      monthKey: '2026-10',
      type: 'expense',
      categoryId: 'girlfriend',
      title: 'Movie',
      amount: 250,
      date: '2026-10-08',
      note: 'Cinema tickets',
      createdAt: baseTimestamp - 180000,
    },
    {
      id: 'tx_seed_3',
      monthKey: '2026-10',
      type: 'expense',
      categoryId: 'home',
      title: 'Groceries',
      amount: 400,
      date: '2026-10-09',
      note: 'Vegetables and dairy',
      createdAt: baseTimestamp - 120000,
    },
    {
      id: 'tx_seed_4',
      monthKey: '2026-10',
      type: 'expense',
      categoryId: 'recharge',
      title: 'Phone Recharge',
      amount: 299,
      date: '2026-10-10',
      operator: 'Jio',
      note: 'Monthly 28 days plan',
      createdAt: baseTimestamp - 60000,
    },
  ];
}

export function loadMonthData(monthKey: string): MonthData {
  const settings = loadSettings();
  try {
    const raw = localStorage.getItem(`${MONTH_KEY_PREFIX}${monthKey}`);
    if (raw) {
      const data = JSON.parse(raw);
      addMonthKeyToIndex(monthKey);
      return data;
    }
  } catch (e) {
    console.error('Failed to load month data', e);
  }

  // Brand new month, clone from settings defaults
  const newMonth: MonthData = {
    monthKey,
    salary: settings.defaultSalary,
    savingsTarget: settings.defaultSavingsTarget,
    categories: JSON.parse(JSON.stringify(settings.defaultCategories)),
    transactions: getInitialSampleTransactions(monthKey),
  };

  saveMonthData(monthKey, newMonth);
  addMonthKeyToIndex(monthKey);
  return newMonth;
}

export function saveMonthData(monthKey: string, data: MonthData): void {
  try {
    localStorage.setItem(`${MONTH_KEY_PREFIX}${monthKey}`, JSON.stringify(data));
    addMonthKeyToIndex(monthKey);
  } catch (e) {
    console.error('Failed to save month data', e);
  }
}

export function addTransaction(
  monthKey: string,
  txData: Omit<Transaction, 'id' | 'createdAt' | 'monthKey'>
): Transaction {
  const monthData = loadMonthData(monthKey);
  const newTx: Transaction = {
    ...txData,
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    monthKey,
    createdAt: Date.now(),
  };

  monthData.transactions.unshift(newTx);
  saveMonthData(monthKey, monthData);
  return newTx;
}

export function updateTransaction(monthKey: string, updatedTx: Transaction): void {
  const monthData = loadMonthData(monthKey);
  monthData.transactions = monthData.transactions.map((t) =>
    t.id === updatedTx.id ? updatedTx : t
  );
  saveMonthData(monthKey, monthData);
}

export function deleteTransaction(monthKey: string, txId: string): void {
  const monthData = loadMonthData(monthKey);
  monthData.transactions = monthData.transactions.filter((t) => t.id !== txId);
  saveMonthData(monthKey, monthData);
}

export function resetMonthData(monthKey: string): MonthData {
  const settings = loadSettings();
  const freshMonth: MonthData = {
    monthKey,
    salary: settings.defaultSalary,
    savingsTarget: settings.defaultSavingsTarget,
    categories: JSON.parse(JSON.stringify(settings.defaultCategories)),
    transactions: [],
  };
  saveMonthData(monthKey, freshMonth);
  return freshMonth;
}

export function exportAllData(): string {
  const settings = loadSettings();
  const months = getAllMonthKeys();
  const monthsData: Record<string, MonthData> = {};

  for (const m of months) {
    monthsData[m] = loadMonthData(m);
  }

  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings,
    monthsIndex: months,
    monthsData,
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function importAllData(jsonStr: string): boolean {
  try {
    const payload = JSON.parse(jsonStr);
    if (!payload.settings || !payload.monthsData) {
      throw new Error('Invalid MoneyTrack backup format');
    }

    saveSettings(payload.settings);

    const keys: string[] = [];
    for (const [key, month] of Object.entries(payload.monthsData)) {
      keys.push(key);
      localStorage.setItem(`${MONTH_KEY_PREFIX}${key}`, JSON.stringify(month));
    }

    localStorage.setItem(MONTHS_INDEX_KEY, JSON.stringify(keys.sort()));
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}

export function clearAllData(): void {
  try {
    const keys = getAllMonthKeys();
    for (const k of keys) {
      localStorage.removeItem(`${MONTH_KEY_PREFIX}${k}`);
    }
    localStorage.removeItem(MONTHS_INDEX_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
