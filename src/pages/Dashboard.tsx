import { motion } from 'framer-motion';
import MetricsRow from '../components/dashboard/MetricsRow';
import FleetMap from '../components/dashboard/FleetMap';
import AlertsFeed from '../components/dashboard/AlertsFeed';
import ActiveLoads from '../components/dashboard/ActiveLoads';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <MetricsRow />

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        <FleetMap />
        <AlertsFeed />
      </div>

      <ActiveLoads />
    </motion.div>
  );
}
