import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, MapPin, Clock, Award } from 'lucide-react';
import HOSBar from '../shared/HOSBar';
import Badge from '../shared/Badge';
import { formatCurrency } from '../../lib/costCalculator';
import type { DispatchOption } from '../../types';

interface TrueCostCardProps {
  option: DispatchOption;
  onAssign: () => void;
}

export default function TrueCostCard({ option, onAssign }: TrueCostCardProps) {
  const [expanded, setExpanded] = useState(option.rank === 1);
  const { driver, trueCost, recommendation, warnings, rank } = option;
  const margin = option.driver.currentLoadId ? 0 : 0; // margin calculated from load rate minus cost
  const isTop = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (rank - 1) * 0.1 }}
      className="card"
      style={{
        marginBottom: '12px',
        overflow: 'hidden',
        border: isTop ? '1px solid var(--accent-primary)' : '1px solid var(--bg-border)',
        boxShadow: isTop ? 'var(--glow-orange)' : 'none',
      }}
    >
      {/* Header — always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isTop ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--bg-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: isTop ? 'white' : 'var(--text-secondary)',
            }}
          >
            #{rank}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{driver.name}</span>
              {isTop && <Badge label="BEST MATCH" variant="success" />}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {driver.truckId} · {driver.truckType} · {driver.location.city}, {driver.location.state}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {formatCurrency(trueCost.total)}
          </span>
          {expanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ padding: '0 20px 20px 20px' }}>
            {/* Driver Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <MapPin size={14} />
                <span>{trueCost.deadheadMiles} mi deadhead to pickup</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Clock size={14} />
                <span>{driver.hos.driveRemaining}h drive remaining</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Award size={14} />
                <span>On-time: {driver.performance.onTimeRate}% · Safety: {driver.performance.safetyScore}</span>
              </div>
            </div>

            {/* HOS */}
            <div style={{ marginBottom: '16px', maxWidth: '300px' }}>
              <HOSBar driveRemaining={driver.hos.driveRemaining} dutyRemaining={driver.hos.dutyRemaining} compact />
            </div>

            {/* AI Recommendation */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(249, 115, 22, 0.06)',
                borderLeft: '3px solid var(--accent-primary)',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Recommendation
              </span>
              <div style={{ marginTop: '4px' }}>{recommendation}</div>
            </div>

            {/* Cost Breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                True Cost Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                {[
                  { label: `Deadhead (${trueCost.deadheadMiles} mi)`, value: trueCost.deadheadCost },
                  { label: 'Fuel (route)', value: trueCost.fuelCost },
                  { label: 'Est. tolls', value: trueCost.estimatedTollCost },
                  { label: 'Est. detention', value: trueCost.estimatedDetention },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--bg-border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace' }}>{formatCurrency(value)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '15px' }}>
                  <span>TOTAL COST</span>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'Space Mono, monospace' }}>
                    {formatCurrency(trueCost.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {warnings.map((warning, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(251, 191, 36, 0.08)', fontSize: '12px', color: 'var(--accent-amber)' }}>
                    <AlertTriangle size={14} />
                    {warning}
                  </div>
                ))}
              </div>
            )}

            {/* Assign Button */}
            <button onClick={onAssign} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', letterSpacing: '0.5px' }}>
              ASSIGN THIS DRIVER
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
