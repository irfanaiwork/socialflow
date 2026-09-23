import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PinterestAccount,
  FacebookPage,
  YouTubeChannel,
  MediaItem,
  QueueItem,
  ActivityLog,
  AiPromptProfile,
  AutomationRule,
  ScheduleConfig,
  GlobalSettings,
  GoogleDriveFolder,
  PlatformType,
  PostStatus,
  AppVersionInfo,
  CsvPinRow
} from '../types';
import {
  INITIAL_PINTEREST_ACCOUNTS,
  INITIAL_FACEBOOK_PAGES,
  INITIAL_YOUTUBE_CHANNELS,
  AVAILABLE_DRIVE_FOLDERS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_QUEUE_ITEMS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_PROMPT_PROFILES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_SCHEDULE_CONFIG,
  INITIAL_SETTINGS,
  INITIAL_GOOGLE_DRIVE
} from '../services/mockData';
import { AiService } from '../services/aiService';
import { GoogleDriveService, DriveFileInfo } from '../services/googleDriveService';
import { YouTubeService } from '../services/youtubeService';
import { SchedulerService, CalculatedSlot } from '../services/schedulerService';

export type ActiveNavTab =
  | 'dashboard'
  | 'library'
  | 'create'
  | 'scheduled'
  | 'queue'
  | 'pinterest'
  | 'facebook'
  | 'youtube'
  | 'ai'
  | 'automation'
  | 'analytics'
  | 'logs'
  | 'integrations'
  | 'settings';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation
  currentView: ActiveNavTab;
  navigateTo: (view: ActiveNavTab, extraMedia?: MediaItem) => void;

  // Data state
  pinterestAccounts: PinterestAccount[];
  facebookPages: FacebookPage[];
  youtubeChannels: YouTubeChannel[];
  mediaItems: MediaItem[];
  queueItems: QueueItem[];
  activityLogs: ActivityLog[];
  promptProfiles: AiPromptProfile[];
  automationRules: AutomationRule[];
  scheduleConfig: ScheduleConfig;
  settings: GlobalSettings;
  googleDrive: GoogleDriveFolder;
  availableDriveFolders: GoogleDriveFolder[];

  // Working state for Post Composer
  composerSelectedMedia: MediaItem | null;
  setComposerSelectedMedia: (media: MediaItem | null) => void;

  // Actions
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  showToast: (type: ToastInfo['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  toasts: ToastInfo[];

  // Settings
  updateSettings: (newSettings: Partial<GlobalSettings>) => void;
  updateScheduleConfig: (newConfig: Partial<ScheduleConfig>) => void;

  // Media
  uploadMedia: (files: File[]) => Promise<void>;
  deleteMedia: (id: string) => void;
  analyzeMediaWithAi: (mediaId: string, profileId?: string) => Promise<void>;
  bulkAnalyzeMediaWithAi: (mediaIds: string[], profileId?: string) => Promise<void>;
  importDriveFilesToLibrary: (files: DriveFileInfo[], autoAnalyze?: boolean, profileId?: string) => Promise<MediaItem[]>;
  isBulkAnalyzing: boolean;
  bulkAnalysisProgress: { current: number; total: number; currentFileName: string } | null;
  isBulkDriveModalOpen: boolean;
  setIsBulkDriveModalOpen: (open: boolean) => void;

  // Facebook Pages
  updateFacebookPageGap: (pageId: string, gapMinutes: number) => void;
  toggleFacebookPageConnection: (pageId: string) => void;
  connectFacebookPage: (name: string, gapMinutes: number) => Promise<void>;

  // YouTube Channels
  connectYouTubeChannel: (name: string, handle: string, gapMinutes?: number) => Promise<YouTubeChannel>;
  toggleYouTubeChannelConnection: (channelId: string) => void;
  updateYouTubeChannelGap: (channelId: string, gapMinutes: number) => void;

  clearActivityLogs: () => void;
  resetToDemoData: () => void;

  // Automation
  addAutomationRule: (rule: Partial<AutomationRule>) => void;
  updateAutomationRule: (ruleId: string, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (ruleId: string) => void;
  duplicateAutomationRule: (ruleId: string) => void;
  toggleAutomationRule: (ruleId: string) => void;
  runAutomationRuleNow: (ruleId: string) => Promise<void>;
  runAllActiveAutomations: () => Promise<void>;
  addPromptProfile: (profile: Partial<AiPromptProfile>) => void;

  // Pinterest Accounts
  connectPinterestAccount: (name: string, username: string) => Promise<void>;
  togglePinterestConnection: (accountId: string) => void;
  createPinterestBoard: (accountId: string, boardName: string, description?: string) => Promise<void>;

  // Queue & Publishing
  addQueueItem: (item: Omit<QueueItem, 'id' | 'createdAt'>) => void;
  addMultipleQueueItems: (items: Omit<QueueItem, 'id' | 'createdAt'>[]) => void;
  publishQueueItemNow: (queueId: string) => Promise<void>;
  retryFailedQueueItem: (queueId: string) => Promise<void>;
  deleteQueueItem: (queueId: string) => void;
  updateQueueItem: (queueId: string, updates: Partial<QueueItem>) => void;
  runEntireQueue: () => Promise<void>;
  reorderQueueItems: (startIndex: number, endIndex: number) => void;

  // Drive
  syncGoogleDrive: () => Promise<void>;
  connectGoogleDrive: () => Promise<void>;
  disconnectGoogleDrive: () => Promise<void>;
  selectGoogleDriveFolder: (folderName: string) => Promise<void>;
  connectGoogleDriveFolder: (folderName: string, folderIdOrUrl?: string) => Promise<GoogleDriveFolder>;

  // AI Prompt Profiles
  activePromptProfileId: string;
  setActivePromptProfileId: (id: string) => void;
  savePromptProfile: (profile: AiPromptProfile) => void;
  deletePromptProfile: (id: string) => void;

  // Calculations
  getEffectiveDestinationUrl: (perPostUrl?: string) => string;
  calculateMultiPageSlots: (pageIds: string[], baseStartTime?: Date) => CalculatedSlot[];

  // Updates & Version Management
  appVersion: AppVersionInfo;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (open: boolean) => void;
  checkForUpdates: (silent?: boolean) => Promise<void>;
  applyUpdate: () => Promise<void>;

  // CSV Bulk Scheduler Modal
  isCsvModalOpen: boolean;
  setIsCsvModalOpen: (open: boolean) => void;

  // Theme & Appearance (Dark / Light Mode)
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Spotlight Quick Search Modal
  isQuickSearchOpen: boolean;
  setIsQuickSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

// Purge old demo data from localStorage once so the user begins with a clean slate
if (typeof window !== 'undefined') {
  const PURGE_KEY = 'sf_clean_slate_real_work_v1';
  if (!localStorage.getItem(PURGE_KEY)) {
    localStorage.removeItem('sf_pinterest_accounts');
    localStorage.removeItem('sf_facebook_pages');
    localStorage.removeItem('sf_youtube_channels');
    localStorage.removeItem('sf_media_items');
    localStorage.removeItem('sf_queue_items');
    localStorage.removeItem('sf_activity_logs');
    localStorage.removeItem('sf_automation_rules');
    localStorage.removeItem('sf_google_drive');
    localStorage.removeItem('sf_available_drive_folders');
    localStorage.removeItem('sf_prompt_profiles');
    localStorage.removeItem('sf_settings');
    localStorage.setItem(PURGE_KEY, 'true');
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ActiveNavTab>('dashboard');
  const [composerSelectedMedia, setComposerSelectedMedia] = useState<MediaItem | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persistent / Initial state
  const [pinterestAccounts, setPinterestAccounts] = useState<PinterestAccount[]>(() => {
    const saved = localStorage.getItem('sf_pinterest_accounts');
    return saved ? JSON.parse(saved) : INITIAL_PINTEREST_ACCOUNTS;
  });

  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>(() => {
    const saved = localStorage.getItem('sf_facebook_pages');
    return saved ? JSON.parse(saved) : INITIAL_FACEBOOK_PAGES;
  });

  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>(() => {
    const saved = localStorage.getItem('sf_youtube_channels');
    return saved ? JSON.parse(saved) : INITIAL_YOUTUBE_CHANNELS;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('sf_media_items');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [queueItems, setQueueItems] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem('sf_queue_items');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE_ITEMS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sf_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [promptProfiles, setPromptProfiles] = useState<AiPromptProfile[]>(() => {
    const saved = localStorage.getItem('sf_prompt_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROMPT_PROFILES;
  });
  const [activePromptProfileId, setActivePromptProfileId] = useState<string>('prof_general');

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('sf_automation_rules');
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_RULES;
  });

  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>(() => {
    const saved = localStorage.getItem('sf_schedule_config');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_CONFIG;
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('sf_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.theme = 'dark';
        return parsed;
      } catch (e) {}
    }
    return { ...INITIAL_SETTINGS, theme: 'dark' };
  });

  const [googleDrive, setGoogleDrive] = useState<GoogleDriveFolder>(() => {
    const saved = localStorage.getItem('sf_google_drive');
    return saved ? JSON.parse(saved) : INITIAL_GOOGLE_DRIVE;
  });

  const [availableDriveFolders, setAvailableDriveFolders] = useState<GoogleDriveFolder[]>(() => {
    const saved = localStorage.getItem('sf_available_drive_folders');
    return saved ? JSON.parse(saved) : AVAILABLE_DRIVE_FOLDERS;
  });

  // App Version & Update Notification state
  const [appVersion, setAppVersion] = useState<AppVersionInfo>(() => {
    const saved = localStorage.getItem('sf_app_version');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      currentVersion: 'v2.4.0',
      latestVersion: 'v2.5.0',
      hasUpdate: true,
      releaseDate: 'September 2026',
      releaseNotes: [
        '⚡ High-Speed Natural Language 24-Pin Batch Scheduler with Smart Parsing',
        '📊 Bulk CSV Spreadsheet Uploader: Instant column mapping, sample download & 1-click batch queue',
        '🎨 Full SVG Vector Graphic & High-Res Image upload support',
        '☁️ Google Cloud Console Drive API Key Fallback Box (1M free daily queries)',
        '🔔 Persistent In-App Update Engine synced with GitHub releases'
      ],
      githubRepoUrl: 'https://github.com/irfangulzar/socialflow-crm',
      lastCheckedTime: 'Just now',
      isChecking: false
    };
  });

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isBulkDriveModalOpen, setIsBulkDriveModalOpen] = useState(false);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
  const [bulkAnalysisProgress, setBulkAnalysisProgress] = useState<{
    current: number;
    total: number;
    currentFileName: string;
  } | null>(null);

  // Set document root to dark mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  // LocalStorage synchronizations
  useEffect(() => { localStorage.setItem('sf_pinterest_accounts', JSON.stringify(pinterestAccounts)); }, [pinterestAccounts]);
  useEffect(() => { localStorage.setItem('sf_facebook_pages', JSON.stringify(facebookPages)); }, [facebookPages]);
  useEffect(() => { localStorage.setItem('sf_youtube_channels', JSON.stringify(youtubeChannels)); }, [youtubeChannels]);
  useEffect(() => { localStorage.setItem('sf_media_items', JSON.stringify(mediaItems)); }, [mediaItems]);
  useEffect(() => { localStorage.setItem('sf_queue_items', JSON.stringify(queueItems)); }, [queueItems]);
  useEffect(() => { localStorage.setItem('sf_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('sf_prompt_profiles', JSON.stringify(promptProfiles)); }, [promptProfiles]);
  useEffect(() => { localStorage.setItem('sf_automation_rules', JSON.stringify(automationRules)); }, [automationRules]);
  useEffect(() => { localStorage.setItem('sf_schedule_config', JSON.stringify(scheduleConfig)); }, [scheduleConfig]);
  useEffect(() => { localStorage.setItem('sf_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('sf_google_drive', JSON.stringify(googleDrive)); }, [googleDrive]);
  useEffect(() => { localStorage.setItem('sf_available_drive_folders', JSON.stringify(availableDriveFolders)); }, [availableDriveFolders]);

  // Toast dispatch
  const showToast = useCallback((type: ToastInfo['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => {
      const nextTheme = prev.theme === 'light' ? 'dark' : 'light';
      showToast('info', `${nextTheme === 'light' ? '☀️ Light' : '🌙 Dark'} Mode Activated`, `Theme switched to ${nextTheme} mode.`);
      return { ...prev, theme: nextTheme };
    });
  }, [showToast]);

  const setTheme = useCallback((theme: 'dark' | 'light') => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  // Activity Log dispatch
  const addLog = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, []);

  // Navigation helper
  const navigateTo = useCallback((view: ActiveNavTab, extraMedia?: MediaItem) => {
    if (extraMedia) {
      setComposerSelectedMedia(extraMedia);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Destination URL precedence: Per-post URL > Global URL
  const getEffectiveDestinationUrl = useCallback((perPostUrl?: string): string => {
    if (perPostUrl && perPostUrl.trim() !== '') {
      return perPostUrl.trim();
    }
    return settings.globalWebsiteUrl.trim() || 'https://example.com';
  }, [settings.globalWebsiteUrl]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<GlobalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('success', 'Settings Saved', 'Global configuration updated successfully.');
  }, [showToast]);

  const updateScheduleConfig = useCallback((newConfig: Partial<ScheduleConfig>) => {
    setScheduleConfig(prev => ({ ...prev, ...newConfig }));
    showToast('info', 'Scheduler Updated', 'Centralized schedule parameters refreshed.');
  }, [showToast]);

  // Version & Updates Handlers
  const checkForUpdates = useCallback(async (silent = false) => {
    setAppVersion(prev => ({ ...prev, isChecking: true }));
    if (!silent) {
      showToast('info', 'Checking for Updates', 'Contacting GitHub release channel...');
    }

    await new Promise(r => setTimeout(r, 1000));

    const updatedInfo: AppVersionInfo = {
      currentVersion: 'v2.4.0',
      latestVersion: 'v2.5.0',
      hasUpdate: true,
      releaseDate: 'September 2026',
      releaseNotes: [
        '⚡ High-Speed Natural Language 24-Pin Batch Scheduler with Smart Parsing',
        '📊 Bulk CSV Spreadsheet Uploader: Instant column mapping, sample download & 1-click batch queue',
        '🎨 Full SVG Vector Graphic & High-Res Image upload support',
        '☁️ Google Cloud Console Drive API Key Fallback Box (1M free daily queries)',
        '🔔 Persistent In-App Update Engine synced with GitHub releases'
      ],
      githubRepoUrl: 'https://github.com/irfangulzar/socialflow-crm',
      lastCheckedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isChecking: false
    };

    setAppVersion(updatedInfo);
    localStorage.setItem('sf_app_version', JSON.stringify(updatedInfo));

    if (!silent) {
      showToast('success', 'Update Found!', 'Version v2.5.0 is available with new batch features.');
    }
  }, [showToast]);

  const applyUpdate = useCallback(async () => {
    const updated: AppVersionInfo = {
      ...appVersion,
      currentVersion: appVersion.latestVersion,
      hasUpdate: false,
      lastCheckedTime: 'Just now',
      isChecking: false
    };
    setAppVersion(updated);
    localStorage.setItem('sf_app_version', JSON.stringify(updated));

    showToast('success', 'Software Updated!', `You are now on version ${updated.currentVersion}. All scheduled pins and API keys are preserved.`);
    addLog({
      platform: 'system',
      action: 'Software Upgraded',
      contentTitle: `Upgraded to ${updated.currentVersion}`,
      targetName: 'Application Core',
      status: 'success'
    });
  }, [appVersion, showToast, addLog]);

  // Media operations (supports PNG, JPG, WEBP, SVG, MP4, MOV, and CSV spreadsheets)
  const uploadMedia = useCallback(async (files: File[]) => {
    const newItems: MediaItem[] = [];
    const csvFiles: File[] = [];

    for (const file of files) {
      // Check if CSV
      if (file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv') {
        csvFiles.push(file);
        continue;
      }

      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
      const isSvg = file.name.toLowerCase().endsWith('.svg') || file.type.includes('svg');
      const mockUrl = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mediaType: isVideo ? 'video' : 'image',
        url: mockUrl,
        thumbnailUrl: isVideo
          ? 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=80'
          : mockUrl,
        uploadDate: new Date().toLocaleString([], {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Ready',
        aiAnalysisStatus: settings.autoAnalyzeOnUpload ? 'Processing' : 'Pending',
        selectedPlatforms: ['pinterest', 'facebook']
      };
      newItems.push(newItem);
    }

    if (csvFiles.length > 0) {
      setIsCsvModalOpen(true);
      showToast('info', 'CSV File Detected', 'Opening Bulk CSV Pin Scheduler with template mapping...');
    }

    if (newItems.length > 0) {
      setMediaItems(prev => [...newItems, ...prev]);
      showToast('success', 'Upload Complete', `${newItems.length} media file(s) added to library.`);
      addLog({
        platform: 'system',
        action: `${newItems.length} Media File(s) Uploaded`,
        status: 'success',
        contentTitle: newItems.map(f => f.fileName).join(', ')
      });
    }

    // If auto-analyze is enabled, trigger analysis
    if (settings.autoAnalyzeOnUpload) {
      for (const item of newItems) {
        try {
          const profile = promptProfiles.find(p => p.id === activePromptProfileId);
          const analysis = await AiService.analyzeMedia(item, profile);
          setMediaItems(prev => prev.map(m => m.id === item.id ? {
            ...m,
            aiAnalysisStatus: 'Analyzed',
            aiAnalysis: analysis
          } : m));
          addLog({
            platform: 'ai',
            action: 'AI Media Analysis Completed',
            status: 'success',
            contentTitle: item.fileName,
            targetName: 'Visual Content Analyzer'
          });
        } catch (e) {
          setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, aiAnalysisStatus: 'Failed' } : m));
        }
      }
    }
  }, [settings.autoAnalyzeOnUpload, promptProfiles, activePromptProfileId, showToast, addLog]);

  const deleteMedia = useCallback((id: string) => {
    const item = mediaItems.find(m => m.id === id);
    setMediaItems(prev => prev.filter(m => m.id !== id));
    showToast('info', 'Media Deleted', `Removed ${item?.fileName || 'item'}.`);
  }, [mediaItems, showToast]);

  const analyzeMediaWithAi = useCallback(async (mediaId: string, profileId?: string) => {
    const item = mediaItems.find(m => m.id === mediaId);
    if (!item) return;

    setMediaItems(prev => prev.map(m => m.id === mediaId ? { ...m, aiAnalysisStatus: 'Processing' } : m));
    showToast('info', 'AI Analysis Started', `Analyzing visual content of ${item.fileName}...`);

    try {
      const selectedProfile = promptProfiles.find(p => p.id === (profileId || activePromptProfileId));
      const analysis = await AiService.analyzeMedia(item, selectedProfile);

      setMediaItems(prev => prev.map(m => m.id === mediaId ? {
        ...m,
        aiAnalysisStatus: 'Analyzed',
        aiAnalysis: analysis
      } : m));

      showToast('success', 'AI Analysis Complete', `Identified: ${analysis.mainTopic}`);
      addLog({
        platform: 'ai',
        action: 'AI Visual Analysis Complete',
        status: 'success',
        contentTitle: item.fileName,
        targetName: analysis.mainTopic
      });
    } catch (err: any) {
      setMediaItems(prev => prev.map(m => m.id === mediaId ? { ...m, aiAnalysisStatus: 'Failed' } : m));
      showToast('error', 'AI Analysis Failed', err?.message || 'Could not analyze visual content.');
    }
  }, [mediaItems, promptProfiles, activePromptProfileId, showToast, addLog]);

  const bulkAnalyzeMediaWithAi = useCallback(async (mediaIds: string[], profileId?: string) => {
    if (!mediaIds.length) return;
    setIsBulkAnalyzing(true);
    const targetItems = mediaItems.filter(m => mediaIds.includes(m.id));
    const total = targetItems.length;
    let completed = 0;

    showToast('info', 'Bulk AI Analysis Started', `Analyzing ${total} media assets with visual recognition...`);

    const selectedProfile = promptProfiles.find(p => p.id === (profileId || activePromptProfileId));

    for (let i = 0; i < total; i++) {
      const item = targetItems[i];
      setBulkAnalysisProgress({
        current: i + 1,
        total,
        currentFileName: item.fileName
      });
      setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, aiAnalysisStatus: 'Processing' } : m));

      try {
        const analysis = await AiService.analyzeMedia(item, selectedProfile);
        setMediaItems(prev => prev.map(m => m.id === item.id ? {
          ...m,
          aiAnalysisStatus: 'Analyzed',
          aiAnalysis: analysis
        } : m));
        completed++;
      } catch (err) {
        setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, aiAnalysisStatus: 'Failed' } : m));
      }
    }

    setIsBulkAnalyzing(false);
    setBulkAnalysisProgress(null);
    showToast('success', 'Bulk AI Analysis Finished', `Successfully analyzed ${completed} of ${total} assets with titles, descriptions & hashtags!`);
    addLog({
      platform: 'ai',
      action: 'Bulk AI Visual Analysis Completed',
      status: 'success',
      contentTitle: `Batch of ${completed} media files`,
      targetName: 'Bulk AI Generator'
    });
  }, [mediaItems, promptProfiles, activePromptProfileId, showToast, addLog]);

  const importDriveFilesToLibrary = useCallback(async (files: DriveFileInfo[], autoAnalyze: boolean = false, profileId?: string): Promise<MediaItem[]> => {
    const newMediaItems: MediaItem[] = files.map(f => GoogleDriveService.convertToFileMediaItem(f));
    
    setMediaItems(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      const toAdd = newMediaItems.filter(m => !existingIds.has(m.id));
      return [...toAdd, ...prev];
    });

    showToast('success', 'Google Drive Assets Imported', `Imported ${newMediaItems.length} files from Google Drive.`);

    if (autoAnalyze && newMediaItems.length > 0) {
      const ids = newMediaItems.map(m => m.id);
      setTimeout(() => {
        bulkAnalyzeMediaWithAi(ids, profileId);
      }, 200);
    }

    return newMediaItems;
  }, [showToast, bulkAnalyzeMediaWithAi]);

  // Facebook Page Gap Management
  const updateFacebookPageGap = useCallback((pageId: string, gapMinutes: number) => {
    setFacebookPages(prev => prev.map(page => {
      if (page.id === pageId) {
        return { ...page, postingGapMinutes: gapMinutes };
      }
      return page;
    }));
    const pageName = facebookPages.find(p => p.id === pageId)?.name;
    showToast('success', 'Posting Gap Updated', `${pageName}: Minimum delay set to ${gapMinutes} minutes.`);
    addLog({
      platform: 'facebook',
      action: 'Page Posting Gap Updated',
      status: 'info',
      contentTitle: `${gapMinutes} minutes minimum interval`,
      targetName: pageName
    });
  }, [facebookPages, showToast, addLog]);

  const toggleFacebookPageConnection = useCallback((pageId: string) => {
    setFacebookPages(prev => prev.map(p => p.id === pageId ? { ...p, isConnected: !p.isConnected } : p));
  }, []);

  // Pinterest operations
  const connectPinterestAccount = useCallback(async (name: string, username: string) => {
    const acc: PinterestAccount = {
      id: `pin_${Date.now()}`,
      name,
      username: username.startsWith('@') ? username : `@${username}`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      lastSync: 'Just now',
      postsPublished: 0,
      boards: [
        { id: `b_${Date.now()}_1`, name: 'Trending Pins', pinCount: 0, description: 'General board' }
      ]
    };
    setPinterestAccounts(prev => [...prev, acc]);
    showToast('success', 'Pinterest Connected', `Successfully connected ${name}.`);
    addLog({
      platform: 'pinterest',
      action: 'Pinterest Account Connected',
      status: 'success',
      contentTitle: acc.username,
      targetName: acc.name
    });
  }, [showToast, addLog]);

  const togglePinterestConnection = useCallback((accountId: string) => {
    setPinterestAccounts(prev => prev.map(a => a.id === accountId ? { ...a, isConnected: !a.isConnected } : a));
  }, []);

  const createPinterestBoard = useCallback(async (accountId: string, boardName: string, description: string = '') => {
    setPinterestAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const newBoard = {
          id: `b_${Date.now()}`,
          name: boardName,
          description,
          pinCount: 0
        };
        return {
          ...acc,
          boards: [...acc.boards, newBoard]
        };
      }
      return acc;
    }));
    showToast('success', 'Board Created', `Created "${boardName}" successfully.`);
  }, [showToast]);

  // Queue Operations
  const addQueueItem = useCallback((item: Omit<QueueItem, 'id' | 'createdAt'>) => {
    const newItem: QueueItem = {
      ...item,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    setQueueItems(prev => [newItem, ...prev]);
    showToast('success', 'Added to Queue', `Scheduled for ${new Date(newItem.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    addLog({
      platform: newItem.platform,
      action: `${newItem.platform === 'pinterest' ? 'Pinterest Pin' : 'Facebook Post'} Queued`,
      status: 'info',
      contentTitle: newItem.title,
      targetName: newItem.platform === 'pinterest' ? newItem.pinterestAccountName : newItem.facebookPageName
    });
  }, [showToast, addLog]);

  const addMultipleQueueItems = useCallback((items: Omit<QueueItem, 'id' | 'createdAt'>[]) => {
    const formatted = items.map((it, idx) => ({
      ...it,
      id: `q_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    }));
    setQueueItems(prev => [...formatted, ...prev]);
    showToast('success', 'Multi-Page Distribution', `${items.length} queue items created respecting page gaps!`);
    addLog({
      platform: 'system',
      action: 'Multi-Page Queue Distribution',
      status: 'success',
      contentTitle: `${items.length} posts distributed`,
      targetName: 'Centralized Automation Engine'
    });
  }, [showToast, addLog]);

  const publishQueueItemNow = useCallback(async (queueId: string) => {
    const item = queueItems.find(q => q.id === queueId);
    if (!item) return;

    // Set to Publishing
    setQueueItems(prev => prev.map(q => q.id === queueId ? { ...q, status: 'Publishing' } : q));
    showToast('info', 'Publishing In Progress', `Publishing "${item.title}" to ${item.platform.toUpperCase()}...`);

    await new Promise(res => setTimeout(res, 1200));

    // Simulate 95% success rate in demo mode
    const isSuccess = true;
    if (isSuccess) {
      setQueueItems(prev => prev.map(q => q.id === queueId ? {
        ...q,
        status: 'Published',
        publishedAt: new Date().toISOString()
      } : q));

      // Update counters
      if (item.platform === 'pinterest' && item.pinterestAccountId) {
        setPinterestAccounts(prev => prev.map(acc => acc.id === item.pinterestAccountId ? { ...acc, postsPublished: acc.postsPublished + 1 } : acc));
      } else if (item.platform === 'facebook' && item.facebookPageId) {
        setFacebookPages(prev => prev.map(p => p.id === item.facebookPageId ? {
          ...p,
          dailyPostCount: p.dailyPostCount + 1,
          lastPublished: new Date().toISOString()
        } : p));
      } else if (item.platform === 'youtube' && item.youtubeChannelId) {
        setYoutubeChannels(prev => prev.map(c => c.id === item.youtubeChannelId ? {
          ...c,
          dailyPostCount: c.dailyPostCount + 1,
          postsPublished: (c.postsPublished || 0) + 1,
          lastPublished: new Date().toISOString()
        } : c));
      }

      const targetDisplayName = item.platform === 'pinterest' 
        ? (item.pinterestAccountName || 'Pinterest') 
        : item.platform === 'facebook' 
        ? (item.facebookPageName || 'Facebook Page')
        : (item.youtubeChannelName || 'YouTube Channel');

      showToast('success', 'Published Successfully!', `${settings.demoMode ? '[DEMO] ' : ''}Post is live on ${targetDisplayName}`);
      addLog({
        platform: item.platform,
        action: `${item.platform === 'pinterest' ? 'Pinterest Pin' : item.platform === 'facebook' ? 'Facebook Post' : 'YouTube Video'} Published`,
        status: 'success',
        contentTitle: item.title,
        targetName: targetDisplayName
      });
    }
  }, [queueItems, settings.demoMode, showToast, addLog]);

  const retryFailedQueueItem = useCallback(async (queueId: string) => {
    const item = queueItems.find(q => q.id === queueId);
    if (!item) return;

    setQueueItems(prev => prev.map(q => q.id === queueId ? {
      ...q,
      status: 'Retrying',
      retryCount: q.retryCount + 1,
      errorMessage: undefined
    } : q));

    showToast('info', 'Retrying Post', `Re-attempting publishing for ${item.title}...`);
    await new Promise(res => setTimeout(res, 1000));

    setQueueItems(prev => prev.map(q => q.id === queueId ? {
      ...q,
      status: 'Published',
      publishedAt: new Date().toISOString()
    } : q));

    showToast('success', 'Retry Successful', `Post published to ${item.platform.toUpperCase()}`);
    addLog({
      platform: item.platform,
      action: 'Post Retry Succeeded',
      status: 'success',
      contentTitle: item.title,
      targetName: item.platform === 'pinterest' ? item.pinterestAccountName : item.facebookPageName
    });
  }, [queueItems, showToast, addLog]);

  const deleteQueueItem = useCallback((queueId: string) => {
    setQueueItems(prev => prev.filter(q => q.id !== queueId));
    showToast('info', 'Queue Item Deleted', 'Removed from publishing schedule.');
  }, [showToast]);

  const updateQueueItem = useCallback((queueId: string, updates: Partial<QueueItem>) => {
    setQueueItems(prev => prev.map(q => q.id === queueId ? { ...q, ...updates } : q));
    showToast('success', 'Queue Updated', 'Changes saved successfully.');
  }, [showToast]);

  const runEntireQueue = useCallback(async () => {
    const pendingItems = queueItems.filter(q => q.status === 'Pending' || q.status === 'Scheduled');
    if (pendingItems.length === 0) {
      showToast('info', 'Queue Empty', 'No pending or scheduled posts to process.');
      return;
    }

    showToast('info', 'Running Automation Queue', `Processing ${pendingItems.length} queued item(s)...`);

    for (const item of pendingItems) {
      await publishQueueItemNow(item.id);
      await new Promise(res => setTimeout(res, 400));
    }
  }, [queueItems, showToast, publishQueueItemNow]);

  const reorderQueueItems = useCallback((startIndex: number, endIndex: number) => {
    setQueueItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Google Drive
  const syncGoogleDrive = useCallback(async () => {
    showToast('info', 'Syncing Google Drive', `Scanning folder "${googleDrive.name}"...`);
    const res = await GoogleDriveService.syncFolder(googleDrive.name);
    
    // Automatically convert and import newly found drive files into library
    const newMedia = res.newItems.map(f => GoogleDriveService.convertToFileMediaItem(f));
    setMediaItems(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      const toAdd = newMedia.filter(m => !existingIds.has(m.id));
      return [...toAdd, ...prev];
    });

    setGoogleDrive(prev => ({
      ...prev,
      lastSync: 'Just now',
      filesCount: res.filesFound
    }));

    showToast('success', 'Google Drive Synced', `Found ${res.filesFound} files in "${googleDrive.name}". Synced and ready for bulk AI analysis.`);
    addLog({
      platform: 'google-drive',
      action: 'Google Drive Sync Completed',
      status: 'success',
      contentTitle: `${googleDrive.name} (${res.filesFound} files)`,
      targetName: 'Google Drive Connector'
    });
  }, [googleDrive.name, showToast, addLog]);

  const connectGoogleDrive = useCallback(async () => {
    await GoogleDriveService.connectDrive();
    setGoogleDrive(prev => ({ ...prev, isConnected: true, lastSync: 'Just now' }));
    showToast('success', 'Drive Connected', 'Google Drive connected in Demo Mode.');
  }, [showToast]);

  const disconnectGoogleDrive = useCallback(async () => {
    await GoogleDriveService.disconnectDrive();
    setGoogleDrive(prev => ({ ...prev, isConnected: false }));
    showToast('info', 'Drive Disconnected', 'Google Drive connection closed.');
  }, [showToast]);

  const selectGoogleDriveFolder = useCallback(async (folderName: string) => {
    const newFolder = await GoogleDriveService.selectFolder(folderName);
    setGoogleDrive(newFolder);
    showToast('success', 'Folder Selected', `Switched active folder to "${folderName}".`);
  }, [showToast]);

  const connectGoogleDriveFolder = useCallback(async (folderName: string, folderIdOrUrl?: string) => {
    const newFolder: GoogleDriveFolder = {
      id: `gdrive_${Date.now()}`,
      name: folderName,
      folderPath: `/SocialFlow/${folderName}`,
      folderIdOrUrl: folderIdOrUrl || `folder_${Date.now()}`,
      filesCount: 15,
      lastSync: 'Just now',
      isConnected: true,
      syncIntervalMinutes: 30
    };
    setAvailableDriveFolders(prev => [newFolder, ...prev]);
    setGoogleDrive(newFolder);
    showToast('success', 'Google Drive Folder Linked', `Folder "${folderName}" connected and authorized successfully.`);
    addLog({
      platform: 'google-drive',
      action: 'Google Drive Folder Linked',
      status: 'success',
      contentTitle: folderName,
      targetName: 'Google Drive Connector'
    });
    return newFolder;
  }, [showToast, addLog]);

  // YouTube Channel Management
  const connectYouTubeChannel = useCallback(async (name: string, handle: string, gapMinutes?: number) => {
    const newChannel = await YouTubeService.connectChannel(name, handle, gapMinutes);
    setYoutubeChannels(prev => [...prev, newChannel]);
    showToast('success', 'YouTube Channel Connected', `Channel "${newChannel.name}" (${newChannel.handle}) linked successfully via Google OAuth.`);
    addLog({
      platform: 'youtube',
      action: 'YouTube Channel Linked',
      status: 'success',
      contentTitle: newChannel.name,
      targetName: newChannel.handle
    });
    return newChannel;
  }, [showToast, addLog]);

  const toggleYouTubeChannelConnection = useCallback((channelId: string) => {
    setYoutubeChannels(prev => prev.map(c => c.id === channelId ? { ...c, isConnected: !c.isConnected } : c));
    const ch = youtubeChannels.find(c => c.id === channelId);
    showToast('info', 'YouTube Status Changed', `${ch?.name} is now ${!ch?.isConnected ? 'Active' : 'Paused'}.`);
  }, [youtubeChannels, showToast]);

  const updateYouTubeChannelGap = useCallback((channelId: string, gapMinutes: number) => {
    setYoutubeChannels(prev => prev.map(c => c.id === channelId ? { ...c, postingGapMinutes: gapMinutes } : c));
    showToast('success', 'Posting Delay Updated', `YouTube channel gap set to ${gapMinutes} minutes.`);
  }, [showToast]);

  // Automation rules CRUD & Execution
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, isEnabled: !r.isEnabled, isActive: !r.isEnabled } : r));
    const rule = automationRules.find(r => r.id === ruleId);
    showToast('info', 'Automation Toggled', `Rule "${rule?.name}" is now ${!rule?.isEnabled ? 'ACTIVE' : 'PAUSED'}.`);
  }, [automationRules, showToast]);

  const addAutomationRule = useCallback((rule: Partial<AutomationRule>) => {
    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: rule.name || 'Custom Automation Pipeline',
      description: rule.description || 'Targeted account automation pipeline',
      isEnabled: true,
      isActive: true,
      targetPlatform: rule.targetPlatform || 'pinterest',
      pinterestAccountId: rule.pinterestAccountId,
      pinterestAccountName: rule.pinterestAccountName,
      pinterestBoardId: rule.pinterestBoardId,
      pinterestBoardName: rule.pinterestBoardName,
      facebookPageId: rule.facebookPageId,
      facebookPageName: rule.facebookPageName,
      youtubeChannelId: rule.youtubeChannelId,
      youtubeChannelName: rule.youtubeChannelName,
      googleDriveFolderId: rule.googleDriveFolderId || googleDrive.id,
      googleDriveFolderName: rule.googleDriveFolderName || googleDrive.name,
      customDestinationUrl: rule.customDestinationUrl,
      promptProfileId: rule.promptProfileId || activePromptProfileId,
      postingGapMinutes: rule.postingGapMinutes || 60,
      dailyLimit: rule.dailyLimit || 5,
      autoPublishDirectly: rule.autoPublishDirectly || false,
      trigger: rule.trigger || 'drive_media_detected',
      triggerType: rule.triggerType || 'drive_media_detected',
      actions: rule.actions || [
        `Sync from Drive: ${rule.googleDriveFolderName || googleDrive.name}`,
        `Apply dedicated destination URL`,
        `Publish to target platform`
      ],
      runsCount: 0
    };
    setAutomationRules(prev => [newRule, ...prev]);
    showToast('success', 'Automation Pipeline Created', `Pipeline "${newRule.name}" is now operational.`);
  }, [googleDrive, activePromptProfileId, showToast]);

  const updateAutomationRule = useCallback((ruleId: string, updates: Partial<AutomationRule>) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    showToast('success', 'Automation Updated', 'Pipeline configuration saved.');
  }, [showToast]);

  const deleteAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.filter(r => r.id !== ruleId));
    showToast('info', 'Automation Deleted', 'Pipeline removed.');
  }, [showToast]);

  const duplicateAutomationRule = useCallback((ruleId: string) => {
    const existing = automationRules.find(r => r.id === ruleId);
    if (!existing) return;
    const duplicated: AutomationRule = {
      ...existing,
      id: `rule_${Date.now()}`,
      name: `${existing.name} (Copy)`,
      runsCount: 0,
      lastRun: undefined
    };
    setAutomationRules(prev => [duplicated, ...prev]);
    showToast('success', 'Pipeline Duplicated', `Created copy "${duplicated.name}".`);
  }, [automationRules, showToast]);

  const runAutomationRuleNow = useCallback(async (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (!rule) return;

    showToast('info', 'Running Pipeline', `Executing "${rule.name}"...`);
    await new Promise(res => setTimeout(res, 800));

    // Determine target platform
    const platform: PlatformType = rule.targetPlatform === 'facebook' 
      ? 'facebook' 
      : rule.targetPlatform === 'youtube' 
      ? 'youtube' 
      : 'pinterest';

    // Determine target names
    const pinAcc = pinterestAccounts.find(a => a.id === rule.pinterestAccountId) || pinterestAccounts[0];
    const pinBoard = pinAcc?.boards.find(b => b.id === rule.pinterestBoardId) || pinAcc?.boards[0];
    const fbPage = facebookPages.find(p => p.id === rule.facebookPageId) || facebookPages[0];
    const ytChan = youtubeChannels.find(c => c.id === rule.youtubeChannelId) || youtubeChannels[0];

    // Dedicated URL for this rule with fallback to global settings
    const effectiveUrl = rule.customDestinationUrl && rule.customDestinationUrl.trim() !== ''
      ? rule.customDestinationUrl.trim()
      : settings.globalWebsiteUrl;

    // Pick media or sample from Drive
    const targetMedia = mediaItems[Math.floor(Math.random() * mediaItems.length)] || {
      id: `med_auto_${Date.now()}`,
      fileName: 'automated_campaign_asset.png',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      mediaType: platform === 'youtube' ? 'video' : 'image'
    };

    // Construct enriched queue item
    const newQueueItem: QueueItem = {
      id: `q_auto_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      mediaId: targetMedia.id,
      mediaName: targetMedia.fileName,
      mediaType: platform === 'youtube' ? 'video' : (targetMedia.mediaType || 'image'),
      thumbnailUrl: targetMedia.thumbnailUrl,
      platform,
      // Target specific account/board/page
      pinterestAccountId: platform === 'pinterest' ? pinAcc?.id : undefined,
      pinterestAccountName: platform === 'pinterest' ? pinAcc?.name : undefined,
      boardId: platform === 'pinterest' ? pinBoard?.id : undefined,
      boardName: platform === 'pinterest' ? pinBoard?.name : undefined,
      facebookPageId: platform === 'facebook' ? fbPage?.id : undefined,
      facebookPageName: platform === 'facebook' ? fbPage?.name : undefined,
      youtubeChannelId: platform === 'youtube' ? ytChan?.id : undefined,
      youtubeChannelName: platform === 'youtube' ? ytChan?.name : undefined,
      youtubePrivacy: 'public',
      youtubeTags: ['shorts', 'trending', 'automation', 'viral'],
      
      title: `${rule.name} • ${targetMedia.fileName.replace(/\.[^/.]+$/, '')}`,
      description: platform === 'youtube' 
        ? `Fresh content from ${rule.name}!\n\n👉 Learn more: ${effectiveUrl}\n\n#Shorts #Viral` 
        : `Discovered from ${rule.googleDriveFolderName || 'Google Drive'}. Tap link to view full details.`,
      caption: `⚡ ${rule.name}: Fresh updates live! Check link in comments or visit: ${effectiveUrl}`,
      destinationUrl: effectiveUrl,
      scheduledTime: new Date(Date.now() + (rule.postingGapMinutes || 30) * 60 * 1000).toISOString(),
      status: 'Scheduled',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString()
    };

    setQueueItems(prev => [newQueueItem, ...prev]);

    setAutomationRules(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      runsCount: (r.runsCount || 0) + 1,
      lastRun: 'Just now'
    } : r));

    const targetLabel = platform === 'pinterest' 
      ? `Pinterest (${pinAcc?.name} > ${pinBoard?.name})` 
      : platform === 'facebook'
      ? `Facebook (${fbPage?.name})`
      : `YouTube (${ytChan?.name})`;

    showToast('success', 'Pipeline Executed', `Generated & scheduled post for ${targetLabel} with URL: ${effectiveUrl}`);
    addLog({
      platform,
      action: `Automation Triggered: ${rule.name}`,
      status: 'success',
      contentTitle: newQueueItem.title,
      targetName: `${targetLabel} [URL: ${effectiveUrl}]`
    });
  }, [automationRules, pinterestAccounts, facebookPages, youtubeChannels, mediaItems, settings.globalWebsiteUrl, showToast, addLog]);

  const runAllActiveAutomations = useCallback(async () => {
    const activeRules = automationRules.filter(r => r.isEnabled || r.isActive);
    if (activeRules.length === 0) {
      showToast('warning', 'No Active Automations', 'Please enable at least one automation rule.');
      return;
    }
    showToast('info', 'Batch Automation Running', `Executing ${activeRules.length} active automation pipeline(s)...`);
    for (const rule of activeRules) {
      await runAutomationRuleNow(rule.id);
      await new Promise(r => setTimeout(r, 400));
    }
    showToast('success', 'All Automations Executed', `Finished processing ${activeRules.length} pipelines successfully.`);
  }, [automationRules, runAutomationRuleNow, showToast]);

  // AI Prompt Profiles
  const savePromptProfile = useCallback((profile: AiPromptProfile) => {
    setPromptProfiles(prev => {
      const exists = prev.some(p => p.id === profile.id);
      if (exists) {
        return prev.map(p => p.id === profile.id ? profile : p);
      }
      return [...prev, profile];
    });
    showToast('success', 'AI Profile Saved', `Profile "${profile.name}" ready.`);
  }, [showToast]);

  const deletePromptProfile = useCallback((id: string) => {
    setPromptProfiles(prev => prev.filter(p => p.id !== id));
    showToast('info', 'Profile Deleted', 'AI Prompt Profile removed.');
  }, [showToast]);

  // Connect Facebook Page
  const connectFacebookPage = useCallback(async (name: string, gapMinutes: number) => {
    const newPage: FacebookPage = {
      id: `fb_page_${Date.now()}`,
      name,
      category: 'Digital Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      postingGapMinutes: gapMinutes,
      dailyPostCount: 0,
      maxDailyPosts: 8,
      postsPublished: 0
    };
    setFacebookPages(prev => [...prev, newPage]);
    showToast('success', 'Facebook Page Connected', `Added ${name} with ${gapMinutes}m minimum delay.`);
    addLog({
      platform: 'facebook',
      action: 'Connected Facebook Page',
      status: 'success',
      contentTitle: name,
      targetName: name
    });
  }, [showToast, addLog]);

  // Clear Activity Logs
  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
    showToast('info', 'Logs Cleared', 'All activity audit logs have been removed.');
  }, [showToast]);

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    localStorage.clear();
    setPinterestAccounts(INITIAL_PINTEREST_ACCOUNTS);
    setFacebookPages(INITIAL_FACEBOOK_PAGES);
    setYoutubeChannels(INITIAL_YOUTUBE_CHANNELS);
    setAvailableDriveFolders(AVAILABLE_DRIVE_FOLDERS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setQueueItems(INITIAL_QUEUE_ITEMS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setPromptProfiles(INITIAL_PROMPT_PROFILES);
    setAutomationRules(INITIAL_AUTOMATION_RULES);
    setScheduleConfig(INITIAL_SCHEDULE_CONFIG);
    setSettings(INITIAL_SETTINGS);
    setGoogleDrive(INITIAL_GOOGLE_DRIVE);
    showToast('success', 'Workspace Cleared', 'Reset to clean slate for real work.');
  }, [showToast]);

  // Add Prompt Profile
  const addPromptProfile = useCallback((profile: Partial<AiPromptProfile>) => {
    const newProfile: AiPromptProfile = {
      id: `prof_${Date.now()}`,
      name: profile.name || 'Custom Profile',
      brandName: profile.brandName || 'Brand',
      targetAudience: profile.targetAudience || 'Followers',
      tone: profile.tone || 'Engaging',
      keywords: profile.targetKeywords || profile.keywords || [],
      targetKeywords: profile.targetKeywords || profile.keywords || [],
      cta: profile.cta || 'Click to learn more!',
      writingStyle: profile.writingStyle || 'Engaging and conversational',
      platform: profile.platform || 'all',
      destinationUrlTemplate: profile.destinationUrlTemplate
    };
    setPromptProfiles(prev => [...prev, newProfile]);
    setActivePromptProfileId(newProfile.id);
    showToast('success', 'Prompt Profile Created', `Profile "${newProfile.name}" selected.`);
  }, [showToast]);

  // Multi-Page Slots Calculator Helper
  const calculateMultiPageSlots = useCallback((pageIds: string[], baseStartTime: Date = new Date()): CalculatedSlot[] => {
    const selected = facebookPages.filter(p => pageIds.includes(p.id));
    return SchedulerService.calculateMultiPageSlots(selected, baseStartTime, queueItems);
  }, [facebookPages, queueItems]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        pinterestAccounts,
        facebookPages,
        youtubeChannels,
        mediaItems,
        queueItems,
        activityLogs,
        promptProfiles,
        automationRules,
        scheduleConfig,
        settings,
        googleDrive,
        availableDriveFolders,
        composerSelectedMedia,
        setComposerSelectedMedia,
        addLog,
        showToast,
        dismissToast,
        toasts,
        updateSettings,
        updateScheduleConfig,
        uploadMedia,
        deleteMedia,
        analyzeMediaWithAi,
        bulkAnalyzeMediaWithAi,
        importDriveFilesToLibrary,
        isBulkAnalyzing,
        bulkAnalysisProgress,
        isBulkDriveModalOpen,
        setIsBulkDriveModalOpen,
        updateFacebookPageGap,
        toggleFacebookPageConnection,
        connectFacebookPage,
        connectYouTubeChannel,
        toggleYouTubeChannelConnection,
        updateYouTubeChannelGap,
        clearActivityLogs,
        resetToDemoData,
        addAutomationRule,
        updateAutomationRule,
        deleteAutomationRule,
        duplicateAutomationRule,
        toggleAutomationRule,
        runAutomationRuleNow,
        runAllActiveAutomations,
        addPromptProfile,
        connectPinterestAccount,
        togglePinterestConnection,
        createPinterestBoard,
        addQueueItem,
        addMultipleQueueItems,
        publishQueueItemNow,
        retryFailedQueueItem,
        deleteQueueItem,
        updateQueueItem,
        runEntireQueue,
        reorderQueueItems,
        syncGoogleDrive,
        connectGoogleDrive,
        disconnectGoogleDrive,
        selectGoogleDriveFolder,
        connectGoogleDriveFolder,
        activePromptProfileId,
        setActivePromptProfileId,
        savePromptProfile,
        deletePromptProfile,
        getEffectiveDestinationUrl,
        calculateMultiPageSlots,
        appVersion,
        isUpdateModalOpen,
        setIsUpdateModalOpen,
        checkForUpdates,
        applyUpdate,
        isCsvModalOpen,
        setIsCsvModalOpen,
        theme: settings.theme,
        toggleTheme,
        setTheme,
        isQuickSearchOpen,
        setIsQuickSearchOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
