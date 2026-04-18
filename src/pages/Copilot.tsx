import { motion } from 'framer-motion';
import CopilotPanel from '../components/copilot/CopilotPanel';

export default function Copilot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CopilotPanel />
    </motion.div>
  );
}
