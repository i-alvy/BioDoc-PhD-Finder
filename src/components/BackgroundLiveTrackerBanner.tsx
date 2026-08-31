import React, { useState } from 'react';
import { 
  BellRing, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  X, 
  RefreshCw, 
  Radio, 
  ShieldCheck,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { PhDProgram, Professor, UserProfile } from '../types';

export interface BackgroundLiveOpening {
  id: string;
  program: PhDProgram;
  matchScore: number;
  detectedAt: string;
  reasons: string[];
  isNew: boolean;
}

interface BackgroundLiveTrackerBannerProps {
  openings?: BackgroundLiveOpening[];
  newOpenings?: BackgroundLiveOpening[];
  profile?: UserProfile;
  lastScanTime?: string;
  lastCheckedTime?: string;
  isScanning?: boolean;
  isPolling?: boolean;
  onScanNow?: () => void;
  onTriggerInstantCheck?: () => void;
  onSelectOpening?: (program: PhDProgram) => void;
  onOpenProgram?: (program: PhDProgram) => void;
  onDismissOpening: (id: string) => void;
}

export const BackgroundLiveTrackerBanner: React.FC<BackgroundLiveTrackerBannerProps> = ({
  openings,
  newOpenings,
  lastScanTime,
  lastCheckedTime,
  isScanning,
  isPolling,
  onScanNow,
  onTriggerInstantCheck,
  onSelectOpening,
  onOpenProgram,
  onDismissOpening,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const displayOpenings = openings || newOpenings || [];
  const displayScanTime = lastScanTime || lastCheckedTime || 'Just now';
  const displayPolling = Boolean(isScanning || isPolling);
  const handleScan = onScanNow || onTriggerInstantCheck || (() => {});
  const handleOpen = onSelectOpening || onOpenProgram || (() => {});

  const unreadCount = displayOpenings.filter(o => o?.isNew).length;

  return (
    <div className="rounded-2xl bg-[#090e17] border border-cyan-500/25 p-4 sm:p-5 shadow-xl backdrop-blur-sm space-y-3">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Radio className={`h-4 w-4 ${displayPolling ? 'animate-pulse text-cyan-400' : 'text-cyan-400'}`} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-wide flex items-center space-x-1.5">
                <span>Autonomous Profile-Match Background Radar</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  LIVE ACTIVE
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
              <span>Continuously monitoring faculty lab openings & upcoming admission cycles.</span>
              <span className="text-slate-400">• Last scan: {displayScanTime}</span>
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleScan}
            disabled={displayPolling}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121824] hover:bg-[#182132] text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${displayPolling ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{displayPolling ? 'Scanning Repositories...' : 'Scan Now'}</span>
          </button>

          {displayOpenings.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
            >
              {isExpanded ? 'Hide Alerts' : `Show (${unreadCount} New)`}
            </button>
          )}
        </div>
      </div>

      {/* Suggested New Openings Stream */}
      {isExpanded && displayOpenings.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span>RECENTLY DISCOVERED / PROFILE-MATCHED OPENINGS</span>
            <span>{displayOpenings.length} Suggested Opportunities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {displayOpenings.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#05070a] border border-cyan-500/20 hover:border-cyan-500/50 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">
                      {item.program.university}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                      {item.matchScore}% Match
                    </span>
                    {item.isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 truncate">
                    {item.program.title}
                  </p>

                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
                    <span>Rank #{item.program.usNewsRank}</span>
                    <span>•</span>
                    <span>{item.program.acceptanceRate.foreignStudents} Int'l Rate</span>
                    <span>•</span>
                    <span>Deadline: {item.program.deadline}</span>
                  </div>

                  {item.reasons && item.reasons.length > 0 && (
                    <p className="text-[10px] text-cyan-400/90 line-clamp-1 italic">
                      Matched: {item.reasons[0]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onDismissOpening(item.id)}
                    className="text-slate-400 hover:text-slate-200 p-1"
                    title="Dismiss alert"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpen(item.program)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold transition cursor-pointer"
                  >
                    <span>View</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
