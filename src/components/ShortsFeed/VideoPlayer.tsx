import React, { useState, useEffect, useRef } from 'react';
import { ShortVideo, SubscriptionTier } from '../../types';
import { soundEngine } from '../../utils/audio';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  DollarSign, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Lock, 
  Music, 
  ShieldCheck, 
  Plus, 
  Check,
  Disc3,
  Eye,
  TrendingUp
} from 'lucide-react';

interface VideoPlayerProps {
  video: ShortVideo;
  viewerTier: SubscriptionTier;
  isMuted: boolean;
  onToggleMute: () => void;
  onLikeToggle: (videoId: string) => void;
  onOpenComments: () => void;
  onOpenTip: () => void;
  onOpenShare: () => void;
  onOpenSubscribe: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  viewerTier,
  isMuted,
  onToggleMute,
  onLikeToggle,
  onOpenComments,
  onOpenTip,
  onOpenShare,
  onOpenSubscribe,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);

  // Check if current user is allowed to watch
  const isGated = video.isSubscriberOnly && (
    video.requiredTier === 'vip' 
      ? viewerTier.id !== 'vip' 
      : (viewerTier.id !== 'supporter' && viewerTier.id !== 'vip')
  );

  // Auto-progress simulation
  useEffect(() => {
    if (!isPlaying || isGated) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // loop
        }
        return prev + (100 / (video.duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, video.duration, isGated]);

  // Handle audio sound engine
  useEffect(() => {
    if (!isMuted && isPlaying && !isGated) {
      soundEngine.playTrack(video.soundTitle);
    } else {
      soundEngine.stopTrack();
    }

    return () => {
      soundEngine.stopTrack();
    };
  }, [isMuted, isPlaying, video.soundTitle, isGated]);

  const togglePlay = () => {
    if (isGated) return;
    setIsPlaying((prev) => !prev);
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 500);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleMute();
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.isLiked) {
      onLikeToggle(video.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isGated) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setProgress(newProgress);
  };

  const isSubscribedToCreator = viewerTier.id !== 'free';

  return (
    <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[82vh] sm:max-h-[86vh] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl shadow-black/80 select-none flex flex-col justify-between group">
      {/* Visual Canvas / Frame */}
      <div 
        className="absolute inset-0 z-0 cursor-pointer overflow-hidden bg-black"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={video.imageUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying && !isGated ? 'scale-105 filter brightness-95' : 'scale-100 brightness-75'
          } ${isGated ? 'blur-md brightness-50' : ''}`}
        />

        {/* Ambient Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Play/Pause momentary indicator */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-100 animate-out fade-out zoom-out-90 duration-300">
              {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
            </div>
          </div>
        )}

        {/* Heart Burst on Double Tap */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-in zoom-in-50 fade-out duration-700" />
          </div>
        )}

        {/* Gated Paywall View for Non-Subscribers */}
        {isGated && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1.5">
              {video.requiredTier === 'vip' ? 'VIP Exclusive Short' : 'Supporter Exclusive'}
            </span>
            <h3 className="text-lg font-extrabold text-white mb-2 leading-tight">
              Unlock Creator Drop
            </h3>
            <p className="text-xs text-neutral-300 max-w-xs mb-5 leading-relaxed">
              This short contains exclusive behind-the-scenes techniques and perks reserved for active subscribers.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSubscribe();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Join {video.requiredTier === 'vip' ? 'VIP ($14.99/mo)' : 'Supporters ($4.99/mo)'}
            </button>
          </div>
        )}
      </div>

      {/* Top Header Overlay inside Player */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        {/* Subscriber Tag or Live Stats */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {video.isSubscriberOnly ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              <Lock className="w-3 h-3" />
              <span>{video.requiredTier === 'vip' ? 'VIP Drop' : 'Members'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-neutral-700/60 text-neutral-300 text-[10px] font-medium font-mono">
              <Eye className="w-3 h-3 text-neutral-400" />
              <span>{(video.metrics.views / 1000).toFixed(0)}k views</span>
            </span>
          )}
        </div>

        {/* Audio / Mute toggle - permanently pressed state */}
        <div className="pointer-events-auto">
          <button
            onClick={toggleMute}
            className={`transition-all duration-200 flex items-center gap-1.5 shadow-md ${
              !isMuted
                ? 'px-3 py-1.5 rounded-full bg-rose-600 text-white font-semibold text-xs ring-2 ring-rose-400/80 shadow-lg shadow-rose-600/40 scale-102 hover:bg-rose-500 active:scale-95'
                : 'px-2.5 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md text-neutral-400 hover:text-white border border-neutral-700/60 active:scale-95'
            }`}
            aria-label={!isMuted ? 'Sound is ON (Permanently enabled)' : 'Sound is muted (Click to enable)'}
            title={!isMuted ? 'Sound ON (Permanent across all shorts)' : 'Sound Muted'}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 fill-white text-white" />
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" />
                </span>
                <span className="text-[10px] font-bold tracking-tight">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-medium text-neutral-400">Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center navigation hints for desktop keyboard/buttons */}
      <div className="absolute right-[-54px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-10">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="w-10 h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105"
          title="Previous Short (Up Arrow)"
        >
          ▲
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="w-10 h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105"
          title="Next Short (Down Arrow)"
        >
          ▼
        </button>
      </div>

      {/* Bottom Information & Action Bar */}
      <div className="relative z-10 p-4 space-y-3 pointer-events-none">
        <div className="flex items-end justify-between gap-3">
          {/* Left Metadata */}
          <div className="flex-1 space-y-2 pointer-events-auto">
            {/* Creator details */}
            <div className="flex items-center gap-2">
              <img
                src={video.creator.avatarUrl}
                alt={video.creator.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/60"
              />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white drop-shadow-sm">
                    {video.creator.name}
                  </span>
                  {video.creator.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
                <span className="text-[11px] text-neutral-300 font-mono">
                  {video.creator.handle}
                </span>
              </div>

              {/* In-feed subscribe button */}
              <button
                onClick={onOpenSubscribe}
                className={`ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shadow-md ${
                  isSubscribedToCreator
                    ? 'bg-neutral-800/90 text-rose-400 border border-rose-500/30'
                    : 'bg-rose-600 hover:bg-rose-500 text-white active:scale-95'
                }`}
              >
                {isSubscribedToCreator ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Join</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Title and Tags */}
            <div className="space-y-1">
              <h2 className="text-xs sm:text-sm font-semibold text-white leading-snug drop-shadow-md line-clamp-2">
                {video.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-neutral-300 font-medium">
                {video.tags.map((tag, i) => (
                  <span key={i} className="text-rose-400 hover:underline cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sound info */}
            <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
              <Music className="w-3 h-3 text-neutral-400 animate-bounce" />
              <span className="truncate max-w-[200px]">
                {video.soundTitle} · {video.soundAuthor}
              </span>
            </div>
          </div>

          {/* Right Action Rail */}
          <div className="flex flex-col items-center gap-3.5 pointer-events-auto shrink-0 pb-1">
            {/* Like Button */}
            <button
              onClick={() => onLikeToggle(video.id)}
              className="flex flex-col items-center gap-1 group/btn focus-visible:outline-none"
              aria-label="Like video"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 ${
                video.isLiked
                  ? 'bg-rose-500/20 text-rose-500 ring-1 ring-rose-500/40'
                  : 'bg-neutral-900/70 text-white hover:bg-neutral-800/90'
              }`}>
                <Heart className={`w-5 h-5 ${video.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`} />
              </div>
              <span className="text-[10px] font-bold font-mono text-white drop-shadow">
                {(video.likesCount / 1000).toFixed(1)}k
              </span>
            </button>

            {/* Comments Button */}
            <button
              onClick={onOpenComments}
              className="flex flex-col items-center gap-1 group/btn focus-visible:outline-none"
              aria-label="View comments"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-900/70 backdrop-blur-md hover:bg-neutral-800/90 text-white flex items-center justify-center transition-all active:scale-75">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-mono text-white drop-shadow">
                {video.commentsCount}
              </span>
            </button>

            {/* SuperTip / Monetization Button */}
            <button
              onClick={onOpenTip}
              className="flex flex-col items-center gap-1 group/btn focus-visible:outline-none"
              aria-label="Send SuperTip"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-md hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 flex items-center justify-center transition-all active:scale-75 shadow-md shadow-amber-500/10">
                <DollarSign className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold font-mono text-amber-400 drop-shadow">
                Tip
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={onOpenShare}
              className="flex flex-col items-center gap-1 group/btn focus-visible:outline-none"
              aria-label="Share video"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-900/70 backdrop-blur-md hover:bg-neutral-800/90 text-white flex items-center justify-center transition-all active:scale-75">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-mono text-white drop-shadow">
                {(video.sharesCount / 1000).toFixed(1)}k
              </span>
            </button>

            {/* Spinning Vinyl Soundtrack */}
            <div className="relative pt-1">
              <div className={`w-8 h-8 rounded-full bg-neutral-950 border-2 border-neutral-700/80 flex items-center justify-center ${isPlaying && !isMuted ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                <Disc3 className="w-5 h-5 text-rose-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber / Progress Bar */}
        <div 
          onClick={handleSeek}
          className="w-full h-1.5 bg-neutral-800/80 hover:h-2.5 rounded-full overflow-hidden cursor-pointer pointer-events-auto transition-all relative"
        >
          <div 
            className="h-full bg-gradient-to-r from-rose-600 to-amber-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
