import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Badge from '../shared/Badge';
import { formatCurrency } from '../../lib/costCalculator';
import type { Load } from '../../types';

const statusVariant: Record<Load['status'], 'info' | 'warning' | 'critical' | 'success' | 'neutral'> = {
  pending: 'neutral',
  assigned: 'info',
  'in-transit': 'info',
  delivered: 'success',
  delayed: 'warning',
};

export default function ActiveLoads() {
  const loads = useStore((s) => s.loads);
  const drivers = useStore((s) => s.drivers);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeLoads = loads.filter((l) => l.status !== 'pending');
  const getDriver = (id: string | null) => drivers.find((d) => d.id === id);

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-border)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Active Loads</h3>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 150px 120px 120px 100px 60px',
          padding: '12px 20px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottom: '1px solid var(--bg-border)',
        }}
      >
        <span>Load ID</span>
        <span>Route</span>
        <span>Driver</span>
        <span>Status</span>
        <span>ETA</span>
        <span>Rate</span>
        <span></span>
      </div>

      {/* Rows */}
      {activeLoads.map((load) => {
        const driver = getDriver(load.assignedDriverId);
        const isExpanded = expandedId === load.id;
        const isDelayed = load.status === 'delayed';

        return (
          <div key={load.id}>
            <div
              onClick={() => setExpandedId(isExpanded ? null : load.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 150px 120px 120px 100px 60px',
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: '1px solid var(--bg-border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isExpanded ? 'var(--bg-elevated)' : 'transparent',
              }}
            >
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--accent-primary)' }}>
                {load.id}
              </span>
              <span style={{ fontSize: '13px' }}>
                {load.pickup.city}, {load.pickup.state} → {load.delivery.city}, {load.delivery.state}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {driver?.name ?? '—'}
              </span>
              <Badge label={load.status} variant={statusVariant[load.status]} />
              <span style={{
                fontSize: '13px',
                fontFamily: 'Space Mono, monospace',
                color: isDelayed ? 'var(--accent-red)' : 'var(--text-secondary)',
              }}>
                {new Date(load.delivery.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--accent-green)' }}>
                {formatCurrency(load.rate)}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '16px 20px 16px 40px', backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--bg-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Commodity</span>
                        <span>{load.commodity}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Weight</span>
                        <span style={{ fontFamily: 'Space Mono, monospace' }}>{load.weight.toLocaleString()} lbs</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Miles</span>
                        <span style={{ fontFamily: 'Space Mono, monospace' }}>{load.miles}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Broker</span>
                        <span>{load.brokerName}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pickup Address</span>
                        <span>{load.pickup.address}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Delivery Address</span>
                        <span>{load.delivery.address}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
