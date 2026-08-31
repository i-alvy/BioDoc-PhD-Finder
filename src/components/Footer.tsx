import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Dna, 
  GraduationCap, 
  ShieldCheck, 
  Database, 
  Code2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface FooterProps {
  onOpenBootloader?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBootloader }) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-[#06090e]/95 backdrop-blur-md text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
          {/* Brand & Mission */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Dna className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-white tracking-wide">
                BioDoc PhD Intelligence & Matchmaker
              </span>
            </div>
            <p className="text-slate-400 text-[11px] max-w-md">
              Automating academic discovery, laboratory matching, Statement of Purpose synthesis, and faculty cold emails for doctoral applicants in Structural Biology, Biophysics, and Bioinformatics.
            </p>
          </div>

          {/* Quick Metrics / Capabilities */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#0c1016] border border-slate-800 flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>150+ Top PhD Programs</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#0c1016] border border-slate-800 flex items-center space-x-1.5">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Automated AI SOP & Cold Email</span>
            </div>
            {onOpenBootloader && (
              <button
                type="button"
                onClick={onOpenBootloader}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition cursor-pointer flex items-center space-x-1"
              >
                <span>Replay Bootloader</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Requested Signature Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs sm:text-sm font-medium text-slate-300 flex items-center space-x-1.5">
            <span>Designed and Made By</span>
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white font-bold">
              Raghib Ishraq Alvy
            </strong>
            <span className="text-rose-500 inline-block animate-pulse">with ❤️</span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-3">
            <span>Fall 2026 / 2027 Cohort Cycle</span>
            <span>•</span>
            <span>All Data Fully Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
