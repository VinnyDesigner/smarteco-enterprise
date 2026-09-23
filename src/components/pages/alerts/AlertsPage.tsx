import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { MetricCard } from '../../common/MetricCard';
import { ShieldAlert, CheckCircle2, AlertOctagon, Eye } from 'lucide-react';
import { AlertStatus, AlertSeverity } from '../../../types/alert.types';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const openCount = alerts.filter((a) => a.status === 'open').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'acknowledged').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Alerts</h2>
        <p className="text-xs text-slate-500 mt-0.5">177 total alerts</p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          value={openCount}
          label="Open"
          icon={<ShieldAlert className="w-6 h-6 text-rose-600" />}
          variant="critical"
          active={statusFilter === 'open'}
          onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
        />

        <MetricCard
          value={acknowledgedCount}
          label="Acknowledged"
          icon={<Eye className="w-6 h-6 text-amber-600" />}
          variant="amber"
          active={statusFilter === 'acknowledged'}
          onClick={() => setStatusFilter(statusFilter === 'acknowledged' ? 'all' : 'acknowledged')}
        />

        <MetricCard
          value={176}
          label="Resolved"
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          variant="good"
          active={statusFilter === 'resolved'}
          onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
        />

        <MetricCard
          value={criticalCount}
          label="Critical"
          icon={<AlertOctagon className="w-6 h-6 text-rose-700" />}
          variant="critical"
          active={severityFilter === 'critical'}
          onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#217C70]"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Severity</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#217C70]"
          >
            <option value="all">All</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="p-5 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{alert.lastDataAge}</p>
                {alert.description && (
                  <p className="text-xs text-slate-600 mt-1 font-mono">{alert.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="stale" size="sm">
                  {alert.sensor}
                </Badge>
                <Badge
                  variant={
                    alert.status === 'open'
                      ? 'open'
                      : alert.status === 'acknowledged'
                      ? 'moderate'
                      : 'resolved'
                  }
                  size="sm"
                >
                  {alert.status}
                </Badge>
              </div>
            </div>

            {/* Sub Meta Info & Trigger Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>Sensor: <strong className="text-slate-800">{alert.sensor}</strong></span>
              {alert.currentValue !== undefined && (
                <span>Value: <strong className="text-slate-800">{alert.currentValue}</strong></span>
              )}
              <span>Threshold: <strong className="text-slate-800">{alert.thresholdValue}</strong></span>
              <span>Triggered: <strong className="text-slate-800">{alert.triggeredAt}</strong></span>
              <span>Last: <strong className="text-slate-800">{alert.lastSeenAt}</strong></span>
            </div>

            {/* Action Buttons if Open */}
            {alert.status === 'open' && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            )}

            {alert.status === 'resolved' && alert.resolvedAt && (
              <div className="pt-2 text-xs text-emerald-700 font-medium">
                Resolved {alert.resolvedAt}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
