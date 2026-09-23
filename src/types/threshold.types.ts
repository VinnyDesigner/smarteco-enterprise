export type SensorKey = 'aqi' | 'co2' | 'pm25' | 'pm10' | 'pm1';

export interface SensorThreshold {
  id: string;
  sensorKey: SensorKey;
  sensorName: string; // e.g. "AQI", "CO₂ (ppm)", "PM2.5 (µg/m³)"
  unit?: string;
  profileName: string; // e.g. "PROFILE DEFAULT"
  warnMin: number | null; // null if not set (rendered as —)
  warnMax: number | null;
  critMin: number | null;
  critMax: number | null;
}
