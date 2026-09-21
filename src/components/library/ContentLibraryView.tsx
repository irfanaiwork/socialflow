import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem, MediaType } from '../../types';
import {
  UploadCloud,
  Search,
  Filter,
  Sparkles,
  Film,
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
  RefreshCw,
  Cloud,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';
import { MediaModal } from '../common/MediaModal';

export const ContentLibraryView: React.FC = () => {
  const {
    mediaItems,
    uploadMedia,
    deleteMedia,
    analyzeMediaWithAi,
    navigateTo,
    googleDrive,
    syncGoogleDrive,
    connectGoogleDrive,
    disconnectGoogleDrive,
    selectGoogleDriveFolder,
    getEffectiveDestinationUrl
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'ready' | 'scheduled' | 'published' | 'failed'>('all');
  const [selectedMediaForModal, setSelectedMediaForModal] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & search logic
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'image') return item.mediaType === 'image';
    if (filterType === 'video') return item.mediaType === 'video';
    if (filterType === 'ready') return item.status === 'Ready';
    if (filterType === 'scheduled') return item.status === 'Scheduled';
    if (filterType === 'published') return item.status === 'Published';
    if (filterType === 'failed') return item.status === 'Failed';
    return true;
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    uploadMedia(fileArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Google Drive Integration Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Content Library</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized media store supporting high-res PNG, JPG, WEBP, MP4, and MOV with automatic AI visual feature extraction.
          </p>
        </div>

        {/* Google Drive Status Bar & Quick Schedule Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigateTo('scheduled')}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition cursor-pointer"
            title="Schedule 24 Pins Today via AI Instruction"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-100" />
            <span>AI Batch Schedule (24 Pins)</span>
          </button>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2.5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${googleDrive.isConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-200">
                  {googleDrive.isConnected ? 'Google Drive Connected' : 'Google Drive Disconnected'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-zinc-400">
                Folder: <span className="font-mono text-zinc-300 font-medium">{googleDrive.name}</span> • {googleDrive.filesCount} files detected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {googleDrive.isConnected ? (
              <>
                <button
                  onClick={() => setShowFolderModal(true)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium rounded-xl border border-zinc-700/60 transition"
                >
                  Select Folder
                </button>
                <button
                  onClick={syncGoogleDrive}
                  className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium rounded-xl border border-blue-500/30 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Now</span>
                </button>
                <button
                  onClick={disconnectGoogleDrive}
                  className="px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectGoogleDrive}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Connect Google Drive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
          <div className="p-3 bg-zinc-800/80 rounded-2xl text-blue-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-200">
              Drag & drop media files here, or <span className="text-blue-400 underline underline-offset-2">browse computer</span>
            </p>
            <p className="text-xs text-zinc-500">
              Supports PNG, JPG, JPEG, WEBP images and MP4, MOV videos up to 500MB
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'image', label: 'Images' },
            { id: 'video', label: 'Videos' },
            { id: 'ready', label: 'Ready' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'published', label: 'Published' },
            { id: 'failed', label: 'Failed' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterType === pill.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-sm text-zinc-400">No media matches your search or filter criteria.</p>
          <button
            onClick={() => { setSearchTerm(''); setFilterType('all'); }}
            className="mt-3 text-xs text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const destUrl = getEffectiveDestinationUrl(item.destinationUrl);
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item.id}
                className="group bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-sm"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video bg-black/60 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Format Badge (Image / Video) */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 ${
                      isVideo ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40' : 'bg-blue-900/80 text-blue-200 border border-blue-500/40'
                    }`}>
                      {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{isVideo ? 'Video' : 'Image'}</span>
                    </span>

                    {item.durationSeconds && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/80 text-zinc-300 backdrop-blur-md">
                        {item.durationSeconds}s
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md ${
                      item.status === 'Ready' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' :
                      item.status === 'Scheduled' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' :
                      item.status === 'Published' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40' :
                      'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Quick Preview Hover Trigger */}
                  <button
                    onClick={() => setSelectedMediaForModal(item)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    title="Inspect & Preview"
                  >
                    <div className="p-2.5 rounded-full bg-zinc-900/90 text-white shadow-xl hover:scale-110 transition-transform">
                      {isVideo ? <Play className="w-5 h-5 fill-white" /> : <Eye className="w-5 h-5" />}
                    </div>
                  </button>
                </div>

                {/* Card Meta Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-xs text-zinc-200 truncate" title={item.fileName}>
                      {item.fileName}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{item.fileSize}</span>
                      <span>{item.uploadDate}</span>
                    </div>

                    {/* AI Analysis Pill */}
                    <div className="pt-1">
                      {item.aiAnalysisStatus === 'Analyzed' ? (
                        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2 flex items-start gap-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                              AI Analyzed Visuals
                            </span>
                            <p className="text-[11px] text-zinc-300 truncate font-medium">
                              {item.aiAnalysis?.mainTopic}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => analyzeMediaWithAi(item.id)}
                          disabled={item.aiAnalysisStatus === 'Processing'}
                          className="w-full py-1.5 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{item.aiAnalysisStatus === 'Processing' ? 'Analyzing Visuals...' : 'Analyze with AI'}</span>
                        </button>
                      )}
                    </div>

                    {/* Destination URL Preview */}
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 pt-1 truncate">
                      <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="truncate font-mono text-[10px] text-blue-400/90">{destUrl}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                      title="Delete asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigateTo('create', item)}
                      className="flex-1 py-1.5 px-3 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-300 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Create Post</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Media Inspection Modal */}
      {selectedMediaForModal && (
        <MediaModal
          media={selectedMediaForModal}
          onClose={() => setSelectedMediaForModal(null)}
          onSelectForComposer={(media) => {
            setSelectedMediaForModal(null);
            navigateTo('create', media);
          }}
        />
      )}

      {/* Select Google Drive Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="font-semibold text-zinc-100 text-sm">Select Google Drive Folder</h3>
            <p className="text-xs text-zinc-400">
              SocialFlow will periodically poll this folder for incoming media uploads and automatically trigger AI visual generation.
            </p>

            <div className="space-y-2">
              {[
                { name: 'SavvyMomBudget', files: 25, active: googleDrive.name === 'SavvyMomBudget' },
                { name: 'MagicStreetMedia_Daily', files: 18, active: googleDrive.name === 'MagicStreetMedia_Daily' },
                { name: 'FrugalFamilyPrintables', files: 12, active: googleDrive.name === 'FrugalFamilyPrintables' }
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    selectGoogleDriveFolder(f.name);
                    setShowFolderModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    f.active ? 'bg-blue-600/15 border-blue-500/40 text-blue-300' : 'bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-medium text-zinc-200">{f.name}</div>
                      <span className="text-[11px] text-zinc-400">{f.files} files indexed</span>
                    </div>
                  </div>
                  {f.active && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
