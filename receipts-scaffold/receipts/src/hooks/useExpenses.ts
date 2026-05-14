// src/hooks/useExpenses.ts

import { useState, useEffect } from 'react';
import type { Expense, NewExpense } from '../types';

const STORAGE_KEY = 'receipts_expenses';

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Expense[];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Receipts: failed to save to localStorage', e);
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);

  // Persist on every change
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  function addExpense(data: NewExpense): void {
    const expense: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [expense, ...prev]);
  }

  function deleteExpense(id: string): void {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  return { expenses, addExpense, deleteExpense };
}
