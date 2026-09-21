export type MediaType = 'image' | 'video';

export type PostStatus = 
  | 'Pending'
  | 'Processing'
  | 'Scheduled'
  | 'Publishing'
  | 'Published'
  | 'Failed'
  | 'Retrying';

export type PlatformType = 'pinterest' | 'facebook' | 'youtube';

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  pinCount: number;
}

export interface PinterestAccount {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isConnected: boolean;
  boards: PinterestBoard[];
  lastSync: string;
  postsPublished: number;
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  isConnected: boolean;
  postingGapMinutes: number; // e.g. 60, 90, 120, 180
  lastPublished?: string;
  lastPostTime?: string;
  nextAvailableSlot?: string;
  postsPublished?: number;
  dailyPostCount: number;
  maxDailyPosts: number;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isConnected: boolean;
  subscribersCount: number;
  videosCount: number;
  defaultPrivacy: 'public' | 'unlisted' | 'private';
  postingGapMinutes: number;
  lastPublished?: string;
  postsPublished?: number;
  dailyPostCount: number;
  maxDailyPosts: number;
  channelUrl?: string;
}

export interface AiVisualAnalysis {
  mainTopic: string;
  objects: string[];
  people: string;
  environment: string;
  visualStyle: string;
  textVisible: string;
  mainMessage: string;
  targetAudience: string;
  contentCategory: string;
  keywords: string[];
  searchIntent: string;
  visualElementsSummary?: string;
  suggestedDestinationUrl?: string;
  // Generated content
  pinterestTitle: string;
  pinterestDescription: string;
  facebookCaption: string;
  youtubeTitle?: string;
  youtubeDescription?: string;
  youtubeTags?: string[];
  suggestedHashtags: string[];
  suggestedCta: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileSize: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl: string;
  uploadDate: string;
  status: 'Ready' | 'Scheduled' | 'Published' | 'Failed';
  aiAnalysisStatus: 'Pending' | 'Processing' | 'Analyzed' | 'Failed';
  aiAnalysis?: AiVisualAnalysis;
  selectedPlatforms: PlatformType[];
  scheduledDateTime?: string;
  destinationUrl?: string;
  durationSeconds?: number; // for video
  dimensions?: { width: number; height: number };
}

export interface QueueItem {
  id: string;
  mediaId: string;
  mediaName: string;
  mediaType: MediaType;
  thumbnailUrl: string;
  platform: PlatformType;
  // For Pinterest
  pinterestAccountId?: string;
  pinterestAccountName?: string;
  boardId?: string;
  boardName?: string;
  // For Facebook
  facebookPageId?: string;
  facebookPageName?: string;
  // For YouTube
  youtubeChannelId?: string;
  youtubeChannelName?: string;
  youtubePrivacy?: 'public' | 'unlisted' | 'private';
  youtubeTags?: string[];
  
  title: string;
  description: string; // for Pinterest & YouTube
  caption: string;     // for Facebook
  destinationUrl: string;
  scheduledTime: string;
  status: PostStatus;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  platform: PlatformType | 'system' | 'google-drive' | 'ai';
  action: string;
  status: 'success' | 'warning' | 'error' | 'info';
  contentTitle: string;
  targetName?: string;
  errorMessage?: string;
}

export interface AiPromptProfile {
  id: string;
  name: string;
  brandName: string;
  targetAudience: string;
  tone: string;
  keywords?: string[];
  targetKeywords?: string[];
  cta?: string;
  writingStyle?: string;
  platform?: 'all' | 'pinterest' | 'facebook' | 'youtube';
  destinationUrlTemplate?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  isEnabled?: boolean;
  isActive?: boolean;
  targetPlatform: 'all' | 'pinterest' | 'facebook' | 'youtube';
  platform?: 'both' | 'pinterest' | 'facebook' | 'youtube' | 'all';
  
  // Specific target bindings per automation
  pinterestAccountId?: string;
  pinterestAccountName?: string;
  pinterestBoardId?: string;
  pinterestBoardName?: string;
  facebookPageId?: string;
  facebookPageName?: string;
  youtubeChannelId?: string;
  youtubeChannelName?: string;

  // Google Drive binding per automation
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  
  // Per-automation custom destination URL (overrides global fallback)
  customDestinationUrl?: string;

  // AI & Schedule customization per automation
  promptProfileId?: string;
  customKeywords?: string[];
  customCta?: string;
  postingGapMinutes?: number;
  dailyLimit?: number;
  autoPublishDirectly?: boolean;

  trigger: string;
  triggerType?: 'drive_media_detected' | 'scheduled_timer' | 'video_detected';
  action?: string;
  actions?: string[];
  lastRun?: string;
  runsCount?: number;
  lastProcessedItem?: string;
}

export interface ScheduleConfig {
  postsPerDay: number;
  startTime: string; // "09:00"
  endTime: string;   // "21:00"
  intervalMinutes: number;
  timezone: string;
  randomizeSchedule: boolean;
  minimumPageGapMinutes: number;
  mode: 'fixed' | 'smart';
}

export interface GlobalSettings {
  demoMode: boolean;
  zeroBudgetMode?: boolean;
  globalWebsiteUrl: string;
  defaultTimezone: string;
  autoAnalyzeOnUpload: boolean;
  autoGenerateTitles: boolean;
  maxQueueRetries: number;
  theme: 'dark' | 'light';
  apiCredentials?: {
    pinterestClientId?: string;
    pinterestClientSecret?: string;
    metaAppId?: string;
    metaAppSecret?: string;
    youtubeApiKey?: string;
    youtubeClientId?: string;
    googleDriveApiKey?: string;
    googleDriveClientId?: string;
    googleDriveClientSecret?: string;
  };
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  folderPath?: string;
  folderIdOrUrl?: string;
  filesCount: number;
  lastSync: string;
  isConnected: boolean;
  syncIntervalMinutes?: number;
}
