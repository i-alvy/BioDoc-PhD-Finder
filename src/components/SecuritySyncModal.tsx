import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Cloud, 
  RefreshCw, 
  Download, 
  Upload, 
  Bell, 
  Check, 
  AlertCircle, 
  Loader2,
  HardDrive,
  Eye,
  EyeOff
} from 'lucide-react';
import { EncryptionConfig, UserProfile, ApplicationItem } from '../types';
import { sendTestDeadlineNotification, requestNotificationPermission } from '../utils/notifications';

interface SecuritySyncModalProps {
  encryptionConfig: EncryptionConfig;
  onUpdateEncryptionConfig: (config: EncryptionConfig) => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  onSyncNow: () => Promise<void>;
  onRestoreFromCloud: () => Promise<void>;
  profile: UserProfile;
  applications: ApplicationItem[];
  onImportData: (data: { profile?: UserProfile; applications?: ApplicationItem[] }) => void;
}

export const SecuritySyncModal: React.FC<SecuritySyncModalProps> = ({
  encryptionConfig,
  onUpdateEncryptionConfig,
  cloudSyncStatus,
  onSyncNow,
  onRestoreFromCloud,
  profile,
  applications,
  onImportData,
}) => {
  const [passphrase, setPassphrase] = useState(encryptionConfig.passphrase || '');
  const [enableEncryption, setEnableEncryption] = useState(encryptionConfig.isEnabled);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleSaveSecurity = () => {
    if (enableEncryption && !passphrase.trim()) {
      setStatusMessage({ text: 'Please provide an encryption passphrase to enable AES-256.', type: 'error' });
      return;
    }

    onUpdateEncryptionConfig({
      isEnabled: enableEncryption,
      passphrase: passphrase.trim(),
      lastSyncTimestamp: new Date().toISOString(),
    });

    setStatusMessage({
      text: enableEncryption
        ? 'AES-GCM 256-bit encryption successfully configured for all candidate data & sync payloads.'
        : 'Cloud sync updated without client-side encryption.',
      type: 'success',
    });

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      await onSyncNow();
      setStatusMessage({ text: 'Cloud synchronization completed successfully!', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Sync failed. Check connection.', type: 'error' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setStatusMessage(null);
    try {
      await onRestoreFromCloud();
      setStatusMessage({ text: 'Profile & Application state restored from encrypted cloud backup!', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Restore failed.', type: 'error' });
    } finally {
      setIsRestoring(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleRequestPushNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    if (granted) {
      sendTestDeadlineNotification();
      setStatusMessage({ text: 'Push notifications enabled! Sent test deadline alert.', type: 'success' });
    } else {
      setStatusMessage({ text: 'Notification permission was not granted by your browser.', type: 'error' });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExportData = () => {
    const dataToExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      applications,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioDoc_PhD_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile || parsed.applications) {
          onImportData({
            profile: parsed.profile,
            applications: parsed.applications,
          });
          setStatusMessage({ text: 'Backup data imported successfully!', type: 'success' });
        } else {
          throw new Error('Invalid BioDoc backup file format.');
        }
      } catch (err: any) {
        setStatusMessage({ text: err.message || 'Failed to read backup file.', type: 'error' });
      }
      setTimeout(() => setStatusMessage(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Security, Encryption & Cloud Synchronization</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Protect your confidential research proposals, CV metadata, GPA, and professor correspondences with client-side cryptography.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center space-x-2 animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* 1. Client-Side AES-GCM Encryption Settings */}
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Zero-Knowledge AES-GCM 256-bit Encryption</h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableEncryption}
              onChange={(e) => setEnableEncryption(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When enabled, your profile data, research records, and application status notes are encrypted in your browser using <strong>PBKDF2 key derivation (100,000 iterations) and AES-GCM 256-bit ciphers</strong> before sync. The server stores ciphertext and cannot inspect your personal data.
        </p>

        {enableEncryption && (
          <div className="p-4 rounded-xl bg-[#070a0f] border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Master Encryption Passphrase
            </label>
            <div className="relative">
              <Key className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter strong zero-knowledge passphrase..."
                className="w-full bg-[#0c1016] border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Keep this passphrase safe. If you sync from another browser or device, entering this same passphrase will decrypt your profile.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSecurity}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm cursor-pointer"
          >
            Save Encryption Configuration
          </button>
        </div>
      </div>

      {/* 2. Cloud Profile Synchronization */}
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Seamless Cloud Profile Synchronization</h2>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold border ${
            cloudSyncStatus === 'synced'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
          }`}>
            Status: {cloudSyncStatus === 'synced' ? 'Online & In Sync' : 'Local Updates Pending'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Sync your customized profile, GPA, research history, shortlisted universities, and faculty correspondence notes securely to the cloud backend.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#121824] hover:bg-[#182132] text-white border border-slate-700 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <RefreshCw className="h-4 w-4 text-cyan-400" />}
            <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestore}
            disabled={isRestoring}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#070a0f] hover:bg-[#121824] text-slate-200 border border-slate-800 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isRestoring ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <HardDrive className="h-4 w-4 text-slate-400" />}
            <span>{isRestoring ? 'Restoring...' : 'Restore from Cloud'}</span>
          </button>
        </div>
      </div>

      {/* 3. Push Notifications Engine */}
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Browser Push Notifications</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Permission: <strong className="text-cyan-300 uppercase">{notificationPermission}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Receive active push alerts for upcoming PhD application deadlines (at 30 days, 14 days, and 3 days before submission), interview dates, and AI recommendation updates.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRequestPushNotifications}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span>Enable Push Notifications & Send Test Alert</span>
          </button>
        </div>
      </div>

      {/* 4. Local File Backup & Portability */}
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <HardDrive className="h-5 w-5 text-cyan-400" />
          <span>Local Backup & Portability</span>
        </h2>
        <p className="text-xs text-slate-300">
          Export an offline JSON snapshot of your complete PhD tracking history, drafted cold emails, and research profile.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#070a0f] hover:bg-[#121824] text-slate-200 border border-slate-800 transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Export Backup JSON</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#070a0f] hover:bg-[#121824] text-slate-200 border border-slate-800 transition cursor-pointer">
            <Upload className="h-4 w-4 text-cyan-400" />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
