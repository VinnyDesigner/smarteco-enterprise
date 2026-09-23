import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room } from '../types/room.types';
import { Device } from '../types/device.types';
import { Alert } from '../types/alert.types';
import { SensorThreshold } from '../types/threshold.types';
import { ShareLink } from '../types/share.types';
import { User } from '../types/user.types';
import { AIMessage } from '../types/ai.types';

import { INITIAL_ROOMS } from '../mock/mockRooms';
import { INITIAL_DEVICES } from '../mock/mockDevices';
import { INITIAL_ALERTS } from '../mock/mockAlerts';
import { INITIAL_THRESHOLDS } from '../mock/mockThresholds';
import { INITIAL_SHARE_LINKS } from '../mock/mockShareLinks';
import { INITIAL_USERS } from '../mock/mockUsers';
import { INITIAL_AI_MESSAGES } from '../mock/mockAIChat';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Authentication State
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string } | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Navigation & Shell State
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Domain Entities State
  rooms: Room[];
  devices: Device[];
  alerts: Alert[];
  thresholds: SensorThreshold[];
  shareLinks: ShareLink[];
  users: User[];
  aiMessages: AIMessage[];
  toasts: ToastItem[];

  // Action Methods
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  addRoom: (room: Partial<Room>) => void;
  editRoom: (id: string, room: Partial<Room>) => void;

  reassignDevice: (deviceId: string, roomId: string | null) => void;
  editDevice: (deviceId: string, data: Partial<Device>) => void;

  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;

  customizeThreshold: (sensorId: string, warnMax: number | null, critMax: number | null) => void;

  createShareLink: (link: Partial<ShareLink>) => void;
  deleteShareLink: (linkId: string) => void;

  addUser: (user: Partial<User>) => void;
  sendAIMessage: (userText: string) => void;
  resetAIChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('smarteco_authed');
    return saved === 'true';
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('smarteco_user');
    return saved ? JSON.parse(saved) : { name: 'Pujitha', email: 'pujitha@smarteco.io', role: 'Administrator' };
  });

  const [activeRoute, setActiveRoute] = useState<string>('dashboard');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Entities state with localStorage recovery
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('smarteco_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('smarteco_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('smarteco_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [thresholds, setThresholds] = useState<SensorThreshold[]>(() => {
    const saved = localStorage.getItem('smarteco_thresholds');
    return saved ? JSON.parse(saved) : INITIAL_THRESHOLDS;
  });

  const [shareLinks, setShareLinks] = useState<ShareLink[]>(() => {
    const saved = localStorage.getItem('smarteco_shareLinks');
    return saved ? JSON.parse(saved) : INITIAL_SHARE_LINKS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('smarteco_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smarteco_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('smarteco_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('smarteco_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('smarteco_thresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  useEffect(() => {
    localStorage.setItem('smarteco_shareLinks', JSON.stringify(shareLinks));
  }, [shareLinks]);

  useEffect(() => {
    localStorage.setItem('smarteco_users', JSON.stringify(users));
  }, [users]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const addRoom = (roomData: Partial<Room>) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      code: roomData.code || `ROOM-0${rooms.length + 1}`,
      name: roomData.name || `New Room ${rooms.length + 1}`,
      location: roomData.location || 'Building A',
      aqiScore: roomData.aqiScore || 95,
      status: 'Good',
      freshness: 'live',
      lastUpdated: 'Just now',
      sensors: roomData.sensors || {
        aqi: 20,
        co2: 450,
        temp: 23.5,
        humidity: 48,
        pm25: 10,
        tvoc: 5,
      },
      alertTags: [],
      totalAlertsCount: 0,
      reportingStatus: 'reporting',
    };
    setRooms((prev) => [newRoom, ...prev]);
    showToast(`Room "${newRoom.name}" added successfully`);
  };

  const editRoom = (id: string, roomData: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...roomData, lastUpdated: 'Just now' } : r))
    );
    showToast('Room settings updated');
  };

  const reassignDevice = (deviceId: string, roomId: string | null) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              roomId: roomId,
              roomName: targetRoom ? targetRoom.name : null,
              status: roomId ? 'active' : 'unassigned',
              lastSeen: 'Just now',
            }
          : d
      )
    );
    showToast(targetRoom ? `Device reassigned to ${targetRoom.name}` : 'Device unassigned');
  };

  const editDevice = (deviceId: string, data: Partial<Device>) => {
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, ...data } : d)));
    showToast('Device details updated');
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
    showToast('Alert marked as Acknowledged', 'info');
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'resolved', resolvedAt: 'Just now', lastSeenAt: 'Just now' }
          : a
      )
    );
    showToast('Alert marked as Resolved', 'success');
  };

  const customizeThreshold = (sensorId: string, warnMax: number | null, critMax: number | null) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === sensorId ? { ...t, warnMax, critMax } : t))
    );
    showToast('Sensor threshold limits updated');
  };

  const createShareLink = (linkData: Partial<ShareLink>) => {
    const targetRoom = rooms.find((r) => r.id === linkData.roomId) || rooms[0];
    const newLink: ShareLink = {
      id: `share-${Date.now()}`,
      name: linkData.name || 'Custom View',
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      parametersCount: linkData.parametersList ? linkData.parametersList.length : 5,
      parametersList: linkData.parametersList || ['AQI', 'Temp', 'Humidity', 'PM2.5', 'TVOC'],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expiresAt: linkData.expiresAt || 'Never expires',
      token: `live-${Date.now()}`,
    };
    setShareLinks((prev) => [newLink, ...prev]);
    showToast(`Share link "${newLink.name}" created`);
  };

  const deleteShareLink = (linkId: string) => {
    setShareLinks((prev) => prev.filter((l) => l.id !== linkId));
    showToast('Share link deleted', 'info');
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Team Member',
      email: userData.email || 'user@smarteco.io',
      role: userData.role || 'Viewer',
      initials: (userData.name || 'U').substring(0, 2).toUpperCase(),
      status: 'Invited',
      lastActive: 'Just invited',
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Invitation sent to ${newUser.email}`);
  };

  const sendAIMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };

    setAiMessages((prev) => [...prev, userMsg]);

    // Generate intelligent assistant response based on prompt
    setTimeout(() => {
      let botResponse: AIMessage;
      const lower = userText.toLowerCase();

      if (lower.includes('worst') || lower.includes('air quality')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Based on monitored sensor data over the past 7 days, **R&D Lab 04** recorded the lowest average air quality score (AQI 68) due to intermittent elevated TVOC spikes.',
          tableData: {
            headers: ['Room Name', 'Avg AQI Score', 'Primary Pollutant', 'Status'],
            rows: [
              ['R&D Lab 04', 68, 'TVOC (145 ppb)', 'Moderate'],
              ['Room 01', 96, 'Humidity (58%)', 'Good'],
              ['Executive Suite', 92, 'CO2 (450 ppm)', 'Good'],
            ],
          },
        };
      } else if (lower.includes('pm2.5') || lower.includes('trend')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Here is the 7-day average PM2.5 particle density trend for monitored locations across your site:',
          chartData: {
            title: 'PM2.5 Trend (7 Days - µg/m³)',
            type: 'line',
            dataKeys: ['Room01', 'ExecutiveSuite', 'Lab04'],
            data: [
              { day: 'Mon', Room01: 12, ExecutiveSuite: 6, Lab04: 22 },
              { day: 'Tue', Room01: 14, ExecutiveSuite: 7, Lab04: 24 },
              { day: 'Wed', Room01: 15, ExecutiveSuite: 8, Lab04: 28 },
              { day: 'Thu', Room01: 13, ExecutiveSuite: 6, Lab04: 25 },
              { day: 'Fri', Room01: 16, ExecutiveSuite: 9, Lab04: 31 },
              { day: 'Sat', Room01: 15, ExecutiveSuite: 7, Lab04: 26 },
              { day: 'Sun', Room01: 15, ExecutiveSuite: 8, Lab04: 28 },
            ],
          },
        };
      } else if (lower.includes('open alert') || lower.includes('alerts')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'There is currently **1 Open Warning Alert** registered in the system:\n\n• **Device Offline: SEI100A784250006** assigned to Room 01 (Last telemetry payload received 136 minutes ago).',
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Analyzing telemetric records for "${userText}"...\n\nYour site environment remains in **Good** standing overall with an average AQI of 96. 1 hardware unit requires attention due to connectivity timeout.`,
        };
      }

      setAiMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const resetAIChat = () => {
    setAiMessages(INITIAL_AI_MESSAGES);
    showToast('AI Chat session restarted', 'info');
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Simulated authentication check
    const userObj = {
      name: email.includes('admin') ? 'Administrator' : 'Pujitha',
      email: email || 'pujitha@smarteco.io',
      role: 'Administrator',
    };
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('smarteco_authed', 'true');
    localStorage.setItem('smarteco_user', JSON.stringify(userObj));
    showToast(`Welcome back, ${userObj.name}!`, 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('smarteco_authed', 'false');
    showToast('Signed out of SmartEco Enterprise', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,

        activeRoute,
        setActiveRoute,
        isNotificationOpen,
        setIsNotificationOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,

        rooms,
        devices,
        alerts,
        thresholds,
        shareLinks,
        users,
        aiMessages,
        toasts,

        showToast,
        removeToast,
        addRoom,
        editRoom,
        reassignDevice,
        editDevice,
        acknowledgeAlert,
        resolveAlert,
        customizeThreshold,
        createShareLink,
        deleteShareLink,
        addUser,
        sendAIMessage,
        resetAIChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
