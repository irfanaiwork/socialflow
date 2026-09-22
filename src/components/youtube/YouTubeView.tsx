import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { YouTubeChannel } from '../../types';
import { GoogleAuthModal } from '../common/GoogleAuthModal';
import {
  Youtube,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sliders,
  Play,
  Pause,
  ExternalLink,
  Eye,
  Video,
  ShieldCheck,
  X,
  Edit2,
  Sparkles,
  Bot
} from 'lucide-react';

export const YouTubeView: React.FC = () => {
  const {
    youtubeChannels,
    updateYouTubeChannelGap,
    toggleYouTubeChannelConnection,
    connectYouTubeChannel,
    navigateTo,
    showToast
  } = useApp();

  const [editingChannel, setEditingChannel] = useState<YouTubeChannel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSaveChannelEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel) return;
    updateYouTubeChannelGap(editingChannel.id, editingChannel.postingGapMinutes);
    setEditingChannel(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">YouTube Channels & Shorts Automation</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              OAuth 2.0 Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage multi-channel YouTube distribution with independent upload gaps, Shorts auto-tagging, and custom landing page links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect YouTube Channel</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-900 border border-red-900/40 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-zinc-100">YouTube Shorts & Channel Automation Engine</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">Google Cloud Verified</span>
          </div>
          <p className="text-xs text-zinc-300">
            Link authorized YouTube channels via Google Account verification. Each channel supports custom upload intervals, automatic hashtag extraction, and dedicated Google Drive folder watchers.
          </p>
        </div>
      </div>

      {/* Channels Grid */}
      {youtubeChannels.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">No YouTube Channels Connected</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Connect your YouTube channels to auto-publish Shorts and full-length videos with custom tags and landing page destination links.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/20 inline-flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Your First YouTube Channel</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {youtubeChannels.map((channel) => {
          return (
            <div
              key={channel.id}
              className="bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm"
            >
              {/* Header: Avatar, Name, Status Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={channel.avatarUrl}
                    alt={channel.name}
                    className="w-11 h-11 rounded-xl object-cover border border-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">{channel.name}</h3>
                    <span className="text-[11px] font-mono text-red-400">{channel.handle}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleYouTubeChannelConnection(channel.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                    channel.isConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-750'
                  }`}
                >
                  {channel.isConnected ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Channel Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-zinc-950/60 border border-zinc-800/60 rounded-xl text-center">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Subscribers</div>
                  <div className="text-xs font-semibold text-zinc-200 mt-0.5">{channel.subscribersCount?.toLocaleString() || '1.2K'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Videos</div>
                  <div className="text-xs font-semibold text-zinc-200 mt-0.5">{channel.videosCount || 0}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Published</div>
                  <div className="text-xs font-semibold text-zinc-200 mt-0.5">{channel.postsPublished || 0}</div>
                </div>
              </div>

              {/* Posting Gap Control */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Upload Delay:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-red-400 font-semibold">{channel.postingGapMinutes}m</span>
                    <button
                      onClick={() => setEditingChannel(channel)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
                      title="Adjust Delay"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Daily Upload Cap:</span>
                  <span className="text-zinc-300 font-mono">{channel.dailyPostCount} / {channel.maxDailyPosts}</span>
                </div>

                <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (channel.dailyPostCount / channel.maxDailyPosts) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => navigateTo('create')}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>Upload Short</span>
                </button>

                <button
                  onClick={() => navigateTo('automation')}
                  className="flex-1 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Automate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal: Connect Channel via Google OAuth */}
      <GoogleAuthModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        serviceType="youtube"
        userEmail="creator@gmail.com"
        onSuccess={async (data) => {
          if (data.channel) {
            await connectYouTubeChannel(data.channel.name, data.channel.handle, data.channel.gapMinutes);
            setShowAddModal(false);
          }
        }}
      />

      {/* Modal: Edit Upload Gap */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-100">Adjust Upload Gap</h3>
              <button
                onClick={() => setEditingChannel(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveChannelEdit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Delay for {editingChannel.name} (minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  max={720}
                  value={editingChannel.postingGapMinutes}
                  onChange={(e) => setEditingChannel({ ...editingChannel, postingGapMinutes: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium"
                >
                  Save Delay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
