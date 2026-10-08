import { BudgetStatus } from '../types';

/**
 * Format number in Indian Rupee currency style (₹ 10,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format according to Indian Numbering system (Lakhs, Thousands)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Calculate dynamic Green / Orange / Red / Exhausted / Over-budget status
 * Prompt requirements:
 * Remaining > 50%: GREEN
 * Remaining between 20% and 50%: ORANGE
 * Remaining below 20%: RED
 * Remaining = 0: DARK RED / CRITICAL ("Budget exhausted")
 * Remaining < 0: OVER BUDGET ("⚠️ Over Budget")
 */
export function getBudgetStatus(budget: number, spent: number): BudgetStatus {
  const remaining = budget - spent;
  
  if (budget <= 0) {
    return {
      spent,
      budget: 0,
      remaining: -spent,
      percentSpent: 100,
      percentRemaining: 0,
      status: spent > 0 ? 'over' : 'green',
      statusLabel: spent > 0 ? '⚠️ Over Budget' : 'No budget set',
    };
  }

  const percentSpent = Math.round((spent / budget) * 100);
  const percentRemaining = Math.round((remaining / budget) * 100);

  if (remaining < 0) {
    return {
      spent,
      budget,
      remaining,
      percentSpent,
      percentRemaining,
      status: 'over',
      statusLabel: '⚠️ Over Budget',
    };
  }

  if (remaining === 0) {
    return {
      spent,
      budget,
      remaining: 0,
      percentSpent: 100,
      percentRemaining: 0,
      status: 'exhausted',
      statusLabel: 'Budget exhausted',
    };
  }

  if (percentRemaining > 50) {
    return {
      spent,
      budget,
      remaining,
      percentSpent,
      percentRemaining,
      status: 'green',
      statusLabel: `${percentRemaining}% remaining`,
    };
  }

  if (percentRemaining >= 20 && percentRemaining <= 50) {
    return {
      spent,
      budget,
      remaining,
      percentSpent,
      percentRemaining,
      status: 'orange',
      statusLabel: `${percentRemaining}% remaining`,
    };
  }

  return {
    spent,
    budget,
    remaining,
    percentSpent,
    percentRemaining,
    status: 'red',
    statusLabel: `${percentRemaining}% remaining`,
  };
}

/**
 * Month formatting and manipulation helpers
 */
export function formatMonthName(monthKey: string): string {
  // monthKey: "2026-10"
  try {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return monthKey;
  }
}

export function getMonthOffset(monthKey: string, offset: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function getCurrentMonthKey(): string {
  // Target month in prompt is October 2026, default to 2026-10 or current date
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  // If user system year is 2026, return current month key; otherwise default to 2026-10 as requested in prompt!
  return y === 2026 ? `${y}-${m}` : '2026-10';
}

export function formatDateShort(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
