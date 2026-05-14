// src/types/index.ts

export type Category = 'food' | 'transport' | 'data' | 'fun' | 'other';

export type FilterPeriod = 'this-week' | 'last-week' | 'all-time';

export interface Expense {
  id: string;
  amount: number;      // float — e.g. 2400.00
  category: Category;
  date: string;        // "YYYY-MM-DD"
  createdAt: string;   // ISO 8601 datetime
}

export interface CategoryTotal {
  category: Category;
  total: number;
  label: string;
  color: string;
}

export interface DailyTotal {
  date: string;    // "YYYY-MM-DD"
  label: string;   // "Mon", "Tue", etc.
  total: number;
}

export type NewExpense = Omit<Expense, 'id' | 'createdAt'>;
