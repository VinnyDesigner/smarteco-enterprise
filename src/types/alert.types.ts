export type AlertStatus = 'open' | 'acknowledged' | 'resolved';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertSensorType = 'device_offline' | 'stale_data' | 'pm1' | 'pm25' | 'pm10' | 'aqi' | 'co2' | 'temp' | 'humidity';

export interface Alert {
  id: string;
  title: string; // e.g. "Device Offline: SEI100A784250006" or "CRITICAL: PM1.0 out of range"
  description?: string; // e.g. "PM1.0 = 26.50 (threshold: 25.00) on SEI100A784250006"
  lastDataAge: string; // e.g. "Last data 136 minutes ago"
  sensor: AlertSensorType;
  thresholdValue: number | string; // e.g. 120 or 25
  currentValue?: number | string; // e.g. 26.50
  deviceId: string;
  roomName?: string;
  status: AlertStatus;
  severity: AlertSeverity;
  triggeredAt: string; // e.g. "2d ago"
  lastSeenAt: string; // e.g. "just now"
  resolvedAt?: string; // e.g. "2d ago"
}
