export default function Badge({ label, variant }: { label: string; variant: 'neutral' | 'critical' | 'warning' | 'success' }) {
  return (
    <span className={`badge-${variant === 'success' ? 'available' : variant}`}>
      {label}
    </span>
  );
}