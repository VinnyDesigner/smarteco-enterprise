import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { IAQGauge } from '../../visualizers/IAQGauge';
import { MapPin, Pencil, Plus, Search } from 'lucide-react';
import { Room } from '../../../types/room.types';
import { RoomDetailPage } from './RoomDetailPage';

export const RoomsPage: React.FC = () => {
  const { rooms, addRoom, editRoom } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form State
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomLocation, setNewRoomLocation] = useState('');

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoom({
      name: newRoomName || 'New Room',
      code: `ROOM-0${rooms.length + 1}`,
      location: newRoomLocation || 'Main Campus',
    });
    setNewRoomName('');
    setNewRoomLocation('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      editRoom(editingRoom.id, {
        name: editingRoom.name,
        code: editingRoom.code,
        location: editingRoom.location,
      });
      setEditingRoom(null);
    }
  };

  // If a room is selected, render the dedicated RoomDetailPage view
  if (selectedRoom) {
    return (
      <RoomDetailPage
        room={selectedRoom}
        onBack={() => setSelectedRoom(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rooms</h2>
          <p className="text-xs text-slate-500 mt-0.5">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="good" dot>
            {rooms.filter((r) => r.reportingStatus === 'reporting').length} reporting
          </Badge>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Room
          </Button>
        </div>
      </div>

      {/* Search Input (Glassmorphic) */}
      <div className="relative max-w-md flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-400 flex items-center justify-center">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search rooms by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#217C70]/30 focus:bg-white/95 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Room Grid (Glassmorphic Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isYellowGauge = room.aqiScore < 80 && room.aqiScore >= 50;
          const isRedGauge = room.aqiScore < 50;

          const lightTrailGradient = isRedGauge
            ? 'from-transparent via-[#B91C1C] via-[#EF4444] via-[#FCA5A5] via-[#EF4444] via-[#B91C1C] to-transparent'
            : isYellowGauge
              ? 'from-transparent via-[#D97706] via-[#F59E0B] via-[#FBBF24] via-[#F59E0B] via-[#D97706] to-transparent'
              : 'from-transparent via-[#047857] via-[#10B981] via-[#00E676] via-[#10B981] via-[#047857] to-transparent';

          return (
            <Card
              key={room.id}
              hoverable
              onClick={() => setSelectedRoom(room)}
              className="relative overflow-hidden p-5 bg-white/75 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-xl hover:bg-white/90 hover:scale-[1.015] hover:-translate-y-1 rounded-3xl transition-all duration-300 cursor-pointer group"
            >
              {/* Header: Name, Code, Edit Icon, AQI Gauge */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#217C70] transition-colors">
                        {room.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRoom(room);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                        title="Edit room"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{room.code}</span>
                  </div>
                </div>

                <div>
                  <IAQGauge score={room.aqiScore} size={48} />
                </div>
              </div>

              {/* Badges: Good / Stale / Relative Time */}
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={room.aqiScore >= 80 ? 'good' : room.aqiScore >= 50 ? 'warning' : 'critical'} size="sm">
                  {room.aqiScore >= 80 ? 'Good' : room.aqiScore >= 50 ? 'Moderate' : 'Poor'}
                </Badge>
                <Badge variant="stale" size="sm" dot>
                  stale
                </Badge>
                <span className="text-xs text-slate-400 ml-auto">{room.lastUpdated}</span>
              </div>

              {/* Sensor Telemetry Matrix */}
              <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex justify-between pr-3">
                  <span className="text-slate-400">AQI</span>
                  <span className="font-bold text-slate-800">{room.sensors.aqi}</span>
                </div>
                <div className="flex justify-between pl-3 border-l border-slate-200/60">
                  <span className="text-slate-400">CO₂</span>
                  <span className="font-bold text-slate-800">
                    {room.sensors.co2 !== null ? `${room.sensors.co2} ppm` : '—'}
                  </span>
                </div>
                <div className="flex justify-between pr-3">
                  <span className="text-slate-400">Temp</span>
                  <span className="font-bold text-slate-800">{room.sensors.temp} °C</span>
                </div>
                <div className="flex justify-between pl-3 border-l border-slate-200/60">
                  <span className="text-slate-400">Humidity</span>
                  <span className="font-bold text-slate-800">{room.sensors.humidity} %</span>
                </div>
                <div className="flex justify-between pr-3">
                  <span className="text-slate-400">PM2.5</span>
                  <span className="font-bold text-slate-800">{room.sensors.pm25} µg/m³</span>
                </div>
                <div className="flex justify-between pl-3 border-l border-slate-200/60">
                  <span className="text-slate-400">TVOC</span>
                  <span className="font-bold text-slate-800">{room.sensors.tvoc}</span>
                </div>
              </div>

              {/* Alert Tag Pills at Bottom */}
              {room.alertTags.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 pb-1">
                  {room.alertTags.map((tag, idx) => (
                    <Badge key={idx} variant="tag" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs text-slate-400 font-medium ml-1">+7</span>
                </div>
              )}

              {/* Bottom Light Trail matching Gauge Color */}
              <div
                className={`absolute inset-x-0 bottom-0 h-[2px] z-10 pointer-events-none opacity-80 bg-gradient-to-r ${lightTrailGradient}`}
              />
            </Card>
          );
        })}
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Monitored Room"
        subtitle="Specify room metadata and initial location mapping"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit}>
              Create Room
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Room Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Conference Room B"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Floor</label>
            <input
              type="text"
              placeholder="e.g. Building A - Floor 2"
              value={newRoomLocation}
              onChange={(e) => setNewRoomLocation(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Edit Room Modal */}
      {editingRoom && (
        <Modal
          isOpen={!!editingRoom}
          onClose={() => setEditingRoom(null)}
          title={`Edit ${editingRoom.name}`}
          subtitle="Update room metadata and baseline location"
          footer={
            <>
              <Button variant="outline" onClick={() => setEditingRoom(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Name</label>
              <input
                type="text"
                value={editingRoom.name}
                onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={editingRoom.location}
                onChange={(e) => setEditingRoom({ ...editingRoom, location: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
