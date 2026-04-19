import { Driver, Load, DispatchOption } from '../types';

/**
 * Calculate the Haversine distance between two lat/lng points in miles.
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const DEADHEAD_COST_PER_MILE = 2.5;
const FUEL_COST_PER_MILE = 0.34;
const TOLL_ESTIMATE_BASE = 15;
const DETENTION_RATE_PER_HOUR = 75;

/**
 * Generate ranked dispatch options for available drivers for a given load.
 */
export function calculateDispatchOptions(
  load: Load,
  drivers: Driver[]
): DispatchOption[] {
  const available = drivers.filter(
    (d) => !d.currentLoadId && d.status !== 'sleeper' && d.hos.driveRemaining >= 2.0
  );

  const options: DispatchOption[] = available.map((driver) => {
    const deadheadMiles = haversineDistance(
      driver.location.lat,
      driver.location.lng,
      load.pickup.lat,
      load.pickup.lng
    );
    const deadheadCost = Math.round(deadheadMiles * DEADHEAD_COST_PER_MILE);
    const fuelCost = Math.round((deadheadMiles + load.miles) * FUEL_COST_PER_MILE);
    const estimatedTollCost = TOLL_ESTIMATE_BASE + Math.round(load.miles * 0.02);
    const totalDriveHours = (deadheadMiles + load.miles) / 55; // avg 55 mph
    const hosRisk: 'none' | 'caution' | 'high' =
      driver.hos.driveRemaining < totalDriveHours
        ? 'high'
        : driver.hos.driveRemaining < totalDriveHours + 2
        ? 'caution'
        : 'none';
    const estimatedDetention =
      hosRisk === 'high' ? Math.round(DETENTION_RATE_PER_HOUR * 2) : 0;
    const totalCost = deadheadCost + fuelCost + estimatedTollCost + estimatedDetention;
    const scoringTotalCost = (deadheadCost * 1.5) + fuelCost + estimatedTollCost + estimatedDetention;

    // Score: lower cost + better HOS + better performance = higher score
    const costScore = Math.max(0, 100 - (scoringTotalCost / load.rate) * 100);
    const hosScore = Math.min(driver.hos.driveRemaining / 11, 1) * 30;
    const perfScore = (driver.performance.onTimeRate / 100) * 20;
    const safetyScore = (driver.performance.safetyScore / 100) * 10;
    const score = Math.round(costScore + hosScore + perfScore + safetyScore);

    const warnings: string[] = [];
    if (hosRisk === 'high') {
      warnings.push(`Low HOS — only ${driver.hos.driveRemaining}h drive time remaining`);
    }
    if (hosRisk === 'caution') {
      warnings.push(`HOS caution — may need 30-min break en route`);
    }
    if (driver.performance.safetyScore < 85) {
      warnings.push(`Below-average safety score (${driver.performance.safetyScore})`);
    }

    const rippleEffects: string[] = [];
    if (totalDriveHours > 8) {
      rippleEffects.push(`${driver.name} will be unavailable for ~${Math.ceil(totalDriveHours + 10)}h after pickup`);
    }
    if (driver.hos.cycleRemaining < totalDriveHours + 20) {
      rippleEffects.push(`${driver.name} approaching 70h cycle limit — may need restart after this load`);
    }

    let recommendation = '';
    if (deadheadMiles < 50 && hosRisk === 'none') {
      recommendation = `Closest driver with sufficient HOS and low deadhead. ${deadheadMiles} miles to pickup.`;
    } else if (hosRisk === 'none' && driver.performance.onTimeRate > 93) {
      recommendation = `Strong on-time record (${driver.performance.onTimeRate}%) with adequate HOS. ${deadheadMiles} mi deadhead.`;
    } else {
      recommendation = `Available option. ${deadheadMiles} mi deadhead, ${driver.hos.driveRemaining}h drive remaining.`;
    }

    return {
      driver,
      score,
      rank: 0,
      trueCost: {
        total: totalCost,
        deadheadMiles,
        deadheadCost,
        fuelCost,
        hosRisk,
        estimatedDetention,
        estimatedTollCost,
      },
      rippleEffects,
      recommendation,
      warnings,
    };
  });

  // Composite rank: 60% cost efficiency, 25% on-time rate, 15% safety score
  const maxCost = Math.max(...options.map(o => o.trueCost.total), 1);
  options.sort((a, b) => {
    const costA = (1 - a.trueCost.total / maxCost) * 60;
    const costB = (1 - b.trueCost.total / maxCost) * 60;
    const onTimeA = (a.driver.performance.onTimeRate / 100) * 25;
    const onTimeB = (b.driver.performance.onTimeRate / 100) * 25;
    const safetyA = (a.driver.performance.safetyScore / 100) * 15;
    const safetyB = (b.driver.performance.safetyScore / 100) * 15;
    return (costB + onTimeB + safetyB) - (costA + onTimeA + safetyA);
  });
  options.forEach((opt, idx) => {
    opt.rank = idx + 1;
  });

  return options.slice(0, 3);
}

/**
 * Format a dollar amount with commas.
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format cost per mile.
 */
export function formatCostPerMile(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
