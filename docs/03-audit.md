# System Audit: Edge Cases & Design Decisions

No system is perfect. In this audit, we examine how the "Receipts" application handles edge cases, scaling, and potential failure states.

## 1. localStorage Failures

**What happens if `localStorage` fails?**
Browsers can block `localStorage` (e.g., in strict incognito modes) or it can exceed its quota (usually 5MB). 
- **Read Failure:** In `useExpenses.ts`, we wrap the read operation in a `try...catch` block. If `getItem` throws an error, the app logs it to the console and safely falls back to returning an empty array `[]`. The app will load successfully, but it will be empty.
- **Write Failure:** Similarly, the `setItem` call inside the `useEffect` is wrapped in a `try...catch`. If writing fails, the app will continue to function in memory, but the user will lose their data upon refreshing. 

## 2. Empty State Design (Zero Expenses)

**What happens when the user has 0 expenses?**
A blank dashboard is intimidating. We specifically engineered empty states for all components:
- **Dashboard List:** Displays "No receipts for this period" instead of a jarring empty space.
- **Charts:** Recharts throws visual errors if fed completely empty data sets without handling. Both `DailyChart.tsx` and `CategoryDonut.tsx` check if `data.length === 0` (or if all values are 0) and return a custom empty state `div` ("No data available" / "No data for this period") that perfectly matches the height and layout of the actual charts. This prevents layout shifting and crashes.

## 3. Performance at Scale (1,000+ Expenses)

**What happens when the user has 1,000 expenses?**
- **Memory/Storage:** 1,000 expenses stored in JSON string format is roughly 100-150KB. This is well under the 5MB `localStorage` limit.
- **Rendering:** We don't render 1,000 DOM nodes. In `Dashboard.tsx`, we limit the UI to the 10 most recent receipts using `.slice(0, 10)`. This guarantees the DOM stays light and scrolling remains buttery smooth regardless of how many receipts are saved.
- **Compute:** The filtering and aggregation logic runs via `useMemo`. Iterating over 1,000 items in a JavaScript array to sum values takes less than 1 millisecond on a modern device.

## 4. Category Typos & Data Integrity

**What happens if a typo gets into a category?**
Because we rely on strict TypeScript types (`type Category = 'food' | 'transport' | 'data' | 'fun' | 'other'`), it is impossible to compile the code if a developer types "transprt". 
At runtime, the `ExpenseForm` forces the user to select from a `<select>` dropdown, making it impossible for user error to introduce a rogue category.
In the event that corrupted data *does* get injected into `localStorage`, the `getCategoryTotals` utility has a fallback: `color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other`. It will gracefully degrade to the 'other' color rather than crashing.

## 5. Currency Assumptions & Float Math

**Why are amounts stored weirdly?**
In JavaScript, `0.1 + 0.2 === 0.30000000000000004`. If we stored dollar amounts as floats (decimals), our dashboard totals would eventually look like `$15.00000000001`.
To prevent this, the `ExpenseForm` intercepts the decimal input and multiplies it by 100:
`const parsedAmount = Math.round(parseFloat(amount) * 100);`
We store everything in **cents** (integers). All math in `filterUtils.ts` is done on integers. Only at the very last second, before displaying it on the screen, do we divide by 100 (`value / 100`) and format it using `Intl.NumberFormat`. This guarantees perfect financial math.
