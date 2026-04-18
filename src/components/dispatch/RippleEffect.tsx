import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import type { Driver } from '../../types';

interface RippleEffectProps {
  drivers: Driver[];
  assignedDriverName: string;
}

export default function RippleEffect({ drivers, assignedDriverName }: RippleEffectProps) {
  const data = drivers.map((d) => ({
    name: d.name.split(' ')[0],
    busyHours: d.currentLoadId ? Math.round(Math.random() * 8 + 4) : 0,
    freeHours: d.currentLoadId ? Math.round(Math.random() * 6 + 2) : 24,
    isAssigned: d.name === assignedDriverName,
  }));

  return (
    <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        Ripple Effect
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Fleet availability next 24h if you assign <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{assignedDriverName}</span>
      </div>

      <div style={{ height: '160px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={12}>
            <XAxis
              type="number"
              domain={[0, 24]}
              tick={{ fontSize: 10, fill: '#475569' }}
              tickLine={false}
              axisLine={{ stroke: '#252833' }}
              unit="h"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Bar dataKey="busyHours" stackId="a" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.isAssigned ? '#f97316' : '#3b82f6'} fillOpacity={0.7} />
              ))}
            </Bar>
            <Bar dataKey="freeHours" stackId="a" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill="#1a1d25" stroke="#252833" strokeWidth={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
