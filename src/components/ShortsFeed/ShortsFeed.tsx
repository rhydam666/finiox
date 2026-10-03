import React, { useState, useEffect } from 'react';
import { ShortVideo, SubscriptionTier, Comment, CreatorProfile } from '../../types';
import { VideoPlayer } from './VideoPlayer';
import { CommentsModal } from './CommentsModal';
import { TipModal } from './TipModal';
import { SubscribeModal } from './SubscribeModal';
import { ShareModal } from './ShareModal';
import { ChevronUp, ChevronDown, Sparkles, Filter, Lock } from 'lucide-react';

interface ShortsFeedProps {
  videos: ShortVideo[];
  viewerTier: SubscriptionTier;
  subscriptionTiers: SubscriptionTier[];
  creatorProfile: CreatorProfile;
  comments: Comment[];
  isMuted: boolean;
  onToggleMute: () => void;
  onLikeToggle: (videoId: string) => void;
  onAddComment: (videoId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onSendTip: (amount: number, message: string, videoId: string) => void;
  onSelectTier: (tier: SubscriptionTier) => void;
  userAvatar: string;
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({
  videos,
  viewerTier,
  subscriptionTiers,
  creatorProfile,
  comments,
  isMuted,
  onToggleMute,
  onLikeToggle,
  onAddComment,
  onLikeComment,
  onSendTip,
  onSelectTier,
  userAvatar,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'all' | 'public' | 'subscribers'>('all');

  // Modals state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const filteredVideos = videos.filter((v) => {
    if (filterMode === 'public') return !v.isSubscriberOnly;
    if (filterMode === 'subscribers') return v.isSubscriberOnly;
    return true;
  });

  const currentVideo = filteredVideos[currentIndex] || filteredVideos[0];

  const handleNext = () => {
    if (currentIndex < filteredVideos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredVideos.length]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      {/* Feed Filter Pill Buttons */}
      <div className="mb-3 flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl shadow-lg backdrop-blur-md">
        <button
          onClick={() => {
            setFilterMode('all');
            setCurrentIndex(0);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filterMode === 'all'
              ? 'bg-neutral-800 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          For You ({videos.length})
        </button>
        <button
          onClick={() => {
            setFilterMode('public');
            setCurrentIndex(0);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filterMode === 'public'
              ? 'bg-neutral-800 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Public Drops
        </button>
        <button
          onClick={() => {
            setFilterMode('subscribers');
            setCurrentIndex(0);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            filterMode === 'subscribers'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-neutral-400 hover:text-amber-300'
          }`}
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Subscriber Perks</span>
        </button>
        <div className="h-4 w-px bg-neutral-800 mx-0.5" />
        <button
          onClick={onToggleMute}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            !isMuted
              ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Toggle persistent sound across all shorts"
        >
          {!isMuted ? '🔊 Sound: ON' : '🔇 Sound: Muted'}
        </button>
      </div>

      {/* Main Vertical Player */}
      {currentVideo ? (
        <div 
          className="relative flex items-center justify-center w-full bg-[#000000]"
          style={{ backgroundColor: '#000000' }}
        >
          <VideoPlayer
            key={currentVideo.id}
            video={currentVideo}
            viewerTier={viewerTier}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onLikeToggle={onLikeToggle}
            onOpenComments={() => setIsCommentsOpen(true)}
            onOpenTip={() => setIsTipOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < filteredVideos.length - 1}
            hasPrev={currentIndex > 0}
          />
        </div>
      ) : (
        <div className="py-20 text-center text-neutral-400">
          <p className="text-sm font-semibold">No shorts found in this filter.</p>
        </div>
      )}

      {/* Quick Mobile / Desktop Prev/Next Controls */}
      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400 font-mono">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <span>
          {currentIndex + 1} / {filteredVideos.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredVideos.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      {currentVideo && (
        <>
          <CommentsModal
            isOpen={isCommentsOpen}
            onClose={() => setIsCommentsOpen(false)}
            video={currentVideo}
            comments={comments}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            userAvatar={userAvatar}
          />
          <TipModal
            isOpen={isTipOpen}
            onClose={() => setIsTipOpen(false)}
            video={currentVideo}
            onSendTip={(amount, msg) => onSendTip(amount, msg, currentVideo.id)}
          />
          <SubscribeModal
            isOpen={isSubscribeOpen}
            onClose={() => setIsSubscribeOpen(false)}
            creator={creatorProfile}
            tiers={subscriptionTiers}
            currentTierId={viewerTier.id}
            onSelectTier={onSelectTier}
          />
          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            video={currentVideo}
          />
        </>
      )}
    </div>
  );
};
