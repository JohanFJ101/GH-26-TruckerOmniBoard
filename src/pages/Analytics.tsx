import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import { formatCurrency, formatCostPerMile } from '../lib/costCalculator';

const COST_BREAKDOWN = [
  { name: 'Fuel', value: 55, color: '#f97316' },
  { name: 'Deadhead', value: 20, color: '#3b82f6' },
  { name: 'Detention', value: 12, color: '#fbbf24' },
  { name: 'Tolls', value: 8, color: '#22c55e' },
  { name: 'Other', value: 5, color: '#94a3b8' },
];

const TREND_DATA = [
  { day: 'Mon', fleet: 1.95, webb: 1.88, okonkwo: 1.72, delgado: 2.10 },
  { day: 'Tue', fleet: 1.92, webb: 1.85, okonkwo: 1.71, delgado: 2.05 },
  { day: 'Wed', fleet: 1.90, webb: 1.83, okonkwo: 1.73, delgado: 2.03 },
  { day: 'Thu', fleet: 1.89, webb: 1.81, okonkwo: 1.74, delgado: 2.00 },
  { day: 'Fri', fleet: 1.91, webb: 1.84, okonkwo: 1.76, delgado: 2.04 },
  { day: 'Sat', fleet: 1.88, webb: 1.80, okonkwo: 1.73, delgado: 1.99 },
  { day: 'Sun', fleet: 1.87, webb: 1.82, okonkwo: 1.74, delgado: 2.01 },
];

export default function Analytics() {
  const { drivers, loads } = useStore();

  const sortedDrivers = [...drivers].sort((a, b) => b.performance.avgCostPerMile - a.performance.avgCostPerMile);
  const maxCost = Math.max(...drivers.map((d) => d.performance.avgCostPerMile));

  const loadProfitability = loads
    .filter((l) => l.assignedDriverId)
    .map((l) => {
      const driver = drivers.find((d) => d.id === l.assignedDriverId);
      const estCost = Math.round(l.miles * (driver?.performance.avgCostPerMile ?? 1.87));
      const margin = l.rate - estCost;
      const marginPct = ((margin / l.rate) * 100).toFixed(1);
      return { ...l, driverName: driver?.name ?? '—', estCost, margin, marginPct: parseFloat(marginPct) };
    })
    .sort((a, b) => a.marginPct - b.marginPct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
        {/* Cost Per Mile by Driver */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Cost Per Mile by Driver</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sortedDrivers.map((driver) => {
              const pct = (driver.performance.avgCostPerMile / maxCost) * 100;
              const isHighest = driver.performance.avgCostPerMile === maxCost;
              return (
                <div key={driver.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: isHighest ? 'var(--accent-red)' : 'var(--text-secondary)' }}>{driver.name}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', color: isHighest ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: 600 }}>
                      {formatCostPerMile(driver.performance.avgCostPerMile)}
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isHighest ? 'var(--accent-red)' : 'var(--accent-primary)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Trend */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>7-Day Fleet Cost Trend</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid stroke="#252833" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={{ stroke: '#252833' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={{ stroke: '#252833' }} tickLine={false} domain={[1.6, 2.2]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d25', border: '1px solid #252833', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="fleet" stroke="#f97316" strokeWidth={2.5} dot={false} name="Fleet Avg" />
                <Line type="monotone" dataKey="webb" stroke="#3b82f6" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Webb" />
                <Line type="monotone" dataKey="okonkwo" stroke="#22c55e" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Okonkwo" />
                <Line type="monotone" dataKey="delgado" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Delgado" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Load Profitability */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-border)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Load Profitability</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px 100px 100px 100px', padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--bg-border)' }}>
          <span>Load</span><span>Route</span><span>Driver</span><span>Miles</span><span>Est. Cost</span><span>Rate</span><span>Margin</span>
        </div>
        {loadProfitability.map((l) => (
          <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px 100px 100px 100px', padding: '12px 20px', fontSize: '13px', alignItems: 'center', borderBottom: '1px solid var(--bg-border)', backgroundColor: l.marginPct < 0 ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--accent-primary)' }}>{l.id}</span>
            <span>{l.pickup.city} → {l.delivery.city}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{l.driverName}</span>
            <span style={{ fontFamily: 'Space Mono, monospace' }}>{l.miles}</span>
            <span style={{ fontFamily: 'Space Mono, monospace' }}>{formatCurrency(l.estCost)}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--accent-green)' }}>{formatCurrency(l.rate)}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 600, color: l.marginPct < 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {l.marginPct}%
            </span>
          </div>
        ))}
      </div>

      {/* Donut Chart */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>Cost Breakdown This Week</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ width: '280px', height: '280px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COST_BREAKDOWN} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value" paddingAngle={3} stroke="none">
                  {COST_BREAKDOWN.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1d25', border: '1px solid #252833', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total This Week</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '22px', fontWeight: 700, color: 'var(--accent-primary)' }}>$34,280</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {COST_BREAKDOWN.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '80px' }}>{item.name}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 600 }}>{item.value}%</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatCurrency(Math.round(34280 * item.value / 100))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
