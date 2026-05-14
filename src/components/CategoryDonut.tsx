import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryTotal } from '../types';

interface CategoryDonutProps {
  data: CategoryTotal[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'var(--bg-obsidian)',
        border: '1px solid var(--border-dim)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: data.color }} />
        <span style={{ textTransform: 'capitalize' }}>{data.name}:</span>
        <span className="font-mono" style={{ fontWeight: 600 }}>${data.value.toFixed(2)}</span>
      </div>
    );
  }
  return null;
};

export function CategoryDonut({ data }: CategoryDonutProps) {
  if (data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Spend by Category</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
          No data for this period
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Spend by Category</h3>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
            <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
