import { PinterestAccount, PinterestBoard } from '../types';
import { INITIAL_PINTEREST_ACCOUNTS } from './mockData';

export interface CreatePinPayload {
  accountId: string;
  boardId: string;
  title: string;
  description: string;
  destinationUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  scheduledTime?: string;
}

export class PinterestService {
  private static accounts: PinterestAccount[] = [...INITIAL_PINTEREST_ACCOUNTS];

  static async getAccounts(): Promise<PinterestAccount[]> {
    await new Promise((res) => setTimeout(res, 200));
    return this.accounts;
  }

  static async connectPinterest(accountName: string, username: string): Promise<PinterestAccount> {
    await new Promise((res) => setTimeout(res, 500));
    const newAccount: PinterestAccount = {
      id: `pin_${Date.now()}`,
      name: accountName,
      username: username.startsWith('@') ? username : `@${username}`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isConnected: true,
      lastSync: 'Just now',
      postsPublished: 0,
      boards: [
        { id: `b_${Date.now()}_1`, name: 'General Inspiration', pinCount: 0, description: 'Default board' },
        { id: `b_${Date.now()}_2`, name: 'Trending Content', pinCount: 0, description: 'Weekly features' }
      ]
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  static async disconnectPinterest(accountId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    const acc = this.accounts.find(a => a.id === accountId);
    if (acc) {
      acc.isConnected = false;
      return true;
    }
    return false;
  }

  static async getPinterestBoards(accountId: string): Promise<PinterestBoard[]> {
    await new Promise((res) => setTimeout(res, 200));
    const acc = this.accounts.find(a => a.id === accountId);
    return acc ? acc.boards : [];
  }

  static async createBoard(accountId: string, boardName: string, description: string = ''): Promise<PinterestBoard> {
    await new Promise((res) => setTimeout(res, 300));
    const acc = this.accounts.find(a => a.id === accountId);
    if (!acc) throw new Error(`Account ${accountId} not found`);
    const newBoard: PinterestBoard = {
      id: `b_${Date.now()}`,
      name: boardName,
      description,
      pinCount: 0
    };
    acc.boards.push(newBoard);
    return newBoard;
  }

  static async createPin(payload: CreatePinPayload): Promise<{ success: boolean; pinId: string; destinationUrl: string }> {
    await new Promise((res) => setTimeout(res, 600));
    // Verify destination URL preservation
    if (!payload.destinationUrl) {
      throw new Error('Destination URL is required for Pinterest Pins');
    }
    return {
      success: true,
      pinId: `pin_item_${Date.now()}`,
      destinationUrl: payload.destinationUrl
    };
  }

  static async getPinStatus(pinId: string): Promise<{ status: string; impressions: number; saves: number; clicks: number }> {
    await new Promise((res) => setTimeout(res, 250));
    return {
      status: 'PUBLISHED',
      impressions: Math.floor(Math.random() * 450) + 120,
      saves: Math.floor(Math.random() * 35) + 5,
      clicks: Math.floor(Math.random() * 25) + 3
    };
  }
}
