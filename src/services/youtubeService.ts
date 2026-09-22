import { YouTubeChannel } from '../types';

export class YouTubeService {
  private static channels: YouTubeChannel[] = [];

  static getChannels(): YouTubeChannel[] {
    return this.channels;
  }

  static async connectChannel(name: string, handle: string, gapMinutes: number = 60): Promise<YouTubeChannel> {
    await new Promise((r) => setTimeout(r, 600));
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const newChannel: YouTubeChannel = {
      id: `yt_chan_${Date.now()}`,
      name,
      handle: cleanHandle,
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      subscribersCount: 0,
      videosCount: 0,
      defaultPrivacy: 'public',
      postingGapMinutes: gapMinutes || 60,
      dailyPostCount: 0,
      maxDailyPosts: 5,
      channelUrl: `https://youtube.com/${cleanHandle.replace('@', '')}`
    };
    return newChannel;
  }

  static async publishVideo(channelId: string, videoPayload: {
    title: string;
    description: string;
    destinationUrl: string;
    privacy: 'public' | 'unlisted' | 'private';
    tags: string[];
    isShorts?: boolean;
  }): Promise<{ success: boolean; videoId: string; url: string }> {
    await new Promise((r) => setTimeout(r, 750));
    const videoId = `yt_vid_${Date.now()}`;
    return {
      success: true,
      videoId,
      url: `https://youtube.com/shorts/${videoId}`
    };
  }
}
