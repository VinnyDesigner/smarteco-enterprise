export type DeviceStatus = 'active' | 'offline' | 'unassigned' | 'stale';

export interface DeviceSensors {
  aqi?: number;
  pm25?: number;
  temp?: number;
  humidity?: number;
}

export interface Device {
  id: string; // e.g. Device 0006
  serialNumber: string; // e.g. SEI100A784250006
  status: DeviceStatus;
  lastSeen: string; // e.g. "2d ago" or "136 minutes ago"
  airQualityStatus: 'Good' | 'Moderate' | 'Poor';
  roomId: string | null;
  roomName: string | null; // e.g. "Room 01" or null
  sensors: DeviceSensors;
}
