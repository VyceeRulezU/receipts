import React, { useMemo, useState } from 'react';
import type { Expense, FilterPeriod } from '../types';
import { filterByPeriod, getCategoryTotals, getDailyTotals, getPeriodTotal, formatCurrency } from '../utils/filterUtils';
import { CategoryDonut } from './CategoryDonut';
import { DailyChart } from './DailyChart';
import { ExpenseForm } from './ExpenseForm';

interface DashboardProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDeleteExpense: (id: string) => void;
}

export function Dashboard({ expenses, onAddExpense, onDeleteExpense }: DashboardProps) {
  const [filter, setFilter] = useState<FilterPeriod>('this-week');

  const filteredExpenses = useMemo(() => filterByPeriod(expenses, filter), [expenses, filter]);
  const categoryTotals = useMemo(() => getCategoryTotals(filteredExpenses), [filteredExpenses]);
  const dailyTotals = useMemo(() => getDailyTotals(filteredExpenses), [filteredExpenses]);
  const periodTotal = useMemo(() => getPeriodTotal(filteredExpenses), [filteredExpenses]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Spend</h2>
          <div className="text-gradient font-mono" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>
            {formatCurrency(periodTotal)}
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
          {(['this-week', 'last-week', 'all-time'] as FilterPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              style={{
                background: filter === period ? 'var(--border-focus)' : 'transparent',
                color: filter === period ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                cursor: 'pointer',
                fontWeight: 500,
                textTransform: 'capitalize',
                transition: 'var(--transition)'
              }}
            >
              {period.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <CategoryDonut data={categoryTotals} />
        <DailyChart data={dailyTotals} />
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Expense List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Recent Receipts</h3>
          {filteredExpenses.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem 0' }}>No receipts for this period.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredExpenses.slice(0, 10).map((expense) => (
                <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>{expense.category}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{expense.date} {expense.description && `• ${expense.description}`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${(expense.amount / 100).toFixed(2)}</span>
                    <button 
                      onClick={() => onDeleteExpense(expense.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="Delete"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Expense Form */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <ExpenseForm onAdd={onAddExpense} />
        </div>
      </div>
      
    </div>
  );
}
