import React from 'react';
import { 
  GraduationCap, 
  FileText, 
  Kanban, 
  Users, 
  ShieldCheck, 
  Bell, 
  Cloud, 
  Lock, 
  Sparkles,
  Search
} from 'lucide-react';
import { AppNotification, EncryptionConfig } from '../types';

interface NavbarProps {
  activeTab: 'programs' | 'profile' | 'tracker' | 'professors' | 'security';
  setActiveTab: (tab: 'programs' | 'profile' | 'tracker' | 'professors' | 'security') => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenCVUpload: () => void;
  encryptionConfig: EncryptionConfig;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenCVUpload,
  encryptionConfig,
  cloudSyncStatus,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('programs')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center">
              <div className="h-full w-full bg-[#070b12] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">BioDoc</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  PhD & Labs
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">USA & Europe Bioinformatics / Structural Biology</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0c111a] p-1 rounded-xl border border-slate-800/90 shadow-inner">
            <button
              id="nav-tab-programs"
              onClick={() => setActiveTab('programs')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'programs'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>PhD Openings</span>
            </button>

            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>CV & Profile</span>
            </button>

            <button
              id="nav-tab-tracker"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Application Tracker</span>
            </button>

            <button
              id="nav-tab-professors"
              onClick={() => setActiveTab('professors')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'professors'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>PI & Lab Directory</span>
            </button>

            <button
              id="nav-tab-security"
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Security & Sync</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick CV Upload Button */}
            <button
              id="btn-quick-cv-upload"
              onClick={onOpenCVUpload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Upload CV</span>
              <span className="sm:hidden">CV</span>
            </button>

            {/* Cloud Sync & Encryption Badge */}
            <button
              id="btn-cloud-sync-status"
              onClick={() => setActiveTab('security')}
              title={encryptionConfig.isEnabled ? "AES-256 Encrypted & Cloud Synced" : "Cloud Sync Active"}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-[#0e141f] border border-slate-700/80 text-slate-300 hover:border-cyan-500/40 transition"
            >
              <Lock className={`h-3 w-3 ${encryptionConfig.isEnabled ? 'text-cyan-400' : 'text-slate-400'}`} />
              <Cloud className={`h-3 w-3 ${cloudSyncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-[11px]">
                {encryptionConfig.isEnabled ? 'AES-256' : 'Cloud'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white bg-[#0e141f] hover:bg-slate-800 border border-slate-700/80 transition"
              title="Notifications & Upcoming Deadlines"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
              activeTab === 'programs' ? 'text-cyan-300 bg-cyan-500/15 font-bold' : 'text-slate-400'
            }`}
          >
            Openings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
              activeTab === 'profile' ? 'text-cyan-300 bg-cyan-500/15 font-bold' : 'text-slate-400'
            }`}
          >
            CV & Profile
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
              activeTab === 'tracker' ? 'text-cyan-300 bg-cyan-500/15 font-bold' : 'text-slate-400'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => setActiveTab('professors')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
              activeTab === 'professors' ? 'text-cyan-300 bg-cyan-500/15 font-bold' : 'text-slate-400'
            }`}
          >
            Professors
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
              activeTab === 'security' ? 'text-cyan-300 bg-cyan-500/15 font-bold' : 'text-slate-400'
            }`}
          >
            Sync & Crypto
          </button>
        </div>
      </div>
    </header>
  );
};
