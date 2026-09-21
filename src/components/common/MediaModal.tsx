import React from 'react';
import { MediaItem } from '../../types';
import { X, Sparkles, ExternalLink, Calendar, Check, Play, Film, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MediaModalProps {
  media: MediaItem | null;
  onClose: () => void;
  onSelectForComposer?: (media: MediaItem) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ media, onClose, onSelectForComposer }) => {
  const { analyzeMediaWithAi, navigateTo, getEffectiveDestinationUrl } = useApp();

  if (!media) return null;

  const destUrl = getEffectiveDestinationUrl(media.destinationUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg ${media.mediaType === 'video' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {media.mediaType === 'video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-semibold text-zinc-100 truncate max-w-md">{media.fileName}</h3>
              <p className="text-xs text-zinc-400">
                {media.fileSize} • Uploaded {media.uploadDate} • Status: <span className="text-emerald-400 font-medium">{media.status}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Media Player / Preview */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-black/40 rounded-xl border border-zinc-800 p-2 overflow-hidden min-h-[300px]">
            {media.mediaType === 'video' ? (
              <video
                src={media.url}
                controls
                className="max-h-[380px] w-full rounded-lg object-contain"
                poster={media.thumbnailUrl}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <img
                src={media.url}
                alt={media.fileName}
                className="max-h-[380px] w-full rounded-lg object-contain"
              />
            )}

            {media.mediaType === 'video' && (
              <div className="w-full mt-3 px-3 py-2 bg-purple-950/30 border border-purple-800/40 rounded-lg flex items-center gap-2 text-xs text-purple-300">
                <Play className="w-3.5 h-3.5 shrink-0" />
                <span>AI Video Analysis Ready: Multi-frame sampling & transcription supported</span>
              </div>
            )}
          </div>

          {/* AI Metadata & Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Destination URL */}
              <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-800">
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  Target Destination URL (Pinterest Pin link)
                </label>
                <div className="mt-1 font-mono text-xs text-blue-400 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 truncate">
                  {destUrl}
                </div>
              </div>

              {/* AI Status Banner */}
              <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-zinc-200">AI Visual Recognition</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    media.aiAnalysisStatus === 'Analyzed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {media.aiAnalysisStatus}
                  </span>
                </div>

                {media.aiAnalysis ? (
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Detected Topic</span>
                      <p className="text-zinc-200 font-medium">{media.aiAnalysis.mainTopic}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Visible Objects & Environment</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {media.aiAnalysis.objects.map((obj, i) => (
                          <span key={i} className="bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-md text-[11px]">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Pinterest Title</span>
                      <p className="text-zinc-200 bg-zinc-900/80 p-2 rounded border border-zinc-800/80 italic">
                        "{media.aiAnalysis.pinterestTitle}"
                      </p>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Facebook Caption</span>
                      <p className="text-zinc-300 bg-zinc-900/80 p-2 rounded border border-zinc-800/80 line-clamp-2">
                        {media.aiAnalysis.facebookCaption}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-zinc-400 mb-3">Visual content has not yet been processed by AI.</p>
                    <button
                      onClick={() => analyzeMediaWithAi(media.id)}
                      disabled={media.aiAnalysisStatus === 'Processing'}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-medium border border-amber-500/30 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {media.aiAnalysisStatus === 'Processing' ? 'Analyzing Visuals...' : 'Analyze Visual Content'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onSelectForComposer) {
                    onSelectForComposer(media);
                  } else {
                    navigateTo('create', media);
                  }
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                Use in Create Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
