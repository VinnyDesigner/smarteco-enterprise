import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { IAQGauge } from '../../visualizers/IAQGauge';
import { Share2, Plus, Copy, ExternalLink, Trash2, Calendar, Sliders, Check } from 'lucide-react';
import { ShareLink } from '../../../types/share.types';

export const ShareDashboardPage: React.FC = () => {
  const { shareLinks, rooms, createShareLink, deleteShareLink, showToast } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [liveViewLink, setLiveViewLink] = useState<ShareLink | null>(null);

  // Form State
  const [newLinkName, setNewLinkName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [selectedParams, setSelectedParams] = useState<string[]>([
    'AQI',
    'Temp',
    'Humidity',
    'PM2.5',
    'TVOC',
  ]);

  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/#share-${token}`;
    navigator.clipboard.writeText(url);
    showToast('Share link copied to clipboard!', 'success');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShareLink({
      name: newLinkName || 'Executive View',
      roomId: selectedRoomId,
      parametersList: selectedParams,
    });
    setNewLinkName('');
    setIsCreateModalOpen(false);
  };

  const toggleParam = (param: string) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Share dashboards</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create read-only views for selected rooms and parameters.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Share dashboard
        </Button>
      </div>

      {/* Share Links List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share links</h3>

        <div className="space-y-3">
          {shareLinks.map((link) => (
            <Card key={link.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/80">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 text-[#217C70] rounded-xl shrink-0 mt-0.5">
                  <Share2 className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">{link.name}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      {link.roomName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      {link.parametersCount} parameters
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Created {link.createdAt}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{link.expiresAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy(link.token)}
                >
                  Copy link
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => setLiveViewLink(link)}
                >
                  Open live view
                </Button>

                <button
                  onClick={() => deleteShareLink(link.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors border border-rose-200/60"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Share Link Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Read-Only Dashboard Link"
        subtitle="Expose real-time room telemetry to external auditors or executives"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSubmit}>
              Generate Share Link
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link Title / Label</label>
            <input
              type="text"
              required
              placeholder="e.g. Executive Boardroom Digest"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Room</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Exposed Telemetry Parameters</label>
            <div className="grid grid-cols-2 gap-2">
              {['AQI', 'Temp', 'Humidity', 'PM2.5', 'CO2', 'TVOC'].map((param) => {
                const isSelected = selectedParams.includes(param);
                return (
                  <button
                    key={param}
                    type="button"
                    onClick={() => toggleParam(param)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-[#217C70] text-[#217C70]'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{param}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>

      {/* Live Read-Only View Modal */}
      {liveViewLink && (
        <Modal
          isOpen={!!liveViewLink}
          onClose={() => setLiveViewLink(null)}
          title={`Read-Only Live View: ${liveViewLink.name}`}
          subtitle={`Simulated public view for ${liveViewLink.roomName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 p-2">
            <div className="p-4 bg-teal-500 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-100 font-semibold uppercase">SmartEco Public Portal</span>
                <h3 className="text-xl font-bold mt-0.5">{liveViewLink.roomName}</h3>
              </div>
              <IAQGauge score={96} size={54} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {liveViewLink.parametersList.map((param) => (
                <div key={param} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-400">{param}</span>
                  <div className="text-base font-bold text-slate-900 mt-1">Normal</div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">
                🔒 Read-only view powered by SmartEco Environmental Telemetry · Refreshing live
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
