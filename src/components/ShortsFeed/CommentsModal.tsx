import React, { useState } from 'react';
import { Comment, ShortVideo } from '../../types';
import { X, Heart, Send, Sparkles, ShieldCheck } from 'lucide-react';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: ShortVideo;
  comments: Comment[];
  onAddComment: (videoId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  userAvatar: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  video,
  comments,
  onAddComment,
  onLikeComment,
  userAvatar,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(video.id, inputText.trim());
    setInputText('');
  };

  const videoComments = comments.filter((c) => c.videoId === video.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Comments
              <span className="text-xs font-mono text-neutral-400 font-normal">
                ({videoComments.length})
              </span>
            </h3>
            <p className="text-xs text-neutral-400 truncate max-w-xs">
              {video.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            aria-label="Close comments"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {videoComments.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs text-neutral-400 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            videoComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-sm">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs text-neutral-200">
                      {comment.authorName}
                    </span>
                    {comment.isSubscriber && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        {comment.subscriberTier === 'vip' ? 'VIP' : 'Supporter'}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-400 font-mono">
                      · {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed break-words">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => onLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        comment.isLiked ? 'text-rose-500 font-semibold' : 'text-neutral-400 hover:text-neutral-300'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          comment.isLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span className="font-mono">{comment.likes}</span>
                    </button>
                    <button className="text-[11px] text-neutral-400 hover:text-neutral-300">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
        >
          <img
            src={userAvatar}
            alt="You"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a comment for the creator..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white transition-colors shrink-0"
            aria-label="Send comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
