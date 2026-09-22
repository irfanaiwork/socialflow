import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FacebookPage } from '../../types';
import {
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sliders,
  Play,
  Pause,
  ExternalLink,
  ShieldAlert,
  X,
  Edit2
} from 'lucide-react';

export const FacebookView: React.FC = () => {
  const {
    facebookPages,
    updateFacebookPageGap,
    toggleFacebookPageConnection,
    connectFacebookPage,
    navigateTo,
    showToast
  } = useApp();

  const [editingPage, setEditingPage] = useState<FacebookPage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageGap, setNewPageGap] = useState(60);

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName) return;
    await connectFacebookPage(newPageName, newPageGap);
    setNewPageName('');
    setNewPageGap(60);
    setShowAddModal(false);
  };

  const handleSavePageEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    updateFacebookPageGap(editingPage.id, editingPage.postingGapMinutes);
    setEditingPage(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Facebook Pages & Posting Delays</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage multi-page networks with independent minimum posting gaps to prevent algorithmic spam throttling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Facebook Page</span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      {facebookPages.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">No Facebook Pages Connected</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Connect your Facebook business pages and configure anti-spam posting delay intervals to start multi-page distribution.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 inline-flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Your First Facebook Page</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facebookPages.map((page) => {
          return (
            <div
              key={page.id}
              className="bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm"
            >
              {/* Header: Avatar, Name, Status Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={page.avatarUrl}
                    alt={page.name}
                    className="w-11 h-11 rounded-xl object-cover border border-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">{page.name}</h3>
                    <span className="text-[11px] font-mono text-zinc-400">ID: {page.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFacebookPageConnection(page.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                    page.isConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-750'
                  }`}
                  title="Click to toggle Active / Paused"
                >
                  {page.isConnected ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Per-Page Configured Posting Gap Metric */}
              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Configured Delay Gap
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {page.postingGapMinutes} minutes
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-850">
                  <span>Last Published:</span>
                  <span className="text-zinc-300">
                    {page.lastPostTime || page.lastPublished ? new Date(page.lastPostTime || page.lastPublished || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'None yet'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Next Eligible Slot:</span>
                  <span className="text-emerald-400 font-mono">
                    {page.nextAvailableSlot ? new Date(page.nextAvailableSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready now'}
                  </span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-200">{page.postsPublished ?? page.dailyPostCount ?? 0}</span> Posts Published
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
                    title="Edit posting gap"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('create')}
                    className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg font-medium text-xs transition"
                  >
                    Post to Page
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Multi-Page Posting Engine Info */}
      <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-zinc-200 block">
            Automated Staggering Architecture
          </span>
          <p className="text-zinc-400 leading-relaxed">
            When publishing a single post across multiple Facebook pages simultaneously, SocialFlow calculates individual delivery timestamps staggered by each page's specific gap (e.g. 60m for Mystique Magic, 90m for Street Magic Daily). This protects your business page reputation from duplicate frequency penalties.
          </p>
        </div>
      </div>

      {/* Edit Gap Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleSavePageEdit} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Edit {editingPage.name} Settings</h3>
              <button type="button" onClick={() => setEditingPage(null)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Minimum Posting Delay / Gap (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="720"
                  step="15"
                  value={editingPage.postingGapMinutes}
                  onChange={(e) => setEditingPage({ ...editingPage, postingGapMinutes: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Example: 60 = 1 hour minimum gap between posts on this page.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Save Gap Setting
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleAddPage} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Connect New Facebook Page</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Page Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Magic Tricks"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Configured Posting Delay Gap (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="720"
                  step="15"
                  value={newPageGap}
                  onChange={(e) => setNewPageGap(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Connect Page (Demo)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
