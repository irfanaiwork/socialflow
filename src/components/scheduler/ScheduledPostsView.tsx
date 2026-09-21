import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Share2,
  Bookmark,
  Shuffle,
  ShieldCheck,
  Zap,
  RotateCw
} from 'lucide-react';
import { SchedulerService } from '../../services/schedulerService';
import { SmartPromptScheduler } from './SmartPromptScheduler';

export const ScheduledPostsView: React.FC = () => {
  const {
    scheduleConfig,
    updateScheduleConfig,
    queueItems,
    facebookPages,
    publishQueueItemNow,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'prompt' | 'config'>('prompt');
  const [localConfig, setLocalConfig] = useState(scheduleConfig);

  const handleSaveConfig = () => {
    updateScheduleConfig(localConfig);
    showToast('success', 'Saved', 'Schedule parameters updated.');
  };

  // Generate preview of smart schedule slots
  const calculatedSlots = SchedulerService.generateSmartScheduleSlots(
    localConfig.postsPerDay,
    localConfig
  );

  const scheduledItems = queueItems.filter(q => q.status === 'Scheduled' || q.status === 'Pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Automation • High-Speed Scheduling
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Centralized Scheduling Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Autonomous slot allocator distributing content across daily time windows with per-page delay compliance and natural language instruction batching.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#071224] p-1 rounded-xl border border-[#1a335a]">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'prompt'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>AI Prompt Scheduler</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'config'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-sky-200" />
            <span>Parameters & Config</span>
          </button>
        </div>
      </div>

      {/* Prominent Smart Prompt Scheduler View */}
      {activeTab === 'prompt' && (
        <SmartPromptScheduler />
      )}

      {/* Schedule Parameters & Advanced Sliders Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${activeTab === 'prompt' ? 'mt-6' : ''}`}>
        {/* Left Column: Central Scheduler Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0b1730]/90 border border-[#1a335a] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Scheduling Engine Mode
              </span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setLocalConfig({ ...localConfig, mode: 'smart' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    localConfig.mode === 'smart' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400'
                  }`}
                >
                  Smart Schedule
                </button>
                <button
                  onClick={() => setLocalConfig({ ...localConfig, mode: 'fixed' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    localConfig.mode === 'fixed' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400'
                  }`}
                >
                  Fixed Interval
                </button>
              </div>
            </div>

            {/* Posts Per Day */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-300 font-medium">Target Posts Per Day</label>
                <span className="text-xs font-bold text-blue-400 font-mono">{localConfig.postsPerDay} posts</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={localConfig.postsPerDay}
                onChange={(e) => setLocalConfig({ ...localConfig, postsPerDay: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>1 post/day</span>
                <span>6 posts/day</span>
                <span>12 posts/day</span>
              </div>
            </div>

            {/* Active Time Window */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Window Start Time</label>
                <input
                  type="time"
                  value={localConfig.startTime}
                  onChange={(e) => setLocalConfig({ ...localConfig, startTime: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Window End Time</label>
                <input
                  type="time"
                  value={localConfig.endTime}
                  onChange={(e) => setLocalConfig({ ...localConfig, endTime: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Operating Timezone</label>
              <select
                value={localConfig.timezone}
                onChange={(e) => setLocalConfig({ ...localConfig, timezone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="UTC">UTC Universal Time</option>
              </select>
            </div>

            {/* Randomize Schedule Natural Variance */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">Natural Schedule Variance</span>
                  <span className="text-[11px] text-zinc-500">Injects +/- 10m jitter to look human</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localConfig.randomizeSchedule}
                onChange={(e) => setLocalConfig({ ...localConfig, randomizeSchedule: e.target.checked })}
                className="rounded border-zinc-700 text-blue-600 focus:ring-0 w-4 h-4"
              />
            </div>
          </div>

          {/* Facebook Pages Posting Gap Reference */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Enforced Page Delays
              </span>
              <span className="text-[11px] text-zinc-500">Automatic gap detection</span>
            </div>

            <div className="space-y-2">
              {facebookPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60 text-xs">
                  <span className="text-zinc-300 font-medium truncate">{page.name}</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-blue-400">
                    Min gap: {page.postingGapMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Daily Time Slots & Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Daily Slots Breakdown */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Calculated Distribution Slots</h3>
                <p className="text-xs text-zinc-400">
                  Daily slots from {localConfig.startTime} to {localConfig.endTime} ({localConfig.timezone})
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {localConfig.mode.toUpperCase()} ENGINE
              </span>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {calculatedSlots.map((slotDate, index) => (
                <div
                  key={index}
                  className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-zinc-200 font-mono">
                        {slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">Estimated delivery slot</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                    Slot Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Scheduled Posts Queue */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Scheduled Posts Timeline</h3>
              <span className="text-xs text-zinc-400">{scheduledItems.length} posts pending schedule</span>
            </div>

            {scheduledItems.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No posts scheduled currently.</p>
            ) : (
              <div className="space-y-2.5">
                {scheduledItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.thumbnailUrl} alt={item.mediaName} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-200 block truncate">{item.title}</span>
                        <span className="text-[11px] text-zinc-500">
                          {item.platform.toUpperCase()} • {item.platform === 'pinterest' ? item.pinterestAccountName : item.facebookPageName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono text-[11px] text-zinc-300">
                        {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <button
                        onClick={() => publishQueueItemNow(item.id)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
