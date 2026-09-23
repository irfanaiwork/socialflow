import { GoogleDriveFolder, MediaItem } from '../types';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  thumbnailUrl: string;
  modifiedTime: string;
}

export const DEMO_DRIVE_FILES: (DriveFileInfo & { folder?: string })[] = [
  {
    id: 'drv_pin_01',
    name: 'modern-kitchen-quartz-countertops.jpg',
    mimeType: 'image/jpeg',
    size: '1.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
    modifiedTime: '2026-09-21 14:20',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_02',
    name: 'minimalist-home-office-desk-setup.jpg',
    mimeType: 'image/jpeg',
    size: '2.4 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    modifiedTime: '2026-09-21 14:22',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_03',
    name: 'healthy-mediterranean-quinoa-salad.jpg',
    mimeType: 'image/jpeg',
    size: '1.5 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    modifiedTime: '2026-09-21 14:25',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_04',
    name: '24-daily-pins-automation-strategy.jpg',
    mimeType: 'image/jpeg',
    size: '2.1 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    modifiedTime: '2026-09-21 14:28',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_05',
    name: 'daily-budget-printable-planner-sheet.jpg',
    mimeType: 'image/jpeg',
    size: '1.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    modifiedTime: '2026-09-21 14:30',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_06',
    name: 'cozy-scandinavian-living-room-decor.jpg',
    mimeType: 'image/jpeg',
    size: '3.1 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    modifiedTime: '2026-09-21 14:32',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_07',
    name: 'iced-matcha-latte-morning-routine.jpg',
    mimeType: 'image/jpeg',
    size: '1.9 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800',
    modifiedTime: '2026-09-21 14:35',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_08',
    name: 'clean-skincare-routine-aesthetic.jpg',
    mimeType: 'image/jpeg',
    size: '1.6 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    modifiedTime: '2026-09-21 14:38',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_09',
    name: 'indoor-houseplant-propagation-guide.jpg',
    mimeType: 'image/jpeg',
    size: '2.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    modifiedTime: '2026-09-21 14:40',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_10',
    name: 'cozy-coffee-brewing-espresso-art.jpg',
    mimeType: 'image/jpeg',
    size: '2.0 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    modifiedTime: '2026-09-21 14:42',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_11',
    name: 'morning-workout-yoga-stretching.jpg',
    mimeType: 'image/jpeg',
    size: '2.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    modifiedTime: '2026-09-21 14:45',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_12',
    name: 'sustainable-capsule-wardrobe-essentials.jpg',
    mimeType: 'image/jpeg',
    size: '2.7 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
    modifiedTime: '2026-09-21 14:48',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_13',
    name: 'fresh-berry-smoothie-bowl-recipe.jpg',
    mimeType: 'image/jpeg',
    size: '1.7 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800',
    modifiedTime: '2026-09-21 14:50',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_14',
    name: 'diy-modern-floating-shelves-project.jpg',
    mimeType: 'image/jpeg',
    size: '2.5 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
    modifiedTime: '2026-09-21 14:52',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_15',
    name: 'cozy-autumn-reading-nook-aesthetic.jpg',
    mimeType: 'image/jpeg',
    size: '3.0 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    modifiedTime: '2026-09-21 14:55',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_16',
    name: 'freelance-designer-workspace-setup.jpg',
    mimeType: 'image/jpeg',
    size: '2.3 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    modifiedTime: '2026-09-21 14:58',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_17',
    name: 'artisan-sourdough-bread-scoring-tips.jpg',
    mimeType: 'image/jpeg',
    size: '2.6 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    modifiedTime: '2026-09-21 15:00',
    folder: 'Drive_Pin_Designs_2026'
  },
  {
    id: 'drv_pin_18',
    name: 'zero-waste-kitchen-pantry-organization.jpg',
    mimeType: 'image/jpeg',
    size: '2.9 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800',
    modifiedTime: '2026-09-21 15:02',
    folder: 'Drive_Pin_Designs_2026'
  },
  // Shorts videos
  {
    id: 'drv_short_01',
    name: 'card-teleportation-street-magic.mp4',
    mimeType: 'video/mp4',
    size: '8.4 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    modifiedTime: '2026-09-21 15:10',
    folder: 'YouTube_Shorts_Vault'
  },
  {
    id: 'drv_short_02',
    name: '10-second-morning-desk-reset.mp4',
    mimeType: 'video/mp4',
    size: '6.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
    modifiedTime: '2026-09-21 15:15',
    folder: 'YouTube_Shorts_Vault'
  },
  {
    id: 'drv_short_03',
    name: 'quick-creamy-garlic-pasta-short.mp4',
    mimeType: 'video/mp4',
    size: '7.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=800',
    modifiedTime: '2026-09-21 15:20',
    folder: 'YouTube_Shorts_Vault'
  }
];

export class GoogleDriveService {
  private static isConnected: boolean = true;
  private static currentFolder: string = 'Drive_Pin_Designs_2026';

  static async connectDrive(): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 600));
    this.isConnected = true;
    return { success: true, message: 'Google Drive connected successfully' };
  }

  static async disconnectDrive(): Promise<{ success: boolean }> {
    await new Promise((res) => setTimeout(res, 300));
    this.isConnected = false;
    return { success: true };
  }

  static async listFiles(folderName: string = this.currentFolder): Promise<DriveFileInfo[]> {
    await new Promise((res) => setTimeout(res, 300));
    if (!folderName) return DEMO_DRIVE_FILES;
    const filtered = DEMO_DRIVE_FILES.filter(f => !f.folder || f.folder === folderName);
    return filtered.length > 0 ? filtered : DEMO_DRIVE_FILES;
  }

  static async selectFolder(newFolder: string): Promise<GoogleDriveFolder> {
    await new Promise((res) => setTimeout(res, 300));
    this.currentFolder = newFolder;
    const files = await this.listFiles(newFolder);
    return {
      id: `folder_${newFolder.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: newFolder,
      filesCount: files.length,
      lastSync: 'Just now',
      isConnected: true
    };
  }

  static async syncFolder(folderName: string = this.currentFolder): Promise<{ filesFound: number; newItems: DriveFileInfo[] }> {
    await new Promise((res) => setTimeout(res, 500));
    const files = await this.listFiles(folderName);
    return {
      filesFound: files.length,
      newItems: files
    };
  }

  static convertToFileMediaItem(file: DriveFileInfo): MediaItem {
    const isVideo = file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.webm');
    return {
      id: `med_drive_${file.id}`,
      fileName: file.name,
      fileSize: file.size,
      mediaType: isVideo ? 'video' : 'image',
      url: file.thumbnailUrl,
      thumbnailUrl: file.thumbnailUrl,
      uploadDate: file.modifiedTime,
      status: 'Ready',
      aiAnalysisStatus: 'Pending',
      selectedPlatforms: isVideo ? ['youtube', 'facebook'] : ['pinterest', 'facebook']
    };
  }
}
