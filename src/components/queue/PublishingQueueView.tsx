import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QueueItem, PostStatus, PlatformType } from '../../types';
import {
  Layers,
  Play,
  RotateCw,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Film,
  Image as ImageIcon,
  ArrowUpDown,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  Send
} from 'lucide-react';

export const PublishingQueueView: React.FC = () => {
  const {
    queueItems,
    runEntireQueue,
    publishQueueItemNow,
    retryFailedQueueItem,
    deleteQueueItem,
    updateQueueItem,
    reorderQueueItems,
    settings,
    getEffectiveDestinationUrl
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<QueueItem | null>(null);

  const filteredQueue = queueItems.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    return true;
  });

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < queueItems.length) {
      reorderQueueItems(index, targetIndex);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Queue Control Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Publishing Queue</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized automation pipeline managing real-time posting cadences, retry logic, and platform dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runEntireQueue}
            className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Process All Pending Now</span>
          </button>
        </div>
      </div>

      {/* Filter and Status Summary Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-zinc-400 mr-1">Status:</span>
          {['all', 'Pending', 'Scheduled', 'Publishing', 'Published', 'Failed', 'Retrying'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                {st === 'all'
                  ? queueItems.length
                  : queueItems.filter(q => q.status === st).length}
              </span>
            </button>
          ))}
        </div>

        {/* Platform Toggle */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'pinterest', label: 'Pinterest' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'youtube', label: 'YouTube' },
          ].map((pf) => (
            <button
              key={pf.id}
              onClick={() => setPlatformFilter(pf.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                platformFilter === pf.id ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items List */}
      {filteredQueue.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center">
          <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No items match this filter.</p>
          <p className="text-xs text-zinc-500 mt-1">Queue up content from Content Library or Create Post.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((item, index) => {
            const isVideo = item.mediaType === 'video';
            const destUrl = getEffectiveDestinationUrl(item.destinationUrl);

            return (
              <div
                key={item.id}
                className="group bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition shadow-sm"
              >
                {/* Left Section: Reorder, Thumbnail & Details */}
                <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                  {/* Priority reordering controls */}
                  <div className="flex flex-col gap-0.5 text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:text-zinc-200 disabled:opacity-20"
                      title="Move up priority"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === queueItems.length - 1}
                      className="p-1 hover:text-zinc-200 disabled:opacity-20"
                      title="Move down priority"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-zinc-800 shrink-0">
                    <img src={item.thumbnailUrl} alt={item.mediaName} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 p-0.5 rounded bg-black/70 text-zinc-300">
                      {isVideo ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Platform Tag */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.platform === 'pinterest'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.platform === 'facebook'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {item.platform}
                      </span>

                      {/* Account / Page / Channel Target */}
                      <span className="text-xs font-semibold text-zinc-200 truncate">
                        {item.platform === 'pinterest'
                          ? item.pinterestAccountName
                          : item.platform === 'facebook'
                          ? item.facebookPageName
                          : item.youtubeChannelName || 'YouTube Channel'}
                      </span>

                      {item.boardName && (
                        <span className="text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                          Board: {item.boardName}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-medium text-zinc-100 truncate max-w-xl">
                      {item.title}
                    </h4>

                    {/* Destination URL */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 truncate">
                      <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="text-blue-400 truncate">{destUrl}</span>
                    </div>

                    {/* Error message if failed */}
                    {item.errorMessage && (
                      <p className="text-[11px] text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-900/60 max-w-lg mt-1">
                        {item.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section: Time, Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-0 border-zinc-800">
                  {/* Scheduled Slot Time */}
                  <div className="text-left md:text-right">
                    <div className="flex items-center md:justify-end gap-1 text-xs text-zinc-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.scheduledTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Published' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Failed' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                    item.status === 'Publishing' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse' :
                    item.status === 'Retrying' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}>
                    {item.status}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {item.status === 'Failed' ? (
                      <button
                        onClick={() => retryFailedQueueItem(item.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                        title="Retry posting"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    ) : item.status !== 'Published' ? (
                      <button
                        onClick={() => publishQueueItemNow(item.id)}
                        className="p-1.5 bg-zinc-800 hover:bg-emerald-600/30 hover:text-emerald-300 text-zinc-300 rounded-lg transition"
                        title="Publish Now (Demo)"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
                      title="Edit item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteQueueItem(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                      title="Delete from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Queue Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Edit Queue Item</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Destination URL (Pinterest)</label>
                <input
                  type="url"
                  value={editingItem.destinationUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, destinationUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono"
                />
              </div>

              {editingItem.platform === 'pinterest' ? (
                <div>
                  <label className="text-zinc-400 block mb-1">Pinterest Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-zinc-400 block mb-1">Facebook Caption</label>
                  <textarea
                    rows={3}
                    value={editingItem.caption}
                    onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateQueueItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
