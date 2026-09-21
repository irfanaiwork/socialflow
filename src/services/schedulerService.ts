import { FacebookPage, QueueItem, MediaItem, ScheduleConfig } from '../types';

export interface CalculatedSlot {
  pageId: string;
  pageName: string;
  slotIso: string;
  slotFormatted: string;
  gapMinutes: number;
  isCompliant: boolean;
  reason: string;
}

export class SchedulerService {
  /**
   * Checks if a proposed scheduled time complies with a Facebook Page's minimum posting gap
   */
  static checkPageGap(
    page: FacebookPage,
    proposedDate: Date,
    existingQueueForPage: QueueItem[]
  ): { isEligible: boolean; nextAvailableSlot: Date; reason: string } {
    const minGapMs = page.postingGapMinutes * 60 * 1000;

    // Check against lastPublished
    if (page.lastPublished) {
      const lastPubDate = new Date(page.lastPublished);
      const diffSinceLastPub = proposedDate.getTime() - lastPubDate.getTime();
      if (diffSinceLastPub < minGapMs) {
        const eligible = new Date(lastPubDate.getTime() + minGapMs);
        return {
          isEligible: false,
          nextAvailableSlot: eligible,
          reason: `Too close to last published post at ${lastPubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Needs at least ${page.postingGapMinutes}m gap.`
        };
      }
    }

    // Check against existing scheduled queue items for this page
    for (const item of existingQueueForPage) {
      if (item.status === 'Scheduled' || item.status === 'Pending' || item.status === 'Published') {
        const itemDate = new Date(item.scheduledTime);
        const diff = Math.abs(proposedDate.getTime() - itemDate.getTime());
        if (diff < minGapMs) {
          const nextSlot = new Date(itemDate.getTime() + minGapMs);
          return {
            isEligible: false,
            nextAvailableSlot: nextSlot,
            reason: `Conflicts with scheduled post "${item.title.slice(0, 20)}..." at ${itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. (Min gap: ${page.postingGapMinutes}m)`
          };
        }
      }
    }

    return {
      isEligible: true,
      nextAvailableSlot: proposedDate,
      reason: `Complies with ${page.postingGapMinutes}m minimum posting gap`
    };
  }

  /**
   * Multi-page distribution algorithm:
   * Given a list of target Facebook pages and a base start time,
   * calculates staggered eligible slots for every single page respecting each page's specific gap!
   */
  static calculateMultiPageSlots(
    pages: FacebookPage[],
    baseStartTime: Date,
    existingQueue: QueueItem[]
  ): CalculatedSlot[] {
    const results: CalculatedSlot[] = [];

    // Track rolling cursor
    let currentCursor = new Date(baseStartTime.getTime());

    pages.forEach((page, index) => {
      const pageQueue = existingQueue.filter(q => q.facebookPageId === page.id);
      
      // Each page starts offset or at cursor, then gap-checked
      let testSlot = new Date(currentCursor.getTime() + (index > 0 ? 15 * 60 * 1000 * index : 0));
      let gapCheck = this.checkPageGap(page, testSlot, pageQueue);

      while (!gapCheck.isEligible) {
        testSlot = new Date(gapCheck.nextAvailableSlot.getTime());
        gapCheck = this.checkPageGap(page, testSlot, pageQueue);
      }

      results.push({
        pageId: page.id,
        pageName: page.name,
        slotIso: testSlot.toISOString(),
        slotFormatted: testSlot.toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        gapMinutes: page.postingGapMinutes,
        isCompliant: true,
        reason: gapCheck.reason
      });
    });

    return results;
  }

  /**
   * Generates a smart distribution across a time window (e.g., 09:00 AM to 09:00 PM)
   */
  static generateSmartScheduleSlots(
    count: number,
    config: ScheduleConfig,
    baseDate: Date = new Date()
  ): Date[] {
    const slots: Date[] = [];
    const [startH, startM] = config.startTime.split(':').map(Number);
    const [endH, endM] = config.endTime.split(':').map(Number);

    const startDateTime = new Date(baseDate);
    startDateTime.setHours(startH, startM, 0, 0);

    const endDateTime = new Date(baseDate);
    endDateTime.setHours(endH, endM, 0, 0);

    const totalDurationMs = Math.max(endDateTime.getTime() - startDateTime.getTime(), 60 * 60 * 1000);
    const stepMs = totalDurationMs / Math.max(count, 1);

    for (let i = 0; i < count; i++) {
      let slotMs = startDateTime.getTime() + (stepMs * i);
      if (config.randomizeSchedule && count > 1) {
        // Add subtle +/- 10 minute natural variance
        const varianceMs = (Math.random() * 20 - 10) * 60 * 1000;
        slotMs = Math.max(startDateTime.getTime(), Math.min(endDateTime.getTime(), slotMs + varianceMs));
      }
      slots.push(new Date(slotMs));
    }

    return slots;
  }

  /**
   * Helper to create queue items from multi-page distribution
   */
  static createQueueItemsForPages(
    media: MediaItem,
    pages: FacebookPage[],
    baseTitle: string,
    baseCaption: string,
    destinationUrl: string,
    slots: CalculatedSlot[]
  ): QueueItem[] {
    return pages.map((page) => {
      const assignedSlot = slots.find(s => s.pageId === page.id);
      const scheduledTime = assignedSlot ? assignedSlot.slotIso : new Date().toISOString();

      return {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        mediaId: media.id,
        mediaName: media.fileName,
        mediaType: media.mediaType,
        thumbnailUrl: media.thumbnailUrl,
        platform: 'facebook',
        facebookPageId: page.id,
        facebookPageName: page.name,
        title: baseTitle,
        description: '',
        caption: baseCaption,
        destinationUrl: destinationUrl || 'https://example.com',
        scheduledTime,
        status: 'Scheduled',
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date().toISOString()
      };
    });
  }
}
