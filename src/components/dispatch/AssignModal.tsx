import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Truck } from 'lucide-react';
import type { Driver, Load } from '../../types';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driver: Driver | null;
  load: Load | null;
}

export default function AssignModal({ isOpen, onClose, onConfirm, driver, load }: AssignModalProps) {
  if (!driver || !load) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, width: '480px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Confirm Assignment</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{driver.name}</div>
                  <div style={{ fontSize: '12px', color: '#374151' }}>{driver.truckId} · {driver.truckType}</div>
                </div>
              </div>
              <div style={{ padding: '12px', borderRadius: '2px', backgroundColor: '#FFFFFF', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>Load</span>
                    <div style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--accent-primary)', fontWeight: 600, marginTop: '2px' }}>{load.id}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>Rate</span>
                    <div style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--accent-green)', fontWeight: 600, marginTop: '2px' }}>${load.rate.toLocaleString()}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>Route</span>
                    <div style={{ marginTop: '2px' }}>{load.pickup.city}, {load.pickup.state} → {load.delivery.city}, {load.delivery.state}</div>
                  </div>
                </div>
              </div>
              <button onClick={onConfirm} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Confirm & Notify Driver
              </button>
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#64748B' }}>Route will be sent to driver's TruckerPath app</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
