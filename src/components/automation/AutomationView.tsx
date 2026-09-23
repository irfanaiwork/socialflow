import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomationRule, PlatformType } from '../../types';
import { GoogleAuthModal } from '../common/GoogleAuthModal';
import {
  Bot,
  Zap,
  Play,
  Plus,
  CheckCircle2,
  Clock,
  Share2,
  Bookmark,
  Youtube,
  HardDrive,
  Globe,
  Sliders,
  X,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  Folder,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers
} from 'lucide-react';

export const AutomationView: React.FC = () => {
  const {
    automationRules,
    toggleAutomationRule,
    addAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    duplicateAutomationRule,
    runAutomationRuleNow,
    runAllActiveAutomations,
    syncGoogleDrive,
    googleDrive,
    availableDriveFolders,
    pinterestAccounts,
    facebookPages,
    youtubeChannels,
    connectYouTubeChannel,
    connectGoogleDriveFolder,
    promptProfiles,
    settings,
    showToast,
    setIsBulkDriveModalOpen
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<'all' | 'pinterest' | 'facebook' | 'youtube'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // Modal State for Create / Edit Rule
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [googleAuthService, setGoogleAuthService] = useState<'youtube' | 'drive' | null>(null);

  // Form State for Automation Rule
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<PlatformType>('pinterest');

  // Account targets
  const [selectedPinterestAccountId, setSelectedPinterestAccountId] = useState<string>('');
  const [selectedPinterestBoardId, setSelectedPinterestBoardId] = useState<string>('');
  const [selectedFacebookPageId, setSelectedFacebookPageId] = useState<string>('');
  const [selectedYouTubeChannelId, setSelectedYouTubeChannelId] = useState<string>('');

  // Drive folder & URL
  const [selectedDriveFolderId, setSelectedDriveFolderId] = useState<string>('');
  const [customDestinationUrl, setCustomDestinationUrl] = useState<string>('');
  const [selectedPromptProfileId, setSelectedPromptProfileId] = useState<string>('');
  const [postingGapMinutes, setPostingGapMinutes] = useState<number>(60);
  const [dailyLimit, setDailyLimit] = useState<number>(5);
  const [autoPublishDirectly, setAutoPublishDirectly] = useState<boolean>(false);

  // Filtered rules
  const filteredRules = automationRules.filter(rule => {
    const matchesPlatform = platformFilter === 'all' || 
      (platformFilter === 'pinterest' && (rule.targetPlatform === 'pinterest' || rule.platform === 'pinterest')) ||
      (platformFilter === 'facebook' && (rule.targetPlatform === 'facebook' || rule.platform === 'facebook')) ||
      (platformFilter === 'youtube' && (rule.targetPlatform === 'youtube' || rule.platform === 'youtube'));

    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rule.description && rule.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rule.customDestinationUrl && rule.customDestinationUrl.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPlatform && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingRuleId(null);
    setRuleName('');
    setRuleDesc('');
    setTargetPlatform('pinterest');

    const defaultPin = pinterestAccounts[0];
    setSelectedPinterestAccountId(defaultPin?.id || '');
    setSelectedPinterestBoardId(defaultPin?.boards[0]?.id || '');

    const defaultFb = facebookPages[0];
    setSelectedFacebookPageId(defaultFb?.id || '');

    const defaultYt = youtubeChannels[0];
    setSelectedYouTubeChannelId(defaultYt?.id || '');

    const defaultFolder = availableDriveFolders[0] || googleDrive;
    setSelectedDriveFolderId(defaultFolder.id);
    setCustomDestinationUrl('');
    setSelectedPromptProfileId(promptProfiles[0]?.id || '');
    setPostingGapMinutes(60);
    setDailyLimit(5);
    setAutoPublishDirectly(false);

    setIsModalOpen(true);
  };

  const openEditModal = (rule: AutomationRule) => {
    setEditingRuleId(rule.id);
    setRuleName(rule.name);
    setRuleDesc(rule.description || '');
    const platform = (rule.targetPlatform === 'all' ? 'pinterest' : rule.targetPlatform) || 'pinterest';
    setTargetPlatform(platform as PlatformType);

    setSelectedPinterestAccountId(rule.pinterestAccountId || pinterestAccounts[0]?.id || '');
    setSelectedPinterestBoardId(rule.pinterestBoardId || '');
    setSelectedFacebookPageId(rule.facebookPageId || facebookPages[0]?.id || '');
    setSelectedYouTubeChannelId(rule.youtubeChannelId || youtubeChannels[0]?.id || '');

    setSelectedDriveFolderId(rule.googleDriveFolderId || availableDriveFolders[0]?.id || googleDrive.id);
    setCustomDestinationUrl(rule.customDestinationUrl || '');
    setSelectedPromptProfileId(rule.promptProfileId || promptProfiles[0]?.id || '');
    setPostingGapMinutes(rule.postingGapMinutes || 60);
    setDailyLimit(rule.dailyLimit || 5);
    setAutoPublishDirectly(rule.autoPublishDirectly || false);

    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const pinAcc = pinterestAccounts.find(a => a.id === selectedPinterestAccountId);
    const pinBoard = pinAcc?.boards.find(b => b.id === selectedPinterestBoardId);
    const fbPage = facebookPages.find(p => p.id === selectedFacebookPageId);
    const ytChan = youtubeChannels.find(c => c.id === selectedYouTubeChannelId);
    const driveFolder = availableDriveFolders.find(f => f.id === selectedDriveFolderId) || googleDrive;

    const ruleData: Partial<AutomationRule> = {
      name: ruleName.trim(),
      description: ruleDesc.trim(),
      targetPlatform,
      platform: targetPlatform as any,
      pinterestAccountId: targetPlatform === 'pinterest' ? pinAcc?.id : undefined,
      pinterestAccountName: targetPlatform === 'pinterest' ? pinAcc?.name : undefined,
      pinterestBoardId: targetPlatform === 'pinterest' ? pinBoard?.id : undefined,
      pinterestBoardName: targetPlatform === 'pinterest' ? pinBoard?.name : undefined,
      facebookPageId: targetPlatform === 'facebook' ? fbPage?.id : undefined,
      facebookPageName: targetPlatform === 'facebook' ? fbPage?.name : undefined,
      youtubeChannelId: targetPlatform === 'youtube' ? ytChan?.id : undefined,
      youtubeChannelName: targetPlatform === 'youtube' ? ytChan?.name : undefined,
      googleDriveFolderId: driveFolder.id,
      googleDriveFolderName: driveFolder.name,
      customDestinationUrl: customDestinationUrl.trim() || undefined,
      promptProfileId: selectedPromptProfileId,
      postingGapMinutes,
      dailyLimit,
      autoPublishDirectly,
      actions: [
        `Sync from Drive: ${driveFolder.name}`,
        `Apply custom landing URL: ${customDestinationUrl.trim() || settings.globalWebsiteUrl}`,
        `Publish to ${targetPlatform.toUpperCase()}`
      ]
    };

    if (editingRuleId) {
      updateAutomationRule(editingRuleId, ruleData);
    } else {
      addAutomationRule(ruleData);
    }

    setIsModalOpen(false);
  };

  const handleExecuteAll = async () => {
    setIsExecutingAll(true);
    await runAllActiveAutomations();
    setIsExecutingAll(false);
  };

  const handleSyncDrive = async () => {
    setIsSyncingDrive(true);
    await syncGoogleDrive();
    setIsSyncingDrive(false);
  };

  // Find board options when editing Pinterest
  const currentPinAccount = pinterestAccounts.find(a => a.id === selectedPinterestAccountId) || pinterestAccounts[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Multi-Account Automation Pipelines</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Per-Account Rules & Custom URLs
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Create independent automated pipelines for specific Pinterest accounts/boards, Facebook pages, or YouTube channels with dedicated landing URLs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsBulkDriveModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition cursor-pointer"
            title="Import and analyze files from Google Drive in bulk with Vision AI"
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-200" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Drive Bulk AI</span>
          </button>

          <button
            onClick={handleSyncDrive}
            disabled={isSyncingDrive}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
            <span>{isSyncingDrive ? 'Scanning Drive...' : 'Poll Drive Folders'}</span>
          </button>

          <button
            onClick={handleExecuteAll}
            disabled={isExecutingAll}
            className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-emerald-400 text-emerald-400 ${isExecutingAll ? 'animate-pulse' : ''}`} />
            <span>{isExecutingAll ? 'Executing Pipelines...' : 'Run All Automations'}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Pipeline</span>
          </button>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-900/40 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-zinc-100">Granular Per-Account & Per-Page Custom Automations</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">Enterprise Pipeline</span>
          </div>
          <p className="text-xs text-zinc-300">
            Set up separate automation rules for each Pinterest account (targeting distinct boards), each Facebook page (with independent anti-spam delays), and each YouTube channel. Assign a dedicated Google Drive folder and individual custom destination URL to every pipeline.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/80">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              platformFilter === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            All Pipelines ({automationRules.length})
          </button>
          <button
            onClick={() => setPlatformFilter('pinterest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
              platformFilter === 'pinterest'
                ? 'bg-rose-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-800'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Pinterest</span>
          </button>
          <button
            onClick={() => setPlatformFilter('facebook')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
              platformFilter === 'facebook'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-blue-400 hover:bg-zinc-800'
            }`}
          >
            <Share2 className="w-3 h-3" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => setPlatformFilter('youtube')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
              platformFilter === 'youtube'
                ? 'bg-red-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
            }`}
          >
            <Youtube className="w-3 h-3" />
            <span>YouTube</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules, targets, URLs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3">
            <Bot className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-300">No Automation Pipelines Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Create your first automation rule to tie a Google Drive folder to a specific social account and dedicated landing URL.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
            >
              Create New Pipeline
            </button>
          </div>
        ) : (
          filteredRules.map((rule) => {
            const isRuleActive = rule.isActive ?? rule.isEnabled ?? true;
            const platform = (rule.targetPlatform === 'all' ? 'pinterest' : rule.targetPlatform) || 'pinterest';

            // Target Account info
            const pinAcc = pinterestAccounts.find(a => a.id === rule.pinterestAccountId) || pinterestAccounts[0];
            const pinBoard = pinAcc?.boards.find(b => b.id === rule.pinterestBoardId) || pinAcc?.boards[0];
            const fbPage = facebookPages.find(p => p.id === rule.facebookPageId) || facebookPages[0];
            const ytChan = youtubeChannels.find(c => c.id === rule.youtubeChannelId) || youtubeChannels[0];

            return (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isRuleActive
                    ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    : 'bg-zinc-950/50 border-zinc-900 opacity-65'
                }`}
              >
                {/* Top Row: Title, Badges, Toggle */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-zinc-800/70">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      platform === 'pinterest' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                      platform === 'facebook' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' :
                      'bg-red-600/15 text-red-400 border border-red-500/20'
                    }`}>
                      {platform === 'pinterest' && <Bookmark className="w-5 h-5" />}
                      {platform === 'facebook' && <Share2 className="w-5 h-5" />}
                      {platform === 'youtube' && <Youtube className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-100 truncate">{rule.name}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          platform === 'pinterest' ? 'bg-rose-500/20 text-rose-300' :
                          platform === 'facebook' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {platform}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {rule.postingGapMinutes || 60}m delay • max {rule.dailyLimit || 5}/day
                        </span>
                      </div>
                      {rule.description && (
                        <p className="text-xs text-zinc-400 mt-1">{rule.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <button
                      type="button"
                      onClick={() => toggleAutomationRule(rule.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isRuleActive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-750'
                      }`}
                    >
                      {isRuleActive ? 'Active Pipeline' : 'Paused'}
                    </button>

                    <button
                      type="button"
                      onClick={() => runAutomationRuleNow(rule.id)}
                      className="px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Execute Rule Immediately"
                    >
                      <Play className="w-3 h-3 fill-blue-400 text-blue-400" />
                      <span>Run Now</span>
                    </button>
                  </div>
                </div>

                {/* Configuration Specs: Target Account, Google Drive Folder, Dedicated Destination URL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs">
                  {/* Target Account Spec */}
                  <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                      Target Account & Destination
                    </span>
                    {platform === 'pinterest' && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <img src={pinAcc?.avatarUrl} alt={pinAcc?.name} className="w-5 h-5 rounded-full object-cover border border-zinc-700" />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 truncate">{pinAcc?.name}</div>
                          <div className="text-[11px] text-rose-400 truncate">Board: {rule.pinterestBoardName || pinBoard?.name || 'General'}</div>
                        </div>
                      </div>
                    )}
                    {platform === 'facebook' && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <img src={fbPage?.avatarUrl} alt={fbPage?.name} className="w-5 h-5 rounded-full object-cover border border-zinc-700" />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 truncate">{fbPage?.name}</div>
                          <div className="text-[11px] text-blue-400">Delay: {rule.postingGapMinutes || fbPage?.postingGapMinutes || 60} min</div>
                        </div>
                      </div>
                    )}
                    {platform === 'youtube' && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <img src={ytChan?.avatarUrl} alt={ytChan?.name} className="w-5 h-5 rounded-full object-cover border border-zinc-700" />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 truncate">{ytChan?.name}</div>
                          <div className="text-[11px] text-red-400">{ytChan?.handle} • Shorts & Videos</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Google Drive Source Folder */}
                  <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-amber-400" />
                      <span>Linked Google Drive Source</span>
                    </span>
                    <div className="pt-0.5">
                      <div className="font-semibold text-zinc-200 truncate">
                        📁 {rule.googleDriveFolderName || googleDrive.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">
                        Auto-detect new files & sync
                      </div>
                    </div>
                  </div>

                  {/* Dedicated Destination URL (User Directive) */}
                  <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Dedicated Destination URL</span>
                    </span>
                    <div className="pt-0.5">
                      {rule.customDestinationUrl && rule.customDestinationUrl.trim() !== '' ? (
                        <div>
                          <a
                            href={rule.customDestinationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] text-blue-400 hover:underline flex items-center gap-1 truncate"
                          >
                            <span className="truncate">{rule.customDestinationUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Custom Landing Link</span>
                        </div>
                      ) : (
                        <div>
                          <div className="font-mono text-[11px] text-zinc-400 truncate">
                            {settings.globalWebsiteUrl}
                          </div>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">(Global Fallback URL)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Stats & CRUD Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-800/70 text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Executed: <strong className="text-zinc-200">{rule.runsCount || 0} times</strong></span>
                    </span>
                    {rule.lastRun && (
                      <span>Last run: <strong className="text-zinc-300">{rule.lastRun}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateAutomationRule(rule.id)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg flex items-center gap-1 transition"
                      title="Duplicate this pipeline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(rule)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg flex items-center gap-1 transition"
                      title="Edit settings and targets"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Rule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete automation rule "${rule.name}"?`)) {
                          deleteAutomationRule(rule.id);
                        }
                      }}
                      className="px-2.5 py-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-1 transition"
                      title="Delete pipeline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Architecture Flow Diagram Box */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Unified Multi-Account Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
            <span className="text-xs font-semibold text-zinc-200 block">Dedicated Drive Folder</span>
            <p className="text-[11px] text-zinc-400">Watches the specific Google Drive folder mapped to this pipeline</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
            <span className="text-xs font-semibold text-zinc-200 block">AI Visual Processing</span>
            <p className="text-[11px] text-zinc-400">Analyzes image/video, tailors titles, hooks & SEO tags for the target</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
            <span className="text-xs font-semibold text-zinc-200 block">Dedicated URL Ingestion</span>
            <p className="text-[11px] text-zinc-400">Attaches this automation rule's custom landing page URL</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">4</div>
            <span className="text-xs font-semibold text-zinc-200 block">Target Account Publishing</span>
            <p className="text-[11px] text-zinc-400">Dispatches to specific Pinterest board, Facebook page, or YouTube Shorts</p>
          </div>
        </div>
      </div>

      {/* Modal: Create or Edit Automation Pipeline */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveRule} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-zinc-100 text-sm">
                  {editingRuleId ? 'Edit Automation Pipeline' : 'Create Dedicated Automation Pipeline'}
                </h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Rule Name & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-zinc-300 font-semibold block mb-1">Pipeline Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Mom Budgeting Pins Auto-Publisher"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-zinc-400 block mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Uploads daily recipe pins to Frugal Living board with blog landing link"
                    value={ruleDesc}
                    onChange={(e) => setRuleDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 2. Platform Selector */}
              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">Target Social Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetPlatform('pinterest')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${
                      targetPlatform === 'pinterest'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-850'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-rose-400" />
                    <span>Pinterest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetPlatform('facebook')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${
                      targetPlatform === 'facebook'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-850'
                    }`}
                  >
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetPlatform('youtube')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${
                      targetPlatform === 'youtube'
                        ? 'bg-red-500/20 text-red-300 border-red-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-850'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span>YouTube</span>
                  </button>
                </div>
              </div>

              {/* 3. Granular Target Bindings */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3">
                <span className="font-semibold text-zinc-200 block">
                  {targetPlatform === 'pinterest' && 'Pinterest Account & Board Targeting'}
                  {targetPlatform === 'facebook' && 'Facebook Page Targeting'}
                  {targetPlatform === 'youtube' && 'YouTube Channel Targeting'}
                </span>

                {targetPlatform === 'pinterest' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Select Pinterest Account</label>
                      <select
                        value={selectedPinterestAccountId}
                        onChange={(e) => {
                          setSelectedPinterestAccountId(e.target.value);
                          const acc = pinterestAccounts.find(a => a.id === e.target.value);
                          if (acc?.boards[0]) setSelectedPinterestBoardId(acc.boards[0].id);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                      >
                        {pinterestAccounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.name} (@{account.username})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Select Target Board</label>
                      <select
                        value={selectedPinterestBoardId}
                        onChange={(e) => setSelectedPinterestBoardId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                      >
                        {currentPinAccount?.boards.map(board => (
                          <option key={board.id} value={board.id}>
                            📌 {board.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {targetPlatform === 'facebook' && (
                  <div>
                    <label className="text-zinc-400 block mb-1">Select Facebook Page</label>
                    <select
                      value={selectedFacebookPageId}
                      onChange={(e) => setSelectedFacebookPageId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                    >
                      {facebookPages.map(page => (
                        <option key={page.id} value={page.id}>
                          {page.name} ({page.postingGapMinutes}m delay)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetPlatform === 'youtube' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-300 font-medium block">Target YouTube Channel</label>
                      <button
                        type="button"
                        onClick={() => setGoogleAuthService('youtube')}
                        className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Link via Google Account</span>
                      </button>
                    </div>

                    {youtubeChannels.length === 0 ? (
                      <div className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold block text-white">No YouTube channel linked</span>
                            <span className="text-[11px] text-zinc-400">Authorize your channel via Google OAuth to proceed</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGoogleAuthService('youtube')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-xs transition cursor-pointer shrink-0"
                        >
                          Sign in with Google
                        </button>
                      </div>
                    ) : (
                      <select
                        value={selectedYouTubeChannelId}
                        onChange={(e) => setSelectedYouTubeChannelId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                      >
                        {youtubeChannels.map(channel => (
                          <option key={channel.id} value={channel.id}>
                            {channel.name} ({channel.handle})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Google Drive Folder Binding */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-semibold block">
                    Google Drive Ingestion Folder
                  </label>
                  <button
                    type="button"
                    onClick={() => setGoogleAuthService('drive')}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Authorize New Drive Folder</span>
                  </button>
                </div>
                <select
                  value={selectedDriveFolderId}
                  onChange={(e) => setSelectedDriveFolderId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:border-amber-500"
                >
                  {availableDriveFolders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      📁 {folder.name} ({folder.filesCount} files) • {folder.folderPath}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-zinc-500 block">
                  This pipeline will automatically watch this folder for incoming image & video media.
                </span>
              </div>

              {/* 5. DEDICATED CUSTOM DESTINATION URL (User Explicit Requirement) */}
              <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <label className="text-zinc-200 font-semibold">
                    Dedicated Destination Landing Page URL for THIS Automation
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="e.g., https://mybrand.com/featured-guide"
                  value={customDestinationUrl}
                  onChange={(e) => setCustomDestinationUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-blue-800/60 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:border-blue-400 text-xs"
                />
                <span className="text-[11px] text-blue-300/80 block">
                  ✨ Leave blank to inherit the global fallback (<span className="font-mono text-zinc-300">{settings.globalWebsiteUrl}</span>). If filled, posts published by this rule will direct clicks strictly to this dedicated URL!
                </span>
              </div>

              {/* 6. AI Profile & Timing Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">AI Prompt Profile</label>
                  <select
                    value={selectedPromptProfileId}
                    onChange={(e) => setSelectedPromptProfileId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200"
                  >
                    {promptProfiles.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        ✨ {prof.name} ({prof.tone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Minimum Posting Delay (Minutes)</label>
                  <input
                    type="number"
                    min={10}
                    max={720}
                    value={postingGapMinutes}
                    onChange={(e) => setPostingGapMinutes(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              {/* 7. Auto Publish Direct or Enqueue */}
              <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                <div>
                  <span className="text-zinc-200 font-medium block">Automatic Publishing</span>
                  <span className="text-[11px] text-zinc-500">
                    If enabled, posts will be scheduled directly into the publishing queue without manual review.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoPublishDirectly}
                  onChange={(e) => setAutoPublishDirectly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{editingRuleId ? 'Save Changes' : 'Create Pipeline'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Google OAuth Modal for YouTube and Google Drive */}
      <GoogleAuthModal
        isOpen={googleAuthService !== null}
        onClose={() => setGoogleAuthService(null)}
        serviceType={googleAuthService || 'youtube'}
        userEmail="creator@gmail.com"
        onSuccess={async (data) => {
          if (data.channel) {
            const newChan = await connectYouTubeChannel(data.channel.name, data.channel.handle, data.channel.gapMinutes);
            if (newChan) setSelectedYouTubeChannelId(newChan.id);
          } else if (data.folder) {
            const newFld = await connectGoogleDriveFolder(data.folder.name, data.folder.folderPath);
            if (newFld) setSelectedDriveFolderId(newFld.id);
          }
        }}
      />
    </div>
  );
};
