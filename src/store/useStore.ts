import { create } from 'zustand';
import { Driver, Load, Alert, FleetMetrics } from '../types';
import { MOCK_DRIVERS } from '../data/mockDrivers';
import { MOCK_LOADS } from '../data/mockLoads';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_METRICS } from '../data/mockMetrics';

interface StoreState {
  drivers: Driver[];
  loads: Load[];
  alerts: Alert[];
  metrics: FleetMetrics;
  selectedLoadId: string | null;
  sidebarCollapsed: boolean;
  setSelectedLoadId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  assignDriver: (loadId: string, driverId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  drivers: MOCK_DRIVERS,
  loads: MOCK_LOADS,
  alerts: MOCK_ALERTS,
  metrics: MOCK_METRICS,
  selectedLoadId: null,
  sidebarCollapsed: false,

  setSelectedLoadId: (id) => set({ selectedLoadId: id }),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  assignDriver: (loadId, driverId) =>
    set((state) => ({
      loads: state.loads.map((l) =>
        l.id === loadId ? { ...l, assignedDriverId: driverId, status: 'assigned' as const } : l
      ),
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, currentLoadId: loadId, status: 'on-duty' as const } : d
      ),
    })),

  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    })),
}));
