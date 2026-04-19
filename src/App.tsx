import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';
import Copilot from './pages/Copilot';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import Debug from './pages/Debug';
import { useStore } from './store/useStore';

const LIVE_POLL_MS = 15000;

export default function App() {
  useEffect(() => {
    const store = useStore.getState();
    store.initializeFleet();
    const id = setInterval(() => {
      useStore.getState().initializeFleet();
    }, LIVE_POLL_MS);
    const onFocus = () => useStore.getState().initializeFleet();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/copilot" element={<Copilot />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/debug" element={<Debug />} />
      </Route>
    </Routes>
  );
}
