import React from 'react';
import { useApp } from '../../../context/AppContext';
import { AmbientAirFlow } from '../../visualizers/AmbientAirFlow';
import {
  Leaf,
  Bell,
  AlertTriangle,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  FileText,
  MoreVertical,
  Activity,
  Wifi,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import SmartEcoDeviceBanner from '../../../assets/smarteco-device-banner.png';
import CardBg from '../../../assets/Card bg.png';

export const DashboardPage: React.FC = () => {
  const { rooms, alerts, setActiveRoute } = useApp();

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;
  const roomsNeedingAttention = rooms.filter((r) => r.totalAlertsCount > 0 || r.status !== 'Good');
  const reportingRooms = rooms.filter((r) => r.reportingStatus === 'reporting');
  // Exact Room entries from screenshots (Top 2)
  const displayRooms = [
    {
      id: 'r1',
      name: 'Room 01',
      code: 'ROOM-01',
      location: 'My Location',
      score: 96,
      status: 'good',
      alertCount: 1,
    },
    {
      id: 'r2',
      name: 'Room 02',
      code: 'ROOM-02',
      location: 'Main Office',
      score: 92,
      status: 'good',
      alertCount: 0,
    },
  ];

  // Exact Recent Alert entries from screenshots & mock system (Top 3)
  const displayAlerts = [
    {
      id: 'a1',
      title: 'Device Offline: SE1100A784250006',
      sensor: 'device_offline',
      room: 'Room 01',
      threshold: '120 min',
      value: '—',
      triggered: 'Last data 136 minutes ago',
      status: 'Open',
      severity: 'critical',
    },
    {
      id: 'a2',
      title: 'PM1.0 out of range',
      sensor: 'pm1',
      room: 'Room 01',
      threshold: '25.00',
      value: '26.50',
      triggered: '3d ago',
      status: 'Resolved',
      severity: 'warning',
    },
    {
      id: 'a3',
      title: 'PM10 out of range',
      sensor: 'pm10',
      room: 'Room 01',
      threshold: '25.00',
      value: '25.80',
      triggered: '3d ago',
      status: 'Resolved',
      severity: 'warning',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none pb-8">
      {/* Top Header Title */}
      <div className="mb-8 sm:mb-10">
        <span className="text-sm font-bold text-slate-400 tracking-wider block mb-1">
          Welcome Pujitha
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Air Quality Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl glass-card flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SmartEco Live Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: LEFT HERO DEVICE PANEL + RIGHT DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[29.5%_1fr] gap-6 items-stretch">

        {/* LEFT COLUMN: SMARTECO DEVICE HERO & AIR QUALITY STATUS OVERLAY (EXTENDED HEIGHT TO FILL BOTTOM SPACE) */}
        <div className="flex flex-col justify-between relative overflow-hidden rounded-[2.2rem] border border-white/90 shadow-xl group bg-gradient-to-b from-[#C8EBF0] via-[#E6F5F3] to-[#E6F5F3] min-h-[700px] xl:min-h-[760px]">
          {/* Background image of uploaded Card bg.png (UNCROPPED) */}
          <img
            src={CardBg}
            alt="SmartEco Hardware Device Environment"
            className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Subtle top ambient vignette */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/20 to-transparent z-0 pointer-events-none" />

          {/* Top Device Header Badge */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/90 text-[11px] font-black text-[#217C70] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-[#217C70]" />
              <span>SmartEco Device</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
              <Wifi className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Online</span>
            </div>
          </div>

          {/* Middle Spacer to balance device image header */}
          <div className="relative z-10 flex-1 min-h-[120px]" />

          {/* Bottom Overlay Card inside Image Block: Air Quality Status & Diagnostics */}
          <div className="relative z-10 p-5 sm:p-6 m-4 glass-overlay rounded-[2.2rem] border border-white/95 shadow-2xl space-y-4">

            {/* Header: Status title + Big Air Quality Score Pill */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <Leaf className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Air Quality Score</h3>
                  <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Diagnostics
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">96</span>
                  <span className="text-xs font-bold text-slate-400">/100</span>
                </div>
                <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                  Good
                </span>
              </div>
            </div>

            {/* Environmental Summary Text */}
            <p className="text-xs font-medium text-slate-700 leading-relaxed pt-1">
              Environment health is <strong className="text-emerald-700 font-bold">Good</strong>. 1 room needs minor attention.
            </p>

            {/* Sensor Metrics 2x2 Rich Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-white/90 border border-slate-100/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temp</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block">26.2 °C</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-slate-100/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Humidity</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block">58 %</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-slate-100/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PM 2.5</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block">15 µg/m³</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-slate-100/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PM 10</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block">22 µg/m³</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: 4 METRIC CARDS HORIZONTALLY IN A SINGLE ROW + TOP ROOMS & RECENT ALERTS BELOW */}
        <div className="space-y-6">

          {/* 1. TOP ROW: 4 METRIC CARDS HORIZONTALLY IN A SINGLE ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* Card 1: Air Quality Score */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#D9F4F1] via-[#F4FCFC] to-white border border-white/90 shadow-md shadow-teal-950/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 tracking-tight leading-snug">
                  Air Quality Score
                </span>
                <div className="w-11 h-11 rounded-full bg-[#D1F4EA] text-[#059669] flex items-center justify-center shrink-0 border border-emerald-200/50 shadow-2xs">
                  <Leaf className="w-5 h-5 fill-current" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  96
                </div>
                <span className="text-[11px] sm:text-xs text-[#059669] font-normal block mt-0.5">
                  Good overall status
                </span>
              </div>
            </div>

            {/* Card 2: Open Alerts */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#D9F4F1] via-[#F4FCFC] to-white border border-white/90 shadow-md shadow-teal-950/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 tracking-tight leading-snug">
                  Open Alerts
                </span>
                <div className="w-11 h-11 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0 border border-rose-200/50 shadow-2xs">
                  <Bell className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-[#E11D48] tracking-tight">
                  {openAlertsCount}
                </div>
                <span className="text-[11px] sm:text-xs text-[#E11D48] font-normal block mt-0.5">
                  0 critical
                </span>
              </div>
            </div>

            {/* Card 3: Rooms Needing Attention */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#D9F4F1] via-[#F4FCFC] to-white border border-white/90 shadow-md shadow-teal-950/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 tracking-tight leading-snug">
                  Rooms Needing Attention
                </span>
                <div className="w-11 h-11 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 border border-amber-200/50 shadow-2xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-[#D97706] tracking-tight">
                  {roomsNeedingAttention.length}
                </div>
                <span className="text-[11px] sm:text-xs text-[#B45309] font-normal block mt-0.5 truncate">
                  alerts, recent detections
                </span>
              </div>
            </div>

            {/* Card 4: Rooms Reporting */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#D9F4F1] via-[#F4FCFC] to-white border border-white/90 shadow-md shadow-teal-950/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 tracking-tight leading-snug">
                  Rooms Reporting
                </span>
                <div className="w-11 h-11 rounded-full bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center shrink-0 border border-teal-200/50 shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-[#0D9488] tracking-tight">
                  {reportingRooms.length}
                </div>
                <span className="text-[11px] sm:text-xs text-[#0D9488] font-normal block mt-0.5">
                  1 total across 1 sites
                </span>
              </div>
            </div>

          </div>

          {/* 2. BOTTOM ROWS BELOW METRIC CARDS: TOP ROOMS ROW THEN RECENT ALERTS ROW */}
          <div className="space-y-6">

            {/* ROW 1: TOP ROOMS */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 space-y-4 border border-white/80 shadow-sm">
              {/* Header Row Inside Outer Card */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#217C70]" />
                  <span>TOP ROOMS</span>
                </h3>
                <button
                  onClick={() => setActiveRoute('rooms')}
                  className="text-xs font-semibold text-[#217C70] hover:underline flex items-center gap-0.5"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table / List Content - White Glass Inner Cards */}
              <div className="space-y-2">
                {displayRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoute('rooms')}
                    className="p-3.5 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#217C70] flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#217C70] transition-colors">
                            {room.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {room.score} — {room.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-slate-500">
                          <span>{room.code}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {room.location}
                          </span>
                          <span>•</span>
                          <span className="text-rose-600 font-bold">{room.alertCount} alert</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-[#217C70] group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: RECENT ALERTS */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 space-y-4 border border-white/80 shadow-sm">
              {/* Header Row Inside Outer Card */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <span>RECENT ALERTS</span>
                </h3>
                <button
                  onClick={() => setActiveRoute('alerts')}
                  className="text-xs font-semibold text-[#217C70] hover:underline flex items-center gap-0.5"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table / List Content - White Glass Inner Cards */}
              <div className="space-y-2">
                {displayAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => setActiveRoute('alerts')}
                    className={`p-3.5 rounded-2xl border backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${alert.status === 'Open'
                      ? 'bg-amber-50/80 border-amber-200/90 hover:bg-amber-50/95'
                      : 'bg-white/80 border-white/90 hover:bg-white/95'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${alert.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                          }`}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{alert.title}</span>
                          {alert.status === 'Open' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                              {alert.sensor}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                              {alert.sensor}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                          {alert.triggered}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {alert.threshold !== '—' && (
                        <div className="text-[10px] font-mono text-slate-500 bg-white/90 px-2 py-1 rounded-lg border border-slate-100">
                          Threshold: {alert.threshold}
                        </div>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${alert.status === 'Open'
                          ? 'bg-amber-200/80 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100/80 text-emerald-800 border border-emerald-200'
                          }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
