import React from 'react';
import { useExpenses } from './hooks/useExpenses';
import { Dashboard } from './components/Dashboard';

function App() {
  const { expenses, addExpense, deleteExpense } = useExpenses();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-dim)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Receipts
          </h1>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>A Spender's Dashboard.</p>
        </div>
      </header>

      <main>
        <Dashboard 
          expenses={expenses} 
          onAddExpense={addExpense} 
          onDeleteExpense={deleteExpense} 
        />
      </main>
    </div>
  );
}

export default App;
