# Receipts — A Spender's Dashboard

> Track what your money has been doing behind your back.

## Overview

Receipts is a single-page React application for personal expense tracking. No accounts, no backend, no shame. You log where money went, the app shows you what it means.

Data lives in `localStorage`. Everything runs in the browser.

---

## Features

| Feature | Detail |
|---|---|
| Add expense | Amount, category, date — nothing more |
| Donut chart | Spending split by category |
| Bar chart | Daily totals for the last 7 days |
| Week total | Current-week spend at a glance |
| Filter | This week / Last week / All time |
| Persistence | localStorage — survives page refresh |

### Categories

`food` · `transport` · `data` · `fun` · `other`

---

## Stack

- **React 18** via Vite
- **TypeScript** (strict mode)
- **Recharts** — PieChart (donut) + BarChart
- **localStorage** — no backend
- **Vanilla CSS** — custom properties, no framework

---

## Project Structure

```
receipts/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AddExpenseForm/
│   │   ├── FilterBar/
│   │   ├── Dashboard/
│   │   ├── DonutChart/
│   │   ├── DailyBarChart/
│   │   ├── WeekTotal/
│   │   └── ExpenseList/
│   ├── hooks/
│   │   └── useExpenses.ts
│   ├── utils/
│   │   ├── filterUtils.ts
│   │   └── dateUtils.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css
│   │   └── components.css
│   ├── constants/
│   │   └── categories.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── DATA_MODEL.md
│   └── DESIGN_SYSTEM.md
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Design Philosophy

Money is emotional. The UI treats that with calm clarity — dark surfaces, clear type, color only where it earns its place. No cluttered forms. No guilt-inducing red. Just what you spent and where.

See `docs/DESIGN_SYSTEM.md` for tokens and palette decisions.

---

## Roadmap

- [ ] Delete individual expenses
- [ ] Edit existing entries
- [ ] Export to CSV
- [ ] Monthly view
- [ ] Budget cap per category

---

## License

MIT
