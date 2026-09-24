import React, { useState, useRef, useEffect } from 'react';
import { Room } from '../../../types/room.types';
import { useApp } from '../../../context/AppContext';
import {
  ChevronLeft,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Droplets,
  Wind,
  HelpCircle,
  Info,
  Lightbulb,
  Download,
  ChevronRight,
  Clock,
  Zap,
  Filter,
  BarChart3,
  RefreshCw,
  Bell,
  Calendar,
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RoomDetailPageProps {
  room: Room;
  onBack: () => void;
}

interface MetricConfig {
  id: string;
  label: string;
  unit: string;
  color: string;
}

const METRIC_CONFIGS: Record<string, MetricConfig> = {
  'AQI': { id: 'AQI', label: 'AQI', unit: '', color: '#217C70' },
  'PM2.5': { id: 'PM25', label: 'PM2.5', unit: 'µg/m³', color: '#10B981' },
  'PM10': { id: 'PM10', label: 'PM10', unit: 'µg/m³', color: '#064E3B' },
  'PM1.0': { id: 'PM10_sub', label: 'PM1.0', unit: 'µg/m³', color: '#0D9488' },
  'Temperature': { id: 'Temp', label: 'Temperature', unit: '°C', color: '#F59E0B' },
  'Humidity': { id: 'Humidity', label: 'Humidity', unit: '%', color: '#14B8A6' },
  'TVOC': { id: 'TVOC', label: 'TVOC', unit: 'ppb', color: '#059669' },
  'HCHO': { id: 'HCHO', label: 'HCHO', unit: 'mg/m³', color: '#F59E0B' },
  'Mold Risk': { id: 'Mold', label: 'Mold Risk', unit: '%', color: '#F59E0B' },
  'Virus Risk': { id: 'Virus', label: 'Virus Risk', unit: '%', color: '#EF4444' },
  'Thermal Comfort': { id: 'Thermal', label: 'Thermal Comfort', unit: 'pts', color: '#217C70' },
};

const TIME_FILTER_OPTIONS = [
  { label: 'Last 12 Hours', subtitle: 'Averaged per hour' },
  { label: 'Last 24 Hours', subtitle: 'Averaged per hour' },
  { label: 'Last 7 Days', subtitle: 'Averaged per 6 hours' },
  { label: 'Last 30 Days', subtitle: 'Averaged per day' },
  { label: 'Custom Range', subtitle: 'Custom selection' },
];

const generateTelemetryData = (filter: string) => {
  if (filter === 'Last 12 Hours') {
    return [
      { time: '14:00', AQI: 18.0, PM25: 8, PM10: 12.0, PM10_sub: 7, Temp: 24.2, Humidity: 50, TVOC: 120, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
      { time: '15:00', AQI: 18.5, PM25: 9, PM10: 12.5, PM10_sub: 7.5, Temp: 24.4, Humidity: 51, TVOC: 125, HCHO: 0.02, Mold: 16, Virus: 11, Thermal: 84 },
      { time: '16:00', AQI: 18.0, PM25: 9, PM10: 12.0, PM10_sub: 7, Temp: 24.6, Humidity: 51, TVOC: 118, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
      { time: '17:00', AQI: 18.2, PM25: 10, PM10: 12.2, PM10_sub: 7.2, Temp: 24.5, Humidity: 50, TVOC: 122, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
      { time: '18:00', AQI: 18.8, PM25: 10, PM10: 12.8, PM10_sub: 7.8, Temp: 24.2, Humidity: 50, TVOC: 130, HCHO: 0.03, Mold: 17, Virus: 12, Thermal: 83 },
      { time: '19:00', AQI: 19.0, PM25: 11, PM10: 13.1, PM10_sub: 8.0, Temp: 24.0, Humidity: 49, TVOC: 135, HCHO: 0.03, Mold: 18, Virus: 12, Thermal: 82 },
      { time: '20:00', AQI: 19.2, PM25: 11, PM10: 13.4, PM10_sub: 8.2, Temp: 23.8, Humidity: 49, TVOC: 140, HCHO: 0.03, Mold: 18, Virus: 13, Thermal: 82 },
      { time: '21:00', AQI: 18.9, PM25: 10, PM10: 13.0, PM10_sub: 7.9, Temp: 23.6, Humidity: 50, TVOC: 132, HCHO: 0.02, Mold: 17, Virus: 11, Thermal: 83 },
      { time: '22:00', AQI: 18.4, PM25: 9, PM10: 12.6, PM10_sub: 7.5, Temp: 23.4, Humidity: 50, TVOC: 124, HCHO: 0.02, Mold: 16, Virus: 10, Thermal: 84 },
      { time: '23:00', AQI: 18.0, PM25: 8, PM10: 12.1, PM10_sub: 7.1, Temp: 23.2, Humidity: 51, TVOC: 120, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
      { time: '00:00', AQI: 17.8, PM25: 8, PM10: 12.0, PM10_sub: 7.0, Temp: 23.0, Humidity: 51, TVOC: 115, HCHO: 0.02, Mold: 14, Virus: 9, Thermal: 86 },
      { time: '01:00', AQI: 17.6, PM25: 7, PM10: 12.0, PM10_sub: 6.8, Temp: 22.9, Humidity: 52, TVOC: 110, HCHO: 0.01, Mold: 14, Virus: 9, Thermal: 86 },
    ];
  } else if (filter === 'Last 7 Days') {
    return [
      { time: 'Sep 18', AQI: 22.0, PM25: 14, PM10: 18.5, PM10_sub: 10, Temp: 25.1, Humidity: 54, TVOC: 150, HCHO: 0.03, Mold: 22, Virus: 15, Thermal: 78 },
      { time: 'Sep 19', AQI: 20.0, PM25: 12, PM10: 16.2, PM10_sub: 9, Temp: 24.8, Humidity: 53, TVOC: 140, HCHO: 0.03, Mold: 20, Virus: 13, Thermal: 80 },
      { time: 'Sep 20', AQI: 24.0, PM25: 16, PM10: 21.0, PM10_sub: 12, Temp: 25.5, Humidity: 56, TVOC: 175, HCHO: 0.04, Mold: 26, Virus: 18, Thermal: 75 },
      { time: 'Sep 21', AQI: 19.0, PM25: 10, PM10: 14.5, PM10_sub: 8, Temp: 24.3, Humidity: 50, TVOC: 130, HCHO: 0.02, Mold: 18, Virus: 12, Thermal: 83 },
      { time: 'Sep 22', AQI: 17.0, PM25: 8, PM10: 12.2, PM10_sub: 7, Temp: 23.8, Humidity: 49, TVOC: 115, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 86 },
      { time: 'Sep 23', AQI: 18.0, PM25: 9, PM10: 12.0, PM10_sub: 7, Temp: 24.6, Humidity: 51, TVOC: 120, HCHO: 0.02, Mold: 16, Virus: 10, Thermal: 85 },
      { time: 'Sep 24', AQI: 18.4, PM25: 9, PM10: 12.4, PM10_sub: 7, Temp: 24.9, Humidity: 52, TVOC: 122, HCHO: 0.02, Mold: 16, Virus: 11, Thermal: 84 },
    ];
  } else if (filter === 'Last 30 Days') {
    return [
      { time: 'Aug 26', AQI: 25.0, PM25: 18, PM10: 23.0, PM10_sub: 14, Temp: 26.0, Humidity: 58, TVOC: 190, HCHO: 0.05, Mold: 30, Virus: 20, Thermal: 72 },
      { time: 'Aug 31', AQI: 22.0, PM25: 15, PM10: 19.5, PM10_sub: 11, Temp: 25.4, Humidity: 55, TVOC: 160, HCHO: 0.04, Mold: 24, Virus: 16, Thermal: 77 },
      { time: 'Sep 05', AQI: 28.0, PM25: 20, PM10: 26.2, PM10_sub: 16, Temp: 26.5, Humidity: 60, TVOC: 210, HCHO: 0.06, Mold: 35, Virus: 24, Thermal: 68 },
      { time: 'Sep 10', AQI: 19.0, PM25: 11, PM10: 15.0, PM10_sub: 8, Temp: 24.2, Humidity: 51, TVOC: 135, HCHO: 0.03, Mold: 19, Virus: 12, Thermal: 82 },
      { time: 'Sep 15', AQI: 21.0, PM25: 13, PM10: 17.8, PM10_sub: 10, Temp: 24.9, Humidity: 53, TVOC: 145, HCHO: 0.03, Mold: 21, Virus: 14, Thermal: 80 },
      { time: 'Sep 20', AQI: 18.0, PM25: 9, PM10: 13.5, PM10_sub: 7, Temp: 24.1, Humidity: 50, TVOC: 125, HCHO: 0.02, Mold: 16, Virus: 10, Thermal: 85 },
      { time: 'Sep 24', AQI: 18.2, PM25: 9, PM10: 12.0, PM10_sub: 7, Temp: 24.9, Humidity: 52, TVOC: 120, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
    ];
  } else if (filter === 'Custom Range') {
    return [
      { time: '12:00', AQI: 16.0, PM25: 7, PM10: 11.5, PM10_sub: 6, Temp: 23.5, Humidity: 48, TVOC: 105, HCHO: 0.01, Mold: 12, Virus: 8, Thermal: 88 },
      { time: '13:00', AQI: 17.0, PM25: 8, PM10: 11.8, PM10_sub: 6.5, Temp: 23.8, Humidity: 49, TVOC: 110, HCHO: 0.02, Mold: 13, Virus: 9, Thermal: 87 },
      { time: '14:00', AQI: 18.0, PM25: 9, PM10: 12.0, PM10_sub: 7, Temp: 24.2, Humidity: 50, TVOC: 118, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
      { time: '15:00', AQI: 19.0, PM25: 10, PM10: 12.5, PM10_sub: 7.5, Temp: 24.5, Humidity: 51, TVOC: 125, HCHO: 0.02, Mold: 16, Virus: 11, Thermal: 84 },
      { time: '16:00', AQI: 18.0, PM25: 9, PM10: 12.0, PM10_sub: 7, Temp: 24.6, Humidity: 51, TVOC: 120, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
    ];
  }

  // Default: Last 24 Hours
  return [
    { time: '14:00', AQI: 17.6, PM25: 8, PM10: 12.0, PM10_sub: 6.8, Temp: 24.0, Humidity: 50, TVOC: 115, HCHO: 0.01, Mold: 14, Virus: 9, Thermal: 86 },
    { time: '16:00', AQI: 18.0, PM25: 9, PM10: 12.0, PM10_sub: 7.0, Temp: 24.6, Humidity: 51, TVOC: 120, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
    { time: '18:00', AQI: 18.4, PM25: 9.5, PM10: 12.4, PM10_sub: 7.2, Temp: 24.4, Humidity: 51, TVOC: 122, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
    { time: '20:00', AQI: 19.0, PM25: 10.2, PM10: 13.0, PM10_sub: 7.8, Temp: 24.1, Humidity: 50, TVOC: 128, HCHO: 0.02, Mold: 16, Virus: 11, Thermal: 84 },
    { time: '22:00', AQI: 19.6, PM25: 11.0, PM10: 13.6, PM10_sub: 8.2, Temp: 23.8, Humidity: 49, TVOC: 134, HCHO: 0.03, Mold: 17, Virus: 12, Thermal: 83 },
    { time: '00:00', AQI: 20.0, PM25: 11.5, PM10: 14.0, PM10_sub: 8.5, Temp: 23.5, Humidity: 49, TVOC: 138, HCHO: 0.03, Mold: 18, Virus: 12, Thermal: 82 },
    { time: '02:00', AQI: 19.8, PM25: 11.2, PM10: 13.8, PM10_sub: 8.3, Temp: 23.2, Humidity: 50, TVOC: 132, HCHO: 0.02, Mold: 17, Virus: 11, Thermal: 83 },
    { time: '04:00', AQI: 19.2, PM25: 10.5, PM10: 13.2, PM10_sub: 7.9, Temp: 23.0, Humidity: 50, TVOC: 126, HCHO: 0.02, Mold: 16, Virus: 10, Thermal: 84 },
    { time: '06:00', AQI: 18.6, PM25: 9.8, PM10: 12.6, PM10_sub: 7.4, Temp: 23.4, Humidity: 51, TVOC: 121, HCHO: 0.02, Mold: 15, Virus: 10, Thermal: 85 },
    { time: '08:00', AQI: 18.8, PM25: 10.0, PM10: 12.8, PM10_sub: 7.6, Temp: 24.2, Humidity: 52, TVOC: 125, HCHO: 0.02, Mold: 16, Virus: 11, Thermal: 84 },
    { time: '10:00', AQI: 19.4, PM25: 10.8, PM10: 13.4, PM10_sub: 8.0, Temp: 24.8, Humidity: 54, TVOC: 130, HCHO: 0.03, Mold: 17, Virus: 12, Thermal: 83 },
    { time: '12:00', AQI: 20.2, PM25: 11.8, PM10: 14.2, PM10_sub: 8.6, Temp: 25.1, Humidity: 53, TVOC: 142, HCHO: 0.03, Mold: 19, Virus: 13, Thermal: 81 },
  ];
};

// Custom Tooltip component matching exact reference screenshot UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl text-xs space-y-1.5 min-w-[170px] z-50">
        <div className="text-[11px] font-bold text-slate-400">
          Sep 23, {label}
        </div>
        {payload.map((entry: any, index: number) => {
          const metricName = entry.name;
          const config = METRIC_CONFIGS[metricName];
          const unitStr = config?.unit ? ` (${config.unit})` : '';
          return (
            <div key={index} className="flex items-center gap-2 font-extrabold text-slate-800 text-[12px]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.stroke || entry.color || config?.color }}
              />
              <span>
                {metricName}{unitStr}: <span className="font-black text-slate-900">{entry.value}</span>
              </span>
            </div>
          );
        })}
        <div className="text-[10px] font-semibold text-slate-400 pt-0.5">
          Driven by PM2.5
        </div>
      </div>
    );
  }
  return null;
};

const EXACT_HEATMAP_HOURS = [
  '12 AM',
  '10 PM',
  '8 PM',
  '6 PM',
  '4 PM',
  '2 PM',
  '12 PM',
  '10 AM',
  '8 AM',
  '6 AM',
  '4 AM',
  '2 AM',
  '12 AM',
];

// 30 Days x 13 Time Slots Heatmap Matrix Data Generator
const generateHeatmapGrid = () => {
  const grid = [];
  for (let r = 0; r < 13; r++) {
    const hourLabel = EXACT_HEATMAP_HOURS[r];
    const row = [];
    for (let day = 1; day <= 30; day++) {
      let color = '#10B981'; // Primary Green (Good)

      // Day 7 is completely blank (white) in reference image
      if (day === 7) {
        color = '#FFFFFF';
      } else if (day > 18) {
        // Days 19-30 are empty except Day 23 row index 4 (4 PM) and 5 (2 PM)
        if (day === 23 && (r === 4 || r === 5)) {
          color = '#10B981';
        } else {
          color = '#FFFFFF';
        }
      } else {
        // Specific anomaly dots matching reference screenshot:
        if (day === 4 && r === 1) color = '#EA580C'; // 10 PM Orange (Moderate)
        else if (day === 4 && r === 2) color = '#D97706'; // 8 PM Golden Yellow (Satisfactory)
        else if (day === 6 && r === 11) color = '#D97706'; // 2 AM Golden Yellow (Satisfactory)
        else if (day === 8 && r === 8) color = '#D97706'; // 8 AM Golden Yellow
        else if (day === 12 && r === 1) color = '#D97706'; // 10 PM Golden Yellow
        else if (day === 12 && r === 7) color = '#D97706'; // 10 AM Golden Yellow
        else if (day === 12 && r === 8) color = '#EA580C'; // 8 AM Orange
        else if (day === 13 && r === 7) color = '#EA580C'; // 10 AM Orange
        else if (day === 13 && r === 12) color = '#D97706'; // 12 AM bottom Golden Yellow
        else if (day === 14 && r === 3) color = '#DC2626'; // 6 PM Red (Poor)
        else if (day === 14 && r === 6) color = '#EA580C'; // 12 PM Orange
        else if (day === 14 && r === 8) color = '#D97706'; // 8 AM Golden Yellow
        else if (day === 14 && r === 9) color = '#D97706'; // 6 AM Golden Yellow
        else if (day === 14 && r === 11) color = '#D97706'; // 2 AM Golden Yellow
        else if (day === 15 && r === 1) color = '#D97706'; // 10 PM Golden Yellow
        else if (day === 15 && r === 9) color = '#D97706'; // 6 AM Golden Yellow
        else if (day === 16 && r === 1) color = '#D97706'; // 10 PM Golden Yellow
        else if (day === 16 && r === 8) color = '#D97706'; // 8 AM Golden Yellow
        else if (day === 16 && r === 9) color = '#D97706'; // 6 AM Golden Yellow
        else if (day === 16 && r === 10) color = '#D97706'; // 4 AM Golden Yellow
        else if (day === 17 && r === 1) color = '#D97706'; // 10 PM Golden Yellow
        else if (day === 17 && r === 8) color = '#EA580C'; // 8 AM Orange
      }

      row.push({ day, hour: hourLabel, color });
    }
    grid.push({ hour: hourLabel, days: row });
  }
  return grid;
};

const HEATMAP_DATA = generateHeatmapGrid();

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateYearHeatmapGrid = () => {
  const grid = [];
  for (let r = 0; r < 13; r++) {
    const hourLabel = EXACT_HEATMAP_HOURS[r];
    const row = [];
    for (let m = 0; m < 12; m++) {
      let color = '#10B981';
      if (m >= 9) {
        color = '#FFFFFF';
      } else if (m === 3 && r === 1) {
        color = '#F59E0B';
      } else if (m === 5 && r === 8) {
        color = '#F59E0B';
      } else if (m === 8 && r === 3) {
        color = '#EF4444';
      }
      row.push({ label: MONTH_NAMES[m], index: m + 1, hour: hourLabel, color });
    }
    grid.push({ hour: hourLabel, months: row });
  }
  return grid;
};

const HEATMAP_YEAR_DATA = generateYearHeatmapGrid();

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ room, onBack }) => {
  const { setActiveRoute, alerts } = useApp();

  // Multi-parameter selection state (Default: AQI and PM10 selected as in screenshot!)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['AQI', 'PM10']);

  // Time filter dropdown state
  const [timeFilter, setTimeFilter] = useState<string>('Last 24 Hours');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState<boolean>(false);
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState<boolean>(false);
  const [customFromDate, setCustomFromDate] = useState<string>('18-09-2026');
  const [customToDate, setCustomToDate] = useState<string>('24-09-2026');
  const [heatmapMode, setHeatmapMode] = useState<'Month' | 'Year'>('Month');
  const [exportToast, setExportToast] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const telemetryScrollRef = useRef<HTMLDivElement>(null);
  const [telemetryScrollProgress, setTelemetryScrollProgress] = useState<number>(0);

  const handleTelemetryScroll = () => {
    if (telemetryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = telemetryScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setTelemetryScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const scrollTelemetry = (direction: 'left' | 'right') => {
    if (telemetryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      telemetryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false);
        setIsCustomRangeModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const metricFilters = [
    'AQI',
    'PM2.5',
    'PM10',
    'PM1.0',
    'Temperature',
    'Humidity',
    'TVOC',
    'HCHO',
    'Mold Risk',
    'Virus Risk',
    'Thermal Comfort',
  ];

  // Logic to handle parameter selection (Allows selecting up to 2 parameters at once)
  const handleMetricClick = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
      }
    } else {
      if (selectedMetrics.length < 2) {
        setSelectedMetrics([...selectedMetrics, metric]);
      } else {
        setSelectedMetrics([selectedMetrics[0], metric]);
      }
    }
  };

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  const currentSubtitle = TIME_FILTER_OPTIONS.find((t) => t.label === timeFilter)?.subtitle || 'Averaged per hour';
  const chartData = generateTelemetryData(timeFilter);

  const primaryMetricName = selectedMetrics[0];
  const secondaryMetricName = selectedMetrics[1];

  const primaryConfig = primaryMetricName ? METRIC_CONFIGS[primaryMetricName] : null;
  const secondaryConfig = secondaryMetricName ? METRIC_CONFIGS[secondaryMetricName] : null;

  const detections = [
    {
      id: 'd1',
      title: 'humidity imbalance',
      type: 'info',
      time: '5d ago',
      details: 'Humidity outside optimal range: 3 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd2',
      title: 'humidity imbalance',
      type: 'info',
      time: '5d ago',
      details: 'Humidity outside optimal range: 4 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd3',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 4 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd4',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 4 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd5',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 4 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd6',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 4 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd7',
      title: 'deteriorating aq',
      type: 'warning',
      time: '6d ago',
      details: 'AQ score declining: 97 → 81 → 54',
      severity: 'warning',
    },
    {
      id: 'd8',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 3 of last 4 readings',
      severity: 'info',
    },
    {
      id: 'd9',
      title: 'pm25 spike',
      type: 'warning',
      time: '6d ago',
      details: 'PM2.5 spike: 36.4 vs baseline avg 16.3',
      severity: 'warning',
    },
    {
      id: 'd10',
      title: 'humidity imbalance',
      type: 'info',
      time: '6d ago',
      details: 'Humidity outside optimal range: 3 of last 4 readings',
      severity: 'info',
    },
  ];

  const roomAlerts = alerts.filter((a) => a.roomName === room.name || a.roomName === room.code);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 select-none">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <button
              onClick={onBack}
              className="hover:text-[#217C70] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Rooms</span>
            </button>
            <span>/</span>
            <span>Generic</span>
            <span>/</span>
            <span className="text-slate-600 font-bold">{room.code}</span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>{room.name}</span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Optimal
            </span>
          </h1>
        </div>

        {/* Top Right Action Pills */}
        <div className="flex items-center gap-3">
          {/* Refresh Status Badge */}
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>30 min ago</span>
          </div>
        </div>
      </div>

      {/* 2. TOP HERO ROW: ENVIRONMENT STATUS CARD (45%) + DIAGNOSTIC INSIGHTS CARD (55%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6 items-stretch">
        {/* LEFT CARD (45%): ENVIRONMENT STATUS CARD */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#D9F4F1] via-[#F4FCFC] to-white border border-white/90 shadow-md shadow-teal-950/5 flex flex-col justify-between">
          {/* Header Row: Environment Status (Left) & Optimal Chip (Right) */}
          <div className="flex items-center justify-between pb-3 border-b border-teal-100/60">
            <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 tracking-wider uppercase">
              Environment Status
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optimal</span>
            </span>
          </div>

          {/* Body: Circular Progress Bar (Left) + 3 Vertical Metric Cards (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-center mt-3">
            {/* Left: SVG Circular Ring Gauge */}
            <div className="relative w-36 h-36 mx-auto sm:mx-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-100"
                  strokeWidth="7.5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#0D9488] transition-all duration-1000 ease-out"
                  strokeWidth="7.5"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - room.aqiScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Score Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{room.aqiScore}</span>
                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">POINTS</span>
              </div>
            </div>

            {/* Right: Vertical Line / Stack of 3 Sensor Metric Cards */}
            <div className="flex flex-col gap-2">
              {/* Card 1: Temperature */}
              <div className="p-2.5 rounded-xl bg-white/90 border border-white/90 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Thermometer className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      TEMPERATURE
                    </span>
                    <span className="text-xs font-black text-slate-900 block">
                      {room.sensors.temp} °C / {(room.sensors.temp * 1.8 + 32).toFixed(1)} °F
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  High
                </span>
              </div>

              {/* Card 2: Humidity */}
              <div className="p-2.5 rounded-xl bg-white/90 border border-white/90 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      HUMIDITY
                    </span>
                    <span className="text-xs font-black text-slate-900 block">
                      {room.sensors.humidity} %
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Optimal</span>
                </span>
              </div>

              {/* Card 3: PM 2.5 */}
              <div className="p-2.5 rounded-xl bg-white/90 border border-white/90 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#217C70] flex items-center justify-center shrink-0">
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      PM 2.5
                    </span>
                    <span className="text-xs font-black text-slate-900 block">
                      {room.sensors.pm25} µg/m³
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Optimal</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (55%): DIAGNOSTIC INSIGHTS CARD (DESIGNED LIKE "TOP ROOMS" CARD ON DASHBOARD) */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm flex flex-col justify-between space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#217C70]" />
              <span>DIAGNOSTIC INSIGHTS</span>
            </h3>
            <span className="text-xs font-semibold text-[#217C70]">Live Analysis</span>
          </div>

          {/* Banner 1: Amber - WHAT IS HAPPENING */}
          <div className="p-3 bg-white/80 backdrop-blur-md border border-amber-200/90 rounded-2xl shadow-sm hover:shadow-md hover:bg-amber-50/90 transition-all duration-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black tracking-wider text-amber-800 uppercase block">
                WHAT IS HAPPENING
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Air quality status is <strong className="text-emerald-700 font-bold">Good</strong>.
              </p>
            </div>
          </div>

          {/* Banner 2: Gray - WHY IT IS HAPPENING */}
          <div className="p-3 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">
                WHY IT IS HAPPENING
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Current conditions appear within normal operating envelope.
              </p>
            </div>
          </div>

          {/* Banner 3: Blue - WHAT MAY HAPPEN NEXT */}
          <div className="p-3 bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-sky-50/80 transition-all duration-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black tracking-wider text-sky-600 uppercase block">
                WHAT MAY HAPPEN NEXT
              </span>
              <p className="text-xs font-bold text-sky-950 mt-0.5">
                Trends remain stable for the next hour.
              </p>
            </div>
          </div>

          {/* Banner 4: Emerald - RECOMMENDED ACTION + "Open Alerts" BUTTON */}
          <div className="p-3.5 rounded-2xl bg-[#064E3B] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700/70 text-emerald-300 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-wider text-emerald-300 uppercase block">
                  RECOMMENDED ACTION
                </span>
                <p className="text-xs font-extrabold text-white mt-0.5">
                  Continue monitoring. No active intervention required.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveRoute('alerts')}
              className="px-3.5 py-1.5 rounded-xl bg-white text-[#064E3B] font-extrabold text-xs hover:bg-emerald-50 transition-colors shadow-2xs shrink-0 self-end sm:self-auto"
            >
              Open Alerts
            </button>
          </div>
        </div>
      </div>

      {/* LIVE TELEMETRY SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">
            LIVE TELEMETRY
          </h3>
        </div>

        <div className="relative group">
          {/* Scrollable Metric Cards Container */}
          <div
            ref={telemetryScrollRef}
            onScroll={handleTelemetryScroll}
            className="flex items-center gap-3.5 overflow-x-auto pb-2 custom-theme-scrollbar scroll-smooth select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { label: 'AQI', value: room?.sensors?.aqi ?? 18, unit: '', icon: '🌡️' },
              { label: 'CO₂', value: room?.sensors?.co2 ? `${room.sensors.co2}` : '—', unit: 'ppm', icon: '🌫️' },
              { label: 'PM2.5', value: room?.sensors?.pm25 ?? 11, unit: 'µg/m³', icon: '🔬' },
              { label: 'PM10', value: room?.sensors?.pm10 ?? 12, unit: 'µg/m³', icon: '🔬' },
              { label: 'PM1.0', value: '8', unit: 'µg/m³', icon: '🔬' },
              { label: 'Temperature', value: room?.sensors?.temp ?? 24.9, unit: '°C', icon: '🌡️' },
              { label: 'Humidity', value: room?.sensors?.humidity ?? 52, unit: '%', icon: '💧' },
              { label: 'TVOC', value: '0', unit: '', icon: '🧪' },
              { label: 'HCHO', value: '20.1', unit: 'ppb', icon: '🧪' },
              { label: 'O₃', value: '—', unit: 'ppm', icon: '🌫️' },
              { label: 'NO₂', value: '—', unit: 'ppb', icon: '🌫️' },
              { label: 'SO₂', value: '—', unit: 'ppb', icon: '🌫️' },
              { label: 'CO', value: '—', unit: 'ppm', icon: '🌫️' },
              { label: 'Noise', value: '—', unit: 'dBA', icon: '🔊' },
              { label: 'Mold Risk', value: '0.0', unit: '', icon: '🦠' },
              { label: 'Virus Risk', value: '3.0', unit: '', icon: '🦠' },
              { label: 'Thermal Comfort', value: '0.2', unit: '', icon: '🌡️' },
            ].map((item, index) => (
              <div
                key={index}
                className="w-[135px] min-w-[135px] h-[105px] bg-white rounded-2xl border border-slate-200/70 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-3.5 flex flex-col items-center justify-between shrink-0"
              >
                {/* Icon */}
                <div className="text-lg flex items-center justify-center h-6">
                  {item.icon}
                </div>

                {/* Value & Unit */}
                <div className="flex items-baseline justify-center gap-0.5 text-center">
                  <span className="text-base font-black text-slate-800 tracking-tight">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="text-xs font-bold text-slate-500 tracking-tight text-center truncate w-full">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Scroll Track with Left & Right Arrow Controls */}
          <div className="flex items-center gap-2 pt-1 px-1">
            <button
              onClick={() => scrollTelemetry('left')}
              className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              aria-label="Scroll Left"
            >
              <span className="text-[10px] font-black select-none">◄</span>
            </button>

            <div
              className="relative flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                if (telemetryScrollRef.current) {
                  const maxScroll = telemetryScrollRef.current.scrollWidth - telemetryScrollRef.current.clientWidth;
                  telemetryScrollRef.current.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
                }
              }}
            >
              <div
                className="absolute top-0 bottom-0 bg-slate-500/80 hover:bg-slate-600 rounded-full transition-all duration-150"
                style={{
                  width: '30%',
                  left: `${telemetryScrollProgress * 0.7}%`,
                }}
              />
            </div>

            <button
              onClick={() => scrollTelemetry('right')}
              className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              aria-label="Scroll Right"
            >
              <span className="text-[10px] font-black select-none">►</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. 2-COLUMN SECTION: DETAILED INSIGHTS GRAPH (40%) + HEAT MAP (60%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-6 items-stretch">
        {/* LEFT COLUMN (40%): DETAILED INSIGHTS & DUAL-PARAMETER INTERACTIVE CHART */}
        <div className="p-6 rounded-[2.2rem] bg-white/80 backdrop-blur-md border border-white/90 shadow-md flex flex-col justify-between space-y-5">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Detailed Insights</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{currentSubtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Time Filter Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-extrabold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-[110px]">{timeFilter}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Time Filter Dropdown & Custom Range Date Fields Popover */}
                {isTimeDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                    {!isCustomRangeModalOpen ? (
                      <div className="space-y-1">
                        {TIME_FILTER_OPTIONS.map((opt) => {
                          const isSelected = timeFilter === opt.label;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => {
                                if (opt.label === 'Custom Range') {
                                  setIsCustomRangeModalOpen(true);
                                } else {
                                  setTimeFilter(opt.label);
                                  setIsTimeDropdownOpen(false);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#E8F5E9] text-[#064E3B]'
                                  : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-4 h-4 text-[#064E3B]" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Custom Range Form Popover matching exact user reference image */
                      <div className="space-y-3">
                        <div className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#064E3B] text-xs font-black tracking-wide w-fit">
                          Custom Range
                        </div>
                        <div className="border-b border-slate-100 pb-1" />

                        {/* From Date */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">From</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customFromDate}
                              onChange={(e) => setCustomFromDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                              placeholder="DD-MM-YYYY"
                            />
                            <Calendar className="w-4 h-4 text-slate-700 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* To Date */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">To</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customToDate}
                              onChange={(e) => setCustomToDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                              placeholder="DD-MM-YYYY"
                            />
                            <Calendar className="w-4 h-4 text-slate-700 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            onClick={() => setIsCustomRangeModalOpen(false)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setTimeFilter(`Custom (${customFromDate} - ${customToDate})`);
                              setIsCustomRangeModalOpen(false);
                              setIsTimeDropdownOpen(false);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#04382A] text-white text-xs font-extrabold transition-colors shadow-2xs"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-extrabold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Recharts Dual Y-Axis Telemetry Trend Line Chart */}
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="time"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />

                {/* Left Y-Axis for Primary Selected Metric */}
                {primaryConfig && (
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                )}

                {/* Right Y-Axis for Secondary Selected Metric (if selected) */}
                {secondaryConfig && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                )}

                <Tooltip content={<CustomTooltip />} />

                {/* Primary Parameter Line (Left Axis) */}
                {primaryConfig && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={primaryConfig.id}
                    name={primaryConfig.label}
                    stroke={primaryConfig.color}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: primaryConfig.color, strokeWidth: 1.5, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: primaryConfig.color, stroke: '#ffffff', strokeWidth: 2.5 }}
                  />
                )}

                {/* Secondary Parameter Line (Right Axis) */}
                {secondaryConfig && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={secondaryConfig.id}
                    name={secondaryConfig.label}
                    stroke={secondaryConfig.color}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: secondaryConfig.color, strokeWidth: 1.5, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: secondaryConfig.color, stroke: '#ffffff', strokeWidth: 2.5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Filter Parameter Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {metricFilters.map((metric) => {
                const isSelected = selectedMetrics.includes(metric);
                return (
                  <button
                    key={metric}
                    onClick={() => handleMetricClick(metric)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#064E3B] text-white shadow-2xs ring-2 ring-[#064E3B]/20'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    {metric}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] font-semibold text-slate-400 text-center pt-0.5">
              {selectedMetrics.length === 1
                ? 'Pick a second parameter to compare it on a separate axis.'
                : `Comparing ${selectedMetrics[0]} & ${selectedMetrics[1]} on separate axes.`}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (60%): HEAT MAP SECTION MATCHING EXACT USER SCREENSHOT */}
        <div className="p-6 rounded-[2.2rem] bg-white/80 backdrop-blur-md border border-white/90 shadow-md flex flex-col justify-between space-y-4">
          {/* Heat Map Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Heat Map</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">AQI - September 2026 — 2-hour averages</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Month / Year Toggle */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200/60">
                <button
                  onClick={() => setHeatmapMode('Month')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                    heatmapMode === 'Month'
                      ? 'bg-[#064E3B] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setHeatmapMode('Year')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                    heatmapMode === 'Year'
                      ? 'bg-[#064E3B] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Year
                </button>
              </div>

              {/* Pagination Arrows */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200/90 hover:bg-slate-100 text-slate-600 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200/90 hover:bg-slate-100 text-slate-600 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-extrabold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Heatmap Grid Matrix Container with Explicit Inline CSS Grid Columns */}
          <div className="bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-slate-200/60 overflow-x-auto">
            <div className="min-w-[500px] space-y-1">
              {heatmapMode === 'Month' ? (
                HEATMAP_DATA.map((row) => (
                  <div key={row.hour} className="flex items-center gap-2">
                    <span className="w-10 text-[9px] font-semibold text-slate-400 text-right shrink-0">
                      {row.hour}
                    </span>
                    <div
                      className="flex-1 grid gap-[3px]"
                      style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}
                    >
                      {row.days.map((item, idx) => {
                        const isBlank = item.color === '#FFFFFF';
                        return (
                          <div
                            key={idx}
                            className={`w-full aspect-square rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${
                              isBlank
                                ? 'bg-slate-100/70 border border-slate-200/50'
                                : 'shadow-2xs'
                            }`}
                            style={{ backgroundColor: isBlank ? undefined : item.color }}
                            title={`Day ${item.day}, ${item.hour}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                HEATMAP_YEAR_DATA.map((row) => (
                  <div key={row.hour} className="flex items-center gap-2">
                    <span className="w-10 text-[9px] font-semibold text-slate-400 text-right shrink-0">
                      {row.hour}
                    </span>
                    <div
                      className="flex-1 grid gap-[3px]"
                      style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}
                    >
                      {row.months.map((item, idx) => {
                        const isBlank = item.color === '#FFFFFF';
                        return (
                          <div
                            key={idx}
                            className={`w-full aspect-square rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${
                              isBlank
                                ? 'bg-slate-100/70 border border-slate-200/50'
                                : 'shadow-2xs'
                            }`}
                            style={{ backgroundColor: isBlank ? undefined : item.color }}
                            title={`${item.label}, ${item.hour}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {/* X-Axis Labels Row */}
              <div className="flex items-center gap-2 pt-1.5">
                <span className="w-10 text-[9px] font-bold text-slate-400 text-right shrink-0">
                  {/* Empty space for alignment */}
                </span>
                <div
                  className="flex-1 grid gap-[3px] text-center"
                  style={{
                    gridTemplateColumns:
                      heatmapMode === 'Month' ? 'repeat(30, minmax(0, 1fr))' : 'repeat(12, minmax(0, 1fr))',
                  }}
                >
                  {heatmapMode === 'Month'
                    ? Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                        <span key={d} className="text-[9px] font-semibold text-slate-400">
                          {d}
                        </span>
                      ))
                    : MONTH_NAMES.map((m) => (
                        <span key={m} className="text-[9px] font-semibold text-slate-400">
                          {m}
                        </span>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Legend Row + Summary Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[11px] font-extrabold text-slate-500">
            {/* Color Badges Legend matching exact reference screenshot */}
            <div className="flex flex-wrap items-center gap-3 font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
                <span>Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#D97706]" />
                <span>Satisfactory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#EA580C]" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#DC2626]" />
                <span>Poor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#8B5CF6]" />
                <span>Very Poor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#800020]" />
                <span>Severe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#F1F5F9] border border-slate-200" />
                <span>No data</span>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="flex items-center gap-3 text-slate-600 font-extrabold self-end sm:self-auto">
              <span>Avg <strong className="text-slate-900 font-black">33</strong></span>
              <span>•</span>
              <span>Min <strong className="text-slate-900 font-black">0</strong></span>
              <span>•</span>
              <span>Max <strong className="text-slate-900 font-black">347</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM 2-COLUMN GRID: DETECTIONS & OPEN ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: DETECTIONS */}
        <div className="p-6 rounded-[2.2rem] bg-white/80 backdrop-blur-md border border-white/90 shadow-md space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            DETECTIONS
          </h3>

          {/* Scrollable Container displaying 4 items at a time with theme scrollbar */}
          <div className="max-h-[305px] overflow-y-auto pr-1.5 space-y-2.5 custom-theme-scrollbar">
            {detections.map((d) => {
              const isWarning = d.severity === 'warning';
              return (
                <div
                  key={d.id}
                  className={`p-3.5 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 ${
                    isWarning
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#EFF6FF] border-[#BFDBFE]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-extrabold ${
                          isWarning ? 'text-[#92400E]' : 'text-[#1E40AF]'
                        }`}
                      >
                        {d.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          isWarning
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#DBEAFE] text-[#1D4ED8]'
                        }`}
                      >
                        {d.type}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] font-semibold mt-1 ${
                        isWarning ? 'text-[#D97706]' : 'text-[#2563EB]'
                      }`}
                    >
                      {d.details}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold shrink-0 ${
                      isWarning ? 'text-[#D97706]' : 'text-[#60A5FA]'
                    }`}
                  >
                    {d.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: OPEN ALERTS */}
        <div className="p-6 rounded-[2.2rem] bg-white/80 backdrop-blur-md border border-white/90 shadow-md space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <span>OPEN ALERTS</span>
          </h3>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">
                Device Offline: SEI100A784250006
              </h4>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Last data 149 minutes ago on SEI100A784250006
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                just now
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-600 text-[10px] font-bold shrink-0">
              device_offline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
