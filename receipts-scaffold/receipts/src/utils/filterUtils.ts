// src/utils/filterUtils.ts

import type { Expense, FilterPeriod, CategoryTotal, DailyTotal, Category } from '../types';
import { CATEGORY_META } from '../constants/categories';

// Returns "YYYY-MM-DD" string for a Date object
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Returns Monday of the current week (ISO week: Mon–Sun)
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekBounds(offsetWeeks = 0): { start: string; end: string } {
  const now = new Date();
  const monday = getMondayOf(now);
  monday.setDate(monday.getDate() + offsetWeeks * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: toDateString(monday),
    end:   toDateString(sunday),
  };
}

export function filterByPeriod(expenses: Expense[], period: FilterPeriod): Expense[] {
  if (period === 'all-time') return expenses;

  const offset = period === 'last-week' ? -7 : 0;
  const { start, end } = getWeekBounds(period === 'last-week' ? -1 : 0);
  void offset;

  return expenses.filter(e => e.date >= start && e.date <= end);
}

export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals: Partial<Record<Category, number>> = {};

  for (const expense of expenses) {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
  }

  return (Object.entries(totals) as [Category, number][])
    .map(([category, total]) => ({
      category,
      total,
      label: CATEGORY_META[category].label,
      color: CATEGORY_META[category].color,
    }))
    .sort((a, b) => b.total - a.total);
}

// Returns exactly `days` entries, oldest first, with 0 for empty days
export function getDailyTotals(expenses: Expense[], days = 7): DailyTotal[] {
  const result: DailyTotal[] = [];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateString(d);
    const dayLabel = DAY_NAMES[d.getDay()];

    const total = expenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    result.push({ date: dateStr, label: dayLabel, total });
  }

  return result;
}

// Week total always reflects the current week, regardless of active filter
export function getWeekTotal(expenses: Expense[]): number {
  const { start, end } = getWeekBounds(0);
  return expenses
    .filter(e => e.date >= start && e.date <= end)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function formatCurrency(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
