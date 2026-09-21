import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScrollText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Download,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs, clearActivityLogs, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activityLogs.filter((log) => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) && !log.contentTitle.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `socialflow_activity_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Export Completed', 'Activity logs exported as JSON file.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">System & Activity Audit Logs</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time audit trail of background polling, AI visual feature extraction, slot calculations, and API dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Logs</span>
          </button>
          <button
            onClick={clearActivityLogs}
            className="px-3.5 py-2 bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search action or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'success', 'warning', 'error', 'info'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st}
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                {st === 'all' ? activityLogs.length : activityLogs.filter(l => l.status === st).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Feed */}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No activity log entries match your filter.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {filteredLogs.map((log) => {
              const Icon = log.status === 'success' ? CheckCircle2 :
                           log.status === 'error' ? AlertCircle :
                           log.status === 'warning' ? AlertTriangle : ScrollText;
              const colorClass = log.status === 'success' ? 'text-emerald-400 bg-emerald-500/10' :
                                 log.status === 'error' ? 'text-rose-400 bg-rose-500/10' :
                                 log.status === 'warning' ? 'text-amber-400 bg-amber-500/10' :
                                 'text-blue-400 bg-blue-500/10';

              return (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-850/40 transition">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-200">{log.action}</span>
                        {log.platform && (
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            log.platform === 'pinterest' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {log.platform}
                          </span>
                        )}
                        {log.targetName && (
                          <span className="text-[11px] text-zinc-400">Target: {log.targetName}</span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 truncate font-medium">{log.contentTitle}</p>

                      {log.errorMessage && (
                        <p className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-900/60 mt-1 max-w-xl">
                          {log.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-mono text-zinc-500 block">{log.timestamp}</span>
                    <span className="text-[10px] text-zinc-600 block">System Event ID: {log.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
