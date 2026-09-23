import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { SlidersHorizontal, Radio } from 'lucide-react';
import { SensorThreshold } from '../../../types/threshold.types';

export const ThresholdsPage: React.FC = () => {
  const { thresholds, customizeThreshold } = useApp();
  const [selectedSensorFilter, setSelectedSensorFilter] = useState<string>('all');
  const [customizingThreshold, setCustomizingThreshold] = useState<SensorThreshold | null>(null);

  const [warnMaxInput, setWarnMaxInput] = useState<string>('');
  const [critMaxInput, setCritMaxInput] = useState<string>('');

  const filteredThresholds = thresholds.filter((t) => {
    if (selectedSensorFilter !== 'all' && t.sensorKey !== selectedSensorFilter) return false;
    return true;
  });

  const handleOpenCustomize = (t: SensorThreshold) => {
    setCustomizingThreshold(t);
    setWarnMaxInput(t.warnMax !== null ? String(t.warnMax) : '');
    setCritMaxInput(t.critMax !== null ? String(t.critMax) : '');
  };

  const handleCustomizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customizingThreshold) {
      customizeThreshold(
        customizingThreshold.id,
        warnMaxInput ? Number(warnMaxInput) : null,
        critMaxInput ? Number(critMaxInput) : null
      );
      setCustomizingThreshold(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Alerts Thresholds</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure warning and critical thresholds for each sensor.
          </p>
        </div>

        <div>
          <select
            value={selectedSensorFilter}
            onChange={(e) => setSelectedSensorFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#217C70]"
          >
            <option value="all">All Sensors</option>
            <option value="aqi">AQI</option>
            <option value="co2">CO₂</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="pm1">PM1.0</option>
          </select>
        </div>
      </div>

      {/* Threshold Cards */}
      <div className="space-y-4">
        {filteredThresholds.map((threshold) => (
          <Card key={threshold.id} className="p-5 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-[#217C70]" />
              <h3 className="text-base font-bold text-slate-900">
                {threshold.sensorName} {threshold.unit && <span className="text-xs font-normal text-slate-400">({threshold.unit})</span>}
              </h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs flex-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Profile
                  </span>
                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    {threshold.profileName}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Warn Min
                  </span>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {threshold.warnMin !== null ? threshold.warnMin : '—'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Warn Max
                  </span>
                  <div className="text-xs font-semibold text-amber-700 mt-1">
                    {threshold.warnMax !== null ? threshold.warnMax : '—'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Crit Min
                  </span>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {threshold.critMin !== null ? threshold.critMin : '—'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Crit Max
                  </span>
                  <div className="text-xs font-semibold text-rose-700 mt-1">
                    {threshold.critMax !== null ? threshold.critMax : '—'}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenCustomize(threshold)}
                >
                  Customize
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Customize Threshold Modal */}
      {customizingThreshold && (
        <Modal
          isOpen={!!customizingThreshold}
          onClose={() => setCustomizingThreshold(null)}
          title={`Customize ${customizingThreshold.sensorName} Limits`}
          subtitle="Override profile default warning and critical limits"
          footer={
            <>
              <Button variant="outline" onClick={() => setCustomizingThreshold(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCustomizeSubmit}>
                Save Thresholds
              </Button>
            </>
          }
        >
          <form onSubmit={handleCustomizeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warning Maximum Threshold ({customizingThreshold.unit || 'units'})
              </label>
              <input
                type="number"
                value={warnMaxInput}
                onChange={(e) => setWarnMaxInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Critical Maximum Threshold ({customizingThreshold.unit || 'units'})
              </label>
              <input
                type="number"
                value={critMaxInput}
                onChange={(e) => setCritMaxInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
