import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Bot, Users, BarChart2, Database } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dispatch', icon: Truck, label: 'Dispatch' },
  { to: '/copilot', icon: Bot, label: 'Copilot' },
  { to: '/drivers', icon: Users, label: 'Drivers' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/debug', icon: Database, label: 'Debug Data' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: '48px', position: 'fixed', left: 0, top: '48px', bottom: 0, backgroundColor: '#1E2A3A', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '4px', zIndex: 40 }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          title={label}
          style={({ isActive }) => ({
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: isActive ? 'rgba(37,99,235,0.25)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background-color 0.15s',
          })}
        >
          {({ isActive }) => (
            <Icon size={18} color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth={1.5} />
          )}
        </NavLink>
      ))}
    </aside>
  );
}