import { ShareLink } from '../types/share.types';

export const INITIAL_SHARE_LINKS: ShareLink[] = [
  {
    id: 'share-1',
    name: 'sharing',
    roomId: 'room-01',
    roomName: 'Room 01',
    parametersCount: 5,
    parametersList: ['AQI', 'Temp', 'Humidity', 'PM2.5', 'TVOC'],
    createdAt: 'Sep 8, 2026',
    expiresAt: 'Never expires',
    token: 'live-room01-sep8-2026',
  },
  {
    id: 'share-2',
    name: 'test',
    roomId: 'room-01',
    roomName: 'Room 01',
    parametersCount: 5,
    parametersList: ['AQI', 'Temp', 'Humidity', 'PM2.5', 'CO2'],
    createdAt: 'Aug 27, 2026',
    expiresAt: 'Never expires',
    token: 'live-room01-aug27-2026',
  },
];
