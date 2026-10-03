import React from 'react';
import { NavigationTab, UserRole, CreatorProfile, SubscriptionTier } from '../types';
import { PlaySquare, Plus, Sparkles, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentCreator: CreatorProfile;
  viewerTier: SubscriptionTier;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  currentCreator,
  viewerTier,
  onOpenUpload,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform">
              <PlaySquare className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                finox
              </span>
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-400/90 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                MVP
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links (single line) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            Shorts Feed
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            Creator Studio
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'monetization'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            Monetization
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Live Analytics
          </button>
        </nav>

        {/* Zone 3: Actions & Role View */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick role toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setUserRole('creator')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                userRole === 'creator'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="View platform as creator Maya Chen"
            >
              Creator
            </button>
            <button
              onClick={() => setUserRole('viewer')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                userRole === 'viewer'
                  ? 'bg-neutral-700 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="View platform as audience member"
            >
              <User className="w-3 h-3" />
              <span>Viewer</span>
            </button>
          </div>

          {/* Primary Action: Upload Short */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-semibold shadow-md shadow-rose-950/30 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Short</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Creator Avatar badge / Current Viewer Tier info */}
          <div className="flex items-center gap-2 pl-1 border-l border-neutral-800">
            <div className="relative">
              <img
                src={currentCreator.avatarUrl}
                alt={currentCreator.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-rose-500 border-2 border-neutral-950 rounded-full" />
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-semibold text-neutral-200 flex items-center gap-1">
                {currentCreator.name}
                <ShieldCheck className="w-3 h-3 text-rose-400" />
              </div>
              <div className="text-[11px] text-neutral-400">
                {userRole === 'creator' ? 'Creator Studio' : `Tier: ${viewerTier.name}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar will handle mobile viewports */}
    </header>
  );
};
