import { Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/dispatch': 'Smart Dispatch',
  '/copilot': 'AI Copilot',
  '/drivers': 'Drivers',
  '/analytics': 'Analytics',
};

export default function TopBar() {
  const alerts = useStore((s) => s.alerts);
  const drivers = useStore((s) => s.drivers);
  const loads = useStore((s) => s.loads);
  const location = useLocation();
  const collapsed = useStore((s) => s.sidebarCollapsed);

  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;
  const activeLoads = loads.filter((l) => l.status === 'in-transit' || l.status === 'delayed').length;
  const title = pageTitles[location.pathname] || 'DispatchIQ';

  return (
    <header
      style={{
        height: '56px',
        position: 'fixed',
        top: 0,
        left: collapsed ? '64px' : '240px',
        right: 0,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--bg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 40,
        transition: 'left 0.2s ease',
      }}
    >
      {/* Left: Page Title */}
      <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{title}</h1>

      {/* Center: Live Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontFamily: 'Space Mono, monospace',
          color: 'var(--text-secondary)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        <span>{drivers.length} DRIVERS</span>
        <span style={{ color: 'var(--text-muted)' }}>·</span>
        <span>{activeLoads} ACTIVE LOADS</span>
        <span style={{ color: 'var(--text-muted)' }}>·</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className="pulse-live"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-green)',
            }}
          />
          <span style={{ color: 'var(--accent-green)' }}>LIVE</span>
        </div>
      </div>

      {/* Right: Alerts + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          <Bell size={20} />
          {unacknowledged > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-red)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unacknowledged}
            </span>
          )}
        </button>

        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-amber))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: 'white',
          }}
        >
          JD
        </div>
      </div>
    </header>
  );
}
