import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useStore } from '../../store/useStore';
import HOSBar from '../shared/HOSBar';
import StatusDot from '../shared/StatusDot';
import type { Driver } from '../../types';

function getMarkerColor(driver: Driver): string {
  if (driver.hos.driveRemaining < 3) return '#fbbf24'; // amber
  if (driver.status === 'driving' || driver.status === 'on-duty') return '#22c55e'; // green
  if (driver.status === 'off-duty' || driver.status === 'sleeper') return '#64748b'; // gray
  return '#22c55e';
}

export default function FleetMap() {
  const drivers = useStore((s) => s.drivers);
  const alerts = useStore((s) => s.alerts);

  const driverHasAlert = (driverId: string) =>
    alerts.some((a) => a.driverId === driverId && !a.acknowledged && a.severity !== 'info');

  return (
    <div className="card" style={{ height: '400px', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Fleet Map</h3>
        <span style={{ fontSize: '14px', color: '#64748B', fontFamily: 'Inter', fontWeight: 600 }}>
          {drivers.length} UNITS TRACKED
        </span>
      </div>
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        style={{ height: 'calc(100% - 52px)', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {drivers.map((driver) => {
          const hasAlert = driverHasAlert(driver.id);
          const color = hasAlert ? '#ef4444' : getMarkerColor(driver);
          return (
            <CircleMarker
              key={driver.id}
              center={[driver.location.lat, driver.location.lng]}
              radius={hasAlert ? 10 : 8}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.9,
                color: color,
                weight: 2,
                opacity: 0.6,
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <StatusDot status={driver.status} />
                    <strong style={{ fontSize: '12px' }}>{driver.name}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    {driver.truckId} · {driver.truckType} · {driver.location.city}, {driver.location.state}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <HOSBar driveRemaining={driver.hos.driveRemaining} dutyRemaining={driver.hos.dutyRemaining} compact />
                  </div>
                  {driver.currentLoadId && (
                    <div style={{ fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, color: '#2563EB' }}>
                      Load: {driver.currentLoadId}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
