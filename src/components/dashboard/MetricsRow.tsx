import { motion } from 'framer-motion';
import { TrendingDown, Package, Clock, Users, Route } from 'lucide-react';
import { useStore } from '../../store/useStore';
import CostTrend from '../shared/CostTrend';
import { useEffect, useState } from 'react';

interface MetricCard {
  label: string;
  icon: React.ReactNode;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  sparkline?: number[];
  accentColor: string;
}

function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(increment * step * 100) / 100);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="metric-value">
      {prefix}{typeof target === 'number' && target % 1 !== 0 ? current.toFixed(2) : Math.round(current)}{suffix}
    </span>
  );
}

export default function MetricsRow() {
  const metrics = useStore((s) => s.metrics);
  const drivers = useStore((s) => s.drivers);

  const cards: MetricCard[] = [
    {
      label: 'Cost Per Mile',
      icon: <TrendingDown size={18} />,
      value: `$${metrics.costPerMile.current.toFixed(2)}`,
      trend: `${metrics.costPerMile.vsLastWeek}%`,
      trendPositive: metrics.costPerMile.vsLastWeek < 0,
      sparkline: metrics.costPerMile.trend,
      accentColor: metrics.costPerMile.vsLastWeek < 0 ? 'var(--accent-green)' : 'var(--accent-red)',
    },
    {
      label: 'Active Loads',
      icon: <Package size={18} />,
      value: `${metrics.activeLoads}`,
      accentColor: 'var(--accent-blue)',
    },
    {
      label: 'On-Time Rate',
      icon: <Clock size={18} />,
      value: `${metrics.onTimeRate}%`,
      trend: '+1.4%',
      trendPositive: true,
      accentColor: 'var(--accent-green)',
    },
    {
      label: 'Drivers Available',
      icon: <Users size={18} />,
      value: `${drivers.filter((d) => !d.currentLoadId).length}/${drivers.length}`,
      accentColor: 'var(--accent-primary)',
    },
    {
      label: 'Deadhead %',
      icon: <Route size={18} />,
      value: `${metrics.deadheadPercentage}%`,
      trend: '+2.1%',
      trendPositive: false,
      accentColor: 'var(--accent-red)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          className="card"
          style={{
            padding: '12px',
            borderTop: `2px solid ${card.accentColor}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {card.label}
            </span>
            <span style={{ color: card.accentColor }}>{card.icon}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <span className="metric-value">{card.value}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              {card.trend && (
                <span
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter', fontWeight: 600,
                    color: card.trendPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontWeight: 600,
                  }}
                >
                  {card.trend}
                </span>
              )}
              {card.sparkline && <CostTrend trend={card.sparkline} positive={card.trendPositive} />}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
