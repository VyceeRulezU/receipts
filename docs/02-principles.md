# Engineering Principles in Receipts

A clean codebase isn't just about making things work; it's about making them predictable, scalable, and easy to reason about. Here are the core software engineering principles embedded in the "Receipts" dashboard.

## 1. Single Source of Truth (SSOT)

**Where it is:** `useExpenses.ts`
The application state revolves around one primitive array: `expenses`. 
We do not store `weeklyExpenses`, `foodTotal`, or `totalSpend` in React state. By keeping a Single Source of Truth, we eliminate "sync bugs" where one piece of state updates but another related piece gets left behind. If the main array is correct, everything downstream is mathematically guaranteed to be correct.

## 2. Derived State

**Where it is:** `Dashboard.tsx` (using `useMemo`)
Instead of duplicating state, we *derive* what we need on the fly. 
When the `expenses` array or the `filter` changes, `Dashboard.tsx` recalculates `filteredExpenses`, `categoryTotals`, and `periodTotal` dynamically. We wrap these calculations in `useMemo` so React only recalculates them when their dependencies change, optimizing performance without sacrificing data integrity.

## 3. Pure Functions & Immutability

**Where it is:** `filterUtils.ts`
The utility functions (`filterByPeriod`, `getCategoryTotals`, `getDailyTotals`) are pure. 
- **Pure Functions:** They take inputs (an array of expenses) and return a new output (a filtered array or a sum) without causing side effects. They don't reach out to the network, they don't modify global variables, and given the exact same input, they will always return the exact same output. This makes them incredibly easy to write unit tests for.
- **Immutability:** When filtering data, we use `Array.prototype.filter()` and `Array.prototype.reduce()`. These methods return *brand new arrays* rather than mutating the original array in place. 

## 4. Separation of Concerns (Data vs. Presentation)

**Where it is:** Component Architecture vs. Hooks/Utils
- **Data Layer:** `useExpenses.ts` handles how data is fetched, saved, and modified. `filterUtils.ts` handles the business logic of dates and math.
- **Presentation Layer:** `DailyChart.tsx` and `CategoryDonut.tsx` are "dumb" components. They know absolutely nothing about `localStorage`, `date-fns`, or how a week is calculated. They simply receive an array of numbers and strings via props and paint them on the screen. 
This decoupling means you could rip out `localStorage` tomorrow and replace it with a Supabase database, and the charts wouldn't need a single line of code changed.

## 5. Defensive Programming (Fail Safes)

**Where it is:** `ExpenseForm.tsx`
We don't trust user input. In the form submission handler, we explicitly validate the amount:
```typescript
const parsedAmount = Math.round(parseFloat(amount) * 100);
if (isNaN(parsedAmount) || parsedAmount <= 0) return;
```
By preventing `NaN` or negative numbers from ever entering the state, we protect the charts and math utilities downstream from catastrophic failures.
