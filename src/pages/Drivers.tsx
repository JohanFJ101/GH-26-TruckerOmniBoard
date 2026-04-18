import { motion } from 'framer-motion';
import { Phone, Truck, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import HOSBar from '../components/shared/HOSBar';
import StatusDot from '../components/shared/StatusDot';
import Badge from '../components/shared/Badge';

const truckTypeLabels: Record<string, string> = {
  'dry-van': 'Dry Van',
  'reefer': 'Reefer',
  'flatbed': 'Flatbed',
  'tanker': 'Tanker',
};

export default function Drivers() {
  const drivers = useStore((s) => s.drivers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {drivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="card"
            style={{ padding: '20px', transition: 'all 0.2s' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: 'white',
              }}>
                {driver.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>{driver.name}</span>
                  <StatusDot status={driver.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>
                    {driver.truckId}
                  </span>
                  <Badge label={truckTypeLabels[driver.truckType]} variant="neutral" />
                </div>
              </div>
            </div>

            {/* HOS */}
            <div style={{ marginBottom: '16px' }}>
              <HOSBar driveRemaining={driver.hos.driveRemaining} dutyRemaining={driver.hos.dutyRemaining} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Safety</div>
                <div style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700,
                  color: driver.performance.safetyScore >= 90 ? 'var(--accent-green)' : driver.performance.safetyScore >= 80 ? 'var(--accent-amber)' : 'var(--accent-red)',
                }}>
                  {driver.performance.safetyScore}
                </div>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>On-Time</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700, color: 'var(--accent-green)' }}>
                  {driver.performance.onTimeRate}%
                </div>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cost/Mi</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700 }}>
                  ${driver.performance.avgCostPerMile.toFixed(2)}
                </div>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mi/Week</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700 }}>
                  {driver.performance.totalMilesThisWeek.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} />
              <span>{driver.location.city}, {driver.location.state}</span>
              <span style={{ color: 'var(--text-muted)' }}>· {driver.location.lastUpdated}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <Phone size={14} /> Message
              </button>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <Truck size={14} /> Assign Load
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
