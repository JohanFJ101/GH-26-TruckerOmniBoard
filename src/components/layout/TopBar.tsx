import { useLocation } from 'react-router-dom';
import { MessageSquare, Phone, Grid, Bell, Truck } from 'lucide-react';
import { useStore } from '../../store/useStore';

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/dispatch': 'Truckloads',
  '/drivers': 'Drivers',
  '/copilot': 'Copilot',
  '/analytics': 'Analytics',
};

export default function TopBar() {
  const alerts = useStore((s) => s.alerts);
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;
  const { pathname } = useLocation();
  const pageLabel = pageLabels[pathname] ?? 'Dashboard';

  return (
    <header style={{ height: '48px', position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
        <div style={{ width: '24px', height: '24px', backgroundColor: '#2563EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Truck size={14} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>TRUCKER PATH</span>
        <span style={{ fontWeight: 400, fontSize: '14px', color: '#64748B' }}>{pageLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <MessageSquare size={16} color="#64748B" cursor="pointer" />
        <Phone size={16} color="#64748B" cursor="pointer" />
        <Grid size={16} color="#64748B" cursor="pointer" />
        <div style={{ position: 'relative' }}>
          <Bell size={16} color="#64748B" cursor="pointer" />
          {unacknowledged > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#DC2626', borderRadius: '50%' }} />}
        </div>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#15803D', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>JD</div>
      </div>
    </header>
  );
}