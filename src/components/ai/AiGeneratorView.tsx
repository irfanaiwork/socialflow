import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiPromptProfile, AiVisualAnalysis, MediaItem } from '../../types';
import {
  Sparkles,
  Bookmark,
  Share2,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  Plus,
  Sliders,
  Copy,
  ExternalLink,
  Bot,
  Lightbulb,
  X
} from 'lucide-react';
import { AiService } from '../../services/aiService';

export const AiGeneratorView: React.FC = () => {
  const {
    mediaItems,
    promptProfiles,
    activePromptProfileId,
    setActivePromptProfileId,
    addPromptProfile,
    navigateTo,
    showToast,
    settings,
    getEffectiveDestinationUrl
  } = useApp();

  const [selectedMediaId, setSelectedMediaId] = useState<string>(mediaItems[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated or edited state
  const [topic, setTopic] = useState('');
  const [visualSummary, setVisualSummary] = useState('');
  const [pinterestTitle, setPinterestTitle] = useState('');
  const [pinterestDesc, setPinterestDesc] = useState('');
  const [facebookCaption, setFacebookCaption] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');

  // Add profile modal
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newTone, setNewTone] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newUrlTemplate, setNewUrlTemplate] = useState('');

  const currentMedia = mediaItems.find(m => m.id === selectedMediaId);
  const activeProfile = promptProfiles.find(p => p.id === activePromptProfileId) || promptProfiles[0];

  // Initialize with current media's analysis if exists
  React.useEffect(() => {
    if (currentMedia?.aiAnalysis) {
      setTopic(currentMedia.aiAnalysis.mainTopic || '');
      setVisualSummary(currentMedia.aiAnalysis.visualElementsSummary || '');
      setPinterestTitle(currentMedia.aiAnalysis.pinterestTitle || '');
      setPinterestDesc(currentMedia.aiAnalysis.pinterestDescription || '');
      setFacebookCaption(currentMedia.aiAnalysis.facebookCaption || '');
      setDestinationUrl(getEffectiveDestinationUrl(currentMedia.aiAnalysis.suggestedDestinationUrl));
    }
  }, [currentMedia]);

  const handleGenerate = async () => {
    if (!currentMedia) return;
    setIsGenerating(true);
    showToast('info', 'AI Analysis Started', `Scanning visual structure of ${currentMedia.fileName}...`);

    try {
      const result = await AiService.analyzeMedia(currentMedia, activeProfile);
      setTopic(result.mainTopic || '');
      setVisualSummary(result.visualElementsSummary || '');
      setPinterestTitle(result.pinterestTitle || '');
      setPinterestDesc(result.pinterestDescription || '');
      setFacebookCaption(result.facebookCaption || '');
      setDestinationUrl(getEffectiveDestinationUrl(result.suggestedDestinationUrl));
      showToast('success', 'Generation Completed', `Fine-tuned for profile "${activeProfile.name}".`);
    } catch (err: any) {
      showToast('error', 'Generation Failed', err.message || 'Could not complete AI analysis.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToCreatePost = () => {
    if (!currentMedia) return;
    // Prepare updated media item with these contents
    const baseAnalysis: AiVisualAnalysis = currentMedia.aiAnalysis || {
      mainTopic: topic,
      objects: [],
      people: 'None',
      environment: 'Studio/Digital',
      visualStyle: 'Modern',
      textVisible: '',
      mainMessage: topic,
      targetAudience: 'General Audience',
      contentCategory: 'Social Media',
      keywords: [],
      searchIntent: 'Inspirational / Informative',
      pinterestTitle,
      pinterestDescription: pinterestDesc,
      facebookCaption,
      suggestedHashtags: [],
      suggestedCta: 'Click the link to learn more!'
    };

    const updatedMedia: MediaItem = {
      ...currentMedia,
      destinationUrl,
      aiAnalysis: {
        ...baseAnalysis,
        mainTopic: topic,
        visualElementsSummary: visualSummary,
        pinterestTitle,
        pinterestDescription: pinterestDesc,
        facebookCaption,
        suggestedDestinationUrl: destinationUrl
      }
    };
    navigateTo('create', updatedMedia);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName || !newBrandName) return;

    addPromptProfile({
      name: newProfileName,
      brandName: newBrandName,
      tone: newTone || 'Engaging and professional',
      targetAudience: 'Content consumers and social media followers',
      targetKeywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean),
      destinationUrlTemplate: newUrlTemplate || settings.globalWebsiteUrl
    });

    setNewProfileName('');
    setNewBrandName('');
    setNewTone('');
    setNewKeywords('');
    setNewUrlTemplate('');
    setShowAddProfileModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">AI Visual Analysis & Copywriting</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Detect visual hooks, movement, and aesthetics to craft high-conversion Pinterest Titles, descriptions, and Facebook captions.
          </p>
        </div>

        <button
          onClick={() => setShowAddProfileModal(true)}
          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Prompt Profile</span>
        </button>
      </div>

      {/* Profile Switcher Pills */}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-amber-400" />
            Active Niche Prompt Profile
          </span>
          <span className="text-[11px] text-zinc-500">Guides AI tone, hashtags & target audience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {promptProfiles.map((p) => {
            const isActive = p.id === activePromptProfileId;
            return (
              <div
                key={p.id}
                onClick={() => setActivePromptProfileId(p.id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-200">{p.name}</h4>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{p.tone}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(p.targetKeywords || p.keywords || []).slice(0, 3).map((kw: string) => (
                    <span key={kw} className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Generator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Selection & Visual Feature Extraction (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-semibold text-zinc-200 block">Select Media Asset to Analyze</label>

            {/* Media Selector */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {mediaItems.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMediaId(m.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition ${
                    selectedMediaId === m.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-zinc-100'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={m.thumbnailUrl} alt={m.fileName} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-medium block truncate">{m.fileName}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{m.mediaType}</span>
                    </div>
                  </div>
                  {m.aiAnalysisStatus === 'Analyzed' && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded shrink-0">
                      Analyzed
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Analysis Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !currentMedia}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Analyzing Visuals & Synthesizing...' : 'Analyze Visuals & Generate Copy'}</span>
            </button>
          </div>

          {/* Visual Breakdown Card */}
          {topic && (
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Detected Visual Attributes
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Primary Visual Theme</span>
                  <p className="text-zinc-200 font-semibold">{topic}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[11px]">Visual Summary & Hooks</span>
                  <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/70">
                    {visualSummary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Editable Output Fields (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200">Generated Copy (Fully Editable)</span>
              <span className="text-[11px] text-zinc-400">Review before publishing</span>
            </div>

            {/* Pinterest Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-rose-400" />
                  Pinterest Title (Max 100 Chars)
                </label>
                <span className="text-[10px] text-zinc-500">{pinterestTitle.length}/100</span>
              </div>
              <input
                type="text"
                value={pinterestTitle}
                onChange={(e) => setPinterestTitle(e.target.value)}
                placeholder="AI-generated SEO title..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:border-blue-500"
              />
            </div>

            {/* Pinterest Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-rose-400" />
                  Pinterest Description (Max 500 Chars)
                </label>
                <span className="text-[10px] text-zinc-500">{pinterestDesc.length}/500</span>
              </div>
              <textarea
                rows={3}
                value={pinterestDesc}
                onChange={(e) => setPinterestDesc(e.target.value)}
                placeholder="AI-generated Pinterest pin description..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Facebook Caption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  Facebook Page Caption (Conversational + Hashtags)
                </label>
                <span className="text-[10px] text-zinc-500">{facebookCaption.length}/2000</span>
              </div>
              <textarea
                rows={4}
                value={facebookCaption}
                onChange={(e) => setFacebookCaption(e.target.value)}
                placeholder="AI-generated viral Facebook caption..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Destination URL */}
            <div>
              <label className="text-xs text-zinc-300 font-medium flex items-center gap-1 mb-1">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Target Destination URL
              </label>
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://savvymombudget.blogspot.com/p/free-budget-planner.html"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:border-blue-500"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={handleSendToCreatePost}
                disabled={!pinterestTitle}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Post Composer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleCreateProfile} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Create New Prompt Profile</h3>
              <button type="button" onClick={() => setShowAddProfileModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Frugal Kitchen Hacks"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Savvy Mom Kitchen"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Copy Tone & Voice</label>
                <input
                  type="text"
                  placeholder="e.g. Relatable, warm, money-saving, empowering"
                  value={newTone}
                  onChange={(e) => setNewTone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Keywords & Hashtags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. mealprep, budgetrecipes, grocerysaving"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Default Destination URL Template</label>
                <input
                  type="url"
                  placeholder="e.g. https://savvymombudget.blogspot.com"
                  value={newUrlTemplate}
                  onChange={(e) => setNewUrlTemplate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProfileModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
