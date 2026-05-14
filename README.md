# Receipts — A Spender's Dashboard

> Track what your money has been doing behind your back.

## Overview

Receipts is a single-page React application for personal expense tracking. No accounts, no backend, no shame. You log where money went, the app shows you what it means.

Data lives in `localStorage`. Everything runs in the browser.

---

## Features

| Feature | Detail |
|---------|--------|
| Add expense | Amount, category, date, optional note |
| Delete expense | Remove individual entries with one click |
| Donut chart | Spending split by category |
| Bar chart | Daily totals for the last 7 days |
| Period total | Total spend for selected period |
| Filter | This week / Last week / All time |
| Persistence | localStorage — survives page refresh |

### Categories

`food` · `transport` · `data` · `fun` · `other`

---

## Tech Stack

- **React 18** via Vite
- **TypeScript** (strict mode)
- **Recharts** — PieChart (donut) + BarChart
- **date-fns** — Date manipulation
- **localStorage** — No backend
- **lucide-react** — Icons
- **Vanilla CSS** — CSS custom properties, no framework

---

## Project Structure

```
receipts/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard with filtering & totals
│   │   ├── CategoryDonut.tsx # Pie chart for category breakdown
│   │   ├── DailyChart.tsx    # Bar chart for daily spending
│   │   └── ExpenseForm.tsx   # Form to add new expenses
│   ├── hooks/
│   │   └── useExpenses.ts    # State management & localStorage sync
│   ├── utils/
│   │   └── filterUtils.ts    # Pure functions for filtering & math
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces & types
│   ├── index.css             # Global styles & design tokens
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── docs/                     # Documentation
│   ├── 01-explanation.md     # Child-friendly explanation
│   ├── 02-principles.md      # Engineering principles
│   ├── 03-audit.md           # Edge cases & design audit
│   ├── 05-tinker.md          # Comprehensive audit report
│   └── 06-lie-detector.md    # Code review challenge
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
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

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-obsidian` | #0A0A0A | Main background |
| `--text-primary` | #F0F0F0 | Main text |
| `--text-secondary` | #A0A0A0 | Secondary text |
| `--text-tertiary` | #606060 | Tertiary text |
| `--accent-amber` | #FFBF00 | Primary accent (Food) |
| `--accent-coral` | #FF7F50 | Secondary accent (Transport) |

### Category Colors

| Category | Color |
|----------|-------|
| food | #FFBF00 (Amber) |
| transport | #FF7F50 (Coral) |
| data | #4A90E2 (Muted Blue) |
| fun | #9B51E0 (Purple) |
| other | #A0A0A0 (Slate) |

---

## Engineering Principles

This application embodies several core software engineering principles:

1. **Single Source of Truth (SSOT)** — All expense data lives in one array; no duplicated state
2. **Derived State** — Data is computed on-the-fly using `useMemo`
3. **Pure Functions** — Utilities in `filterUtils.ts` have no side effects
4. **Separation of Concerns** — Data layer (hooks/utils) is separate from presentation (components)
5. **Defensive Programming** — Input validation prevents invalid data from entering state

---

## Key Implementation Details

### Currency Math

Amounts are stored as **integers in cents** (not floats) to avoid JavaScript floating-point errors:

```typescript
// Store: multiply by 100
const parsedAmount = Math.round(parseFloat(amount) * 100);

// Display: divide by 100
const display = (expense.amount / 100).toFixed(2);
```

### Empty States

All components handle zero-data scenarios gracefully:
- Dashboard: "No receipts for this period"
- Charts: "No data available" / "No data for this period"

### localStorage Error Handling

Both read and write operations are wrapped in try-catch blocks:
- Read failure → fallback to empty array
- Write failure → continue in memory (data lost on refresh)

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/01-explanation.md` | Explain how the app works (child-friendly) |
| `docs/02-principles.md` | Software engineering principles applied |
| `docs/03-audit.md` | Edge cases & design decisions audit |
| `docs/05-tinker.md` | Comprehensive code review & recommendations |
| `docs/06-lie-detector.md` | Code review challenge — find the lie |

---

## Roadmap

- [x] Delete individual expenses
- [ ] Edit existing entries
- [ ] Export to CSV
- [ ] Monthly view
- [ ] Budget cap per category
- [ ] Data import/export
- [ ] Add form validation

---

## Limitations

- **No tests** — Zero test coverage currently
- **No backup** — Data cannot be exported/imported
- **localStorage only** — No cloud sync, data lost if cleared
- **Accessibility gaps** — Missing labels, aria attributes, contrast issues

---

## License

MIT