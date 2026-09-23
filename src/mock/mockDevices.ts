import { Device } from '../types/device.types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'device-0006',
    serialNumber: 'SEI100A784250006',
    status: 'active',
    lastSeen: '2d ago',
    airQualityStatus: 'Good',
    roomId: 'room-01',
    roomName: 'Room 01',
    sensors: {
      aqi: 23,
      pm25: 15,
      temp: 26.2,
      humidity: 58,
    },
  },
  {
    id: 'device-0007',
    serialNumber: 'SEI100A784250007',
    status: 'stale',
    lastSeen: '65 minutes ago',
    airQualityStatus: 'Good',
    roomId: 'room-02',
    roomName: 'Executive Suite',
    sensors: {
      aqi: 18,
      pm25: 8,
      temp: 22.4,
      humidity: 45,
    },
  },
];
