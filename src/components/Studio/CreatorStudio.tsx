import React, { useState } from 'react';
import { ShortVideo, CreatorProfile } from '../../types';
import { 
  PlaySquare, 
  Upload, 
  Eye, 
  Heart, 
  DollarSign, 
  Lock, 
  Unlock, 
  Trash2, 
  Share2, 
  Plus, 
  Search, 
  TrendingUp, 
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CreatorStudioProps {
  creator: CreatorProfile;
  videos: ShortVideo[];
  onOpenUpload: () => void;
  onToggleSubscriberOnly: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
  onWatchVideo: (videoId: string) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  creator,
  videos,
  onOpenUpload,
  onToggleSubscriberOnly,
  onDeleteVideo,
  onWatchVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'subscriber'>('all');

  const filtered = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType === 'public') return matchesSearch && !v.isSubscriberOnly;
    if (filterType === 'subscriber') return matchesSearch && v.isSubscriberOnly;
    return matchesSearch;
  });

  const totalViews = videos.reduce((acc, v) => acc + v.metrics.views, 0);
  const totalLikes = videos.reduce((acc, v) => acc + v.likesCount, 0);
  const totalTips = videos.reduce((acc, v) => acc + v.tipsTotal, 0);
  const totalShortsRevenue = videos.reduce((acc, v) => acc + v.metrics.earnings, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/40"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {creator.name} Studio
              </h1>
              <span className="text-xs font-mono text-neutral-400">
                {creator.handle}
              </span>
              <ShieldCheck className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-xs text-neutral-400 max-w-xl line-clamp-1">
              {creator.bio}
            </p>
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenUpload}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Short</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Total Shorts Views</span>
            <Eye className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {(totalViews / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            +18.4% this month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Audience Likes</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {(totalLikes / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            94.6% positive ratio
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">SuperTips Earned</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ${totalTips.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-1">
            Direct creator gifts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Est. Shorts Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ${totalShortsRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Ads + Tips + Perks
          </div>
        </div>
      </div>

      {/* Video Management Section */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Shorts ({videos.length})
            </button>
            <button
              onClick={() => setFilterType('public')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'public'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Public
            </button>
            <button
              onClick={() => setFilterType('subscriber')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filterType === 'subscriber'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-neutral-400 hover:text-amber-300'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Subscriber-Only</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search shorts by title or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Shorts Library Table */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                  <th className="py-3 px-4">Short Video</th>
                  <th className="py-3 px-4">Visibility & Tier</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Retention</th>
                  <th className="py-3 px-4 text-right">Tips</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                {filtered.map((video) => (
                  <tr key={video.id} className="hover:bg-neutral-850/60 transition-colors">
                    {/* Video info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800 group">
                          <img
                            src={video.imageUrl}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => onWatchVideo(video.id)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            title="Play in Feed"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1 max-w-xs">
                          <p className="font-semibold text-white truncate hover:text-rose-400 cursor-pointer" onClick={() => onWatchVideo(video.id)}>
                            {video.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                            <span>{video.createdAt}</span>
                            <span>·</span>
                            <span>{video.duration}s</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="py-3 px-4">
                      {video.isSubscriberOnly ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-[11px]">
                          <Lock className="w-3 h-3" />
                          <span>{video.requiredTier === 'vip' ? 'VIP Only' : 'Supporters'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                          <Unlock className="w-3 h-3" />
                          <span>Public Drop</span>
                        </div>
                      )}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-200">
                      {(video.metrics.views / 1000).toFixed(1)}k
                    </td>

                    {/* Retention */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-200">
                      <span className="text-emerald-400 font-semibold">
                        {video.metrics.completionRate}%
                      </span>
                    </td>

                    {/* Tips */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-400 font-semibold">
                      ${video.tipsTotal}
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      ${video.metrics.earnings.toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onToggleSubscriberOnly(video.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            video.isSubscriberOnly
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                          }`}
                          title={video.isSubscriberOnly ? 'Make Public' : 'Lock to Subscribers'}
                        >
                          {video.isSubscriberOnly ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onDeleteVideo(video.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/60 border border-neutral-700 hover:border-rose-600/40 text-neutral-400 hover:text-rose-400 transition-colors"
                          title="Delete short"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
