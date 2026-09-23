export interface ShareLink {
  id: string;
  name: string; // e.g. "sharing" or "test"
  roomId: string;
  roomName: string; // e.g. "Room 01"
  parametersCount: number; // e.g. 5
  parametersList: string[]; // e.g. ["AQI", "CO2", "Temp", "Humidity", "PM2.5"]
  createdAt: string; // e.g. "Sep 8, 2026"
  expiresAt: string; // e.g. "Never expires"
  token: string;
}
