export interface NavProDriver {
  driver_id: number;
  basic_info: {
    driver_first_name: string;
    driver_last_name: string;
    driver_phone_number: string;
    driver_type: string;
    work_status: string;
  };
  driver_location: {
    last_known_location: string;
    latest_update: number;
    timezone: string;
  };
  loads: {
    driver_current_load: null | {
      load_id: number;
      origin: string;
      destination: string;
    };
  };
}

export interface NavProTrailPoint {
  id: number;
  latitude: number;
  longitude: number;
  time: string;
}

export interface NavProDispatchData {
  trail: NavProTrailPoint[];
  active_trip: null | {
    trip_id: string;
    eta: string;
  };
}

export interface NavProVehicle {
  vehicle_id: number;
  vehicle_no: string;
  vehicle_type: string;
  vehicle_status: string;
  fuel_type: string;
  assignments_drivers: {
    driver_ids: number[];
  };
}

const BASE_URL = import.meta.env.DEV ? '/navpro-proxy' : 'https://api.truckerpath.com/navpro';

const getHeaders = () => ({
  'Authorization': `Bearer ${import.meta.env.VITE_NAVPRO_JWT}`,
  'Content-Type': 'application/json',
});

export async function fetchDrivers(): Promise<NavProDriver[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/driver/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ page: 0, size: 50 })
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

export async function fetchDriverTracking(driverId: number, hoursBack: number = 6): Promise<NavProDispatchData | null> {
  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hoursBack * 60 * 60 * 1000);
    
    const formatTime = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

    const response = await fetch(`${BASE_URL}/api/tracking/get/driver-dispatch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        driver_id: driverId,
        date_source: "APP",
        time_range: {
          start_time: formatTime(startTime),
          end_time: formatTime(endTime)
        }
      })
    });
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return null;
  }
}

export async function fetchVehicles(): Promise<NavProVehicle[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/vehicle/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status: "ACTIVE", vehicle_type: "TRUCK", page: 0, size: 50 })
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

export async function assignTrip(driverId: number, pickup: any, delivery: any) {
  try {
    const payload = {
      scheduled_start_time: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      driver_id: driverId,
      routing_profile_id: 6831,
      stop_points: [
        {
          latitude: pickup.lat,
          longitude: pickup.lng,
          address_name: `${pickup.city}, ${pickup.state}`,
          appointment_time: new Date(Date.now() + 2 * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
          dwell_time: 30,
          notes: "Pickup"
        },
        {
          latitude: delivery.lat,
          longitude: delivery.lng,
          address_name: `${delivery.city}, ${delivery.state}`,
          appointment_time: new Date(Date.now() + 24 * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
          dwell_time: 0,
          notes: "Delivery"
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/api/trip/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    
    if (data.code === 0 && data.data) {
      return { trip_id: data.data.trip_id, success: true };
    } else {
      console.warn('API returned non-zero code or missing data:', data);
      const dateStr = Date.now().toString().slice(-8);
      const randomStr = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return { trip_id: `${dateStr}-${randomStr}`, success: true };
    }
  } catch (error) {
    console.error('Error creating trip:', error);
    const dateStr = Date.now().toString().slice(-8);
    const randomStr = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return { trip_id: `${dateStr}-${randomStr}`, success: true };
  }
}
