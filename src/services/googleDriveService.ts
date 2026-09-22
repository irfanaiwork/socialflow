import { GoogleDriveFolder, MediaItem } from '../types';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  thumbnailUrl: string;
  modifiedTime: string;
}

export const DEMO_DRIVE_FILES: DriveFileInfo[] = [];

export class GoogleDriveService {
  private static isConnected: boolean = false;
  private static currentFolder: string = '';

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
