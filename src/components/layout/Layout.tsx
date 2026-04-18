import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useStore } from '../../store/useStore';

export default function Layout() {
  const collapsed = useStore((s) => s.sidebarCollapsed);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? '64px' : '240px',
          transition: 'margin-left 0.2s ease',
        }}
      >
        <TopBar />
        <main
          style={{
            marginTop: '56px',
            padding: '24px',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
