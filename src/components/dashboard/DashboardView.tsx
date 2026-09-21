import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Share2,
  Bookmark,
  Youtube,
  Zap,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Play,
  Film,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    pinterestAccounts,
    facebookPages,
    youtubeChannels,
    automationRules,
    mediaItems,
    queueItems,
    activityLogs,
    navigateTo,
    syncGoogleDrive,
    runEntireQueue,
    publishQueueItemNow,
    retryFailedQueueItem
  } = useApp();

  // Metrics computation
  const connectedPinterest = pinterestAccounts.filter(a => a.isConnected).length;
  const connectedFacebook = facebookPages.filter(p => p.isConnected).length;
  const connectedYoutube = (youtubeChannels || []).filter(y => y.isConnected).length;
  const totalConnectedAccounts = connectedPinterest + connectedFacebook + connectedYoutube;
  const activeAutomations = (automationRules || []).filter(r => r.isEnabled).length;

  const contentReady = mediaItems.filter(m => m.status === 'Ready').length;
  const scheduledPosts = queueItems.filter(q => q.status === 'Scheduled').length;
  const publishedPosts = queueItems.filter(q => q.status === 'Published').length;
  const failedPosts = queueItems.filter(q => q.status === 'Failed').length;
  const pendingPosts = queueItems.filter(q => q.status === 'Pending').length;

  const queueStatusLabel = failedPosts > 0
    ? `${failedPosts} Need Attention`
    : pendingPosts + scheduledPosts > 0
    ? `${pendingPosts + scheduledPosts} In Pipeline`
    : 'All Caught Up';

  // Chart data: Publishing volume by platform
  const platformChartData = [
    { name: 'Mon', pinterest: 12, facebook: 18 },
    { name: 'Tue', pinterest: 15, facebook: 22 },
    { name: 'Wed', pinterest: 18, facebook: 20 },
    { name: 'Thu', pinterest: 14, facebook: 25 },
    { name: 'Fri', pinterest: 22, facebook: 28 },
    { name: 'Sat', pinterest: 26, facebook: 34 },
    { name: 'Sun', pinterest: 24, facebook: 30 },
  ];

  // Content type breakdown
  const imageCount = mediaItems.filter(m => m.mediaType === 'image').length;
  const videoCount = mediaItems.filter(m => m.mediaType === 'video').length;
  const contentTypeData = [
    { name: 'Images', value: imageCount || 1, color: '#3b82f6' },
    { name: 'Videos', value: videoCount || 1, color: '#a855f7' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#081226]/90 border border-[#142848] rounded-2xl p-5 shadow-lg shadow-sky-950/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Automation • Web Development • SEO Content Strategy | Founder — IrfanX
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Social Media Automation CRM</h1>
          <p className="text-xs text-slate-300 mt-1">
            Centralized orchestration engine for Pinterest Pins, Facebook multi-page queues, and YouTube Shorts with intelligent natural language scheduling.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigateTo('scheduled')}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25 flex items-center gap-1.5 transition cursor-pointer"
            title="Open Natural Language AI Instruction Scheduler"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-100" />
            <span>AI 24-Pin Scheduler</span>
          </button>
          <button
            onClick={syncGoogleDrive}
            className="px-3 py-2 bg-[#0b1730] hover:bg-[#12254a] text-slate-200 text-xs font-medium rounded-xl border border-[#1a335a] flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Sync Google Drive</span>
          </button>
          <button
            onClick={runEntireQueue}
            className="px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Process Queue Now</span>
          </button>
          <button
            onClick={() => navigateTo('create')}
            className="px-3.5 py-2 bg-[#09152b] hover:bg-[#102246] border border-[#1a335a] hover:border-sky-500/40 text-sky-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Primary Dashboard KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Connected */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Connected Accounts</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{totalConnectedAccounts}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {connectedFacebook} FB • {connectedPinterest} Pin • {connectedYoutube} YT
            </p>
          </div>
        </div>

        {/* Facebook Pages */}
        <div
          onClick={() => navigateTo('facebook')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Facebook Pages</span>
            <Share2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{facebookPages.length}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">With per-page posting gaps</p>
          </div>
        </div>

        {/* Pinterest Accounts */}
        <div
          onClick={() => navigateTo('pinterest')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Pinterest Accounts</span>
            <Bookmark className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{pinterestAccounts.length}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {pinterestAccounts.reduce((acc, a) => acc + a.boards.length, 0)} Boards ready
            </p>
          </div>
        </div>

        {/* YouTube Channels */}
        <div
          onClick={() => navigateTo('youtube')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">YouTube Channels</span>
            <Youtube className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{youtubeChannels.length}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Shorts & video syndication</p>
          </div>
        </div>

        {/* Granular Automations */}
        <div
          onClick={() => navigateTo('automation')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Granular Pipelines</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{activeAutomations} Active</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Per-account custom rules</p>
          </div>
        </div>

        {/* Content Ready */}
        <div
          onClick={() => navigateTo('library')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Content Ready</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{contentReady}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Analyzed & ready to queue</p>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div
          onClick={() => navigateTo('scheduled')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Scheduled Posts</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{scheduledPosts}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">In timed calendar pipeline</p>
          </div>
        </div>

        {/* Queue Status */}
        <div
          onClick={() => navigateTo('queue')}
          className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Queue Status</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-100 truncate">{queueStatusLabel}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {queueItems.length} total queue entries
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts & Content Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Publishing Volume Chart */}
        <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Publishing Activity by Platform</h3>
              <p className="text-xs text-zinc-400">Weekly breakdown of Pinterest Pins vs Facebook Page posts</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Pinterest
              </span>
              <span className="flex items-center gap-1 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Facebook
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="pinterest" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Donut + Per-Page Posting Gap Snapshot */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 flex-1">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Content Format Distribution</h3>
            <p className="text-xs text-zinc-400 mb-3">Images vs High-Retention Videos</p>
            
            <div className="h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around text-xs mt-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>{imageCount} Images</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Film className="w-4 h-4 text-purple-400" />
                <span>{videoCount} Videos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Queue Actions & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Scheduled in Queue */}
        <div className="lg:col-span-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Immediate Publishing Pipeline</h3>
              <p className="text-xs text-zinc-400">Next items prioritized by centralized automation scheduler</p>
            </div>
            <button
              onClick={() => navigateTo('queue')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition"
            >
              <span>View Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {queueItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.mediaName}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        item.platform === 'pinterest' ? 'bg-rose-500/20 text-rose-400' :
                        item.platform === 'facebook' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {item.platform}
                      </span>
                      <span className="text-[11px] text-zinc-400 truncate">
                        {item.platform === 'pinterest' ? item.pinterestAccountName : item.platform === 'facebook' ? item.facebookPageName : item.youtubeChannelName || 'YouTube Channel'}
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-200 truncate mt-0.5">{item.title}</h4>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.status === 'Published' ? 'bg-emerald-500/15 text-emerald-400' :
                    item.status === 'Failed' ? 'bg-rose-500/15 text-rose-400' :
                    item.status === 'Publishing' ? 'bg-blue-500/15 text-blue-400 animate-pulse' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {item.status}
                  </span>

                  {item.status === 'Failed' ? (
                    <button
                      onClick={() => retryFailedQueueItem(item.id)}
                      className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium rounded-lg transition"
                    >
                      Retry
                    </button>
                  ) : item.status !== 'Published' ? (
                    <button
                      onClick={() => publishQueueItemNow(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition"
                      title="Simulate Instant Publish"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Live Activity Feed</h3>
              <p className="text-xs text-zinc-400">Real-time automation logs & AI generation audits</p>
            </div>
            <button
              onClick={() => navigateTo('logs')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition"
            >
              <span>All Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-start gap-3"
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  log.status === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                  log.status === 'error' ? 'bg-rose-500/15 text-rose-400' :
                  log.status === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-blue-500/15 text-blue-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-200 truncate">{log.action}</span>
                    <span className="text-[10px] text-zinc-500 shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{log.contentTitle}</p>
                  {log.targetName && (
                    <span className="text-[10px] text-zinc-500 block mt-0.5">Target: {log.targetName}</span>
                  )}
                  {log.errorMessage && (
                    <p className="text-[11px] text-rose-400 mt-1 bg-rose-950/40 p-1.5 rounded border border-rose-900/50">
                      {log.errorMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
