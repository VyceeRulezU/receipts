import { isThisWeek, isSameWeek, subWeeks, parseISO, startOfDay, subDays, format, isSameDay } from 'date-fns';
import type { Expense, FilterPeriod, CategoryTotal, DailyTotal } from '../types';

export const CATEGORY_COLORS: Record<string, string> = {
  food: '#FFBF00',      // Amber
  transport: '#FF7F50', // Coral
  data: '#4A90E2',      // Muted Blue (complementary)
  fun: '#9B51E0',       // Purple
  other: '#A0A0A0',     // Slate
};

export function filterByPeriod(expenses: Expense[], period: FilterPeriod): Expense[] {
  return expenses.filter(expense => {
    const date = parseISO(expense.date);
    if (period === 'this-week') return isThisWeek(date, { weekStartsOn: 1 });
    if (period === 'last-week') return isSameWeek(date, subWeeks(new Date(), 1), { weekStartsOn: 1 });
    return true; // 'all-time'
  });
}

export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value: value / 100, // Convert to display format
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value); // Sort descending
}

export function getDailyTotals(expenses: Expense[], days: number = 7): DailyTotal[] {
  const today = startOfDay(new Date());
  const dailyTotals: DailyTotal[] = [];

  // Initialize last `days` with 0
  for (let i = days - 1; i >= 0; i--) {
    const targetDate = subDays(today, i);
    dailyTotals.push({
      date: targetDate.toISOString(),
      displayDate: format(targetDate, 'EEE'), // Mon, Tue, etc.
      amount: 0,
    });
  }

  // Aggregate amounts
  expenses.forEach(expense => {
    const expenseDate = startOfDay(parseISO(expense.date));
    const dayMatch = dailyTotals.find(d => isSameDay(parseISO(d.date), expenseDate));
    if (dayMatch) {
      dayMatch.amount += (expense.amount / 100);
    }
  });

  return dailyTotals;
}

export function getPeriodTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // You can change this to NGN or other based on locale, but USD is a standard fallback
  }).format(amount);
}
