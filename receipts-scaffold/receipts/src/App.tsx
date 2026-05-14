// src/App.tsx

import { useState, useMemo } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { filterByPeriod } from './utils/filterUtils';
import { AddExpenseForm } from './components/AddExpenseForm';
import { FilterBar } from './components/FilterBar';
import { Dashboard } from './components/Dashboard';
import type { FilterPeriod } from './types';
import './styles/global.css';
import styles from './App.module.css';

export default function App() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [filter, setFilter] = useState<FilterPeriod>('this-week');

  const filtered = useMemo(
    () => filterByPeriod(expenses, filter),
    [expenses, filter]
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>RECEIPTS</span>
        <FilterBar currentFilter={filter} onChange={setFilter} />
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <AddExpenseForm onAdd={addExpense} />
        </aside>

        <section className={styles.content}>
          <Dashboard
            expenses={filtered}
            filter={filter}
            onDelete={deleteExpense}
          />
        </section>
      </main>
    </div>
  );
}
