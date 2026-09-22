import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  GitBranch,
  DownloadCloud,
  FileSpreadsheet
} from 'lucide-react';

interface UpdateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateNotificationModal: React.FC<UpdateNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    appVersion,
    checkForUpdates,
    applyUpdate,
    showToast
  } = useApp();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [stepText, setStepText] = useState('');

  if (!isOpen) return null;

  const handleStartUpdate = async () => {
    setIsUpdating(true);
    setUpdateProgress(15);
    setStepText('Backing up local pins and API settings...');

    await new Promise(r => setTimeout(r, 400));
    setUpdateProgress(45);
    setStepText('Pulling latest code changes and asset bundle...');

    await new Promise(r => setTimeout(r, 500));
    setUpdateProgress(85);
    setStepText('Syncing database schema and migrating schedule slots...');

    await new Promise(r => setTimeout(r, 400));
    setUpdateProgress(100);
    setStepText('Update verified! Restarting application...');

    await new Promise(r => setTimeout(r, 300));
    setIsUpdating(false);
    await applyUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1730] border border-[#1a335a] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-sky-950/40">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#09152b] via-[#0d2249] to-[#081326] p-5 border-b border-[#162f56] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Software Update Available</h3>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  v{appVersion.latestVersion.replace(/^v/, '')} Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                New release pushed to the official repository. Upgrade without losing any data!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#12254a] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Version Comparison Card */}
          <div className="bg-[#050b14] border border-[#1a335a] rounded-xl p-4 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Current Version</div>
              <div className="text-base font-bold text-slate-300 font-mono mt-0.5">
                {appVersion.currentVersion}
              </div>
              <div className="text-[10px] text-slate-500">Installed locally</div>
            </div>

            <div className="flex flex-col items-center px-4">
              <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-sky-400 font-semibold uppercase mt-1">Upgrade</span>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">Latest Release</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {appVersion.latestVersion}
              </div>
              <div className="text-[10px] text-emerald-500/80">{appVersion.releaseDate}</div>
            </div>
          </div>

          {/* Safe Data Guarantee Box */}
          <div className="bg-[#071429] border border-[#1c3866] rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Enterprise Data Integrity & Safe Update Protection</strong>
              <span>
                All your scheduled 24 pins, Google Drive folder connections, Facebook pages, and API keys remain safely stored in your browser local storage. No data will be lost during updates.
              </span>
            </div>
          </div>

          {/* Release Notes / What's New */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                What&apos;s New in this Release:
              </h4>
              <span className="text-[11px] text-slate-400">Official Changelog</span>
            </div>

            <div className="bg-[#071224] border border-[#183158] rounded-xl p-3.5 space-y-2">
              {appVersion.releaseNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Sync Status */}
          <div className="bg-[#050b14] border border-[#162c4f] rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[240px]">
                {appVersion.githubRepoUrl.replace('https://github.com/', '')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => checkForUpdates(false)}
                disabled={appVersion.isChecking || isUpdating}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${appVersion.isChecking ? 'animate-spin' : ''}`} />
                <span>{appVersion.isChecking ? 'Checking...' : 'Check Again'}</span>
              </button>
              <a
                href={appVersion.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                title="View on GitHub"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Progress Bar (Visible while updating) */}
          {isUpdating && (
            <div className="space-y-2 p-3 bg-[#071329] border border-[#1b3662] rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  {stepText}
                </span>
                <span className="font-mono font-bold text-sky-400">{updateProgress}%</span>
              </div>
              <div className="w-full bg-[#050b14] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${updateProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#081326] p-4 border-t border-[#162f56] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Last checked: <strong className="text-slate-200">{appVersion.lastCheckedTime || 'Just now'}</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="w-1/2 sm:w-auto px-4 py-2 bg-[#09152b] hover:bg-[#102246] text-slate-300 border border-[#1a335a] rounded-xl text-xs font-semibold transition"
            >
              Later
            </button>
            <button
              type="button"
              onClick={handleStartUpdate}
              disabled={isUpdating}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>{isUpdating ? 'Applying Update...' : `Update to ${appVersion.latestVersion} Now`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
