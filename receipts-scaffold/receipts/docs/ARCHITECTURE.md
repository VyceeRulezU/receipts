# Architecture

## Decisions

### Why Vite?

Fast cold starts, instant HMR, and first-class TypeScript support. No ejection needed. The dev experience is noticeably better than CRA for a project this size.

### Why Recharts?

Recharts is built on top of D3 and exposes a composable React API. For a dashboard with a donut and a bar chart, it's the right tradeoff — full control without writing raw SVG. Chart.js and Visx were considered; Recharts wins on React-native ergonomics.

### Why localStorage?

This is a personal tracker, not a shared platform. No auth, no sync, no cost. The data shape is simple enough that localStorage is the right tool. A future Supabase migration path is noted in `DATA_MODEL.md`.

### Why Vanilla CSS?

Tailwind's JIT is fast, but it introduces a build dependency and obscures the design system in class soup. With a small component surface, hand-authored CSS with custom properties gives full control and zero abstraction tax.

---

## Data Flow

```
useExpenses (hook)
  ├── reads from localStorage on mount
  ├── stores Expense[] in React state
  ├── writes to localStorage on every mutation
  └── exposes: expenses, addExpense, deleteExpense

App
  ├── holds: filter (FilterPeriod)
  ├── receives: expenses + mutations from useExpenses
  └── passes filtered data down to Dashboard

Dashboard
  ├── DonutChart  — receives categoryTotals[]
  ├── DailyBarChart — receives dailyTotals[] (last 7 days)
  └── WeekTotal — receives weekSum (number)
       └── ExpenseList — receives filtered Expense[]
```

---

## State Shape

Only two pieces of React state live at the top level:

| State | Type | Where |
|---|---|---|
| `expenses` | `Expense[]` | `useExpenses` hook |
| `filter` | `FilterPeriod` | `App.tsx` |

Everything else (category totals, daily totals, week sum) is derived via `useMemo` inside `Dashboard` or its children. No prop drilling beyond two levels.

---

## Filtering

Filtering happens in `filterUtils.ts`, not inside components. This keeps components pure and makes the filter logic independently testable.

```ts
// filterUtils.ts
filterByPeriod(expenses: Expense[], period: FilterPeriod): Expense[]
getCategoryTotals(expenses: Expense[]): CategoryTotal[]
getDailyTotals(expenses: Expense[], days: number): DailyTotal[]
getWeekTotal(expenses: Expense[]): number
```

`FilterPeriod` is a union: `'this-week' | 'last-week' | 'all-time'`

---

## localStorage Schema

Key: `receipts_expenses`

Value: JSON-serialized `Expense[]`

```json
[
  {
    "id": "uuid-v4",
    "amount": 2400,
    "category": "food",
    "date": "2025-05-12",
    "createdAt": "2025-05-12T14:32:00.000Z"
  }
]
```

Amounts are stored as integers (kobo/cents) to avoid float arithmetic issues. The UI converts on display: `amount / 100`.

---

## Error Boundaries

A single `<ErrorBoundary>` wraps the chart region. If Recharts throws (e.g. on an empty data edge case), the fallback shows "No data to display" instead of a blank crash.

---

## Future: Backend Migration

If this ever needs multi-device sync, the `useExpenses` hook is the only thing that changes. The component tree is already decoupled from the persistence layer. Replace localStorage reads/writes with Supabase calls — everything above stays the same.
