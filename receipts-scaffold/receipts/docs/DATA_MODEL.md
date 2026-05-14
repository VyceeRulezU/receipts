# Data Model

## Core Types

```ts
// src/types/index.ts

export type Category = 'food' | 'transport' | 'data' | 'fun' | 'other';

export type FilterPeriod = 'this-week' | 'last-week' | 'all-time';

export interface Expense {
  id: string;          // nanoid() or crypto.randomUUID()
  amount: number;      // stored as float (e.g. 2400.00), NOT cents
  category: Category;
  date: string;        // "YYYY-MM-DD" — ISO 8601 date string (no time)
  createdAt: string;   // ISO 8601 datetime — for sort stability
}

export interface CategoryTotal {
  category: Category;
  total: number;
  label: string;
  color: string;
}

export interface DailyTotal {
  date: string;     // "YYYY-MM-DD"
  label: string;    // "Mon", "Tue", etc.
  total: number;
}
```

---

## Amount Convention

Amounts are stored as plain floats (e.g. `2400` = ₦2,400). This avoids cent/kobo conversion logic throughout the app. On input, the form accepts decimal values (e.g. `24.50`). On display, format with `Intl.NumberFormat`.

```ts
// Formatting helper
const formatAmount = (amount: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
```

---

## Date Convention

Dates are stored as `"YYYY-MM-DD"` strings (not Date objects, not timestamps).

**Why strings?**

- JSON serializes cleanly — no `new Date()` calls on parse.
- `date` input values are already in this format.
- Avoids timezone issues — a date is a date, not a moment in time.

**Comparisons use lexicographic ordering**, which works correctly for `YYYY-MM-DD` format:

```ts
// "2025-05-12" < "2025-05-13" — string compare works
expenses.filter(e => e.date >= weekStart && e.date <= weekEnd)
```

---

## Filter Logic

```ts
// src/utils/filterUtils.ts

function getWeekBounds(offset = 0): { start: string; end: string }
// offset 0 = this week, offset -1 = last week
// "week" starts on Monday (ISO week)

function filterByPeriod(expenses: Expense[], period: FilterPeriod): Expense[]
// this-week: current Mon–Sun
// last-week: previous Mon–Sun
// all-time: no filter

function getCategoryTotals(expenses: Expense[]): CategoryTotal[]
// groups by category, sums amounts, attaches label + color
// returns sorted by total descending

function getDailyTotals(expenses: Expense[], days = 7): DailyTotal[]
// always returns exactly `days` entries
// days with no spending have total: 0
// ordered oldest → newest

function getWeekTotal(expenses: Expense[]): number
// sum of this-week expenses only
// regardless of active filter — always "current week"
```

---

## localStorage

**Key:** `receipts_expenses`

**On mount:** `useExpenses` reads from localStorage, parses JSON, validates shape, falls back to `[]` on error.

**On mutation:** every `addExpense` / `deleteExpense` call syncs the full array back to localStorage.

```ts
// Simplified hook signature
function useExpenses(): {
  expenses: Expense[];
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
}
```

**Storage limit:** localStorage is capped at ~5MB per origin. Each Expense object serialises to ~120 bytes. At 1,000 expenses/month, this is ~120KB/month — effectively unlimited for personal use.

---

## Constants

```ts
// src/constants/categories.ts

export const CATEGORY_META: Record<Category, { label: string; color: string; emoji: string }> = {
  food:      { label: 'Food',      color: '#E8593C', emoji: '🍜' },
  transport: { label: 'Transport', color: '#F2A623', emoji: '🚌' },
  data:      { label: 'Data',      color: '#4A90D9', emoji: '📶' },
  fun:       { label: 'Fun',       color: '#9B59B6', emoji: '🎉' },
  other:     { label: 'Other',     color: '#888780', emoji: '•'  },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
```

---

## Future: Supabase Migration Path

If cloud sync is added:

1. Replace `useExpenses` internals — swap localStorage reads/writes with Supabase `select`/`insert`/`delete`.
2. Add `user_id` field to `Expense`.
3. Everything above the hook stays the same — `App.tsx`, all components, all utils.

The current `id` field uses `crypto.randomUUID()` — compatible with Postgres `uuid` primary keys.
