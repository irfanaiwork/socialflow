import { YouTubeChannel } from '../types';

export class YouTubeService {
  private static channels: YouTubeChannel[] = [
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

  static getChannels(): YouTubeChannel[] {
    return this.channels;
  }

  static async connectChannel(name: string, handle: string): Promise<YouTubeChannel> {
    await new Promise((r) => setTimeout(r, 600));
    const newChannel: YouTubeChannel = {
      id: `yt_chan_${Date.now()}`,
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      subscribersCount: 1250,
      videosCount: 8,
      defaultPrivacy: 'public',
      postingGapMinutes: 60,
      dailyPostCount: 0,
      maxDailyPosts: 5,
      channelUrl: `https://youtube.com/${handle}`
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
