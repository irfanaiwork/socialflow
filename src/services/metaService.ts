import { FacebookPage } from '../types';
import { INITIAL_FACEBOOK_PAGES } from './mockData';

export interface PublishMetaPostPayload {
  pageId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  destinationUrl?: string;
  scheduledTime?: string;
}

export class MetaService {
  private static pages: FacebookPage[] = [...INITIAL_FACEBOOK_PAGES];

  static async getPages(): Promise<FacebookPage[]> {
    await new Promise((res) => setTimeout(res, 200));
    return this.pages;
  }

  static async connectMeta(): Promise<{ success: boolean; pagesFound: number }> {
    await new Promise((res) => setTimeout(res, 600));
    return { success: true, pagesFound: this.pages.length };
  }

  static async updatePageGap(pageId: string, gapMinutes: number): Promise<FacebookPage> {
    await new Promise((res) => setTimeout(res, 200));
    const page = this.pages.find(p => p.id === pageId);
    if (!page) throw new Error(`Page ${pageId} not found`);
    page.postingGapMinutes = gapMinutes;
    return { ...page };
  }

  static async publishImagePost(payload: PublishMetaPostPayload): Promise<{ success: boolean; postId: string }> {
    await new Promise((res) => setTimeout(res, 500));
    const page = this.pages.find(p => p.id === payload.pageId);
    if (page) {
      page.dailyPostCount += 1;
      page.lastPublished = new Date().toISOString();
    }
    return {
      success: true,
      postId: `fb_post_${Date.now()}`
    };
  }

  static async publishVideoPost(payload: PublishMetaPostPayload): Promise<{ success: boolean; videoId: string }> {
    await new Promise((res) => setTimeout(res, 800));
    const page = this.pages.find(p => p.id === payload.pageId);
    if (page) {
      page.dailyPostCount += 1;
      page.lastPublished = new Date().toISOString();
    }
    return {
      success: true,
      videoId: `fb_video_${Date.now()}`
    };
  }

  static async getPostStatus(postId: string): Promise<{ status: string; reach: number; reactions: number; shares: number; comments: number }> {
    await new Promise((res) => setTimeout(res, 250));
    return {
      status: 'PUBLISHED',
      reach: Math.floor(Math.random() * 1800) + 400,
      reactions: Math.floor(Math.random() * 140) + 25,
      shares: Math.floor(Math.random() * 45) + 6,
      comments: Math.floor(Math.random() * 32) + 4
    };
  }
}
