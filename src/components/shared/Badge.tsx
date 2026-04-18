interface BadgeProps {
  label: string;
  variant: 'info' | 'warning' | 'critical' | 'success' | 'neutral';
}

const variantStyles: Record<BadgeProps['variant'], { bg: string; text: string; dot: string }> = {
  info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', dot: '#3b82f6' },
  warning: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', dot: '#fbbf24' },
  critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', dot: '#ef4444' },
  success: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', dot: '#22c55e' },
  neutral: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', dot: '#94a3b8' },
};

export default function Badge({ label, variant }: BadgeProps) {
  const style = variantStyles[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.dot,
        }}
      />
      {label}
    </span>
  );
}
