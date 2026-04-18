import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Badge from '../shared/Badge';
import { formatCurrency } from '../../lib/costCalculator';
import type { Load } from '../../types';

const priorityColors: Record<Load['priority'], string> = {
  standard: 'var(--text-muted)',
  hot: 'var(--accent-primary)',
  critical: 'var(--accent-red)',
};

export default function LoadQueue() {
  const loads = useStore((s) => s.loads);
  const selectedLoadId = useStore((s) => s.selectedLoadId);
  const setSelectedLoadId = useStore((s) => s.setSelectedLoadId);

  const pendingLoads = loads.filter((l) => l.status === 'pending');

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Load Queue</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pendingLoads.length} pending</span>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <Plus size={14} /> New Load
        </button>
      </div>

      {/* Load List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {pendingLoads.map((load) => {
          const isSelected = selectedLoadId === load.id;
          return (
            <div
              key={load.id}
              onClick={() => setSelectedLoadId(isSelected ? null : load.id)}
              className={isSelected ? 'card-selected' : ''}
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--bg-border)',
                backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.05)' : 'var(--bg-elevated)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: priorityColors[load.priority],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 600 }}>
                    {load.id}
                  </span>
                </div>
                <Badge
                  label={load.priority}
                  variant={load.priority === 'critical' ? 'critical' : load.priority === 'hot' ? 'warning' : 'neutral'}
                />
              </div>

              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                {load.pickup.city}, {load.pickup.state} → {load.delivery.city}, {load.delivery.state}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>{load.commodity}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--accent-green)', fontWeight: 600 }}>
                  {formatCurrency(load.rate)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{load.miles} mi · {load.weight.toLocaleString()} lbs</span>
                <span>{load.brokerName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
