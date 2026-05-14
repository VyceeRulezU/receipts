import { useState } from 'react';
import type { Category } from '../types';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onAdd: (expense: { amount: number; category: Category; date: string; description?: string }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Amount is inputted as decimal, we store as cents
    const parsedAmount = Math.round(parseFloat(amount) * 100);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAdd({
      amount: parsedAmount,
      category,
      date,
      description: description.trim() || undefined,
    });

    // Reset fields, keep date
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Add Expense</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Track a new transaction.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-field font-mono"
            style={{ paddingLeft: '2rem' }}
            required
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="input-field"
        >
          <option value="food">Food & Dining</option>
          <option value="transport">Transportation</option>
          <option value="data">Data & Internet</option>
          <option value="fun">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
          required
        />
        
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Note (optional)"
          className="input-field"
        />
      </div>

      <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Plus size={18} />
        <span>Add Receipt</span>
      </button>
    </form>
  );
}
