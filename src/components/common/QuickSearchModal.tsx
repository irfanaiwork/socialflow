import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp, ActiveNavTab } from '../../context/AppContext';
import {
  Search,
  X,
  Sparkles,
  Calendar,
  Layers,
  FolderKanban,
  FileSpreadsheet,
  Cloud,
  PlusCircle,
  LayoutDashboard,
  Bookmark,
  Share2,
  Youtube,
  Bot,
  BarChart3,
  ScrollText,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Command
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'actions' | 'navigation' | 'queue' | 'media';

interface SearchResultItem {
  id: string;
  category: 'action' | 'navigation' | 'queue' | 'media';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  action: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    navigateTo,
    queueItems,
    mediaItems,
    googleDrive,
    syncGoogleDrive,
    settings,
    updateSettings,
    setIsCsvModalOpen,
    setIsBulkDriveModalOpen,
    setIsUpdateModalOpen,
    appVersion
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened & reset search
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled in parent/navbar
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Built-in actions
  const quickActions: SearchResultItem[] = useMemo(() => [
    {
      id: 'act_bulk_drive_ai',
      category: 'action',
      title: 'Google Drive Bulk Ingestion & AI Auto-Generator',
      subtitle: 'Analyze bulk Drive images with AI vision to generate titles, descriptions & hashtags',
      badge: 'Vision AI',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
      icon: Cloud,
      iconColor: 'text-sky-400',
      action: () => {
        onClose();
        setIsBulkDriveModalOpen(true);
      }
    },
    {
      id: 'act_schedule_24',
      category: 'action',
      title: 'Schedule 24 Pins via AI Today',
      subtitle: 'Open high-speed natural language AI batch scheduler',
      badge: 'High Speed',
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
      icon: Sparkles,
      iconColor: 'text-sky-400',
      action: () => {
        navigateTo('scheduled');
        onClose();
      }
    },
    {
      id: 'act_bulk_csv',
      category: 'action',
      title: 'Bulk CSV Spreadsheet Uploader',
      subtitle: 'Upload spreadsheet with titles, links & auto-queue 100+ pins',
      badge: 'Batch Tool',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      icon: FileSpreadsheet,
      iconColor: 'text-emerald-400',
      action: () => {
        onClose();
        setIsCsvModalOpen(true);
      }
    },
    {
      id: 'act_create_post',
      category: 'action',
      title: 'Create Single Post / Pin',
      subtitle: 'Compose manually or with AI caption assist for Pinterest & Facebook',
      badge: 'Editor',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
      icon: PlusCircle,
      iconColor: 'text-blue-400',
      action: () => {
        navigateTo('create');
        onClose();
      }
    },
    {
      id: 'act_sync_drive',
      category: 'action',
      title: 'Sync Google Drive Media',
      subtitle: `Scan connected folder (${googleDrive.name}) for new photos & videos`,
      badge: `${googleDrive.filesCount} assets`,
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
      icon: Cloud,
      iconColor: 'text-sky-400',
      action: () => {
        syncGoogleDrive();
        onClose();
      }
    },
    {
      id: 'act_toggle_demo',
      category: 'action',
      title: settings.demoMode ? 'Switch to Production API Mode' : 'Switch to Sandbox Simulation Mode',
      subtitle: settings.demoMode ? 'Enable real API keys & network dispatch' : 'Enable local sandbox execution environment',
      badge: settings.demoMode ? 'Demo' : 'Live',
      badgeColor: settings.demoMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      icon: Sparkles,
      iconColor: 'text-amber-400',
      action: () => {
        updateSettings({ demoMode: !settings.demoMode });
        onClose();
      }
    },
    {
      id: 'act_check_update',
      category: 'action',
      title: `Check Software Updates (${appVersion.currentVersion})`,
      subtitle: appVersion.hasUpdate ? `Update ${appVersion.latestVersion} is ready to apply` : 'Software is up to date',
      badge: appVersion.hasUpdate ? 'Update Available' : 'Current',
      badgeColor: appVersion.hasUpdate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-300',
      icon: Clock,
      iconColor: 'text-emerald-400',
      action: () => {
        onClose();
        setIsUpdateModalOpen(true);
      }
    }
  ], [navigateTo, onClose, setIsCsvModalOpen, googleDrive, syncGoogleDrive, settings.demoMode, updateSettings, appVersion, setIsUpdateModalOpen]);

  // Navigation targets
  const navigationItems: SearchResultItem[] = useMemo(() => [
    { id: 'nav_dashboard', category: 'navigation', title: 'Dashboard', subtitle: 'Overview metrics, live activity & quick stats', icon: LayoutDashboard, action: () => { navigateTo('dashboard'); onClose(); } },
    { id: 'nav_library', category: 'navigation', title: 'Content Library', subtitle: 'Browse uploaded graphics, SVG vectors & Google Drive media', icon: FolderKanban, action: () => { navigateTo('library'); onClose(); } },
    { id: 'nav_scheduled', category: 'navigation', title: 'Scheduled Calendar & 24-Pin AI', subtitle: 'Calendar views and automated daily slot scheduler', icon: Calendar, action: () => { navigateTo('scheduled'); onClose(); } },
    { id: 'nav_queue', category: 'navigation', title: 'Publishing Queue', subtitle: `${queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled').length} items awaiting publication`, icon: Layers, action: () => { navigateTo('queue'); onClose(); } },
    { id: 'nav_pinterest', category: 'navigation', title: 'Pinterest Accounts & Boards', subtitle: 'Account connections, boards list, and sync health', icon: Bookmark, action: () => { navigateTo('pinterest'); onClose(); } },
    { id: 'nav_facebook', category: 'navigation', title: 'Facebook Pages & Distribution', subtitle: 'Manage pages, gap spacing rules, and rate limits', icon: Share2, action: () => { navigateTo('facebook'); onClose(); } },
    { id: 'nav_youtube', category: 'navigation', title: 'YouTube Shorts Integration', subtitle: 'Upload and schedule short-form viral videos', icon: Youtube, action: () => { navigateTo('youtube'); onClose(); } },
    { id: 'nav_ai', category: 'navigation', title: 'AI Content Generator', subtitle: 'Visual analysis and SEO prompt profile builder', icon: Sparkles, action: () => { navigateTo('ai'); onClose(); } },
    { id: 'nav_automation', category: 'navigation', title: 'Automation Rules Engine', subtitle: 'Configure autonomous Google Drive to Social rules', icon: Bot, action: () => { navigateTo('automation'); onClose(); } },
    { id: 'nav_analytics', category: 'navigation', title: 'Analytics & Reports', subtitle: 'Traffic, engagement & outbound click statistics', icon: BarChart3, action: () => { navigateTo('analytics'); onClose(); } },
    { id: 'nav_logs', category: 'navigation', title: 'Activity Logs', subtitle: 'Audit log of automated publications & sync events', icon: ScrollText, action: () => { navigateTo('logs'); onClose(); } },
    { id: 'nav_settings', category: 'navigation', title: 'Settings & Cloud API Keys', subtitle: 'Google Drive, Meta, Pinterest, and YouTube credentials', icon: Settings, action: () => { navigateTo('settings'); onClose(); } }
  ], [navigateTo, onClose, queueItems]);

  // Queue item results
  const queueResults: SearchResultItem[] = useMemo(() => {
    return queueItems.map(item => ({
      id: `queue_${item.id}`,
      category: 'queue',
      title: item.title || 'Untitled Post',
      subtitle: `${item.platform.toUpperCase()} • ${item.scheduledTime || item.createdAt} • ${item.status}`,
      badge: item.status,
      badgeColor: item.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400',
      icon: Clock,
      iconColor: item.status === 'Published' ? 'text-emerald-400' : 'text-sky-400',
      action: () => {
        navigateTo('queue');
        onClose();
      }
    }));
  }, [queueItems, navigateTo, onClose]);

  // Media item results
  const mediaResults: SearchResultItem[] = useMemo(() => {
    return mediaItems.map(item => ({
      id: `media_${item.id}`,
      category: 'media',
      title: item.fileName,
      subtitle: item.aiAnalysis?.mainTopic || `${item.mediaType} • ${item.fileSize}`,
      badge: item.status,
      badgeColor: 'bg-zinc-800 text-zinc-300',
      icon: FolderKanban,
      iconColor: 'text-slate-400',
      action: () => {
        navigateTo('library');
        onClose();
      }
    }));
  }, [mediaItems, navigateTo, onClose]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    let pool: SearchResultItem[] = [];
    if (selectedCategory === 'all') {
      pool = [...quickActions, ...navigationItems, ...queueResults, ...mediaResults];
    } else if (selectedCategory === 'actions') {
      pool = quickActions;
    } else if (selectedCategory === 'navigation') {
      pool = navigationItems;
    } else if (selectedCategory === 'queue') {
      pool = queueResults;
    } else if (selectedCategory === 'media') {
      pool = mediaResults;
    }

    if (!q) {
      return pool.slice(0, 12);
    }

    return pool.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }).slice(0, 16);
  }, [query, selectedCategory, quickActions, navigationItems, queueResults, mediaResults]);

  // Keyboard navigation inside results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-[#081226] border border-[#1a335a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#142848] flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Quick search pins, media, actions, or type 'schedule'..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0d1c3a] border border-[#1a335a] rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-3.5 py-2.5 bg-[#060e1f]/90 border-b border-[#142848] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Results' },
              { id: 'actions', label: 'Quick Actions' },
              { id: 'navigation', label: 'Pages' },
              { id: 'queue', label: 'Scheduled Pins' },
              { id: 'media', label: 'Media' }
            ] as const
          ).map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1a35]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 max-h-[55vh]">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
              <p className="text-sm font-semibold text-slate-300">No matching results found for "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for "schedule", "pins", "csv", "drive", or "dark mode".</p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f244c] border border-sky-500/40 text-white'
                      : 'hover:bg-[#0b1b38] text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg bg-[#071329] border border-[#142848] shrink-0 ${item.iconColor || 'text-sky-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-[#060e1f] border-t border-[#142848] text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#0d1c3a] border border-[#1a335a] rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-[#0d1c3a] border border-[#1a335a] rounded text-[10px] font-mono">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#0d1c3a] border border-[#1a335a] rounded text-[10px] font-mono">↵</kbd> to select
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Press <kbd className="px-1 py-0.5 bg-[#0d1c3a] border border-[#1a335a] rounded text-[10px]">Esc</kbd> to exit
          </div>
        </div>
      </div>
    </div>
  );
};
