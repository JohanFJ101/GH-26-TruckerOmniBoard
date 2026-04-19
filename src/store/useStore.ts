import { create } from 'zustand';
import { Driver, Load, Alert, FleetMetrics } from '../types';
import { MOCK_DRIVERS } from '../data/mockDrivers';
import { MOCK_LOADS } from '../data/mockLoads';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_METRICS } from '../data/mockMetrics';
import { fetchDrivers } from '../lib/navproApi';

interface StoreState {
  drivers: Driver[];
  loads: Load[];
  alerts: Alert[];
  metrics: FleetMetrics;
  selectedLoadId: string | null;
  sidebarCollapsed: boolean;
  navproLoaded: boolean;
  isLiveData: boolean;
  setSelectedLoadId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  assignDriver: (loadId: string, driverId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  initializeFleet: () => Promise<void>;
  addLoad: (load: Load) => void;
  setDrivers: (drivers: Driver[]) => void;
  setLoads: (loads: Load[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setMetrics: (metrics: FleetMetrics) => void;
  resetToMocks: () => void;
}

export const useStore = create<StoreState>((set) => ({
  drivers: MOCK_DRIVERS,
  loads: MOCK_LOADS,
  alerts: MOCK_ALERTS,
  metrics: MOCK_METRICS,
  selectedLoadId: null,
  sidebarCollapsed: false,
  navproLoaded: false,
  isLiveData: false,

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

  addLoad: (load) => set((state) => ({ loads: [load, ...state.loads] })),

  setDrivers: (drivers) => set({ drivers }),
  setLoads: (loads) => set({ loads }),
  setAlerts: (alerts) => set({ alerts }),
  setMetrics: (metrics) => set({ metrics }),
  resetToMocks: () => set({
    drivers: MOCK_DRIVERS,
    loads: MOCK_LOADS,
    alerts: MOCK_ALERTS,
    metrics: MOCK_METRICS,
  }),

  initializeFleet: async () => {
    const navproDrivers = await fetchDrivers();
    if (navproDrivers && navproDrivers.length > 0) {
      const mappedDrivers = navproDrivers.map((d, index) => {
        const first = d.basic_info?.driver_first_name || '';
        const last = d.basic_info?.driver_last_name || '';
        const fullName = `${first} ${last}`.trim();

        // Match to mock driver by name to get real location data
        const mockMatch = MOCK_DRIVERS.find(
          (m) => m.name.toLowerCase() === fullName.toLowerCase()
        );

        let city: string;
        let state: string;
        let lat: number;
        let lng: number;

        if (mockMatch) {
          ({ city, state, lat, lng } = mockMatch.location);
        } else if (d.driver_location?.last_known_location) {
          const parts = d.driver_location.last_known_location.split(',');
          city = parts[0]?.trim() || 'En Route';
          state = parts[1]?.trim() || 'US';
          lat = 39.5 + index * 2.5;
          lng = -98.35 + index * 3;
        } else {
          // Spread unmatched drivers across major US freight hubs
          const hubs = [
            { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
            { city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
            { city: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786 },
            { city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910 },
            { city: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581 },
          ];
          const hub = hubs[index % hubs.length];
          ({ city, state, lat, lng } = hub);
        }

        const driveRemaining = mockMatch
          ? mockMatch.hos.driveRemaining
          : Math.round((Math.random() * 9 + 2) * 10) / 10;
        
        return {
          id: `D-${d.driver_id}`,
          name: `${first} ${last}`.trim() || 'Unknown Driver',
          avatar: `${first.charAt(0) || ''}${last.charAt(0) || ''}` || 'U',
          truckId: `T-${d.driver_id}`,
          truckType: 'dry-van',
          status: d.basic_info?.work_status === 'IN_TRANSIT' ? 'driving' : 'on-duty',
          location: {
            city,
            state,
            lat,
            lng,
            lastUpdated: 'just now',
          },
          hos: {
            driveRemaining,
            dutyRemaining: driveRemaining + 2.5,
            cycleRemaining: Math.floor(Math.random() * 54) + 12,
            nextBreakIn: Math.floor(Math.random() * 6) + 1,
            restartAvailable: false,
          },
          performance: {
            onTimeRate: Math.floor(Math.random() * 15) + 85,
            avgCostPerMile: Math.round((Math.random() * 0.45 + 1.65) * 100) / 100,
            safetyScore: Math.floor(Math.random() * 25) + 75,
            totalMilesThisWeek: Math.floor(Math.random() * 2401) + 800,
          },
          currentLoadId: d.loads?.driver_current_load?.load_id ? `L-${d.loads.driver_current_load.load_id}` : null,
          phone: d.basic_info?.driver_phone_number || '(000) 000-0000',
        };
      });
      set({ drivers: mappedDrivers as any, navproLoaded: true, isLiveData: true });
    } else {
      set({ drivers: MOCK_DRIVERS, navproLoaded: true, isLiveData: false });
    }
  },
}));
