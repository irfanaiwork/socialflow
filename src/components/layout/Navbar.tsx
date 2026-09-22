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
  Menu,
  DownloadCloud,
  FileSpreadsheet,
  Search,
  Command
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
    mediaItems,
    appVersion,
    setIsUpdateModalOpen,
    setIsCsvModalOpen,
    setIsQuickSearchOpen
  } = useApp();

  const pendingCount = queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled').length;
  const readyMediaCount = mediaItems.filter(m => m.status === 'Ready').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#081226]/90 backdrop-blur-md border-b border-[#142848] px-3 sm:px-5 flex items-center justify-between gap-2">
      {/* Left side: Mobile menu toggle + Project Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-[#0e1d38] rounded-xl transition"
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
          className="flex items-center gap-2 group shrink-0"
          title="Visit Irfan Gulzar Portfolio (irfangulzar.com)"
        >
          <img
            src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
            alt="Irfan Gulzar"
            className="h-7 sm:h-8 w-auto object-contain max-w-[120px] sm:max-w-[140px]"
          />
          <div className="hidden sm:block pl-2 border-l border-[#1b345c]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-tight text-white">SocialFlow</span>
              <span className="text-[9px] font-semibold text-sky-400 bg-sky-950/80 border border-sky-500/30 px-1.5 py-0.2 rounded uppercase">
                AI CRM
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Content Automation</p>
          </div>
        </a>

        {/* DEMO MODE Pill (Desktop only) */}
        <div className="ml-1 hidden xl:flex items-center gap-2">
          <button
            onClick={() => updateSettings({ demoMode: !settings.demoMode })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border transition-all ${
              settings.demoMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
            }`}
            title="Click to toggle Demo Mode"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${settings.demoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{settings.demoMode ? 'SANDBOX MODE' : 'LIVE API'}</span>
          </button>
        </div>
      </div>

      {/* Center: Desktop Quick Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2">
        <button
          onClick={() => setIsQuickSearchOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-[#060e1f] hover:bg-[#0c1c38] border border-[#1a335a] hover:border-sky-500/50 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer shadow-inner group"
          title="Quick search pins, media, and tools (Ctrl + K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Quick search pins, tools, media...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#09152b] border border-[#1b345c] rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right side controls: Mobile Search + Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Quick Search Button */}
        <button
          onClick={() => setIsQuickSearchOpen(true)}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-[#0e1d38] border border-[#1a335a] rounded-xl transition cursor-pointer"
          title="Quick Search (Ctrl+K)"
          aria-label="Quick Search"
        >
          <Search className="w-4 h-4 text-sky-400" />
        </button>

        {/* Update Notification Pill */}
        {appVersion.hasUpdate && (
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-emerald-950/80 to-[#0b2447] hover:from-emerald-900/90 hover:to-[#0f3263] border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
            title="Update available! Click to review"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Update</span>
            <span className="text-[10px] font-mono bg-emerald-500/20 px-1 py-0.2 rounded text-emerald-300">
              {appVersion.latestVersion}
            </span>
          </button>
        )}

        {/* Bulk CSV Upload Quick Button (Desktop) */}
        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09152b] hover:bg-[#112347] border border-[#1a335a] hover:border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="Upload CSV Spreadsheet for Bulk Pin Scheduling"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bulk CSV</span>
        </button>

        {/* Quick Batch AI Scheduler (Desktop) */}
        <button
          onClick={() => navigateTo('scheduled')}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1730] hover:bg-[#12254a] border border-[#1a335a] hover:border-sky-500/40 text-sky-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="Schedule 24 Pins Today via AI Instruction"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>AI 24-Pin</span>
        </button>

        {/* Quick Create Post button (Responsive text) */}
        <button
          onClick={() => navigateTo('create')}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/25 transition cursor-pointer active:scale-95"
          title="Create New Post / Pin"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Create Post</span>
          <span className="sm:hidden">Post</span>
        </button>

        {/* User avatar / portfolio session */}
        <a
          href="https://irfangulzar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center pl-1 sm:pl-2 border-l border-[#1a335a]"
          title="Visit Irfan Gulzar Portfolio"
        >
          <img
            src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
            alt="Irfan Gulzar"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#1a335a] object-contain p-0.5 bg-[#050b14]"
          />
        </a>
      </div>
    </header>
  );
};

