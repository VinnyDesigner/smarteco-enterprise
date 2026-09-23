import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Cpu, CheckCircle2, Link2, Clock, Pencil, ArrowRightLeft } from 'lucide-react';
import { Device } from '../../../types/device.types';
import CardBg from '../../../assets/Card bg.png';

export const DevicesPage: React.FC = () => {
  const { devices, rooms, reassignDevice, editDevice } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'unassigned' | 'stale'>('all');
  const [reassigningDevice, setReassigningDevice] = useState<Device | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [targetRoomId, setTargetRoomId] = useState<string>('');

  // Edit Modal Form State
  const [editDeviceCode, setEditDeviceCode] = useState<string>('');
  const [editDisplayName, setEditDisplayName] = useState<string>('');
  const [editIndustry, setEditIndustry] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('active');

  const totalCount = devices.length;
  const activeCount = devices.filter((d) => d.status === 'active').length;
  const unassignedCount = devices.filter((d) => d.status === 'unassigned').length;
  const staleCount = devices.filter((d) => d.status === 'stale').length;

  const filteredDevices = devices.filter((d) => {
    if (activeTab === 'active') return d.status === 'active';
    if (activeTab === 'unassigned') return d.status === 'unassigned';
    if (activeTab === 'stale') return d.status === 'stale';
    return true;
  });

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reassigningDevice) {
      reassignDevice(reassigningDevice.id, targetRoomId || null);
      setReassigningDevice(null);
    }
  };

  const openEditModal = (device: Device) => {
    setEditingDevice(device);
    setEditDeviceCode(device.serialNumber);
    setEditDisplayName(device.id);
    setEditIndustry('');
    setEditStatus(device.status);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDevice) {
      editDevice(editingDevice.id, {
        serialNumber: editDeviceCode || editingDevice.serialNumber,
        id: editDisplayName || editingDevice.id,
        status: editStatus as any,
      });
      setEditingDevice(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Devices</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage and monitor connected devices</p>
      </div>

      {/* 4 Summary Cards - Dashboard Glass Aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Devices */}
        <div
          onClick={() => setActiveTab('all')}
          className={`relative overflow-hidden p-5 rounded-3xl border shadow-md flex flex-col justify-between group bg-white/50 min-h-[140px] metric-card-popup cursor-pointer ${
            activeTab === 'all' ? 'border-[#217C70] ring-2 ring-[#217C70]/20' : 'border-white/90'
          }`}
        >
          <img
            src={CardBg}
            alt="Metric Card Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0 opacity-70 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xs z-0 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-100/90 text-[#217C70] flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-350 border border-teal-200/50">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100/90 text-[#217C70] border border-teal-200">
              All
            </span>
          </div>

          <div className="relative z-10 mt-4">
            <span className="text-xs font-bold text-slate-600 block">Total Devices</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {totalCount}
            </div>
            <span className="text-[11px] text-[#217C70] font-semibold block mt-0.5">
              {activeCount} active
            </span>
          </div>
        </div>

        {/* Card 2: Online */}
        <div
          onClick={() => setActiveTab('active')}
          className={`relative overflow-hidden p-5 rounded-3xl border shadow-md flex flex-col justify-between group bg-white/50 min-h-[140px] metric-card-popup cursor-pointer ${
            activeTab === 'active' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/90'
          }`}
        >
          <img
            src={CardBg}
            alt="Metric Card Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0 opacity-70 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xs z-0 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-350 border border-emerald-200/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
              Online
            </span>
          </div>

          <div className="relative z-10 mt-4">
            <span className="text-xs font-bold text-slate-600 block">Online</span>
            <div className="text-3xl font-black text-emerald-600 tracking-tight mt-0.5">
              {activeCount}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              0 offline / maintenance
            </span>
          </div>
        </div>

        {/* Card 3: Unassigned */}
        <div
          onClick={() => setActiveTab('unassigned')}
          className={`relative overflow-hidden p-5 rounded-3xl border shadow-md flex flex-col justify-between group bg-white/50 min-h-[140px] metric-card-popup cursor-pointer ${
            activeTab === 'unassigned' ? 'border-slate-400 ring-2 ring-slate-400/20' : 'border-white/90'
          }`}
        >
          <img
            src={CardBg}
            alt="Metric Card Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0 opacity-70 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xs z-0 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-slate-100/90 text-slate-600 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-350 border border-slate-200/50">
              <Link2 className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <span className="text-xs font-bold text-slate-600 block">Unassigned</span>
            <div className="text-3xl font-black text-slate-700 tracking-tight mt-0.5">
              {unassignedCount}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5 truncate">
              no room assigned
            </span>
          </div>
        </div>

        {/* Card 4: Stale / No Data */}
        <div
          onClick={() => setActiveTab('stale')}
          className={`relative overflow-hidden p-5 rounded-3xl border shadow-md flex flex-col justify-between group bg-white/50 min-h-[140px] metric-card-popup cursor-pointer ${
            activeTab === 'stale' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/90'
          }`}
        >
          <img
            src={CardBg}
            alt="Metric Card Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0 opacity-70 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xs z-0 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-350 border border-amber-200/50">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <span className="text-xs font-bold text-slate-600 block">Stale / No Data</span>
            <div className="text-3xl font-black text-amber-600 tracking-tight mt-0.5">
              {staleCount}
            </div>
            <span className="text-[11px] text-amber-800/80 font-semibold block mt-0.5">
              no recent readings
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
        {[
          { id: 'all', label: `All (${totalCount})` },
          { id: 'active', label: `Active (${activeCount})` },
          { id: 'unassigned', label: `Unassigned (${unassignedCount})` },
          { id: 'stale', label: `Stale (${staleCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
              activeTab === tab.id
                ? 'bg-[#217C70] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="p-5 border border-slate-200/80">
            {/* Device Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{device.id}</h3>
                  <Badge variant={device.status === 'active' ? 'active' : 'stale'} size="sm">
                    {device.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">{device.serialNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{device.lastSeen}</span>
                <Badge variant="good" size="sm">
                  {device.airQualityStatus}
                </Badge>
              </div>
            </div>

            {/* Room Mapping & Action Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span>Room: </span>
                <span className="font-bold text-[#217C70]">
                  {device.roomName || 'Unassigned'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setTargetRoomId(device.roomId || '');
                    setReassigningDevice(device);
                  }}
                >
                  Reassign
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Pencil className="w-3.5 h-3.5" />}
                  onClick={() => openEditModal(device)}
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Sensor Pill Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {device.sensors.aqi !== undefined && (
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                  AQI <span className="font-bold text-slate-900">{device.sensors.aqi}</span>
                </span>
              )}
              {device.sensors.pm25 !== undefined && (
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                  PM2.5 <span className="font-bold text-slate-900">{device.sensors.pm25} µg/m³</span>
                </span>
              )}
              {device.sensors.temp !== undefined && (
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                  Temperature <span className="font-bold text-slate-900">{device.sensors.temp} °C</span>
                </span>
              )}
              {device.sensors.humidity !== undefined && (
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                  Humidity <span className="font-bold text-slate-900">{device.sensors.humidity} %</span>
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Reassign Device Modal */}
      {reassigningDevice && (
        <Modal
          isOpen={!!reassigningDevice}
          onClose={() => setReassigningDevice(null)}
          title={`Reassign ${reassigningDevice.id}`}
          subtitle={`Assign serial ${reassigningDevice.serialNumber} to a room`}
          footer={
            <>
              <Button variant="outline" onClick={() => setReassigningDevice(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReassignSubmit}>
                Confirm Reassignment
              </Button>
            </>
          }
        >
          <form onSubmit={handleReassignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Room</label>
              <select
                value={targetRoomId}
                onChange={(e) => setTargetRoomId(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
              >
                <option value="">Unassigned (No Room)</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Device Modal - Exactly matching screenshot design */}
      {editingDevice && (
        <Modal
          isOpen={!!editingDevice}
          onClose={() => setEditingDevice(null)}
          title="Edit Device"
          subtitle={
            <span className="text-xs text-slate-500">
              Update the details of <strong className="font-bold text-slate-900">{editingDevice.id}</strong>.
            </span>
          }
          footer={
            <>
              <Button variant="outline" onClick={() => setEditingDevice(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
            {/* Device Code (Required) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Device Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editDeviceCode}
                onChange={(e) => setEditDeviceCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#217C70] focus:outline-none shadow-2xs"
              />
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Must be unique. This is the identifier used by the device to send telemetry.
              </p>
            </div>

            {/* Display Name (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none shadow-2xs"
              />
            </div>

            {/* Industry (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Industry <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. education, retail, hospitality"
                value={editIndustry}
                onChange={(e) => setEditIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none shadow-2xs placeholder:text-slate-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none shadow-2xs capitalize"
              >
                <option value="active">Active</option>
                <option value="unassigned">Unassigned</option>
                <option value="stale">Stale</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
