import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CsvPinRow, QueueItem } from '../../types';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Send,
  Calendar,
  Clock,
  Bookmark,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

interface CsvBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvBulkUploadModal: React.FC<CsvBulkUploadModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    pinterestAccounts,
    addMultipleQueueItems,
    addLog,
    showToast,
    getEffectiveDestinationUrl
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<CsvPinRow[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedAccountId, setSelectedAccountId] = useState(pinterestAccounts[0]?.id || '');
  const [selectedBoardId, setSelectedBoardId] = useState(pinterestAccounts[0]?.boards[0]?.id || '');
  const [schedulingMode, setSchedulingMode] = useState<'csv_dates' | 'auto_interval'>('auto_interval');
  const [autoIntervalGap, setAutoIntervalGap] = useState(60); // minutes
  const [autoStartDate, setAutoStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [autoStartTime, setAutoStartTime] = useState('09:00');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Sample CSV Download generator
  const handleDownloadSampleCsv = () => {
    const sampleHeaders = 'Title,Description,Destination_URL,Image_URL,Scheduled_Time,Board_Name\n';
    const sampleRows = [
      '"Modern Minimalist Kitchen Aesthetics","Discover 2026 interior trends with sleek quartz countertops and concealed lighting.","https://irfangulzar.com/kitchen-ideas","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800","2026-09-22 09:00","Home Decor"',
      '"24 Daily Pins Automation Strategy","Complete growth guide on scaling your Pinterest reach to 100K monthly views using SocialFlow CRM.","https://irfangulzar.com/growth-guide","https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800","2026-09-22 10:00","Growth & Marketing"',
      '"Healthy 15-Minute Mediterranean Salad","Quick and vibrant lunch recipe packed with antioxidants, virgin olive oil and feta cheese.","https://irfangulzar.com/healthy-salad","https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800","2026-09-22 11:00","Recipes & Food"',
      '"Top 10 High-Converting Pin Design Templates","Maximize click-through rates with these tested typography and color contrast pin layouts.","https://irfangulzar.com/pin-templates","https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800","2026-09-22 12:00","Social Media Tools"'
    ].join('\n');

    const blob = new Blob([sampleHeaders + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'socialflow_pins_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Sample CSV Downloaded', 'socialflow_pins_sample.csv downloaded to your computer.');
  };

  // CSV Parser
  const parseCsvContent = (content: string) => {
    if (!content || content.trim() === '') {
      setParsedRows([]);
      return;
    }

    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      showToast('error', 'Invalid CSV', 'CSV file must have at least a header and 1 data row.');
      return;
    }

    // Parse header row
    const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase().replace(/[\s_-]/g, ''));

    const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('heading') || h.includes('pin'));
    const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('caption') || h.includes('text'));
    const urlIdx = headers.findIndex(h => h.includes('url') || h.includes('link') || h.includes('destination'));
    const imgIdx = headers.findIndex(h => h.includes('image') || h.includes('thumb') || h.includes('photo') || h.includes('media'));
    const timeIdx = headers.findIndex(h => h.includes('time') || h.includes('date') || h.includes('scheduled'));
    const boardIdx = headers.findIndex(h => h.includes('board') || h.includes('category'));

    const rows: CsvPinRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length === 0 || cols.every(c => c.trim() === '')) continue;

      const title = titleIdx !== -1 && cols[titleIdx] ? cols[titleIdx].trim() : cols[0]?.trim() || `Pin #${i}`;
      const desc = descIdx !== -1 && cols[descIdx] ? cols[descIdx].trim() : 'Automated pin imported via bulk CSV scheduler.';
      const destUrl = urlIdx !== -1 && cols[urlIdx] ? cols[urlIdx].trim() : getEffectiveDestinationUrl();
      const imgUrl = imgIdx !== -1 && cols[imgIdx] ? cols[imgIdx].trim() : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80';
      const scheduledTime = timeIdx !== -1 && cols[timeIdx] ? cols[timeIdx].trim() : '';
      const boardName = boardIdx !== -1 && cols[boardIdx] ? cols[boardIdx].trim() : '';

      const isValid = Boolean(title && title.length > 2);

      rows.push({
        id: `csv_row_${Date.now()}_${i}`,
        title,
        description: desc,
        destinationUrl: destUrl,
        imageUrl: imgUrl,
        scheduledTime,
        boardName,
        isValid,
        errorMessage: !isValid ? 'Title must be at least 3 characters' : undefined
      });
    }

    setParsedRows(rows);
    showToast('success', 'CSV Parsed Successfully', `Extracted ${rows.length} pin(s) from CSV spreadsheet.`);
  };

  // Helper to parse line accounting for commas inside quotes
  const parseCsvLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  // File drop/selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCsvContent(content);
    };
    reader.readAsText(file);
  };

  // Schedule to live queue
  const handleImportToQueue = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      showToast('error', 'No Valid Rows', 'Please ensure at least one valid pin row is present.');
      return;
    }

    setIsProcessing(true);

    try {
      const effectiveAccount = pinterestAccounts.find(a => a.id === selectedAccountId) || pinterestAccounts[0];
      const effectiveBoard = effectiveAccount?.boards.find(b => b.id === selectedBoardId) || effectiveAccount?.boards[0];

      const [startYear, startMonth, startDay] = autoStartDate.split('-').map(Number);
      const [startHour, startMin] = autoStartTime.split(':').map(Number);
      const baseDate = new Date(startYear, startMonth - 1, startDay, startHour, startMin, 0);

      const queueItemsToAdd: Omit<QueueItem, 'id' | 'createdAt'>[] = validRows.map((row, idx) => {
        let slotTime = new Date(baseDate.getTime() + idx * autoIntervalGap * 60 * 1000);

        // If csv has specific valid timestamp and mode is csv_dates
        if (schedulingMode === 'csv_dates' && row.scheduledTime) {
          const parsedCustom = new Date(row.scheduledTime);
          if (!isNaN(parsedCustom.getTime())) {
            slotTime = parsedCustom;
          }
        }

        return {
          mediaId: `csv_imported_${idx + 1}`,
          mediaName: `csv_pin_${idx + 1}.jpg`,
          mediaType: 'image',
          thumbnailUrl: row.imageUrl,
          platform: 'pinterest',
          pinterestAccountId: effectiveAccount?.id,
          pinterestAccountName: effectiveAccount?.name,
          boardId: effectiveBoard?.id,
          boardName: row.boardName || effectiveBoard?.name,
          title: row.title,
          description: row.description,
          caption: row.description,
          destinationUrl: row.destinationUrl,
          scheduledTime: slotTime.toISOString(),
          status: 'Scheduled',
          retryCount: 0,
          maxRetries: 3
        };
      });

      addMultipleQueueItems(queueItemsToAdd);

      addLog({
        platform: 'pinterest',
        action: 'CSV Bulk Pins Imported',
        contentTitle: `${validRows.length} Pins Scheduled via CSV`,
        targetName: effectiveBoard?.name || 'Publishing Queue',
        status: 'success'
      });

      showToast(
        'success',
        'Bulk Pins Scheduled!',
        `Successfully imported and scheduled ${validRows.length} pin(s) to the publishing queue.`
      );

      onClose();
    } catch (err) {
      showToast('error', 'Import Failed', 'An error occurred while importing CSV rows.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1730] border border-[#1a335a] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-sky-950/40 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#09152b] via-[#0d2249] to-[#081326] p-5 border-b border-[#162f56] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Bulk CSV / Spreadsheet Pin Scheduler</h3>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  .CSV Upload & Import
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload your CSV spreadsheet to schedule tens or hundreds of pins with automated gap intervals.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#12254a] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Top Controls: Upload vs Paste & Sample CSV Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-[#050b14] p-1 rounded-xl border border-[#1a335a]">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload .CSV File</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'paste'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste CSV Raw Text</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="px-3 py-1.5 bg-[#09152b] hover:bg-[#112347] border border-[#1a335a] hover:border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Sample Template (.CSV)</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          {activeTab === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1d3864] hover:border-sky-400 bg-[#050b14] rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-xl bg-[#0b1730] border border-[#1a335a] group-hover:border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm transition">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-200">
                  Click to select or drop your <span className="text-sky-400 underline underline-offset-2">.CSV file here</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Columns supported: Title, Description, Destination_URL, Image_URL, Scheduled_Time
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 block font-medium">
                Paste CSV Lines (Header first, comma-separated values):
              </label>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  parseCsvContent(e.target.value);
                }}
                rows={4}
                className="w-full bg-[#050b14] border border-[#1a335a] focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                placeholder="Title,Description,Destination_URL,Image_URL&#10;Pin 1,Description here,https://irfangulzar.com,https://images.unsplash.com/..."
              />
            </div>
          )}

          {/* Parsed Rows Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Parsed Pins Preview ({validCount} Valid / {parsedRows.length} Total)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Ready for queue dispatch
                </span>
              </div>

              <div className="border border-[#1a335a] rounded-xl overflow-hidden bg-[#050b14] max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#09152b] border-b border-[#1a335a] text-[10px] uppercase font-semibold text-slate-400 sticky top-0">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Image</th>
                      <th className="p-2.5">Title & Description</th>
                      <th className="p-2.5">Destination URL</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#132542]">
                    {parsedRows.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-[#081326]/60">
                        <td className="p-2.5 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="p-2.5">
                          <img
                            src={row.imageUrl}
                            alt={row.title}
                            className="w-8 h-8 rounded-lg object-cover border border-[#1a335a]"
                          />
                        </td>
                        <td className="p-2.5 max-w-[200px]">
                          <div className="font-semibold text-white truncate">{row.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{row.description}</div>
                        </td>
                        <td className="p-2.5 max-w-[160px]">
                          <span className="font-mono text-[10px] text-sky-400 truncate block">
                            {row.destinationUrl}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {row.isValid ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              Valid
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/70 border border-rose-500/30 px-2 py-0.5 rounded-full">
                              Invalid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Destination & Interval Configuration */}
          <div className="bg-[#071224] border border-[#183158] rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-200 pb-2 border-b border-[#142848] flex items-center justify-between">
              <span>Scheduling Options for Imported Pins</span>
              <span className="text-[11px] text-sky-400 font-medium">Automatic Slot Distribution</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Pinterest Account & Board</label>
                <div className="flex gap-2">
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    {pinterestAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    {(pinterestAccounts.find(a => a.id === selectedAccountId) || pinterestAccounts[0])?.boards.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Interval Between Pins</label>
                <div className="flex gap-2">
                  <select
                    value={autoIntervalGap}
                    onChange={(e) => setAutoIntervalGap(parseInt(e.target.value, 10))}
                    className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Mins (1 Hour)</option>
                    <option value="90">90 Minutes</option>
                    <option value="120">2 Hours</option>
                  </select>
                  <input
                    type="time"
                    value={autoStartTime}
                    onChange={(e) => setAutoStartTime(e.target.value)}
                    className="w-1/2 bg-[#050b14] border border-[#1a335a] rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#081326] p-4 border-t border-[#162f56] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Pins ready to schedule: <strong className="text-emerald-400">{validCount} pins</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-[#09152b] hover:bg-[#102246] text-slate-300 border border-[#1a335a] rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportToQueue}
              disabled={validCount === 0 || isProcessing}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isProcessing ? 'Importing Pins...' : `Schedule ${validCount} Pins to Queue`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
