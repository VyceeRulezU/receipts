# Components

All components are functional. No class components. Props are typed with TypeScript interfaces.

---

## AddExpenseForm

**Path:** `src/components/AddExpenseForm/AddExpenseForm.tsx`

Controlled form with three fields. Submits and resets on valid entry. Amount validation prevents zero or negative values.

### Props

```ts
interface AddExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}
```

### Fields

| Field | Type | Validation |
|---|---|---|
| Amount | number input | > 0, max 2 decimal places |
| Category | select | one of the 5 category keys |
| Date | date input | defaults to today, no future dates |

### Behaviour

- Amount is stored internally as a string to avoid controlled input issues, parsed to float on submit.
- After a successful add, the form resets to default values (empty amount, "food" category, today's date).
- The submit button is disabled while any field is invalid.

---

## FilterBar

**Path:** `src/components/FilterBar/FilterBar.tsx`

Segmented control. Three options rendered as `<button>` elements. Active state driven by `currentFilter` prop.

### Props

```ts
interface FilterBarProps {
  currentFilter: FilterPeriod;
  onChange: (period: FilterPeriod) => void;
}
```

### Options

| Label | Value |
|---|---|
| This week | `'this-week'` |
| Last week | `'last-week'` |
| All time | `'all-time'` |

---

## Dashboard

**Path:** `src/components/Dashboard/Dashboard.tsx`

Container component. Receives filtered expenses and derives chart data via `useMemo`. Renders the three chart/stat sub-components.

### Props

```ts
interface DashboardProps {
  expenses: Expense[];
  filter: FilterPeriod;
}
```

### Derived Data (internal)

```ts
const categoryTotals = useMemo(() => getCategoryTotals(expenses), [expenses]);
const dailyTotals    = useMemo(() => getDailyTotals(expenses, 7), [expenses]);
const weekTotal      = useMemo(() => getWeekTotal(expenses), [expenses]);
```

---

## DonutChart

**Path:** `src/components/DonutChart/DonutChart.tsx`

Recharts `PieChart` with `innerRadius` set for donut shape. Custom active segment animation. Legend rendered as custom HTML below the chart, not Recharts' built-in legend (more control over typography).

### Props

```ts
interface DonutChartProps {
  data: CategoryTotal[];
}
```

### CategoryTotal shape

```ts
interface CategoryTotal {
  category: Category;
  total: number;   // in display units (not cents)
  label: string;   // "Food", "Transport", etc.
  color: string;   // CSS custom property ref or hex
}
```

### Empty state

When `data` is empty or all totals are 0, renders a centered "No expenses yet" message instead of a broken chart.

---

## DailyBarChart

**Path:** `src/components/DailyBarChart/DailyBarChart.tsx`

Recharts `BarChart` showing the last 7 days. X-axis shows day abbreviations (Mon, Tue…). Y-axis shows currency values. Bars use a single fill color with hover highlight via `activeBar` prop.

### Props

```ts
interface DailyBarChartProps {
  data: DailyTotal[];
}
```

### DailyTotal shape

```ts
interface DailyTotal {
  date: string;    // "YYYY-MM-DD"
  label: string;   // "Mon", "Tue", etc.
  total: number;   // in display units
}
```

Days with no spending are included with `total: 0` — no gaps in the bar chart.

---

## WeekTotal

**Path:** `src/components/WeekTotal/WeekTotal.tsx`

Displays a single large currency figure — the total spend for the active filter period. Renders a sub-label showing the period name.

### Props

```ts
interface WeekTotalProps {
  total: number;
  filter: FilterPeriod;
}
```

---

## ExpenseList

**Path:** `src/components/ExpenseList/ExpenseList.tsx`

Scrollable list of expense rows. Each row shows category badge, description-like amount + date, and a delete button.

### Props

```ts
interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}
```

### Row layout

```
[Category badge]  ₦ 2,400.00    May 12
                                 [×]
```

Empty state: "No expenses in this period."

---

## Error Boundary

**Path:** `src/components/ErrorBoundary.tsx`

Class component (React error boundaries must be class-based). Wraps the `Dashboard`. Fallback: a simple "Something went wrong with the charts." message.

---

## Conventions

- Every component folder includes an `index.ts` barrel export.
- Component files are named identically to the component (PascalCase).
- CSS modules are co-located: `AddExpenseForm.module.css` lives alongside `AddExpenseForm.tsx`. (Or use the global component styles file — pick one approach and stay consistent.)
- No prop spreading (`{...props}`) — all props are explicit.
