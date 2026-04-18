// ─── DRIVER ──────────────────────────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  avatar: string;
  truckId: string;
  truckType: 'dry-van' | 'reefer' | 'flatbed' | 'tanker';
  status: 'driving' | 'on-duty' | 'off-duty' | 'sleeper';
  location: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    lastUpdated: string;
  };
  hos: {
    driveRemaining: number;
    dutyRemaining: number;
    cycleRemaining: number;
    nextBreakIn: number;
    restartAvailable: boolean;
  };
  performance: {
    onTimeRate: number;
    avgCostPerMile: number;
    safetyScore: number;
    totalMilesThisWeek: number;
  };
  currentLoadId: string | null;
  phone: string;
}

// ─── LOAD ────────────────────────────────────────────────────────────────────
export interface Load {
  id: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'delayed';
  pickup: {
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
    time: string;
    windowHours: number;
  };
  delivery: {
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
    time: string;
  };
  commodity: string;
  weight: number;
  miles: number;
  rate: number;
  assignedDriverId: string | null;
  brokerName: string;
  priority: 'standard' | 'hot' | 'critical';
}

// ─── DISPATCH OPTION (AI Output) ─────────────────────────────────────────────
export interface DispatchOption {
  driver: Driver;
  score: number;
  rank: number;
  trueCost: {
    total: number;
    deadheadMiles: number;
    deadheadCost: number;
    fuelCost: number;
    hosRisk: 'none' | 'caution' | 'high';
    estimatedDetention: number;
    estimatedTollCost: number;
  };
  rippleEffects: string[];
  recommendation: string;
  warnings: string[];
}

// ─── ALERT ───────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  type: 'breakdown' | 'delay' | 'hos-violation' | 'weather' | 'deviation' | 'inspection';
  severity: 'info' | 'warning' | 'critical';
  loadId?: string;
  driverId: string;
  title: string;
  description: string;
  financialImpact?: number;
  actionRequired: string;
  timestamp: string;
  acknowledged: boolean;
}

// ─── FLEET METRICS ──────────────────────────────────────────────────────────
export interface FleetMetrics {
  costPerMile: {
    current: number;
    trend: number[];
    vsLastWeek: number;
  };
  onTimeRate: number;
  activeLoads: number;
  driversAvailable: number;
  deadheadPercentage: number;
  revenueToday: number;
  alertsActive: number;
}

// ─── COPILOT MESSAGE ────────────────────────────────────────────────────────
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
