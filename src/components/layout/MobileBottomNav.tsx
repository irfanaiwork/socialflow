import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Calendar,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    navigateTo,
    setIsQuickSearchOpen,
    queueItems,
    mediaItems
  } = useApp();

  const pendingCount = queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled').length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081226]/95 backdrop-blur-lg border-t border-[#142848] px-2 py-1.5 safe-area-pb flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
    >
      {/* 1. Dashboard */}
      <button
        onClick={() => navigateTo('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
          currentView === 'dashboard'
            ? 'text-sky-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 leading-none">Home</span>
      </button>

      {/* 2. Library */}
      <button
        onClick={() => navigateTo('library')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] relative ${
          currentView === 'library'
            ? 'text-sky-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FolderKanban className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 leading-none">Library</span>
        {mediaItems.length > 0 && (
          <span className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-sky-400" />
        )}
      </button>

      {/* 3. Center Action: Create Post */}
      <button
        onClick={() => navigateTo('create')}
        className="flex flex-col items-center justify-center -mt-4 p-2.5 bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full shadow-lg shadow-sky-500/30 active:scale-95 transition cursor-pointer"
        title="Create New Post / Pin"
        aria-label="Create Post"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* 4. Scheduled Posts / 24-Pin Scheduler */}
      <button
        onClick={() => navigateTo('scheduled')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] relative ${
          currentView === 'scheduled'
            ? 'text-sky-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 leading-none">Schedule</span>
        {pendingCount > 0 && (
          <span className="absolute top-0.5 right-1.5 text-[9px] font-bold px-1 rounded-full bg-sky-500 text-white leading-tight">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </button>

      {/* 5. Quick Search Trigger */}
      <button
        onClick={() => setIsQuickSearchOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition cursor-pointer min-w-[56px]"
        title="Open Quick Search (Ctrl+K)"
        aria-label="Quick Search"
      >
        <Search className="w-5 h-5 text-sky-400" />
        <span className="text-[10px] mt-0.5 leading-none">Search</span>
      </button>
    </nav>
  );
};
