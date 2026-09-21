import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PinterestAccount } from '../../types';
import {
  Bookmark,
  Plus,
  RefreshCw,
  ExternalLink,
  Layers,
  CheckCircle2,
  FolderPlus,
  X,
  Send,
  Pin
} from 'lucide-react';

export const PinterestView: React.FC = () => {
  const {
    pinterestAccounts,
    connectPinterestAccount,
    togglePinterestConnection,
    createPinterestBoard,
    navigateTo,
    showToast,
    settings
  } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(pinterestAccounts[0]?.id || '');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);

  // New account form state
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountUsername, setNewAccountUsername] = useState('');

  // New board form state
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  const activeAccount = pinterestAccounts.find(a => a.id === selectedAccountId) || pinterestAccounts[0];

  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName || !newAccountUsername) return;
    await connectPinterestAccount(newAccountName, newAccountUsername);
    setNewAccountName('');
    setNewAccountUsername('');
    setShowConnectModal(false);
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName || !activeAccount) return;
    await createPinterestBoard(activeAccount.id, newBoardName, newBoardDesc);
    setNewBoardName('');
    setNewBoardDesc('');
    setShowBoardModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Pinterest Accounts & Boards</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage multiple Pinterest business accounts, organize niche boards, and schedule high-converting image & video Pins with preserved custom destination URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Pinterest Account</span>
          </button>
        </div>
      </div>

      {/* Accounts List & Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pinterestAccounts.map((acc) => {
          const isSelected = acc.id === activeAccount?.id;
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/30'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{acc.name}</h3>
                    <span className="text-xs text-zinc-400">{acc.username}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  acc.isConnected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {acc.isConnected ? 'Connected' : 'Paused'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span>{acc.boards.length} Boards</span>
                <span className="font-semibold text-zinc-200">{acc.postsPublished} Pins Published</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Account Detail Panel */}
      {activeAccount && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Bookmark className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-zinc-100">{activeAccount.name} Boards & Settings</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Account ID: <span className="font-mono text-zinc-300">{activeAccount.id}</span> • Last Sync: {activeAccount.lastSync}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBoardModal(true)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
              >
                <FolderPlus className="w-3.5 h-3.5 text-zinc-400" />
                <span>New Board</span>
              </button>
              <button
                onClick={() => navigateTo('create')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                Create Pin for this Account
              </button>
            </div>
          </div>

          {/* Boards Grid */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Configured Target Boards ({activeAccount.boards.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeAccount.boards.map((board) => (
                <div
                  key={board.id}
                  className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs font-semibold text-zinc-200">{board.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {board.pinCount} pins
                    </span>
                  </div>
                  {board.description && (
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                      {board.description}
                    </p>
                  )}
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>ID: {board.id}</span>
                    <button
                      onClick={() => navigateTo('create')}
                      className="text-rose-400 hover:underline font-medium"
                    >
                      Schedule to Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination URL Enforcement Info */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-start gap-3">
            <Pin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-zinc-200 block">Strict Destination URL Preservation</span>
              <p className="text-zinc-400 leading-relaxed">
                SocialFlow enforces zero URL mutation. Every Pin published to{' '}
                <span className="text-zinc-200 font-semibold">{activeAccount.name}</span> will link strictly to the custom destination URL entered for that post (e.g. blog post landing page, Shopify product page, or printable download), prioritizing per-post URLs over the global website URL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleConnectAccount} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Connect Pinterest Account</h3>
              <button type="button" onClick={() => setShowConnectModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Account Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Savvy Mom Budget"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Pinterest Username</label>
                <input
                  type="text"
                  placeholder="e.g. @savvymombudget"
                  value={newAccountUsername}
                  onChange={(e) => setNewAccountUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Connect (Demo)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Board Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleCreateBoard} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm">Create New Pinterest Board</h3>
              <button type="button" onClick={() => setShowBoardModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Board Name</label>
                <input
                  type="text"
                  placeholder="e.g. $20 Weekly Grocery Meal Plans"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Board Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="What is this board about?"
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBoardModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Create Board
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
