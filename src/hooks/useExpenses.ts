import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '../types';

const STORAGE_KEY = 'receipts_expenses';

// Dummy data for initial demonstration if needed, but we'll start empty to be realistic
const getInitialExpenses = (): Expense[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
  return [];
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses);

  // Sync with local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [expenses]);

  const addExpense = useCallback((newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [expense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    expenses,
    addExpense,
    deleteExpense,
  };
}
