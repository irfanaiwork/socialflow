import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem, PlatformType, QueueItem } from '../../types';
import {
  Sparkles,
  Bookmark,
  Share2,
  Youtube,
  Calendar,
  Layers,
  Send,
  ExternalLink,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Info
} from 'lucide-react';
import { AiService } from '../../services/aiService';

export const CreatePostView: React.FC = () => {
  const {
    mediaItems,
    pinterestAccounts,
    facebookPages,
    youtubeChannels,
    promptProfiles,
    activePromptProfileId,
    composerSelectedMedia,
    setComposerSelectedMedia,
    addQueueItem,
    addMultipleQueueItems,
    publishQueueItemNow,
    navigateTo,
    showToast,
    getEffectiveDestinationUrl,
    calculateMultiPageSlots,
    settings
  } = useApp();

  // Selected media
  const [selectedMediaId, setSelectedMediaId] = useState<string>(
    composerSelectedMedia?.id || (mediaItems[0]?.id || '')
  );

  // Platforms
  const [platformSelection, setPlatformSelection] = useState<'both' | 'pinterest' | 'facebook' | 'youtube' | 'all'>('both');

  // Pinterest targeting
  const [selectedPinterestAccountId, setSelectedPinterestAccountId] = useState<string>(
    pinterestAccounts[0]?.id || ''
  );
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');

  // Facebook targeting: Multiple pages
  const [selectedFacebookPageIds, setSelectedFacebookPageIds] = useState<string[]>([
    facebookPages[0]?.id || '',
    facebookPages[1]?.id || ''
  ]);
  const [multiPageMode, setMultiPageMode] = useState<'same' | 'custom'>('same');

  // YouTube targeting
  const [selectedYouTubeChannelId, setSelectedYouTubeChannelId] = useState<string>(
    youtubeChannels[0]?.id || ''
  );

  // Post Content Fields
  const [title, setTitle] = useState('');
  const [pinterestDescription, setPinterestDescription] = useState('');
  const [facebookCaption, setFacebookCaption] = useState('');
  const [perPostDestinationUrl, setPerPostDestinationUrl] = useState('');
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Scheduling fields
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule' | 'queue'>('schedule');
  const [publishDate, setPublishDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [publishTime, setPublishTime] = useState('10:30');

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Active media reference
  const currentMedia = mediaItems.find(m => m.id === selectedMediaId) || composerSelectedMedia;

  // Sync board options when pinterest account changes
  const activePinterestAccount = pinterestAccounts.find(a => a.id === selectedPinterestAccountId);
  useEffect(() => {
    if (activePinterestAccount && activePinterestAccount.boards.length > 0) {
      setSelectedBoardId(activePinterestAccount.boards[0].id);
    }
  }, [selectedPinterestAccountId, activePinterestAccount]);

  // If media has pre-existing AI analysis or destination URL, populate
  useEffect(() => {
    if (currentMedia) {
      if (currentMedia.destinationUrl) {
        setPerPostDestinationUrl(currentMedia.destinationUrl);
      }
      if (currentMedia.aiAnalysis) {
        setTitle(currentMedia.aiAnalysis.pinterestTitle);
        setPinterestDescription(currentMedia.aiAnalysis.pinterestDescription);
        setFacebookCaption(currentMedia.aiAnalysis.facebookCaption);
      } else {
        // Fallback default
        const cleanName = currentMedia.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cap = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setTitle(cap);
        setPinterestDescription(`Discover practical ideas and top takeaways from ${cap}.`);
        setFacebookCaption(`Check out this exciting update on ${cap}! What do you think? Drop a comment!`);
      }
    }
  }, [currentMedia]);

  // URL Validator
  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return true; // Global fallback is allowed
    try {
      new URL(url);
      setUrlValidationError(null);
      return true;
    } catch {
      setUrlValidationError('Please enter a valid URL (e.g., https://savvymombudget.blogspot.com)');
      return false;
    }
  };

  // Live gap calculation for selected Facebook Pages
  const targetBaseDate = new Date(`${publishDate}T${publishTime}:00`);
  const calculatedSlots = calculateMultiPageSlots(selectedFacebookPageIds, targetBaseDate);

  // Trigger AI Auto-Generate
  const handleAiAutoGenerate = async () => {
    if (!currentMedia) return;
    setIsGeneratingAi(true);
    showToast('info', 'AI Generation', `Analyzing visual features of ${currentMedia.fileName}...`);

    try {
      const activeProfile = promptProfiles.find(p => p.id === activePromptProfileId);
      const analysis = await AiService.analyzeMedia(currentMedia, activeProfile);
      setTitle(analysis.pinterestTitle);
      setPinterestDescription(analysis.pinterestDescription);
      setFacebookCaption(analysis.facebookCaption);
      showToast('success', 'AI Metadata Generated', `Adapted for ${activeProfile?.brandName || 'SocialFlow'}`);
    } catch (err: any) {
      showToast('error', 'Generation Error', err?.message || 'Could not generate metadata.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentMedia) {
      showToast('error', 'Missing Media', 'Please select or upload a media file to post.');
      return;
    }

    if (!validateUrl(perPostDestinationUrl)) {
      showToast('error', 'Invalid URL', 'Destination URL format is invalid.');
      return;
    }

    const needsPinterest = platformSelection === 'both' || platformSelection === 'all' || platformSelection === 'pinterest';
    if (needsPinterest && !activePinterestAccount) {
      showToast('error', 'Pinterest Account Required', 'Please connect a Pinterest account before scheduling to Pinterest.');
      return;
    }

    const needsFacebook = platformSelection === 'both' || platformSelection === 'all' || platformSelection === 'facebook';
    const validFacebookPageIds = selectedFacebookPageIds.filter(id => id && facebookPages.some(p => p.id === id));
    if (needsFacebook && validFacebookPageIds.length === 0) {
      showToast('error', 'Facebook Page Required', 'Please connect and select at least one Facebook page.');
      return;
    }

    const needsYouTube = platformSelection === 'all' || platformSelection === 'youtube';
    const ytChan = youtubeChannels.find(c => c.id === selectedYouTubeChannelId) || youtubeChannels[0];
    if (needsYouTube && !ytChan) {
      showToast('error', 'YouTube Channel Required', 'Please connect a YouTube channel before scheduling to YouTube.');
      return;
    }

    const effectiveUrl = getEffectiveDestinationUrl(perPostDestinationUrl);
    const targetScheduledTime = new Date(`${publishDate}T${publishTime}:00`).toISOString();

    const itemsToAdd: Omit<QueueItem, 'id' | 'createdAt'>[] = [];

    // 1. Pinterest Item (if selected)
    if (needsPinterest && activePinterestAccount) {
      const activeBoard = activePinterestAccount.boards.find(b => b.id === selectedBoardId) || activePinterestAccount.boards[0];
      itemsToAdd.push({
        mediaId: currentMedia.id,
        mediaName: currentMedia.fileName,
        mediaType: currentMedia.mediaType,
        thumbnailUrl: currentMedia.thumbnailUrl,
        platform: 'pinterest',
        pinterestAccountId: activePinterestAccount.id,
        pinterestAccountName: activePinterestAccount.name,
        boardId: activeBoard?.id,
        boardName: activeBoard?.name,
        title,
        description: pinterestDescription,
        caption: '',
        destinationUrl: effectiveUrl, // Preserves exact URL as required
        scheduledTime: scheduleType === 'now' ? new Date().toISOString() : targetScheduledTime,
        status: scheduleType === 'now' ? 'Publishing' : scheduleType === 'queue' ? 'Pending' : 'Scheduled',
        retryCount: 0,
        maxRetries: 3
      });
    }

    // 2. Facebook Items with Per-Page Posting Gaps (if selected)
    if (needsFacebook) {
      validFacebookPageIds.forEach((pageId) => {
        const page = facebookPages.find(p => p.id === pageId);
        const slot = calculatedSlots.find(s => s.pageId === pageId);
        const slotTime = scheduleType === 'now'
          ? new Date().toISOString()
          : (slot ? slot.slotIso : targetScheduledTime);

        itemsToAdd.push({
          mediaId: currentMedia.id,
          mediaName: currentMedia.fileName,
          mediaType: currentMedia.mediaType,
          thumbnailUrl: currentMedia.thumbnailUrl,
          platform: 'facebook',
          facebookPageId: page?.id,
          facebookPageName: page?.name,
          title,
          description: '',
          caption: facebookCaption,
          destinationUrl: effectiveUrl,
          scheduledTime: slotTime,
          status: scheduleType === 'now' ? 'Publishing' : scheduleType === 'queue' ? 'Pending' : 'Scheduled',
          retryCount: 0,
          maxRetries: 3
        });
      });
    }

    // 3. YouTube Shorts / Video Item (if selected)
    if (needsYouTube && ytChan) {
      itemsToAdd.push({
        mediaId: currentMedia.id,
        mediaName: currentMedia.fileName,
        mediaType: currentMedia.mediaType,
        thumbnailUrl: currentMedia.thumbnailUrl,
        platform: 'youtube',
        youtubeChannelId: ytChan.id,
        youtubeChannelName: ytChan.name,
        title: title || 'Quick Short #Shorts',
        description: `${facebookCaption || pinterestDescription}\n\n🔗 Learn more: ${effectiveUrl}`,
        caption: facebookCaption,
        destinationUrl: effectiveUrl,
        scheduledTime: scheduleType === 'now' ? new Date().toISOString() : targetScheduledTime,
        status: scheduleType === 'now' ? 'Publishing' : scheduleType === 'queue' ? 'Pending' : 'Scheduled',
        retryCount: 0,
        maxRetries: 3
      });
    }

    // Dispatch to AppContext
    if (itemsToAdd.length === 1) {
      addQueueItem(itemsToAdd[0]);
    } else {
      addMultipleQueueItems(itemsToAdd);
    }

    // If "Publish Now" chosen, simulate immediate publishing
    if (scheduleType === 'now') {
      showToast('info', 'Publishing Triggered', 'Executing instant publishing in Demo Mode...');
    }

    // Navigate to Queue view
    navigateTo('queue');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Create & Schedule Post</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish or schedule content across Pinterest Boards and multiple Facebook Pages with automated posting delay enforcement.
          </p>
        </div>

        {/* AI Quick Generate Trigger */}
        <button
          type="button"
          onClick={handleAiAutoGenerate}
          disabled={isGeneratingAi || !currentMedia}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isGeneratingAi ? 'Analyzing Visuals...' : 'AI Auto-Fill from Visuals'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media & Targeting Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Media Selector */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Select Media Asset
              </label>
              <button
                type="button"
                onClick={() => navigateTo('library')}
                className="text-xs text-blue-400 hover:underline"
              >
                Upload / Browse Library
              </button>
            </div>

            {/* Media Carousel / Dropdown */}
            {mediaItems.length === 0 ? (
              <div
                onClick={() => navigateTo('library')}
                className="p-6 border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 rounded-xl text-center cursor-pointer transition group"
              >
                <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 mx-auto mb-1.5 transition" />
                <p className="text-xs font-semibold text-zinc-300">No media uploaded yet</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Click here to open Content Library and add your own images or videos</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {mediaItems.slice(0, 4).map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setSelectedMediaId(m.id)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition text-left group ${
                      selectedMediaId === m.id
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={m.thumbnailUrl} alt={m.fileName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                      <span className="text-[10px] text-white font-medium truncate">{m.fileName}</span>
                    </div>
                    {m.mediaType === 'video' && (
                      <span className="absolute top-1 left-1 p-0.5 rounded bg-purple-900/80 text-purple-300">
                        <Film className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentMedia && (
              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`p-1.5 rounded-lg ${currentMedia.mediaType === 'video' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {currentMedia.mediaType === 'video' ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-zinc-200 block truncate">{currentMedia.fileName}</span>
                    <span className="text-[11px] text-zinc-500">{currentMedia.fileSize} • {currentMedia.mediaType.toUpperCase()}</span>
                  </div>
                </div>
                {currentMedia.aiAnalysisStatus === 'Analyzed' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Visuals Analyzed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleAiAutoGenerate}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Analyze
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Platform Selection */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Publishing Platforms
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All 3 Networks', icon: Sparkles },
                { id: 'pinterest', label: 'Pinterest Only', icon: Bookmark },
                { id: 'facebook', label: 'Facebook Only', icon: Share2 },
                { id: 'youtube', label: 'YouTube Shorts', icon: Youtube },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlatformSelection(p.id as any)}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                    platformSelection === p.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <p.icon className="w-4 h-4" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Pinterest Options */}
            {(platformSelection === 'both' || platformSelection === 'pinterest') && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Pinterest Target Account & Board</span>
                </div>

                {pinterestAccounts.length === 0 ? (
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-zinc-400">No Pinterest accounts connected yet.</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('pinterest')}
                      className="text-rose-400 hover:text-rose-300 font-semibold underline"
                    >
                      Connect Account
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Account Selector */}
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Select Pinterest Account</label>
                      <select
                        value={selectedPinterestAccountId}
                        onChange={(e) => setSelectedPinterestAccountId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                      >
                        {pinterestAccounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name} ({acc.username})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Board Selector */}
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Target Board</label>
                      <select
                        value={selectedBoardId}
                        onChange={(e) => setSelectedBoardId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                      >
                        {activePinterestAccount?.boards.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.pinCount} pins)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Facebook Options: Multi-Page Distribution with Per-Page Posting Gap */}
            {(platformSelection === 'both' || platformSelection === 'facebook') && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Facebook Multi-Page Distribution</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {selectedFacebookPageIds.length} of {facebookPages.length} Pages selected
                  </span>
                </div>

                {facebookPages.length === 0 ? (
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-zinc-400">No Facebook pages connected yet.</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('facebook')}
                      className="text-blue-400 hover:text-blue-300 font-semibold underline"
                    >
                      Connect Page
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-zinc-400">
                      Select target pages. The centralized automation engine will stagger posts according to each page's specific delay gap.
                    </p>

                    {/* Page Checkboxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {facebookPages.map((page) => {
                        const isSelected = selectedFacebookPageIds.includes(page.id);
                        return (
                          <div
                            key={page.id}
                            onClick={() => {
                              if (isSelected) {
                                if (selectedFacebookPageIds.length > 1) {
                                  setSelectedFacebookPageIds(prev => prev.filter(id => id !== page.id));
                                } else {
                                  showToast('warning', 'Selection Required', 'At least one Facebook page must be selected.');
                                }
                              } else {
                                setSelectedFacebookPageIds(prev => [...prev, page.id]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600/10 border-blue-500/40 text-zinc-200'
                                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                              />
                              <span className="text-xs font-medium truncate">{page.name}</span>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                              {page.postingGapMinutes}m gap
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Live Per-Page Gap Calculation Timeline Box */}
                    {selectedFacebookPageIds.length > 0 && (
                      <div className="mt-3 bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Calculated Slot Distribution (Respecting Posting Gaps)</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {calculatedSlots.map((slot) => (
                            <div key={slot.pageId} className="flex items-center justify-between py-1 border-b border-zinc-800/60 last:border-0">
                              <span className="text-zinc-300 font-medium">{slot.pageName}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-400 text-[11px]">{slot.slotFormatted}</span>
                                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/50">
                                  +{slot.gapMinutes}m delay
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* YouTube Shorts Options */}
            {(platformSelection === 'all' || platformSelection === 'youtube') && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube Channel & Shorts Destination</span>
                </div>

                {youtubeChannels.length === 0 ? (
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-zinc-400">No YouTube channels connected yet.</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('youtube')}
                      className="text-red-400 hover:text-red-300 font-semibold underline"
                    >
                      Connect Channel
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Target YouTube Channel</label>
                    <select
                      value={selectedYouTubeChannelId}
                      onChange={(e) => setSelectedYouTubeChannelId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    >
                      {youtubeChannels.map((chan) => (
                        <option key={chan.id} value={chan.id}>
                          {chan.name} ({chan.handle}) • {chan.postingGapMinutes}m delay
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Destination URL (VERY IMPORTANT REQUIREMENT) */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Custom Website / Destination URL (Pinterest Pin Link)
              </label>
              <span className="text-[10px] text-zinc-500">Per-post URL overrides Global URL</span>
            </div>

            <div className="space-y-1">
              <input
                type="url"
                value={perPostDestinationUrl}
                onChange={(e) => {
                  setPerPostDestinationUrl(e.target.value);
                  validateUrl(e.target.value);
                }}
                placeholder={`Default: ${settings.globalWebsiteUrl}`}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none ${
                  urlValidationError ? 'border-rose-500 focus:border-rose-500' : 'border-zinc-800 focus:border-blue-500'
                }`}
              />
              {urlValidationError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{urlValidationError}</span>
                </p>
              )}
            </div>

            <div className="p-2.5 bg-blue-950/20 border border-blue-900/30 rounded-xl flex items-start gap-2 text-xs text-blue-300">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold text-blue-200">Enforced Pinterest Destination: </span>
                Whatever URL you enter above is guaranteed to be attached to the Pinterest Pin. Currently resolving to:{' '}
                <span className="font-mono text-zinc-100 underline">{getEffectiveDestinationUrl(perPostDestinationUrl)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Copy, Scheduling & Submit (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Post Content Inputs */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200">Post Copy & Metadata</label>
              <span className="text-[11px] text-zinc-400">User editable</span>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-zinc-400">Title (Pinterest & Header)</label>
                <span className="text-[10px] text-zinc-500">{title.length}/100</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Catchy, SEO-optimized title..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Pinterest Description */}
            {(platformSelection === 'both' || platformSelection === 'pinterest') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-rose-400" />
                    <span>Pinterest Description</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">{pinterestDescription.length}/500</span>
                </div>
                <textarea
                  rows={3}
                  value={pinterestDescription}
                  onChange={(e) => setPinterestDescription(e.target.value)}
                  maxLength={500}
                  placeholder="Detailed description with search keywords and call to action..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            )}

            {/* Facebook Caption */}
            {(platformSelection === 'both' || platformSelection === 'facebook') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-blue-400" />
                    <span>Facebook Caption</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">{facebookCaption.length}/2000</span>
                </div>
                <textarea
                  rows={4}
                  value={facebookCaption}
                  onChange={(e) => setFacebookCaption(e.target.value)}
                  placeholder="Engaging Facebook post caption, questions, and hashtags..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* Scheduling Configuration */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Schedule Type & Timing
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'schedule', label: 'Schedule', desc: 'Pick Date & Time' },
                { id: 'queue', label: 'Add to Queue', desc: 'Auto Slot' },
                { id: 'now', label: 'Publish Now', desc: 'Instant [Demo]' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setScheduleType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    scheduleType === opt.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs font-semibold block">{opt.label}</span>
                  <span className="text-[10px] text-zinc-500 block">{opt.desc}</span>
                </button>
              ))}
            </div>

            {scheduleType === 'schedule' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Base Start Time</label>
                  <input
                    type="time"
                    value={publishTime}
                    onChange={(e) => setPublishTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition"
          >
            <Send className="w-4 h-4" />
            <span>
              {scheduleType === 'now' ? 'Publish Immediately' : scheduleType === 'queue' ? 'Enqueue in Central Pipeline' : 'Confirm Schedule'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
