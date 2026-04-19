import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calculateDispatchOptions } from '../lib/costCalculator';
import LoadQueue from '../components/dispatch/LoadQueue';
import TrueCostCard from '../components/dispatch/TrueCostCard';
import RippleEffect from '../components/dispatch/RippleEffect';
import AssignModal from '../components/dispatch/AssignModal';
import type { DispatchOption } from '../types';
import { assignTrip } from '../lib/navproApi';

export default function Dispatch() {
  const { loads, drivers, selectedLoadId, assignDriver, navproLoaded, isLiveData, addLoad } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DispatchOption | null>(null);
  const [assigned, setAssigned] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignedDriverName, setAssignedDriverName] = useState<string>('');

  useEffect(() => {
    if (!navproLoaded) {
      useStore.getState().initializeFleet();
    }
  }, [navproLoaded]);

  const selectedLoad = loads.find((l) => l.id === selectedLoadId) ?? null;
  const options = selectedLoad ? calculateDispatchOptions(selectedLoad, drivers) : [];

  const handleAssign = (option: DispatchOption) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const confirmAssign = async () => {
    if (selectedOption && selectedLoad) {
      setAssigning(true);
      const driverIdNum = parseInt(selectedOption.driver.id.replace('D-', ''), 10) || 0;
      await assignTrip(driverIdNum, selectedLoad.pickup, selectedLoad.delivery);
      
      assignDriver(selectedLoad.id, selectedOption.driver.id);
      setAssignedDriverName(selectedOption.driver.name);
      setModalOpen(false);
      setAssigning(false);
      setAssigned(true);
      setTimeout(() => setAssigned(false), 5000);
    }
  };

  const addTestLoad = () => {
    const newLoad: any = {
      id: `L-${Date.now().toString().slice(-4)}`,
      status: 'pending' as const,
      pickup: { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298, time: '14:00' },
      delivery: { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970, time: '08:00' },
      rate: 1850,
      commodity: 'Industrial Equipment',
      weight: 44000,
      miles: 921,
      priority: 'hot' as const,
      brokerName: 'XPO Logistics'
    };
    addLoad(newLoad);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 104px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Dispatch</h2>
          {navproLoaded ? (
            isLiveData ? (
              <span style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)', fontWeight: 600 }}>LIVE — NavPro Connected</span>
            ) : (
              <span style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(156, 163, 175, 0.1)', color: 'gray', fontWeight: 600 }}>DEMO — Mock Data</span>
            )
          ) : null}
        </div>
        <button onClick={addTestLoad} style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '2px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
          + Add Test Load
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: '35% 1fr', gap: '24px', flex: 1, overflow: 'hidden' }}
      >
        <div style={{ overflow: 'hidden', height: '100%' }}>
          <LoadQueue />
        </div>

        <div style={{ overflow: 'auto', paddingRight: '4px', position: 'relative' }}>
          {assigning && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', backdropFilter: 'blur(2px)' }}>
              <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
              <div style={{ color: 'white', fontWeight: 600 }}>Simulating NavPro Assignment...</div>
            </div>
          )}

          {!selectedLoad ? (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Zap size={48} style={{ color: '#64748B' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>Select a load to see AI dispatch options</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Click any pending load from the queue</span>
            </div>
          ) : (
            <div>
              {assigned && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '8px 16px', borderRadius: '2px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent-green)', marginBottom: '16px', fontSize: '13px', color: 'var(--accent-green)', fontWeight: 500, textAlign: 'center' }}
                >
                  ✓ Trip assigned — Route sent to {assignedDriverName}'s TruckerPath app. Client notified.
                </motion.div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  AI-Ranked Options for
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'Inter', fontWeight: 600 }}>{selectedLoad.id}</span>
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

        {!assigning && (
          <AssignModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmAssign}
            driver={selectedOption?.driver ?? null}
            load={selectedLoad}
          />
        )}
      </motion.div>
    </div>
  );
}
