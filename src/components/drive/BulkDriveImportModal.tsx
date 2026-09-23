import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleDriveService, DriveFileInfo } from '../../services/googleDriveService';
import { AiService } from '../../services/aiService';
import { AiVisualAnalysis, MediaItem } from '../../types';
import {
  Cloud,
  Sparkles,
  CheckCircle2,
  Folder,
  Layers,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  X,
  Sliders,
  ChevronRight,
  ArrowRight,
  FileCheck,
  Check,
  Edit2,
  Save,
  Tag
} from 'lucide-react';

interface BulkDriveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduledSuccess?: () => void;
}

interface AnalyzedDriveItem {
  file: DriveFileInfo;
  isSelected: boolean;
  title: string;
  description: string;
  caption: string;
  hashtags: string[];
  destinationUrl: string;
  visualAnalysis?: AiVisualAnalysis;
  status: 'pending' | 'processing' | 'done' | 'failed';
}

export const BulkDriveImportModal: React.FC<BulkDriveImportModalProps> = ({
  isOpen,
  onClose,
  onScheduledSuccess
}) => {
  const {
    googleDrive,
    availableDriveFolders,
    promptProfiles,
    activePromptProfileId,
    pinterestAccounts,
    facebookPages,
    youtubeChannels,
    addMultipleQueueItems,
    addLog,
    showToast,
    getEffectiveDestinationUrl,
    navigateTo,
    importDriveFilesToLibrary
  } = useApp();

  const [activeFolder, setActiveFolder] = useState<string>(googleDrive.name || 'Drive_Pin_Designs_2026');
  const [availableFiles, setAvailableFiles] = useState<DriveFileInfo[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activePromptProfileId);
  const [targetPlatform, setTargetPlatform] = useState<'pinterest' | 'facebook' | 'youtube' | 'all'>('pinterest');
  const [batchDestinationUrl, setBatchDestinationUrl] = useState<string>('https://myblog.com/viral-tips');
  
  // Interval gap between pins when scheduling
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);
  
  // Pipeline step: 'select' -> 'analyzing' -> 'review'
  const [step, setStep] = useState<'select' | 'analyzing' | 'review'>('select');
  
  // Progress during bulk AI generation
  const [analyzingIndex, setAnalyzingIndex] = useState<number>(0);
  const [analyzingFile, setAnalyzingFile] = useState<string>('');
  
  // Analyzed items ready for review
  const [analyzedItems, setAnalyzedItems] = useState<AnalyzedDriveItem[]>([]);

  // Load files for active folder
  useEffect(() => {
    let isMounted = true;
    GoogleDriveService.listFiles(activeFolder).then(files => {
      if (isMounted) {
        setAvailableFiles(files);
        // Select all files by default
        setSelectedFileIds(new Set(files.map(f => f.id)));
      }
    });
    return () => { isMounted = false; };
  }, [activeFolder, isOpen]);

  if (!isOpen) return null;

  const activeProfile = promptProfiles.find(p => p.id === selectedProfileId) || promptProfiles[0];

  const handleSelectAll = () => {
    if (selectedFileIds.size === availableFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(availableFiles.map(f => f.id)));
    }
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  // Run Bulk AI Analysis
  const handleStartBulkAnalysis = async () => {
    const filesToAnalyze = availableFiles.filter(f => selectedFileIds.has(f.id));
    if (filesToAnalyze.length === 0) {
      showToast('error', 'No Files Selected', 'Please select at least one file from Google Drive to analyze.');
      return;
    }

    setStep('analyzing');
    setAnalyzingIndex(0);

    const results: AnalyzedDriveItem[] = [];

    for (let i = 0; i < filesToAnalyze.length; i++) {
      const file = filesToAnalyze[i];
      setAnalyzingIndex(i + 1);
      setAnalyzingFile(file.name);

      const mediaItem = GoogleDriveService.convertToFileMediaItem(file);

      try {
        const analysis = await AiService.analyzeMedia(mediaItem, activeProfile);
        
        results.push({
          file,
          isSelected: true,
          title: analysis.pinterestTitle || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          description: analysis.pinterestDescription || `Discover fresh inspiration for ${file.name}. Save to your boards!`,
          caption: analysis.facebookCaption || `Check out this trending update! ✨`,
          hashtags: analysis.suggestedHashtags || ['#Trending', '#Inspiration'],
          destinationUrl: getEffectiveDestinationUrl(batchDestinationUrl),
          visualAnalysis: analysis,
          status: 'done'
        });
      } catch (err) {
        results.push({
          file,
          isSelected: true,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          description: `Discovered from Google Drive. Tap link for details.`,
          caption: `Fresh creative asset ready.`,
          hashtags: ['#Trending'],
          destinationUrl: getEffectiveDestinationUrl(batchDestinationUrl),
          status: 'failed'
        });
      }
    }

    setAnalyzedItems(results);
    setStep('review');
    showToast('success', 'Bulk AI Analysis Completed', `Analyzed ${results.length} images with titles, descriptions & tags!`);
  };

  // Update item field in review
  const updateAnalyzedItem = (index: number, updates: Partial<AnalyzedDriveItem>) => {
    setAnalyzedItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // Schedule all analyzed pins (distributed across daily schedule)
  const handleScheduleAll = () => {
    const activeItems = analyzedItems.filter(item => item.isSelected);
    if (activeItems.length === 0) {
      showToast('error', 'No Items Selected', 'Please select at least one analyzed item to schedule.');
      return;
    }

    const pinAccount = pinterestAccounts[0];
    const pinBoard = pinAccount?.boards?.[0];
    const fbPage = facebookPages[0];
    const ytChannel = youtubeChannels[0];

    const now = new Date();
    // Start 15 minutes from now
    const baseTime = new Date(now.getTime() + 15 * 60 * 1000);

    const queueItemsToAdd = activeItems.map((item, idx) => {
      const scheduledDate = new Date(baseTime.getTime() + idx * intervalMinutes * 60 * 1000);
      const isVideo = item.file.mimeType.includes('video') || item.file.name.endsWith('.mp4');
      const platform = targetPlatform === 'all' 
        ? (isVideo ? 'youtube' : 'pinterest') 
        : targetPlatform;

      return {
        mediaId: `med_drive_${item.file.id}`,
        mediaName: item.file.name,
        mediaType: (isVideo ? 'video' : 'image') as 'image' | 'video',
        thumbnailUrl: item.file.thumbnailUrl,
        platform: platform as any,
        pinterestAccountId: platform === 'pinterest' ? pinAccount?.id : undefined,
        pinterestAccountName: platform === 'pinterest' ? pinAccount?.name : undefined,
        boardId: platform === 'pinterest' ? pinBoard?.id : undefined,
        boardName: platform === 'pinterest' ? pinBoard?.name : undefined,
        facebookPageId: platform === 'facebook' ? fbPage?.id : undefined,
        facebookPageName: platform === 'facebook' ? fbPage?.name : undefined,
        youtubeChannelId: platform === 'youtube' ? ytChannel?.id : undefined,
        youtubeChannelName: platform === 'youtube' ? ytChannel?.name : undefined,
        youtubePrivacy: 'public' as const,
        youtubeTags: item.visualAnalysis?.youtubeTags || ['shorts', 'trending', 'viral'],
        title: item.title,
        description: item.description,
        caption: item.caption,
        destinationUrl: item.destinationUrl || getEffectiveDestinationUrl(batchDestinationUrl),
        scheduledTime: scheduledDate.toISOString(),
        status: 'Scheduled' as const,
        retryCount: 0,
        maxRetries: 3
      };
    });

    addMultipleQueueItems(queueItemsToAdd);

    // Also import to media library so they exist in Content Library with AI analysis
    importDriveFilesToLibrary(activeItems.map(a => a.file), false);

    addLog({
      platform: 'google-drive',
      action: 'Bulk Google Drive AI Schedule',
      status: 'success',
      contentTitle: `Batch of ${activeItems.length} Pins scheduled (${intervalMinutes}m gap)`,
      targetName: 'Bulk AI Generator'
    });

    showToast(
      'success',
      'Batch Scheduled Successfully!',
      `${activeItems.length} pins scheduled with ${intervalMinutes}-minute gap intervals.`
    );

    onClose();
    if (onScheduledSuccess) {
      onScheduledSuccess();
    } else {
      navigateTo('scheduled');
    }
  };

  // Import to Content Library only
  const handleImportToLibraryOnly = async () => {
    const activeFiles = analyzedItems.length > 0 
      ? analyzedItems.filter(i => i.isSelected).map(i => i.file)
      : availableFiles.filter(f => selectedFileIds.has(f.id));

    if (activeFiles.length === 0) {
      showToast('error', 'No Files', 'Select at least one file to import.');
      return;
    }

    await importDriveFilesToLibrary(activeFiles, false);
    showToast('success', 'Imported to Library', `${activeFiles.length} assets added to your Content Library.`);
    onClose();
    navigateTo('library');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Google Drive Bulk Ingestion & AI Auto-Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Bulk Vision AI
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Batch analyze images from Google Drive to automatically write high-converting Pinterest SEO titles, descriptions, and hashtags.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* STEP 1: SELECT DRIVE FOLDER & FILES */}
          {step === 'select' && (
            <div className="space-y-5">
              {/* Folder Selector and Setup Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-blue-400" />
                    <span>Select Google Drive Folder</span>
                  </label>
                  <select
                    value={activeFolder}
                    onChange={(e) => setActiveFolder(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-750 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {availableDriveFolders.map(folder => (
                      <option key={folder.id} value={folder.name}>
                        {folder.name} ({folder.filesCount} files)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Prompt Tone Profile</span>
                  </label>
                  <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-750 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {promptProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.tone.split(',')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Batch Destination URL</span>
                  </label>
                  <input
                    type="url"
                    value={batchDestinationUrl}
                    onChange={(e) => setBatchDestinationUrl(e.target.value)}
                    placeholder="https://yourblog.com/guide"
                    className="w-full bg-zinc-900 border border-zinc-750 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* File Selection Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {selectedFileIds.size === availableFiles.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                  <span className="text-xs text-zinc-400 font-medium">
                    <strong className="text-white">{selectedFileIds.size}</strong> of {availableFiles.length} files selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Target:</span>
                  <div className="flex rounded-xl bg-zinc-800/80 p-0.5 border border-zinc-750 text-xs">
                    {(['pinterest', 'facebook', 'youtube', 'all'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setTargetPlatform(p)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                          targetPlatform === p ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Files Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableFiles.map((file) => {
                  const isSelected = selectedFileIds.has(file.id);
                  const isVideo = file.name.endsWith('.mp4') || file.mimeType.includes('video');

                  return (
                    <div
                      key={file.id}
                      onClick={() => toggleSelectFile(file.id)}
                      className={`relative group rounded-2xl border cursor-pointer overflow-hidden transition p-2 flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-950/20 shadow-md shadow-blue-500/10' 
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                          isSelected ? 'bg-blue-500 text-white shadow-sm' : 'bg-zinc-800/80 text-transparent border border-zinc-600'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Video / Type badge */}
                      {isVideo && (
                        <div className="absolute top-3 left-3 z-10 px-1.5 py-0.5 rounded-md bg-red-600/90 text-[10px] font-bold text-white shadow">
                          SHORT
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 mb-2">
                        <img
                          src={file.thumbnailUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Filename & size */}
                      <div>
                        <p className="text-[11px] font-semibold text-zinc-200 line-clamp-1 break-all" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {file.size} • {file.modifiedTime.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING PROGRESS */}
          {step === 'analyzing' && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  AI
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Analyzing Google Drive Images with AI Vision...
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 max-w-md">
                  Inspecting composition, focal subjects, objects, and generating high-converting Pinterest SEO titles, descriptions, and hashtags.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5 border border-zinc-700">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(analyzingIndex / (selectedFileIds.size || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-xs text-zinc-400 font-medium">
                <span>File {analyzingIndex} of {selectedFileIds.size}</span>
                <span className="font-mono text-zinc-200 truncate max-w-[260px]">{analyzingFile}</span>
                <span>{Math.round((analyzingIndex / (selectedFileIds.size || 1)) * 100)}%</span>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & EDIT ANALYZED PINS */}
          {step === 'review' && (
            <div className="space-y-5">
              {/* Batch Action Bar */}
              <div className="p-4 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-emerald-950/30 border border-blue-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      AI Generation Complete ({analyzedItems.length} Assets)
                    </h4>
                    <p className="text-xs text-zinc-400">
                      All titles and descriptions generated automatically from image visual analysis. Review and edit before scheduling.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-750 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-300">Schedule Gap:</span>
                    <select
                      value={intervalMinutes}
                      onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                      className="bg-transparent text-xs font-semibold text-blue-400 focus:outline-none cursor-pointer"
                    >
                      <option value={30}>30 mins</option>
                      <option value={60}>60 mins (1 hour)</option>
                      <option value={90}>90 mins</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <button
                    onClick={handleScheduleAll}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Batch Schedule All ({analyzedItems.filter(i => i.isSelected).length} Pins)</span>
                  </button>
                </div>
              </div>

              {/* Items Table / Cards */}
              <div className="space-y-3.5">
                {analyzedItems.map((item, idx) => (
                  <div
                    key={item.file.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      item.isSelected 
                        ? 'bg-zinc-950/80 border-zinc-800' 
                        : 'bg-zinc-950/40 border-zinc-850 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* Selection checkbox + thumbnail */}
                      <div className="flex items-start gap-3 w-full md:w-48 shrink-0">
                        <button
                          onClick={() => updateAnalyzedItem(idx, { isSelected: !item.isSelected })}
                          className={`mt-1 w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                            item.isSelected ? 'bg-blue-500 text-white' : 'border border-zinc-700 bg-zinc-900 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                          <img
                            src={item.file.thumbnailUrl}
                            alt={item.file.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-zinc-200 truncate" title={item.file.name}>
                            {item.file.name}
                          </p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {item.visualAnalysis?.contentCategory?.split('&')[0] || 'Visual Pin'}
                          </span>
                        </div>
                      </div>

                      {/* Content Fields */}
                      <div className="flex-1 w-full space-y-2.5">
                        {/* Title input */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                            <span className="font-semibold text-zinc-300">Generated Pin Title (SEO Optimized)</span>
                            <span className="text-[10px] font-mono text-zinc-500">{item.title.length} chars</span>
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateAnalyzedItem(idx, { title: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-750 text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Description textarea */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                            <span className="font-semibold text-zinc-300">Generated Description & Search Intent</span>
                            <span className="text-[10px] font-mono text-zinc-500">{item.description.length} chars</span>
                          </div>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateAnalyzedItem(idx, { description: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-750 text-zinc-200 rounded-xl px-3 py-1.5 text-xs leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>

                        {/* Hashtags and URL row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-850">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Tag className="w-3 h-3 text-zinc-500" />
                            {item.hashtags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-850 text-zinc-300 border border-zinc-750"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                            <ExternalLink className="w-3 h-3 text-emerald-400" />
                            <span className="text-[11px] text-zinc-300 truncate max-w-[200px]">
                              {item.destinationUrl}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          {step === 'select' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleImportToLibraryOnly}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-semibold transition"
                >
                  Import to Library Only
                </button>

                <button
                  onClick={handleStartBulkAnalysis}
                  disabled={selectedFileIds.size === 0}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Analyze {selectedFileIds.size} Images with AI & Generate Titles</span>
                </button>
              </div>
            </>
          )}

          {step === 'analyzing' && (
            <div className="w-full flex justify-end">
              <span className="text-xs text-zinc-400 animate-pulse">
                Processing neural vision prompts...
              </span>
            </div>
          )}

          {step === 'review' && (
            <>
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1.5"
              >
                ← Back to File Selection
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleImportToLibraryOnly}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-semibold transition"
                >
                  Save Analyzed to Library Only
                </button>

                <button
                  onClick={handleScheduleAll}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>Schedule {analyzedItems.filter(i => i.isSelected).length} Pins (1-Click Queue)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
