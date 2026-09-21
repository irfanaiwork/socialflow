import { GoogleDriveFolder, MediaItem } from '../types';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  thumbnailUrl: string;
  modifiedTime: string;
}

export const DEMO_DRIVE_FILES: DriveFileInfo[] = [
  {
    id: 'drv_01',
    name: 'image_001.png',
    mimeType: 'image/png',
    size: '1.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-09-20 05:10'
  },
  {
    id: 'drv_02',
    name: 'image_002.png',
    mimeType: 'image/png',
    size: '1.4 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-09-20 04:30'
  },
  {
    id: 'drv_03',
    name: 'image_003.png',
    mimeType: 'image/png',
    size: '2.1 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-09-20 03:15'
  },
  {
    id: 'drv_04',
    name: 'budget_pin_001.png',
    mimeType: 'image/png',
    size: '1.9 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-09-19 19:40'
  },
  {
    id: 'drv_05',
    name: 'magic_video_001.mp4',
    mimeType: 'video/mp4',
    size: '18.4 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-09-19 16:20'
  }
];

export class GoogleDriveService {
  private static isConnected: boolean = true;
  private static currentFolder: string = 'SavvyMomBudget';

  static async connectDrive(): Promise<{ success: boolean; message: string }> {
    // Simulated OAuth handshake (in production, uses Google Identity Service / OAuth2)
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
    await new Promise((res) => setTimeout(res, 400));
    return DEMO_DRIVE_FILES;
  }

  static async selectFolder(newFolder: string): Promise<GoogleDriveFolder> {
    await new Promise((res) => setTimeout(res, 350));
    this.currentFolder = newFolder;
    return {
      id: `folder_${Date.now()}`,
      name: newFolder,
      filesCount: 25,
      lastSync: 'Just now',
      isConnected: true
    };
  }

  static async syncFolder(): Promise<{ filesFound: number; newItems: DriveFileInfo[] }> {
    await new Promise((res) => setTimeout(res, 800));
    return {
      filesFound: DEMO_DRIVE_FILES.length,
      newItems: DEMO_DRIVE_FILES
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
      selectedPlatforms: ['pinterest', 'facebook']
    };
  }
}
