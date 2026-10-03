/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserRole, 
  ShortVideo, 
  Comment, 
  SubscriptionTier, 
  Subscriber, 
  TipTransaction, 
  CreatorProfile 
} from './types';
import { 
  CURRENT_CREATOR, 
  INITIAL_VIDEOS, 
  INITIAL_COMMENTS, 
  SUBSCRIPTION_TIERS, 
  INITIAL_SUBSCRIBERS, 
  INITIAL_TIPS 
} from './data/mockData';
import { Header } from './components/Header';
import { ShortsFeed } from './components/ShortsFeed/ShortsFeed';
import { CreatorStudio } from './components/Studio/CreatorStudio';
import { UploadModal } from './components/Studio/UploadModal';
import { SubscriptionsManager } from './components/Subscriptions/SubscriptionsManager';
import { MonetizationHub } from './components/Monetization/MonetizationHub';
import { EngagementAnalytics } from './components/Analytics/EngagementAnalytics';
import { PlaySquare, BarChart2, DollarSign, Users, LayoutDashboard, Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('feed');
  const [userRole, setUserRole] = useState<UserRole>('creator');
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(CURRENT_CREATOR);
  const [videos, setVideos] = useState<ShortVideo[]>(() => {
    const saved = localStorage.getItem('pulse_shorts_videos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_VIDEOS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('pulse_shorts_comments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_COMMENTS;
  });

  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>(() => {
    const saved = localStorage.getItem('pulse_shorts_tiers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return SUBSCRIPTION_TIERS;
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('pulse_shorts_subscribers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_SUBSCRIBERS;
  });

  const [tips, setTips] = useState<TipTransaction[]>(() => {
    const saved = localStorage.getItem('pulse_shorts_tips');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_TIPS;
  });

  const [viewerTier, setViewerTier] = useState<SubscriptionTier>(() => {
    const saved = localStorage.getItem('pulse_shorts_viewer_tier');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = SUBSCRIPTION_TIERS.find(t => t.id === parsed.id);
        if (match) return match;
      } catch (e) { /* use default */ }
    }
    return SUBSCRIPTION_TIERS[0]; // Free tier initially
  });

  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const saved = localStorage.getItem('pulse_shorts_balance');
    return saved ? parseFloat(saved) : 4250.00;
  });

  // Sound state: permanently enabled by default
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('finox_audio_muted');
    return saved !== null ? saved === 'true' : false; // false = sound permanently ON
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('finox_audio_muted', isMuted.toString());
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      showToast(next ? 'Sound muted.' : 'Sound ON (Permanent across all shorts)!');
      return next;
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pulse_shorts_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_tiers', JSON.stringify(subscriptionTiers));
  }, [subscriptionTiers]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_tips', JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_viewer_tier', JSON.stringify(viewerTier));
  }, [viewerTier]);

  useEffect(() => {
    localStorage.setItem('pulse_shorts_balance', availableBalance.toString());
  }, [availableBalance]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Like video
  const handleLikeToggle = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1),
          };
        }
        return v;
      })
    );
  };

  // Add comment
  const handleAddComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      videoId,
      authorName: userRole === 'creator' ? creatorProfile.name : 'You (Subscriber)',
      authorHandle: userRole === 'creator' ? creatorProfile.handle : '@you',
      authorAvatar: userRole === 'creator' ? creatorProfile.avatarUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      text,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      isSubscriber: viewerTier.id !== 'free',
      subscriberTier: viewerTier.id as 'supporter' | 'vip',
    };

    setComments((prev) => [newComment, ...prev]);
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, commentsCount: v.commentsCount + 1 } : v))
    );
    showToast('Comment posted!');
  };

  // Like comment
  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  // Send SuperTip
  const handleSendTip = (amount: number, message: string, videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    const newTip: TipTransaction = {
      id: `tip_${Date.now()}`,
      senderName: 'You (Supporter)',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      amount,
      message,
      videoId,
      videoTitle: video ? video.title : 'Pulse Short',
      timestamp: 'Just now',
    };

    setTips((prev) => [newTip, ...prev]);
    setAvailableBalance((prev) => prev + amount);
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, tipsTotal: v.tipsTotal + amount } : v))
    );
    showToast(`SuperTip of $${amount.toFixed(2)} sent!`);
  };

  // Change / Join Subscription Tier
  const handleSelectTier = (tier: SubscriptionTier) => {
    setViewerTier(tier);
    // If upgrading to paid, add to subscribers roster if not already there
    if (tier.id !== 'free') {
      const alreadySub = subscribers.some((s) => s.handle === '@you');
      if (!alreadySub) {
        const newSub: Subscriber = {
          id: `sub_${Date.now()}`,
          name: 'You (Pulse Member)',
          handle: '@you',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          tierId: tier.id,
          tierName: tier.name,
          joinedDate: 'Oct 2026',
          totalPaid: tier.price,
          status: 'active',
        };
        setSubscribers((prev) => [newSub, ...prev]);
      }
      setSubscriptionTiers((prev) =>
        prev.map((t) => (t.id === tier.id ? { ...t, subscriberCount: t.subscriberCount + 1 } : t))
      );
    }
    showToast(`Subscribed to ${tier.name}!`);
  };

  // Publish new Short
  const handlePublishVideo = (newVideoData: Omit<ShortVideo, 'id' | 'likesCount' | 'isLiked' | 'commentsCount' | 'sharesCount' | 'tipsTotal' | 'metrics' | 'createdAt'>) => {
    const newVideo: ShortVideo = {
      ...newVideoData,
      id: `video_${Date.now()}`,
      likesCount: 1,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      tipsTotal: 0,
      metrics: {
        views: 120,
        completionRate: 92.0,
        avgWatchSeconds: newVideoData.duration - 2,
        earnings: 0.00,
      },
      createdAt: 'Just now',
    };

    setVideos((prev) => [newVideo, ...prev]);
    setActiveTab('feed');
    showToast('Short published to feed!');
  };

  // Toggle subscriber-only gating on a video
  const handleToggleSubscriberOnly = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const nextState = !v.isSubscriberOnly;
          return {
            ...v,
            isSubscriberOnly: nextState,
            requiredTier: nextState ? (v.requiredTier === 'none' ? 'supporter' : v.requiredTier) : 'none',
          };
        }
        return v;
      })
    );
    showToast('Video access permissions updated!');
  };

  // Delete video
  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    showToast('Short removed from library.');
  };

  // Add perk to tier
  const handleAddPerk = (tierId: string, perk: string) => {
    setSubscriptionTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, perks: [...t.perks, perk] } : t))
    );
    showToast('New perk added to tier!');
  };

  // Update tier price
  const handleUpdateTierPrice = (tierId: string, newPrice: number) => {
    setSubscriptionTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, price: newPrice } : t))
    );
    showToast('Tier pricing updated.');
  };

  // Post announcement
  const handlePostAnnouncement = (title: string, message: string, targetTier: string) => {
    showToast(`Drop broadcasted to ${targetTier === 'all' ? 'all supporters' : targetTier}!`);
  };

  // Withdraw funds
  const handleWithdrawFunds = (amount: number) => {
    setAvailableBalance((prev) => Math.max(0, prev - amount));
    showToast(`Transfer of $${amount.toFixed(2)} requested!`);
  };

  const handleWatchVideo = (videoId: string) => {
    // Reorder videos to put clicked video first
    setVideos((prev) => {
      const idx = prev.findIndex((v) => v.id === videoId);
      if (idx <= 0) return prev;
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-300 pb-20 md:pb-0">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 border border-rose-500/40 text-white text-xs font-semibold shadow-2xl shadow-rose-950/40 animate-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        currentCreator={creatorProfile}
        viewerTier={viewerTier}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <ShortsFeed
            videos={videos}
            viewerTier={viewerTier}
            subscriptionTiers={subscriptionTiers}
            creatorProfile={creatorProfile}
            comments={comments}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onLikeToggle={handleLikeToggle}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onSendTip={handleSendTip}
            onSelectTier={handleSelectTier}
            userAvatar={userRole === 'creator' ? creatorProfile.avatarUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
          />
        )}

        {activeTab === 'studio' && (
          <CreatorStudio
            creator={creatorProfile}
            videos={videos}
            onOpenUpload={() => setIsUploadOpen(true)}
            onToggleSubscriberOnly={handleToggleSubscriberOnly}
            onDeleteVideo={handleDeleteVideo}
            onWatchVideo={handleWatchVideo}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsManager
            tiers={subscriptionTiers}
            subscribers={subscribers}
            onAddPerk={handleAddPerk}
            onUpdateTierPrice={handleUpdateTierPrice}
            onPostAnnouncement={handlePostAnnouncement}
          />
        )}

        {activeTab === 'monetization' && (
          <MonetizationHub
            tips={tips}
            tiers={subscriptionTiers}
            availableBalance={availableBalance}
            onWithdrawFunds={handleWithdrawFunds}
          />
        )}

        {activeTab === 'analytics' && (
          <EngagementAnalytics videos={videos} />
        )}
      </main>

      {/* Upload Short Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        creator={creatorProfile}
        onPublish={handlePublishVideo}
      />

      {/* Mobile Fixed Bottom Navigation Bar (Following Mobile Pattern 1 in references/10_mobile_touch_apps.md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 grid grid-cols-5 items-center h-16 px-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'feed' ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <PlaySquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Shorts</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'studio' ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Studio</span>
        </button>

        {/* Center Quick Upload Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] -mt-3"
          aria-label="Upload Short"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-950/50 text-white active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-semibold text-rose-400 mt-0.5">Drop</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'subscriptions' ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Tiers</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'monetization' ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Earnings</span>
        </button>
      </nav>
    </div>
  );
}
