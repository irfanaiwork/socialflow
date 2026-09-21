import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Cloud,
  PlusCircle,
  RefreshCw,
  Zap,
  Globe,
  CheckCircle2,
  Menu
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    settings,
    updateSettings,
    googleDrive,
    syncGoogleDrive,
    navigateTo,
    queueItems,
    mediaItems
  } = useApp();

  const pendingCount = queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled').length;
  const readyMediaCount = mediaItems.filter(m => m.status === 'Ready').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#081226]/90 backdrop-blur-md border-b border-[#142848] px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + Project Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-[#0e1d38] rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Irfan Gulzar Brand Logo */}
        <a
          href="https://irfangulzar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 group"
          title="Visit Irfan Gulzar Portfolio (irfangulzar.com)"
        >
          <img
            src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
            alt="Irfan Gulzar"
            className="h-7 sm:h-8 w-auto object-contain max-w-[140px]"
          />
          <div className="hidden sm:block pl-2.5 border-l border-[#1b345c]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-tight text-white">SocialFlow</span>
              <span className="text-[9px] font-semibold text-sky-400 bg-sky-950/80 border border-sky-500/30 px-1.5 py-0.5 rounded uppercase">
                AI CRM
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">High-Speed Content Automation</p>
          </div>
        </a>

        {/* DEMO MODE Pill */}
        <div className="ml-3 hidden sm:flex items-center gap-2">
          <button
            onClick={() => updateSettings({ demoMode: !settings.demoMode })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all ${
              settings.demoMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
            }`}
            title="Click to toggle Demo Mode"
          >
            <span className={`w-2 h-2 rounded-full ${settings.demoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{settings.demoMode ? 'ZERO-BUDGET DEMO' : 'LIVE API MODE'}</span>
          </button>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Batch AI Scheduler */}
        <button
          onClick={() => navigateTo('scheduled')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1730] hover:bg-[#12254a] border border-[#1a335a] hover:border-sky-500/40 text-sky-300 rounded-xl text-xs font-semibold transition"
          title="Schedule 24 Pins Today via AI Instruction"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>AI 24-Pin Scheduler</span>
        </button>

        {/* Google Drive Status & Quick Sync */}
        <div className="hidden lg:flex items-center gap-2 bg-[#09152b] border border-[#1a335a] rounded-xl px-2.5 py-1.5">
          <Cloud className={`w-4 h-4 ${googleDrive.isConnected ? 'text-sky-400' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-[11px] text-slate-200 font-medium leading-none flex items-center gap-1">
              <span>Drive:</span>
              <span className="text-slate-400 truncate max-w-[90px]">{googleDrive.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 leading-none">{googleDrive.filesCount} assets detected</span>
          </div>
          <button
            onClick={syncGoogleDrive}
            className="p-1 hover:bg-[#122448] text-slate-400 hover:text-white rounded transition"
            title="Scan Google Drive for new media"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Create Post button (Irfan Gulzar Blue button style) */}
        <button
          onClick={() => navigateTo('create')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/25 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Post</span>
        </button>

        {/* User avatar / session */}
        <a
          href="https://irfangulzar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 pl-2 border-l border-[#1a335a]"
          title="Irfan Gulzar"
        >
          <img
            src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
            alt="Irfan Gulzar"
            className="w-8 h-8 rounded-lg border border-[#1a335a] object-contain p-0.5 bg-[#050b14]"
          />
        </a>
      </div>
    </header>
  );
};
