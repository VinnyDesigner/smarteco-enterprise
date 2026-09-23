import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Settings, Bell, Thermometer, ShieldCheck, Check } from 'lucide-react';

export const PreferencesPage: React.FC = () => {
  const { showToast } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [refreshInterval, setRefreshInterval] = useState('30');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Preferences</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure personal notification channels, display units, and system defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <Card className="p-6 space-y-4 border border-slate-200/80">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#217C70]" />
            <h3 className="text-base font-bold text-slate-900">Notification Alerts</h3>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-xl">
              <div>
                <span className="font-semibold text-slate-800">Email Incident Digests</span>
                <p className="text-xs text-slate-500">Receive instant email notifications when warning or critical thresholds breach.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#217C70] rounded focus:ring-[#217C70]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-xl">
              <div>
                <span className="font-semibold text-slate-800">In-Browser Real-Time Alerts</span>
                <p className="text-xs text-slate-500">Show floating toast notifications when devices change status.</p>
              </div>
              <input
                type="checkbox"
                checked={browserNotifications}
                onChange={(e) => setBrowserNotifications(e.target.checked)}
                className="w-4 h-4 text-[#217C70] rounded focus:ring-[#217C70]"
              />
            </label>
          </div>
        </Card>

        {/* Display Units */}
        <Card className="p-6 space-y-4 border border-slate-200/80">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Thermometer className="w-5 h-5 text-[#217C70]" />
            <h3 className="text-base font-bold text-slate-900">Telemetry Display Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Temperature Unit</label>
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value as 'C' | 'F')}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none bg-white"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telemetry Refresh Interval</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none bg-white"
              >
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" icon={<Check className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
