export type NavigationTab = 'feed' | 'studio' | 'subscriptions' | 'monetization' | 'analytics';

export type UserRole = 'creator' | 'viewer';

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  subscriberCount: number;
  totalViews: number;
  isVerified: boolean;
}

export interface ShortVideo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  duration: number; // in seconds
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  tipsTotal: number;
  soundTitle: string;
  soundAuthor: string;
  isSubscriberOnly: boolean;
  requiredTier: 'supporter' | 'vip' | 'none';
  metrics: {
    views: number;
    completionRate: number; // percentage, e.g. 84.2
    avgWatchSeconds: number;
    earnings: number;
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isSubscriber?: boolean;
  subscriberTier?: 'supporter' | 'vip';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly';
  description: string;
  perks: string[];
  subscriberCount: number;
  monthlyRevenue: number;
  accentColor: string;
  isPopular?: boolean;
}

export interface Subscriber {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  tierId: string;
  tierName: string;
  joinedDate: string;
  totalPaid: number;
  status: 'active' | 'renewal_pending';
}

export interface TipTransaction {
  id: string;
  senderName: string;
  senderAvatar: string;
  amount: number;
  message: string;
  videoId: string;
  videoTitle: string;
  timestamp: string;
}

export interface RealtimeMetricPoint {
  timeLabel: string;
  activeViewers: number;
  retentionRate: number;
}
