import React from 'react';
import { 
  X, 
  Bell, 
  Calendar, 
  Sparkles, 
  Check, 
  CheckCheck, 
  Trash2, 
  ShieldCheck,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'recommendation':
      case 'match_alert':
        return <Sparkles className="h-4 w-4 text-teal-400" />;
      case 'profile_update':
        return <Check className="h-4 w-4 text-emerald-400" />;
      case 'security':
      case 'system':
        return <ShieldCheck className="h-4 w-4 text-cyan-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#05070a]/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1016] border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#0c1016] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Notifications & Alerts</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#070a0f] text-cyan-300 border border-slate-800">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-5 py-2.5 bg-[#070a0f] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="hover:text-cyan-300 flex items-center space-x-1 transition cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>

          <button
            type="button"
            onClick={onClearNotifications}
            className="hover:text-rose-400 flex items-center space-x-1 transition cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear list</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
              <Bell className="h-8 w-8 text-slate-600" />
              <p className="text-xs font-medium">No alerts at this moment</p>
              <p className="text-[11px]">Upcoming deadlines and fit updates will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                  n.read
                    ? 'bg-[#070a0f]/60 border-slate-800/80 text-slate-400'
                    : 'bg-[#121824] border-slate-700 text-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-[#070a0f] border border-slate-800">
                      {getIcon(n.type)}
                    </div>
                    <span className="text-xs font-bold text-white">{n.title}</span>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-7">{n.message}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pl-7 pt-1">
                  <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {n.daysUntilDeadline !== undefined && (
                    <span className="font-mono text-amber-400 font-semibold">
                      {n.daysUntilDeadline <= 0 ? 'Due Today' : `${n.daysUntilDeadline} days remaining`}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0c1016] text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
