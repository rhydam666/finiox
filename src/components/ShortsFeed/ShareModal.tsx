import React, { useState } from 'react';
import { ShortVideo } from '../../types';
import { X, Copy, Check, Share2, Code, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: ShortVideo;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/shorts/${video.id}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Close share dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Share2 className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold">Share Short Video</h3>
          </div>

          <p className="text-xs text-neutral-400 line-clamp-1">
            "{video.title}" by {video.creator.name}
          </p>

          <div className="flex items-center gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded-xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-neutral-300 font-mono focus:outline-none truncate px-1"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800">
            <p className="text-xs font-medium text-neutral-400 mb-3">Quick Share Options</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopy}
                className="p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded-xl flex flex-col items-center gap-1.5 text-xs text-neutral-200 transition-colors"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span className="text-[11px]">Direct Link</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded-xl flex flex-col items-center gap-1.5 text-xs text-neutral-200 transition-colors"
              >
                <Code className="w-4 h-4 text-amber-400" />
                <span className="text-[11px]">Embed HTML</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded-xl flex flex-col items-center gap-1.5 text-xs text-neutral-200 transition-colors"
              >
                <Share2 className="w-4 h-4 text-rose-400" />
                <span className="text-[11px]">Social Blast</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
