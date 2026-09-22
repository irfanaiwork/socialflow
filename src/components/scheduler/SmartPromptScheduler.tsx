import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QueueItem } from '../../types';
import {
  Sparkles,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  Bookmark,
  Share2,
  Youtube,
  ArrowRight,
  Layers,
  Sliders,
  AlertCircle,
  Shuffle,
  Send,
  HelpCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

interface SmartPromptSchedulerProps {
  onScheduledSuccess?: () => void;
  className?: string;
}

interface ParsedSchedule {
  rawInstruction: string;
  totalPins: number;
  gapMinutes: number;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  targetPlatform: 'pinterest' | 'facebook' | 'youtube' | 'all';
  pinterestAccountId: string;
  pinterestBoardId: string;
  destinationUrl: string;
  mode: 'today_all' | 'custom_date' | 'daily_recurring';
}

export const SmartPromptScheduler: React.FC<SmartPromptSchedulerProps> = ({
  onScheduledSuccess,
  className = ''
}) => {
  const {
    mediaItems,
    pinterestAccounts,
    facebookPages,
    youtubeChannels,
    addMultipleQueueItems,
    addLog,
    showToast,
    getEffectiveDestinationUrl,
    navigateTo
  } = useApp();

  // Active user instruction text (defaults to the exact batch scheduling scenario)
  const [instruction, setInstruction] = useState(
    'Schedule all available pins today: 24 pins with 1 hour gap between each pin'
  );

  const activePinterest = pinterestAccounts[0];
  const activeBoard = activePinterest?.boards[0];

  // Config overrides
  const [overrideCount, setOverrideCount] = useState<number | null>(null);
  const [overrideGap, setOverrideGap] = useState<number | null>(null);
  const [overrideStartDate, setOverrideStartDate] = useState<string>('');
  const [overrideStartTime, setOverrideStartTime] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState(activePinterest?.id || '');
  const [selectedBoardId, setSelectedBoardId] = useState(activeBoard?.id || '');
  const [customDestinationUrl, setCustomDestinationUrl] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [autoFillMedia, setAutoFillMedia] = useState(true);

  // Quick preset instructions
  const samplePrompts = [
    {
      title: 'Today 24 Pins (1 Hr Gap)',
      text: 'Schedule 24 pins for today with 1 hour gap between posts',
      badge: 'Full Day'
    },
    {
      title: 'Today 12 Pins (2 Hr Gap)',
      text: 'Schedule 12 pins today with 2 hours interval between posts',
      badge: 'Relaxed Pace'
    },
    {
      title: 'Tomorrow Morning 9 AM (30m Interval)',
      text: 'Schedule 15 pins tomorrow starting at 09:00 AM with 30 minutes gap',
      badge: 'Morning Slot'
    },
    {
      title: '24/7 Hourly Blitz (24 Pins)',
      text: 'Schedule 24 pins starting now with 60 minutes interval across today and tonight',
      badge: 'Hourly Blitz'
    }
  ];

  // Natural Language & Prompt Parser Function
  const parsedData = useMemo<ParsedSchedule>(() => {
    const text = instruction.toLowerCase().trim();
    const now = new Date();

    // 1. Detect Count of Pins
    let count = 24;
    const countMatch = text.match(/(\d+)\s*(pins?|posts?|items?|tasveerein)?/i);
    if (countMatch && parseInt(countMatch[1], 10) > 0) {
      count = parseInt(countMatch[1], 10);
    } else if (text.includes('sab') || text.includes('all') || text.includes('jitni bhi')) {
      count = mediaItems.length > 0 ? Math.max(mediaItems.length, 24) : 24;
    }

    if (overrideCount !== null) {
      count = overrideCount;
    }

    // 2. Detect Interval / Gap in Minutes
    let gap = 60; // default 1 hour
    if (text.includes('aik ghant') || text.includes('1 ghant') || text.includes('1 hour') || text.includes('1 hr') || text.includes('har ghanty') || text.includes('per hour')) {
      gap = 60;
    } else if (text.includes('2 ghant') || text.includes('2 hour') || text.includes('2 hr')) {
      gap = 120;
    } else if (text.includes('3 ghant') || text.includes('3 hour')) {
      gap = 180;
    } else if (text.includes('aadha ghanta') || text.includes('half hour') || text.includes('30 min')) {
      gap = 30;
    } else if (text.includes('45 min')) {
      gap = 45;
    } else {
      const minMatch = text.match(/(\d+)\s*(min|minute|minutes|minto)/i);
      if (minMatch) {
        gap = parseInt(minMatch[1], 10);
      }
    }

    if (overrideGap !== null) {
      gap = overrideGap;
    }

    // 3. Detect Target Date
    let targetDate = new Date();
    let mode: ParsedSchedule['mode'] = 'today_all';

    if (text.includes('kal') || text.includes('tomorrow') || text.includes('aglay din')) {
      targetDate.setDate(targetDate.getDate() + 1);
      mode = 'custom_date';
    } else if (text.includes('parso') || text.includes('day after')) {
      targetDate.setDate(targetDate.getDate() + 2);
      mode = 'custom_date';
    } else if (text.includes('aj') || text.includes('aaj') || text.includes('today')) {
      mode = 'today_all';
    }

    const yearStr = targetDate.getFullYear();
    const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(targetDate.getDate()).padStart(2, '0');
    const dateFormatted = overrideStartDate || `${yearStr}-${monthStr}-${dayStr}`;

    // 4. Detect Start Time
    let startHours = now.getHours();
    let startMinutes = now.getMinutes() >= 30 ? 0 : 30;
    if (now.getMinutes() >= 30) {
      startHours = (startHours + 1) % 24;
    }

    // Explicit time mentions in prompt
    const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje|subah|shaam)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = (timeMatch[3] || '').toLowerCase();
      if ((meridiem === 'pm' || meridiem === 'shaam') && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;
      if (h >= 0 && h < 24) {
        startHours = h;
        startMinutes = m;
      }
    }

    const timeFormatted = overrideStartTime || `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;

    // 5. Target Platform
    let platform: ParsedSchedule['targetPlatform'] = 'pinterest';
    if (text.includes('facebook') || text.includes('fb page')) {
      platform = 'facebook';
    } else if (text.includes('youtube') || text.includes('shorts')) {
      platform = 'youtube';
    } else if (text.includes('all') || text.includes('sab platform')) {
      platform = 'all';
    }

    const effectiveAccount = pinterestAccounts.find(a => a.id === selectedAccountId) || pinterestAccounts[0];
    const effectiveBoard = effectiveAccount?.boards.find(b => b.id === selectedBoardId) || effectiveAccount?.boards[0];

    return {
      rawInstruction: instruction,
      totalPins: Math.max(1, Math.min(count, 48)),
      gapMinutes: Math.max(5, gap),
      startDate: dateFormatted,
      startTime: timeFormatted,
      targetPlatform: platform,
      pinterestAccountId: effectiveAccount?.id || '',
      pinterestBoardId: effectiveBoard?.id || '',
      destinationUrl: customDestinationUrl || getEffectiveDestinationUrl(),
      mode
    };
  }, [
    instruction,
    overrideCount,
    overrideGap,
    overrideStartDate,
    overrideStartTime,
    selectedAccountId,
    selectedBoardId,
    customDestinationUrl,
    mediaItems,
    pinterestAccounts,
    getEffectiveDestinationUrl
  ]);

  // Generate Slots Timeline
  const generatedSlots = useMemo(() => {
    const slots = [];
    const [startYear, startMonth, startDay] = parsedData.startDate.split('-').map(Number);
    const [startHour, startMin] = parsedData.startTime.split(':').map(Number);

    const baseDate = new Date(startYear, startMonth - 1, startDay, startHour, startMin, 0);
    const availableMedia = mediaItems.filter(m => m.status === 'Ready' || m.status === 'Scheduled');
    const mediaPool = availableMedia.length > 0 ? availableMedia : mediaItems;

    for (let i = 0; i < parsedData.totalPins; i++) {
      const slotTime = new Date(baseDate.getTime() + i * parsedData.gapMinutes * 60 * 1000);
      const media = mediaPool.length > 0 ? mediaPool[i % mediaPool.length] : undefined;

      // Smart Title generation
      let title = media?.aiAnalysis?.pinterestTitle || media?.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || `Curated Pin #${i + 1}`;
      if (i > 0 && mediaPool.length <= i) {
        title = `${title} • Part ${Math.floor(i / mediaPool.length) + 1}`;
      }

      slots.push({
        slotNumber: i + 1,
        slotTime,
        formattedTime: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: slotTime.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        media,
        title,
        description: media?.aiAnalysis?.pinterestDescription || `Automated scheduled pin with high-converting engagement description. Check the link for full details!`,
        destinationUrl: `${parsedData.destinationUrl}${parsedData.destinationUrl.includes('?') ? '&' : '?'}utm_source=pinterest&utm_medium=pin_slot_${i + 1}`
      });
    }

    return slots;
  }, [parsedData, mediaItems]);

  // Execute Batch Scheduling to Queue
  const handleExecuteBatchSchedule = async () => {
    if (pinterestAccounts.length === 0) {
      showToast('error', 'Pinterest Account Required', 'Please connect a Pinterest account before scheduling pins.');
      return;
    }

    if (mediaItems.length === 0) {
      showToast('warning', 'Media Required', 'Please upload at least one image or video in Content Library before batch scheduling.');
      return;
    }

    setIsExecuting(true);

    try {
      const effectiveAccount = pinterestAccounts.find(a => a.id === parsedData.pinterestAccountId) || pinterestAccounts[0];
      const effectiveBoard = effectiveAccount?.boards.find(b => b.id === parsedData.pinterestBoardId) || effectiveAccount?.boards[0];

      const queueItemsToAdd: Omit<QueueItem, 'id' | 'createdAt'>[] = generatedSlots.map((slot) => ({
        mediaId: slot.media?.id || 'gen_' + slot.slotNumber,
        mediaName: slot.media?.fileName || `pin_asset_${slot.slotNumber}.jpg`,
        mediaType: slot.media?.mediaType || 'image',
        thumbnailUrl: slot.media?.thumbnailUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        platform: 'pinterest',
        pinterestAccountId: effectiveAccount?.id,
        pinterestAccountName: effectiveAccount?.name,
        boardId: effectiveBoard?.id,
        boardName: effectiveBoard?.name,
        title: slot.title,
        description: slot.description,
        caption: slot.description,
        destinationUrl: slot.destinationUrl,
        scheduledTime: slot.slotTime.toISOString(),
        status: 'Scheduled',
        retryCount: 0,
        maxRetries: 3
      }));

      // Add all to state & local persistence
      addMultipleQueueItems(queueItemsToAdd);

      addLog({
        platform: 'pinterest',
        action: 'AI Prompt Batch Scheduled',
        contentTitle: `AI Instruction Scheduler: ${parsedData.totalPins} Pins Dispatched`,
        targetName: effectiveBoard?.name || 'Pinterest Queue',
        status: 'success'
      });

      showToast(
        'success',
        'Batch Schedule Activated!',
        `Successfully scheduled ${parsedData.totalPins} pins with ${parsedData.gapMinutes}-minute gaps. First pin drops at ${generatedSlots[0]?.formattedTime}!`
      );

      if (onScheduledSuccess) {
        onScheduledSuccess();
      }
    } catch (err) {
      showToast('error', 'Scheduling Failed', 'An error occurred while compiling queue slots.');
    } finally {
      setIsExecuting(false);
    }
  };

  const firstSlot = generatedSlots[0];
  const lastSlot = generatedSlots[generatedSlots.length - 1];

  return (
    <div className={`bg-[#0b1730]/90 border border-[#1a335a] rounded-2xl p-5 sm:p-6 shadow-xl shadow-sky-950/20 backdrop-blur-md space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#162b4c]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">AI Instruction Batch Scheduler</h2>
              <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Natural Language
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Type natural language instructions like: <em>&ldquo;Schedule 24 pins today with 1 hour gap between posts&rdquo;</em>
            </p>
          </div>
        </div>

        {/* Live parsed badge */}
        <div className="flex items-center gap-2 bg-[#071224] border border-[#1a335a] px-3 py-1.5 rounded-xl">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-sky-300">
            {parsedData.totalPins} Pins • {parsedData.gapMinutes}m Gap
          </span>
        </div>
      </div>

      {/* Natural Language Prompt Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Enter Your Scheduling Instruction:</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">Real-time NLP Parser active</span>
        </div>

        <div className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={2}
            className="w-full bg-[#050b14] border border-[#1d3864] focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-medium transition resize-none shadow-inner"
            placeholder="e.g. Schedule all available pins today: 24 pins with 1 hour gap between each pin"
          />
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInstruction(p.text);
                setOverrideCount(null);
                setOverrideGap(null);
              }}
              className="shrink-0 text-left px-2.5 py-1 bg-[#09152b] hover:bg-[#0f2142] border border-[#1a335a] hover:border-sky-500/40 rounded-lg text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>{p.title}</span>
              <span className="text-[9px] bg-sky-950/70 text-sky-400 border border-sky-500/20 px-1 py-0.2 rounded font-mono">
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Instruction Breakdown Card */}
      <div className="bg-[#071122] border border-[#183158] rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#142848]">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            AI Parsed Execution Parameters
          </span>
          <span className="text-[11px] text-slate-400">
            Window: <strong>{firstSlot?.formattedDate} {firstSlot?.formattedTime}</strong> → <strong>{lastSlot?.formattedDate} {lastSlot?.formattedTime}</strong>
          </span>
        </div>

        {/* 4 Core Parameter Cards with Quick Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Date */}
          <div className="bg-[#0b1730] border border-[#1d3864] p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Target Date</span>
            </div>
            <input
              type="date"
              value={parsedData.startDate}
              onChange={(e) => setOverrideStartDate(e.target.value)}
              className="w-full bg-[#050b14] border border-[#1a335a] rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:border-sky-400"
            />
          </div>

          {/* 2. Start Time */}
          <div className="bg-[#0b1730] border border-[#1d3864] p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Start Time</span>
            </div>
            <input
              type="time"
              value={parsedData.startTime}
              onChange={(e) => setOverrideStartTime(e.target.value)}
              className="w-full bg-[#050b14] border border-[#1a335a] rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:border-sky-400"
            />
          </div>

          {/* 3. Total Pins */}
          <div className="bg-[#0b1730] border border-[#1d3864] p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Total Pins</span>
              <span className="text-sky-400 font-bold font-mono">{parsedData.totalPins} pins</span>
            </div>
            <input
              type="range"
              min="1"
              max="48"
              value={parsedData.totalPins}
              onChange={(e) => setOverrideCount(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 4. Gap / Interval */}
          <div className="bg-[#0b1730] border border-[#1d3864] p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Posting Gap</span>
              <span className="text-emerald-400 font-bold font-mono">{parsedData.gapMinutes} mins</span>
            </div>
            <select
              value={parsedData.gapMinutes}
              onChange={(e) => setOverrideGap(parseInt(e.target.value, 10))}
              className="w-full bg-[#050b14] border border-[#1a335a] rounded-lg px-2 py-1 text-xs text-slate-200 font-medium focus:border-sky-400"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes (1 Hour)</option>
              <option value="90">90 Minutes (1.5 Hr)</option>
              <option value="120">120 Minutes (2 Hours)</option>
              <option value="180">180 Minutes (3 Hours)</option>
            </select>
          </div>
        </div>

        {/* Pinterest Account & Board Targeting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Target Pinterest Account & Board</label>
            {pinterestAccounts.length === 0 ? (
              <div className="flex items-center justify-between p-2 bg-[#050b14] border border-[#1a335a] rounded-xl text-xs">
                <span className="text-slate-400">No account connected</span>
                <button
                  type="button"
                  onClick={() => navigateTo('pinterest')}
                  className="text-rose-400 hover:text-rose-300 font-semibold underline text-xs"
                >
                  Connect Pinterest
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedAccountId}
                  onChange={(e) => {
                    setSelectedAccountId(e.target.value);
                    const acc = pinterestAccounts.find(a => a.id === e.target.value);
                    if (acc?.boards[0]) setSelectedBoardId(acc.boards[0].id);
                  }}
                  className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-sky-400"
                >
                  {pinterestAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (@{acc.username})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedBoardId}
                  onChange={(e) => setSelectedBoardId(e.target.value)}
                  className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-sky-400"
                >
                  {(pinterestAccounts.find(a => a.id === selectedAccountId) || pinterestAccounts[0])?.boards.map(b => (
                    <option key={b.id} value={b.id}>
                      📌 {b.name} ({b.pinCount} pins)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Destination URL for Pins (Attached to every scheduled pin)
            </label>
            <input
              type="url"
              value={customDestinationUrl}
              onChange={(e) => setCustomDestinationUrl(e.target.value)}
              placeholder={parsedData.destinationUrl}
              className="w-full bg-[#050b14] border border-[#1a335a] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:border-sky-400"
            />
          </div>
        </div>
      </div>

      {/* Interactive Slot-by-Slot Timetable Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">
              Generated Timetable Timeline ({generatedSlots.length} Scheduled Slots)
            </span>
            <span className="text-[10px] text-slate-400 bg-[#071224] border border-[#1a335a] px-2 py-0.5 rounded-full">
              Full 24-Pin Cycle
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {mediaItems.length} media items in library available
          </div>
        </div>

        {/* Scrollable Slots Grid */}
        <div className="max-h-64 overflow-y-auto pr-1 space-y-2 divide-y divide-[#132542] bg-[#050b14] border border-[#1a335a] rounded-xl p-3">
          {generatedSlots.map((slot) => (
            <div key={slot.slotNumber} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-md bg-sky-950/80 border border-sky-500/30 text-sky-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                  #{slot.slotNumber}
                </span>

                {slot.media ? (
                  <img
                    src={slot.media.thumbnailUrl}
                    alt={slot.title}
                    className="w-8 h-8 rounded-lg object-cover border border-[#1a335a] shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#0b1730] border border-[#1a335a] flex items-center justify-center shrink-0">
                    <Bookmark className="w-4 h-4 text-rose-400" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{slot.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{slot.destinationUrl}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-sky-400 font-mono">{slot.formattedTime}</div>
                <div className="text-[10px] text-slate-500">{slot.formattedDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Call to Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#142848]">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Clicking below dispatches all <strong>{parsedData.totalPins} pins</strong> to the live publishing queue with <strong>{parsedData.gapMinutes}m gaps</strong>.
          </span>
        </div>

        <button
          type="button"
          onClick={handleExecuteBatchSchedule}
          disabled={isExecuting}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{isExecuting ? 'Dispatching Pins to Queue...' : `Schedule All ${parsedData.totalPins} Pins to Queue`}</span>
        </button>
      </div>
    </div>
  );
};
