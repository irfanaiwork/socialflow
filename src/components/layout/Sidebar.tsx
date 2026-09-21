import React from 'react';
import { useApp, ActiveNavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  PenSquare,
  Calendar,
  Layers,
  Sparkles,
  Bot,
  BarChart3,
  ScrollText,
  Settings,
  Share2,
  Bookmark,
  Youtube,
  Radio,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, navigateTo, queueItems, mediaItems } = useApp();

  const pendingQueueCount = queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled').length;
  const readyMediaCount = mediaItems.filter(m => m.status === 'Ready').length;

  const navItems: { id: ActiveNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'Content Library', icon: FolderKanban, badge: readyMediaCount, badgeColor: 'bg-zinc-800 text-zinc-300' },
    { id: 'create', label: 'Create Post', icon: PenSquare },
    { id: 'scheduled', label: 'Scheduled Posts', icon: Calendar },
    { id: 'queue', label: 'Publishing Queue', icon: Layers, badge: pendingQueueCount, badgeColor: 'bg-blue-500/20 text-blue-400' },
    { id: 'pinterest', label: 'Pinterest', icon: Bookmark },
    { id: 'facebook', label: 'Facebook Pages', icon: Share2 },
    { id: 'youtube', label: 'YouTube Shorts', icon: Youtube },
    { id: 'ai', label: 'AI Content Generator', icon: Sparkles },
    { id: 'automation', label: 'Automation Rules', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Activity Logs', icon: ScrollText },
    { id: 'integrations', label: 'API Integrations', icon: Radio },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-[#081226] border-r border-[#142848] p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile close button & brand */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#142848]">
            <img
              src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
              alt="Irfan Gulzar"
              className="h-6 w-auto object-contain"
            />
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 to-blue-600/20 text-sky-400 border border-sky-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#0d1c3a] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-[#0e2142] text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info: Centralized Automation Engine Status & Creator Tag */}
        <div className="pt-4 border-t border-[#142848] space-y-3">
          <div className="bg-[#0b1730]/90 border border-[#1a335a] rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-200">Central Engine Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Autonomous multi-account gap distributor & AI batch scheduler running.
            </p>
          </div>

          <a
            href="https://irfangulzar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[11px] text-slate-400 hover:text-sky-300 transition py-1"
          >
            Founder: <strong className="text-white">IrfanX</strong> • <span className="text-sky-400 underline underline-offset-2">irfangulzar.com</span>
          </a>
        </div>
      </aside>
    </>
  );
};
