export type Category = 'food' | 'transport' | 'data' | 'fun' | 'other';

export interface Expense {
  id: string;
  amount: number; // in cents/kobo
  category: Category;
  date: string; // ISO format YYYY-MM-DD
  description?: string;
  createdAt: string;
}

export type FilterPeriod = 'this-week' | 'last-week' | 'all-time';

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export interface DailyTotal {
  date: string;
  displayDate: string;
  amount: number;
}
