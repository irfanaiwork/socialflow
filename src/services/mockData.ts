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

export const INITIAL_YOUTUBE_CHANNELS: YouTubeChannel[] = [
  {
    id: 'yt_channel_01',
    name: 'Magic Shorts Vault',
    handle: '@magicshortsvault',
    avatarUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    subscribersCount: 48200,
    videosCount: 184,
    defaultPrivacy: 'public',
    postingGapMinutes: 60,
    lastPublished: '2026-09-20T04:15:00Z',
    dailyPostCount: 2,
    maxDailyPosts: 6,
    channelUrl: 'https://youtube.com/@magicshortsvault'
  },
  {
    id: 'yt_channel_02',
    name: 'Frugal Living TV',
    handle: '@frugallivingtv',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    subscribersCount: 19500,
    videosCount: 76,
    defaultPrivacy: 'public',
    postingGapMinutes: 90,
    lastPublished: '2026-09-19T21:00:00Z',
    dailyPostCount: 1,
    maxDailyPosts: 4,
    channelUrl: 'https://youtube.com/@frugallivingtv'
  }
];

export const AVAILABLE_DRIVE_FOLDERS: GoogleDriveFolder[] = [
  {
    id: 'gdrive_savvymom',
    name: 'SavvyMomBudget',
    folderPath: '/SocialFlow/SavvyMomBudget',
    folderIdOrUrl: '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT',
    filesCount: 38,
    lastSync: '10 mins ago',
    isConnected: true,
    syncIntervalMinutes: 30
  },
  {
    id: 'gdrive_magicvault',
    name: 'MagicVault',
    folderPath: '/SocialFlow/MagicVault',
    folderIdOrUrl: '9zY8xW7vU6tS5rQ4pP3oN2mM1lL0k',
    filesCount: 54,
    lastSync: '25 mins ago',
    isConnected: true,
    syncIntervalMinutes: 60
  },
  {
    id: 'gdrive_streetmagic',
    name: 'StreetMagicClips',
    folderPath: '/SocialFlow/StreetMagicClips',
    folderIdOrUrl: '2mN3bV4cX5zL6kM7jH8gF9dD0sA',
    filesCount: 29,
    lastSync: '1 hour ago',
    isConnected: true,
    syncIntervalMinutes: 45
  },
  {
    id: 'gdrive_ytshorts',
    name: 'YouTubeShortsDrive',
    folderPath: '/SocialFlow/YouTubeShortsDrive',
    folderIdOrUrl: '4pQ5rS6tU7vW8xY9zA1bC2dE3fG',
    filesCount: 42,
    lastSync: '15 mins ago',
    isConnected: true,
    syncIntervalMinutes: 30
  }
];

export const INITIAL_PINTEREST_ACCOUNTS: PinterestAccount[] = [
  {
    id: 'pin_savvymom_01',
    name: 'Savvy Mom Budget',
    username: '@savvymombudget',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    lastSync: '10 minutes ago',
    postsPublished: 142,
    boards: [
      { id: 'b_frugal', name: 'Frugal Living Hacks', pinCount: 48, description: 'Everyday household money saving tips' },
      { id: 'b_mealprep', name: 'Budget Meal Prep', pinCount: 36, description: 'Affordable family meal planning' },
      { id: 'b_planners', name: 'Free Printable Planners', pinCount: 29, description: 'Budget trackers and expense sheets' },
      { id: 'b_savings', name: 'Emergency Fund Savings', pinCount: 29, description: 'Step-by-step savings challenges' },
    ]
  },
  {
    id: 'pin_magic_02',
    name: 'Magic Inspiration',
    username: '@magicinspiration',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    lastSync: '25 minutes ago',
    postsPublished: 89,
    boards: [
      { id: 'b_cardtricks', name: 'Card Sleights & Flourishes', pinCount: 42, description: 'Intermediate to advanced card magic' },
      { id: 'b_illusions', name: 'Mind Bending Illusions', pinCount: 28, description: 'Visual street magic breakdowns' },
      { id: 'b_props', name: 'Vintage Magic Artifacts', pinCount: 19, description: 'Classic stage props and historical curiosities' }
    ]
  },
  {
    id: 'pin_womentools_03',
    name: "Women's Tools & DIY",
    username: '@womenstoolsdiy',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    lastSync: '1 hour ago',
    postsPublished: 54,
    boards: [
      { id: 'b_power_tools', name: 'Cordless Power Tools 101', pinCount: 24, description: 'Best drills, saws, and safety gear' },
      { id: 'b_home_renos', name: 'Weekend Renovation Projects', pinCount: 18, description: 'Beginner friendly home remodeling' },
      { id: 'b_workshop', name: 'Compact Garage Workshop', pinCount: 12, description: 'Storage and tool organization ideas' }
    ]
  }
];

export const INITIAL_FACEBOOK_PAGES: FacebookPage[] = [
  {
    id: 'fb_page_101',
    name: 'Mystique Magic',
    category: 'Entertainment & Magic',
    avatarUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    postingGapMinutes: 60,
    lastPublished: '2026-09-20T05:30:00Z',
    dailyPostCount: 3,
    maxDailyPosts: 6
  },
  {
    id: 'fb_page_102',
    name: 'Street Magic Daily',
    category: 'Video Creator',
    avatarUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    postingGapMinutes: 90,
    lastPublished: '2026-09-20T04:45:00Z',
    dailyPostCount: 2,
    maxDailyPosts: 5
  },
  {
    id: 'fb_page_103',
    name: 'Urban Magic',
    category: 'Arts & Entertainment',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    postingGapMinutes: 120,
    lastPublished: '2026-09-20T03:15:00Z',
    dailyPostCount: 1,
    maxDailyPosts: 4
  },
  {
    id: 'fb_page_104',
    name: 'Magic Moments',
    category: 'Media & News Company',
    avatarUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    postingGapMinutes: 60,
    lastPublished: '2026-09-20T05:40:00Z',
    dailyPostCount: 4,
    maxDailyPosts: 8
  },
  {
    id: 'fb_page_105',
    name: 'Impossible Magic',
    category: 'Community Organization',
    avatarUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&auto=format&fit=crop&q=80',
    isConnected: true,
    postingGapMinutes: 180,
    lastPublished: '2026-09-20T02:00:00Z',
    dailyPostCount: 1,
    maxDailyPosts: 3
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med_001',
    fileName: 'grocery_challenge.png',
    fileSize: '1.8 MB',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-20 04:12',
    status: 'Ready',
    aiAnalysisStatus: 'Analyzed',
    selectedPlatforms: ['pinterest', 'facebook'],
    destinationUrl: 'https://savvymombudget.blogspot.com/p/20-dollar-grocery-challenge.html',
    aiAnalysis: {
      mainTopic: '$20 Grocery Budget Challenge',
      objects: ['Fresh vegetables', 'Brown paper grocery bag', 'Receipt', 'Apples', 'Whole grains'],
      people: 'None visible',
      environment: 'Sunlit rustic kitchen counter with wooden prep board',
      visualStyle: 'Warm, realistic lifestyle photography with bold badge overlay',
      textVisible: '$20 WEEKLY GROCERY CHALLENGE • 7 DINNERS',
      mainMessage: 'Stretch a tight $20 grocery budget into wholesome, nutritious meals for a week.',
      targetAudience: 'Budget-conscious mothers, young families, and students looking for frugal meal inspiration.',
      contentCategory: 'Frugal Living & Food Budgeting',
      keywords: ['grocery challenge', 'budget meals', 'frugal living', '20 dollar meals', 'cheap grocery list', 'family dinner ideas'],
      searchIntent: 'How to buy a week of groceries on 20 dollars',
      pinterestTitle: '$20 Grocery Challenge: Budget-Friendly Grocery Ideas',
      pinterestDescription: 'Looking for ways to stretch your grocery budget? Discover practical ideas for planning affordable meals and making the most of a $20 grocery budget. Full shopping list inside!',
      facebookCaption: 'Can you create a full grocery plan with just $20? Here are simple, realistic ideas to make every single dollar count this week! 🛒👇',
      suggestedHashtags: ['#GroceryBudget', '#FrugalLiving', '#CheapEats', '#SavvyMom', '#MealPlanningOnABudget'],
      suggestedCta: 'Tap the link to download the complete $20 grocery checklist & meal breakdown!'
    }
  },
  {
    id: 'med_002',
    fileName: 'budget_planner.png',
    fileSize: '2.4 MB',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-20 03:50',
    status: 'Scheduled',
    aiAnalysisStatus: 'Analyzed',
    selectedPlatforms: ['pinterest'],
    scheduledDateTime: '2026-09-20 10:30',
    destinationUrl: 'https://savvymombudget.blogspot.com/p/free-budget-planner.html',
    aiAnalysis: {
      mainTopic: 'Zero-Based Monthly Budget Planner Worksheet',
      objects: ['Printed binder sheets', 'Pastel highlighters', 'Financial calculator', 'Coffee mug', 'Pen'],
      people: 'Female hands writing budget figures',
      environment: 'Modern minimalist white desk layout flat lay',
      visualStyle: 'Clean, organized pastel aesthetic with crisp typography',
      textVisible: 'MONTHLY EXPENSE TRACKER & ZERO-BASED BUDGET PLANNER',
      mainMessage: 'Take control of family finances with this free, printable zero-based budget binder.',
      targetAudience: 'Women and moms seeking orderly household money management.',
      contentCategory: 'Personal Finance & Printables',
      keywords: ['free budget printable', 'expense tracker pdf', 'monthly budget sheet', 'zero based budgeting'],
      searchIntent: 'Download free printable monthly budget sheet',
      pinterestTitle: 'Free Printable Monthly Budget Planner & Expense Tracker',
      pinterestDescription: 'Stop wondering where your paycheck went! Download our free zero-based budget printable template designed to help families track savings, debt payoffs, and everyday spending with ease.',
      facebookCaption: 'Tired of unexpected monthly expenses catching you off guard? Grab our free printable budget binder pages right now! 📓✨',
      suggestedHashtags: ['#BudgetPlanner', '#FreePrintables', '#DebtFreeCommunity', '#FrugalMom', '#MoneyTracker'],
      suggestedCta: 'Click through to download your free high-resolution PDF printables now!'
    }
  },
  {
    id: 'med_003',
    fileName: 'magic_trick_01.mp4',
    fileSize: '14.2 MB',
    mediaType: 'video',
    durationSeconds: 42,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-20 02:20',
    status: 'Scheduled',
    aiAnalysisStatus: 'Analyzed',
    selectedPlatforms: ['facebook'],
    scheduledDateTime: '2026-09-20 11:00',
    destinationUrl: 'https://example.com/magic',
    aiAnalysis: {
      mainTopic: 'Visual Card Teleportation Street Illusion',
      objects: ['Bicycle playing cards', 'Close-up performance mat', 'Pedestrian reactions', 'Card deck box'],
      people: 'Street magician and astonished bystanders in public plaza',
      environment: 'Lively downtown urban street corner with natural daylight',
      visualStyle: 'High-energy vertical video format with slow-motion reveal highlights',
      textVisible: 'THEY COULD NOT BELIEVE THIS HAPPENED 😱♠️',
      mainMessage: 'An impossibly fast visual card transposition executed right in the spectator hands.',
      targetAudience: 'Magic fans, street performance enthusiasts, viral video consumers.',
      contentCategory: 'Magic & Entertainment',
      keywords: ['street magic', 'card trick reveal', 'mind blowing illusion', 'sleight of hand', 'viral magic'],
      searchIntent: 'Best visual street magic card tricks',
      pinterestTitle: 'Incredible Street Magic Card Teleportation Revealed',
      pinterestDescription: 'Watch this mind-bending visual card trick performed right before spectators eyes in broad daylight. Learn the psychology behind misdirection!',
      facebookCaption: 'Watch their faces at the 0:24 mark... total disbelief! Could you spot the secret sleight? Comment your best guess below! 🎩✨♠️',
      suggestedHashtags: ['#StreetMagic', '#CardFlourish', '#MindBlow', '#MagicTricks', '#Illusionist'],
      suggestedCta: 'Share this video with someone who loves mind-bending magic!'
    }
  },
  {
    id: 'med_004',
    fileName: 'street_magic_02.mp4',
    fileSize: '21.5 MB',
    mediaType: 'video',
    durationSeconds: 58,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-19 22:15',
    status: 'Published',
    aiAnalysisStatus: 'Analyzed',
    selectedPlatforms: ['facebook'],
    destinationUrl: 'https://example.com/magic-illusions',
    aiAnalysis: {
      mainTopic: 'Levitating Borrowed Ring On Everyday Rubber Band',
      objects: ['Spectator wedding ring', 'Standard rubber band', 'Spectator hands'],
      people: 'Magician and couple on sidewalk',
      environment: 'Evening illuminated city street',
      visualStyle: 'Intimate close-up macro lens video capturing antigravity illusion',
      textVisible: 'IMPOSSIBLE RING LEVITATION 💍✨',
      mainMessage: 'A borrowed solid ring defies gravity and climbs up an ordinary rubber band.',
      targetAudience: 'Casual magic watchers, party trick enthusiasts, viral short creators.',
      contentCategory: 'Close-Up Magic',
      keywords: ['ring levitation', 'rubber band trick', 'close up magic', 'party tricks'],
      searchIntent: 'How to make a ring float up a rubber band',
      pinterestTitle: 'How to Levitate a Ring Up a Rubber Band: Step by Step',
      pinterestDescription: 'The ultimate impromptu party trick you can do anytime with borrowed items. Fool your friends with this classic close-up levitation illusion.',
      facebookCaption: 'No strings, no mirrors—just physics and misdirection. Watch this borrowed ring crawl uphill completely untouched! 🔥👁️',
      suggestedHashtags: ['#Levitation', '#CloseUpMagic', '#StreetMagicDaily', '#MindFreak'],
      suggestedCta: 'Tag a friend who needs to see this crazy optical trick!'
    }
  },
  {
    id: 'med_005',
    fileName: 'home_budget.png',
    fileSize: '3.1 MB',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-19 18:30',
    status: 'Ready',
    aiAnalysisStatus: 'Pending',
    selectedPlatforms: ['pinterest'],
    destinationUrl: 'https://example.com/budget-planner'
  },
  {
    id: 'med_006',
    fileName: 'image_001.png',
    fileSize: '1.2 MB',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-19 14:10',
    status: 'Ready',
    aiAnalysisStatus: 'Pending',
    selectedPlatforms: ['pinterest', 'facebook'],
    destinationUrl: 'https://example.com'
  }
];

export const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'q_001',
    mediaId: 'med_002',
    mediaName: 'budget_planner.png',
    mediaType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
    platform: 'pinterest',
    pinterestAccountId: 'pin_savvymom_01',
    pinterestAccountName: 'Savvy Mom Budget',
    boardId: 'b_planners',
    boardName: 'Free Printable Planners',
    title: 'Free Printable Monthly Budget Planner & Expense Tracker',
    description: 'Stop wondering where your paycheck went! Download our free zero-based budget printable template designed to help families track savings, debt payoffs, and everyday spending with ease.',
    caption: '',
    destinationUrl: 'https://savvymombudget.blogspot.com/p/free-budget-planner.html',
    scheduledTime: '2026-09-20T10:30:00Z',
    status: 'Scheduled',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-20T04:00:00Z'
  },
  {
    id: 'q_002',
    mediaId: 'med_003',
    mediaName: 'magic_trick_01.mp4',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=80',
    platform: 'facebook',
    facebookPageId: 'fb_page_101',
    facebookPageName: 'Mystique Magic',
    title: 'Visual Card Teleportation Street Illusion',
    description: '',
    caption: 'Watch their faces at the 0:24 mark... total disbelief! Could you spot the secret sleight? Comment your best guess below! 🎩✨♠️',
    destinationUrl: 'https://example.com/magic',
    scheduledTime: '2026-09-20T11:00:00Z',
    status: 'Scheduled',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-20T02:30:00Z'
  },
  {
    id: 'q_003',
    mediaId: 'med_003',
    mediaName: 'magic_trick_01.mp4',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=80',
    platform: 'facebook',
    facebookPageId: 'fb_page_102',
    facebookPageName: 'Street Magic Daily',
    title: 'Visual Card Teleportation Street Illusion',
    description: '',
    caption: 'Pure street reaction! What would you do if a card vanished from inside your closed fist? 😱',
    destinationUrl: 'https://example.com/magic',
    scheduledTime: '2026-09-20T12:30:00Z', // respects 90 min page gap
    status: 'Pending',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-20T02:30:00Z'
  },
  {
    id: 'q_004',
    mediaId: 'med_004',
    mediaName: 'street_magic_02.mp4',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&auto=format&fit=crop&q=80',
    platform: 'facebook',
    facebookPageId: 'fb_page_102',
    facebookPageName: 'Street Magic Daily',
    title: 'Levitating Borrowed Ring On Everyday Rubber Band',
    description: '',
    caption: 'No strings, no mirrors—just physics and misdirection. Watch this borrowed ring crawl uphill completely untouched! 🔥👁️',
    destinationUrl: 'https://example.com/magic-illusions',
    scheduledTime: '2026-09-19T22:30:00Z',
    status: 'Published',
    publishedAt: '2026-09-19T22:30:15Z',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-19T22:15:00Z'
  },
  {
    id: 'q_005',
    mediaId: 'med_001',
    mediaName: 'grocery_challenge.png',
    mediaType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    platform: 'pinterest',
    pinterestAccountId: 'pin_savvymom_01',
    pinterestAccountName: 'Savvy Mom Budget',
    boardId: 'b_frugal',
    boardName: 'Frugal Living Hacks',
    title: '$20 Grocery Challenge: Budget-Friendly Grocery Ideas',
    description: 'Looking for ways to stretch your grocery budget? Discover practical ideas for planning affordable meals and making the most of a $20 grocery budget.',
    caption: '',
    destinationUrl: 'https://savvymombudget.blogspot.com/p/20-dollar-grocery-challenge.html',
    scheduledTime: '2026-09-19T18:00:00Z',
    status: 'Failed',
    retryCount: 1,
    maxRetries: 3,
    errorMessage: 'Pinterest API demo rate limit warning: Temporary endpoint handshake timeout. Retry available.',
    createdAt: '2026-09-19T17:45:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-09-20 06:25',
    platform: 'pinterest',
    action: 'Pinterest Pin Published',
    status: 'success',
    contentTitle: 'Savvy Mom $20 Grocery Challenge',
    targetName: 'Savvy Mom Budget (@savvymombudget)'
  },
  {
    id: 'log_2',
    timestamp: '2026-09-20 06:10',
    platform: 'facebook',
    action: 'Facebook Page Post Scheduled',
    status: 'info',
    contentTitle: 'Visual Card Teleportation Street Illusion',
    targetName: 'Mystique Magic'
  },
  {
    id: 'log_3',
    timestamp: '2026-09-20 05:45',
    platform: 'ai',
    action: 'AI Description Generated',
    status: 'success',
    contentTitle: 'grocery_challenge.png',
    targetName: 'Gemini Vision Analyzer'
  },
  {
    id: 'log_4',
    timestamp: '2026-09-20 04:30',
    platform: 'system',
    action: 'Video Added to Queue',
    status: 'info',
    contentTitle: 'magic_trick_01.mp4',
    targetName: 'Centralized Scheduler Engine'
  },
  {
    id: 'log_5',
    timestamp: '2026-09-20 03:50',
    platform: 'pinterest',
    action: 'Post Failed - Retry Available',
    status: 'error',
    contentTitle: '$20 Grocery Challenge Pin',
    targetName: 'Savvy Mom Budget',
    errorMessage: 'Handshake timeout simulation. Auto-retry scheduled.'
  },
  {
    id: 'log_6',
    timestamp: '2026-09-20 02:00',
    platform: 'google-drive',
    action: 'Google Drive Sync Completed',
    status: 'success',
    contentTitle: 'SavvyMomBudget folder scan',
    targetName: 'Google Drive API'
  }
];

export const INITIAL_PROMPT_PROFILES: AiPromptProfile[] = [
  {
    id: 'prof_savvy',
    name: 'Savvy Mom Budget (Frugal Living)',
    brandName: 'Savvy Mom Budget',
    targetAudience: 'Women, mothers, and young families in the USA seeking practical money-saving advice',
    tone: 'Helpful, warm, encouraging, practical, and highly relatable',
    keywords: ['frugal living', 'budget meal prep', 'zero based budget', 'free printables', 'money saving tips for moms'],
    cta: 'Save this Pin for later and click to grab your free printable expense checklist!',
    writingStyle: 'Conversational, benefit-driven with clear bullet points and actionable steps',
    platform: 'pinterest'
  },
  {
    id: 'prof_magic',
    name: 'Magic & Entertainment (Viral)',
    brandName: 'Mystique Magic Network',
    targetAudience: 'Teens and adults aged 16-45 fascinated by sleight of hand, illusions, and street entertainment',
    tone: 'Mysterious, thrilling, energetic, curious, and engaging',
    keywords: ['street magic', 'optical illusion', 'sleight of hand', 'card tricks', 'mind blowing stunts'],
    cta: 'Drop your theories in the comments and share this trick with your friends!',
    writingStyle: 'Hook-heavy, suspenseful, questions that drive immediate social commentary',
    platform: 'facebook'
  },
  {
    id: 'prof_women_diy',
    name: 'Women Tools & Home Improvement',
    brandName: "Women's Tools & DIY",
    targetAudience: 'Independent women and DIY creators tackling home repairs, woodworking, and renovations',
    tone: 'Empowering, clear, safety-first, instructional, and accessible',
    keywords: ['women with power tools', 'beginner woodworking', 'home repair guide', 'diy renovation tips'],
    cta: 'Pin this guide to your weekend home project board and get building today!',
    writingStyle: 'Step-by-step clarity, demystifying technical jargon, encouraging confidence',
    platform: 'pinterest'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule_001',
    name: 'Savvy Mom Frugal Living (Pinterest #1)',
    description: 'Auto-ingest budgeting infographics from SavvyMomBudget Drive folder, generate SEO descriptions, and pin directly to Frugal Living Hacks board with dedicated deals URL.',
    isEnabled: true,
    isActive: true,
    targetPlatform: 'pinterest',
    pinterestAccountId: 'pin_savvymom_01',
    pinterestAccountName: 'Savvy Mom Budget',
    pinterestBoardId: 'b_frugal',
    pinterestBoardName: 'Frugal Living Hacks',
    googleDriveFolderId: 'gdrive_savvymom',
    googleDriveFolderName: 'SavvyMomBudget',
    customDestinationUrl: 'https://savvymombudget.com/frugal-deals',
    promptProfileId: 'prof_savvy',
    postingGapMinutes: 60,
    dailyLimit: 6,
    autoPublishDirectly: false,
    trigger: 'drive_media_detected',
    triggerType: 'drive_media_detected',
    actions: [
      'Ingest from Drive folder: SavvyMomBudget',
      'Analyze image with Savvy Mom AI Profile',
      'Attach custom URL: https://savvymombudget.com/frugal-deals',
      'Schedule to Pinterest Account: Savvy Mom Budget -> Frugal Living Hacks'
    ],
    lastRun: '2026-09-20 04:30',
    runsCount: 38
  },
  {
    id: 'rule_002',
    name: 'Magic Sleights & Flourishes (Pinterest #2)',
    description: 'Poll MagicVault Drive folder for card trick pins, generate hook-heavy titles, and schedule to Magic Inspiration account on Card Sleights board.',
    isEnabled: true,
    isActive: true,
    targetPlatform: 'pinterest',
    pinterestAccountId: 'pin_magic_02',
    pinterestAccountName: 'Magic Inspiration',
    pinterestBoardId: 'b_cardtricks',
    pinterestBoardName: 'Card Sleights & Flourishes',
    googleDriveFolderId: 'gdrive_magicvault',
    googleDriveFolderName: 'MagicVault',
    customDestinationUrl: 'https://magictricksdaily.com/sleights',
    promptProfileId: 'prof_magic',
    postingGapMinutes: 90,
    dailyLimit: 4,
    autoPublishDirectly: false,
    trigger: 'drive_media_detected',
    triggerType: 'drive_media_detected',
    actions: [
      'Ingest from Drive folder: MagicVault',
      'Analyze sleight-of-hand visuals',
      'Attach custom URL: https://magictricksdaily.com/sleights',
      'Schedule to Pinterest Account: Magic Inspiration -> Card Sleights'
    ],
    lastRun: '2026-09-20 03:15',
    runsCount: 29
  },
  {
    id: 'rule_003',
    name: 'Street Magic Daily (Facebook Page #1)',
    description: 'Auto-publish viral street clips to Street Magic Daily Facebook page with strict 90-minute posting gap to maintain high organic page authority.',
    isEnabled: true,
    isActive: true,
    targetPlatform: 'facebook',
    facebookPageId: 'fb_page_102',
    facebookPageName: 'Street Magic Daily',
    googleDriveFolderId: 'gdrive_streetmagic',
    googleDriveFolderName: 'StreetMagicClips',
    customDestinationUrl: 'https://streetmagicdaily.com/viral',
    promptProfileId: 'prof_magic',
    postingGapMinutes: 90,
    dailyLimit: 5,
    autoPublishDirectly: false,
    trigger: 'video_detected',
    triggerType: 'video_detected',
    actions: [
      'Detect street magic video in StreetMagicClips folder',
      'Generate viral Facebook caption with hashtags',
      'Enforce 90-minute minimum delay gap',
      'Publish to Street Magic Daily Facebook Page'
    ],
    lastRun: '2026-09-20 02:20',
    runsCount: 24
  },
  {
    id: 'rule_004',
    name: 'Mystique Magic Network (Facebook Page #2)',
    description: 'Distribute stage illusion clips to Mystique Magic page with 60-minute posting gap and watch landing page destination URL.',
    isEnabled: true,
    isActive: true,
    targetPlatform: 'facebook',
    facebookPageId: 'fb_page_101',
    facebookPageName: 'Mystique Magic',
    googleDriveFolderId: 'gdrive_magicvault',
    googleDriveFolderName: 'MagicVault',
    customDestinationUrl: 'https://mystiquemagic.tv/watch',
    promptProfileId: 'prof_magic',
    postingGapMinutes: 60,
    dailyLimit: 6,
    autoPublishDirectly: false,
    trigger: 'drive_media_detected',
    triggerType: 'drive_media_detected',
    actions: [
      'Ingest illusion video from MagicVault',
      'Generate engaging Facebook caption & poll question',
      'Enforce 60-minute minimum gap',
      'Publish to Mystique Magic Facebook Page'
    ],
    lastRun: '2026-09-19 22:40',
    runsCount: 19
  },
  {
    id: 'rule_005',
    name: 'Viral Shorts Upload (YouTube Shorts Channel)',
    description: 'Auto-detect vertical videos under 60 seconds from YouTubeShortsDrive, generate viral Shorts tags & description, and enqueue for YouTube Shorts publishing.',
    isEnabled: true,
    isActive: true,
    targetPlatform: 'youtube',
    youtubeChannelId: 'yt_channel_01',
    youtubeChannelName: 'Magic Shorts Vault',
    googleDriveFolderId: 'gdrive_ytshorts',
    googleDriveFolderName: 'YouTubeShortsDrive',
    customDestinationUrl: 'https://magicshortsvault.com/subscribe',
    promptProfileId: 'prof_magic',
    postingGapMinutes: 60,
    dailyLimit: 6,
    autoPublishDirectly: false,
    trigger: 'video_detected',
    triggerType: 'video_detected',
    actions: [
      'Detect MP4 in YouTubeShortsDrive (< 60s Shorts)',
      'Generate YouTube Shorts Title, Tags #Shorts #Magic',
      'Attach custom subscription link in description',
      'Schedule to YouTube Channel: Magic Shorts Vault'
    ],
    lastRun: '2026-09-20 04:15',
    runsCount: 15
  }
];

export const INITIAL_SCHEDULE_CONFIG: ScheduleConfig = {
  postsPerDay: 5,
  startTime: '09:00',
  endTime: '21:00',
  intervalMinutes: 90,
  timezone: 'Asia/Karachi',
  randomizeSchedule: true,
  minimumPageGapMinutes: 60,
  mode: 'smart'
};

export const INITIAL_SETTINGS: GlobalSettings = {
  demoMode: true,
  zeroBudgetMode: true,
  globalWebsiteUrl: 'https://example.com',
  defaultTimezone: 'Asia/Karachi',
  autoAnalyzeOnUpload: true,
  autoGenerateTitles: true,
  maxQueueRetries: 3,
  theme: 'dark',
  apiCredentials: {
    pinterestClientId: 'pnt_app_live_89172635489',
    pinterestClientSecret: 'sec_live_9a8b7c6d5e4f3a2b1c',
    metaAppId: '109283746592019',
    metaAppSecret: 'meta_sec_4f3e2d1c0b9a8',
    youtubeApiKey: 'AIzaSyDemoYouTubeDataApiKey_ZeroBudget',
    youtubeClientId: '89102938475-ytclient.apps.googleusercontent.com',
    googleDriveApiKey: 'AIzaSyDemoGoogleDriveApiKey_ZeroCost',
    googleDriveClientId: '1234567890-gdriveclient.apps.googleusercontent.com'
  }
};

export const INITIAL_GOOGLE_DRIVE: GoogleDriveFolder = {
  id: 'gdrive_savvymom',
  name: 'SavvyMomBudget',
  filesCount: 25,
  lastSync: 'Today at 02:00 AM (Demo Sync)',
  isConnected: true
};
