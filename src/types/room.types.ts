export type AirQualityStatus = 'Good' | 'Moderate' | 'Unhealthy' | 'Poor';
export type DataFreshness = 'live' | 'stale' | 'offline';

export interface RoomSensors {
  aqi: number;
  co2: number | null; // null if missing
  temp: number; // in °C
  humidity: number; // in %
  pm25: number; // in µg/m³
  pm10?: number;
  pm10_val?: number;
  tvoc: number; // in ppb or index
}

export interface Room {
  id: string;
  code: string; // e.g. ROOM-01
  name: string; // e.g. Room 01
  location: string; // e.g. My Location / Floor 2
  aqiScore: number; // overall score e.g. 96
  status: AirQualityStatus;
  freshness: DataFreshness;
  lastUpdated: string; // e.g. "2d ago" or "Just now"
  sensors: RoomSensors;
  alertTags: string[]; // e.g. ['humidity imbalance', 'humidity imbalance', ...]
  totalAlertsCount: number;
  reportingStatus: 'reporting' | 'offline' | 'warning';
}
