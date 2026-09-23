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
  GoogleDriveFolder
} from '../types';

export const INITIAL_YOUTUBE_CHANNELS: YouTubeChannel[] = [];

export const AVAILABLE_DRIVE_FOLDERS: GoogleDriveFolder[] = [
  {
    id: 'folder_pins_2026',
    name: 'Drive_Pin_Designs_2026',
    filesCount: 18,
    lastSync: 'Synced 5m ago',
    isConnected: true
  },
  {
    id: 'folder_shorts_vault',
    name: 'YouTube_Shorts_Vault',
    filesCount: 6,
    lastSync: 'Synced 1h ago',
    isConnected: true
  },
  {
    id: 'folder_bulk_marketing',
    name: 'Social_Media_Bulk_Uploads',
    filesCount: 12,
    lastSync: 'Synced 3h ago',
    isConnected: true
  }
];

export const INITIAL_PINTEREST_ACCOUNTS: PinterestAccount[] = [];

export const INITIAL_FACEBOOK_PAGES: FacebookPage[] = [];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [];

export const INITIAL_QUEUE_ITEMS: QueueItem[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_PROMPT_PROFILES: AiPromptProfile[] = [
  {
    id: 'prof_general',
    name: 'General Growth & Viral Engagement',
    brandName: 'My Brand',
    targetAudience: 'Target audience looking for high-value tips, inspiration, and recommendations',
    tone: 'Helpful, engaging, authoritative, and relatable',
    keywords: ['tips and tricks', 'trending', 'how to', 'best ideas', 'step by step guide'],
    cta: 'Save this post for later and click through to read our complete step-by-step guide!',
    writingStyle: 'Conversational, benefit-driven with clear bullet points and actionable advice',
    platform: 'pinterest'
  },
  {
    id: 'prof_ecommerce',
    name: 'E-Commerce & Product Showcase',
    brandName: 'My Store',
    targetAudience: 'Shoppers looking for top-rated products, reviews, and deals',
    tone: 'Exciting, trustworthy, benefit-focused, and persuasive',
    keywords: ['must have', 'top picks', 'affordable finds', 'product review', 'gift ideas'],
    cta: 'Click the link to shop this find before it sells out!',
    writingStyle: 'Feature-benefit focus, highlighting solutions and practical value',
    platform: 'facebook'
  },
  {
    id: 'prof_tutorials',
    name: 'Tutorials & How-To Guides',
    brandName: 'Studio & DIY',
    targetAudience: 'Learners and creators looking for actionable DIY, tech, or educational walkthroughs',
    tone: 'Instructive, clear, encouraging, and structured',
    keywords: ['step by step', 'diy tutorial', 'beginner guide', 'easy workflow', 'learn fast'],
    cta: 'Pin or save this tutorial to reference during your next project!',
    writingStyle: 'Numbered steps, concise clarity, demystifying technical jargon',
    platform: 'pinterest'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [];

export const INITIAL_SCHEDULE_CONFIG: ScheduleConfig = {
  postsPerDay: 5,
  startTime: '09:00',
  endTime: '21:00',
  intervalMinutes: 60,
  timezone: 'UTC',
  randomizeSchedule: true,
  minimumPageGapMinutes: 60,
  mode: 'smart'
};

export const INITIAL_SETTINGS: GlobalSettings = {
  demoMode: false,
  globalWebsiteUrl: '',
  defaultTimezone: 'UTC',
  autoAnalyzeOnUpload: true,
  autoGenerateTitles: true,
  maxQueueRetries: 3,
  theme: 'dark',
  apiCredentials: {
    pinterestClientId: '',
    pinterestClientSecret: '',
    metaAppId: '',
    metaAppSecret: '',
    youtubeApiKey: '',
    youtubeClientId: '',
    googleDriveApiKey: '',
    googleDriveClientId: ''
  }
};

export const INITIAL_GOOGLE_DRIVE: GoogleDriveFolder = {
  id: 'folder_pins_2026',
  name: 'Drive_Pin_Designs_2026',
  filesCount: 18,
  lastSync: 'Synced 5m ago',
  isConnected: true
};
