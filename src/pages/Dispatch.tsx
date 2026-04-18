import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calculateDispatchOptions } from '../lib/costCalculator';
import LoadQueue from '../components/dispatch/LoadQueue';
import TrueCostCard from '../components/dispatch/TrueCostCard';
import RippleEffect from '../components/dispatch/RippleEffect';
import AssignModal from '../components/dispatch/AssignModal';
import type { DispatchOption } from '../types';

export default function Dispatch() {
  const { loads, drivers, selectedLoadId, assignDriver } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DispatchOption | null>(null);
  const [assigned, setAssigned] = useState(false);

  const selectedLoad = loads.find((l) => l.id === selectedLoadId) ?? null;
  const options = selectedLoad ? calculateDispatchOptions(selectedLoad, drivers) : [];

  const handleAssign = (option: DispatchOption) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const confirmAssign = () => {
    if (selectedOption && selectedLoad) {
      assignDriver(selectedLoad.id, selectedOption.driver.id);
      setModalOpen(false);
      setAssigned(true);
      setTimeout(() => setAssigned(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'grid', gridTemplateColumns: '35% 1fr', gap: '24px', height: 'calc(100vh - 104px)' }}
    >
      <LoadQueue />

      <div style={{ overflow: 'auto', paddingRight: '4px' }}>
        {!selectedLoad ? (
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Zap size={48} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Select a load to see AI dispatch options</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Click any pending load from the queue</span>
          </div>
        ) : (
          <div>
            {assigned && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent-green)', marginBottom: '16px', fontSize: '14px', color: 'var(--accent-green)', fontWeight: 500, textAlign: 'center' }}
              >
                ✓ Driver assigned successfully — route sent to TruckerPath app
              </motion.div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                AI-Ranked Options for
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'Space Mono, monospace' }}>{selectedLoad.id}</span>
                {' '}{selectedLoad.pickup.city} → {selectedLoad.delivery.city}
              </div>
            </div>

            {options.map((option) => (
              <TrueCostCard key={option.driver.id} option={option} onAssign={() => handleAssign(option)} />
            ))}

            {options.length > 0 && (
              <RippleEffect drivers={drivers} assignedDriverName={options[0].driver.name} />
            )}
          </div>
        )}
      </div>

      <AssignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAssign}
        driver={selectedOption?.driver ?? null}
        load={selectedLoad}
      />
    </motion.div>
  );
}
