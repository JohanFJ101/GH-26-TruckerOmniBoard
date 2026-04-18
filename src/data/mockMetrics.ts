import { FleetMetrics } from '../types';

export const MOCK_METRICS: FleetMetrics = {
  costPerMile: {
    current: 1.87,
    trend: [1.95, 1.92, 1.90, 1.89, 1.91, 1.88, 1.87],
    vsLastWeek: -3.2,
  },
  onTimeRate: 94,
  activeLoads: 3,
  driversAvailable: 3,
  deadheadPercentage: 12.4,
  revenueToday: 18340,
  alertsActive: 3,
};
