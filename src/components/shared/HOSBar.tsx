interface HOSBarProps {
  driveRemaining: number;
  dutyRemaining: number;
  compact?: boolean;
}

function getColor(hours: number): string {
  if (hours > 6) return '#22c55e';
  if (hours >= 2) return '#fbbf24';
  return '#ef4444';
}

export default function HOSBar({ driveRemaining, dutyRemaining, compact = false }: HOSBarProps) {
  const drivePercent = Math.min((driveRemaining / 11) * 100, 100);
  const dutyPercent = Math.min((dutyRemaining / 14) * 100, 100);

  const barHeight = compact ? 4 : 6;
  const fontSize = compact ? '10px' : '11px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '4px' : '6px', width: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize, color: 'var(--text-secondary)' }}>Drive</span>
          <span style={{ fontSize, fontFamily: 'Space Mono, monospace', color: getColor(driveRemaining) }}>
            {driveRemaining.toFixed(1)}h
          </span>
        </div>
        <div style={{ width: '100%', height: `${barHeight}px`, backgroundColor: 'var(--bg-border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${drivePercent}%`,
              height: '100%',
              backgroundColor: getColor(driveRemaining),
              borderRadius: '3px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize, color: 'var(--text-secondary)' }}>Duty</span>
          <span style={{ fontSize, fontFamily: 'Space Mono, monospace', color: getColor(dutyRemaining) }}>
            {dutyRemaining.toFixed(1)}h
          </span>
        </div>
        <div style={{ width: '100%', height: `${barHeight}px`, backgroundColor: 'var(--bg-border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${dutyPercent}%`,
              height: '100%',
              backgroundColor: getColor(dutyRemaining),
              borderRadius: '3px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
