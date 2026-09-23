import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Bell, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    alerts,
    acknowledgeAlert,
    resolveAlert,
    setActiveRoute,
  } = useApp();

  const openAlerts = alerts.filter((a) => a.status === 'open');

  return (
    <Drawer
      isOpen={isNotificationOpen}
      onClose={() => setIsNotificationOpen(false)}
      title="Notification Center"
      subtitle={`${openAlerts.length} open alert requiring attention`}
    >
      <div className="space-y-4">
        {openAlerts.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h4 className="text-base font-semibold text-slate-800">All Systems Nominal</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              There are no active warning or critical alerts across monitored rooms.
            </p>
          </div>
        ) : (
          openAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.lastDataAge}</p>
                  </div>
                </div>
                <Badge variant={alert.severity === 'critical' ? 'critical' : 'warning'} size="sm">
                  {alert.sensor}
                </Badge>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
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
            </div>
          ))
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsNotificationOpen(false);
              setActiveRoute('alerts');
            }}
          >
            View All Incident Logs →
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
