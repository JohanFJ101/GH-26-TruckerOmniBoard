interface StatusDotProps {
  status: 'driving' | 'on-duty' | 'off-duty' | 'sleeper' | 'alert';
  size?: number;
}

const statusColors: Record<StatusDotProps['status'], string> = {
  driving: '#22c55e',
  'on-duty': '#3b82f6',
  'off-duty': '#94a3b8',
  sleeper: '#475569',
  alert: '#ef4444',
};

export default function StatusDot({ status, size = 8 }: StatusDotProps) {
  const color = statusColors[status];
  const shouldPulse = status === 'driving' || status === 'alert';
  const pulseClass = status === 'driving' ? 'pulse-green' : status === 'alert' ? 'pulse-red' : '';

  return (
    <span
      className={pulseClass}
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        ...(shouldPulse ? {} : { boxShadow: `0 0 0 2px ${color}33` }),
      }}
    />
  );
}
