# How Receipts Works (Explained for a Seven-Year-Old!)

Imagine you have a magical piggy bank that not only holds your money but also draws colorful pictures of what you bought with it. Our "Receipts" app is exactly like that magical piggy bank! Let's explore how it works, step by step.

## The Big Brain (State and Derived State)

When you write down a new expense (like buying a toy), you are adding a piece of paper to a big box. This box is our **State**. It's the one true place where all your receipts live.

```typescript
// From useExpenses.ts
const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses);
```
Think of `useState` as a magic box. `expenses` is what's currently inside the box, and `setExpenses` is the robot arm that puts new things in or takes things out.

But what if we want to know how much we spent *just this week*? Or how much we spent on *food*? We don't need a new box for that! We just look at our main box and do some quick math. This is called **Derived State**.

```typescript
// From Dashboard.tsx
const filteredExpenses = useMemo(() => filterByPeriod(expenses, filter), [expenses, filter]);
const categoryTotals = useMemo(() => getCategoryTotals(filteredExpenses), [filteredExpenses]);
```
`useMemo` is like asking a really smart friend to calculate the math for you, and they only recalculate it if you add a new receipt or change the filter.

## The Sorting Hat (Filtering without Mutating)

When you change the filter from "All Time" to "This Week," we don't throw away the old receipts! We just put a pair of special glasses on. 

```typescript
// From filterUtils.ts
export function filterByPeriod(expenses: Expense[], period: FilterPeriod): Expense[] {
  return expenses.filter(expense => { ... });
}
```
The `.filter()` function is like a bouncer at a club. It checks each receipt. Does it belong to this week? Yes! Come on in. No? Wait outside. 
The best part? The original list of receipts is untouched. We **never mutate** (change) the original list. We just create a brand new, temporary list for the screen.

## The Coloring Book (How Charts Get Their Data)

Now, how do we turn those boring numbers into pretty charts? 

1. **Group the Data:** First, our smart friend (`getCategoryTotals`) reads all the receipts for the week and groups them. "Okay, $5 on apples, $10 on pizza... that's $15 on Food!"
2. **Add Colors:** Then, it assigns a specific color to each group. Food gets Amber, Transport gets Coral!
3. **Give to the Artist:** Finally, we pass this grouped list to our Chart component.

```tsx
// Inside Dashboard.tsx
<CategoryDonut data={categoryTotals} />
```

Inside `CategoryDonut.tsx`, the `Recharts` library takes over. It's like a magical artist. We just say, "Here is a list of slices and their sizes and colors," and it draws the pie for us!

```tsx
// Inside CategoryDonut.tsx
<Pie data={data} dataKey="value">
  {data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Pie>
```
The `<Pie>` component loops over our data (using `.map()`) and creates a slice (`<Cell>`) for each category, filling it with the color we chose.

## The Memory Book (localStorage)

When you close the app, your receipts don't disappear. Why? Because of `localStorage`!

```typescript
// From useExpenses.ts
useEffect(() => {
  localStorage.setItem('receipts_expenses', JSON.stringify(expenses));
}, [expenses]);
```
`useEffect` is a little helper that watches our magic box (`expenses`). Every time the box changes, the helper takes a quick picture of it (`JSON.stringify`) and saves it in the browser's secret backpack (`localStorage`). When you open the app tomorrow, it checks the backpack first and loads your receipts back in!
