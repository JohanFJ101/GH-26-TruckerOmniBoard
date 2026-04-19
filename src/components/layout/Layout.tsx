import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, marginTop: '48px' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '48px', padding: '16px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}