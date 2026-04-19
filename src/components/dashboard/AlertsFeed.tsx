import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CloudSnow, Shield, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Badge from '../shared/Badge';
import type { Alert } from '../../types';

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  breakdown: <AlertTriangle size={16} />,
  delay: <Clock size={16} />,
  'hos-violation': <AlertTriangle size={16} />,
  weather: <CloudSnow size={16} />,
  deviation: <AlertTriangle size={16} />,
  inspection: <Shield size={16} />,
};

const severityColors: Record<Alert['severity'], string> = {
  info: 'var(--accent-blue)',
  warning: 'var(--accent-amber)',
  critical: 'var(--accent-red)',
};

export default function AlertsFeed() {
  const alerts = useStore((s) => s.alerts);
  const drivers = useStore((s) => s.drivers);
  const acknowledge = useStore((s) => s.acknowledgeAlert);

  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  const getDriverName = (driverId: string) =>
    drivers.find((d) => d.id === driverId)?.name ?? driverId;

  return (
    <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Live Alerts</h3>
          <Badge label={`${alerts.filter((a) => !a.acknowledged).length}`} variant="warning" />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {sorted.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
            style={{
              padding: '8px 12px',
              borderRadius: '2px',
              marginBottom: '8px',
              borderLeft: `3px solid ${severityColors[alert.severity]}`,
              backgroundColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.06)' : '#FFFFFF',
              opacity: alert.acknowledged ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <span style={{ color: severityColors[alert.severity], marginTop: '2px' }}>
                  {alertIcons[alert.type]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#374151', marginBottom: '6px' }}>
                    {getDriverName(alert.driverId)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {alert.financialImpact && (
                      <span style={{
                        fontSize: '12px',
                        fontFamily: 'Inter', fontWeight: 600,
                        color: 'var(--accent-amber)',
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>
                        ${alert.financialImpact} risk
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledge(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
