import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';
import Copilot from './pages/Copilot';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import Debug from './pages/Debug';

export default function App() {
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
