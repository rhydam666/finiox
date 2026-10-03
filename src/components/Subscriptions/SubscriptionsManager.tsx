import React, { useState } from 'react';
import { SubscriptionTier, Subscriber } from '../../types';
import { 
  Users, 
  Crown, 
  Zap, 
  Plus, 
  Check, 
  Search, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Edit3, 
  Send,
  CheckCircle2
} from 'lucide-react';

interface SubscriptionsManagerProps {
  tiers: SubscriptionTier[];
  subscribers: Subscriber[];
  onAddPerk: (tierId: string, perk: string) => void;
  onUpdateTierPrice: (tierId: string, newPrice: number) => void;
  onPostAnnouncement: (title: string, message: string, targetTier: string) => void;
}

export const SubscriptionsManager: React.FC<SubscriptionsManagerProps> = ({
  tiers,
  subscribers,
  onAddPerk,
  onUpdateTierPrice,
  onPostAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'roster' | 'announcements'>('tiers');
  const [searchSubscriber, setSearchSubscriber] = useState('');
  
  // Custom perk adding state
  const [selectedTierForPerk, setSelectedTierForPerk] = useState<string | null>(null);
  const [newPerkText, setNewPerkText] = useState('');

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementTier, setAnnouncementTier] = useState('all');
  const [announcementSent, setAnnouncementSent] = useState(false);

  // Price edit state
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  const totalMonthlyMRR = tiers.reduce((acc, t) => acc + (t.price * t.subscriberCount), 0);
  const totalPaidSubscribers = tiers.filter(t => t.price > 0).reduce((acc, t) => acc + t.subscriberCount, 0);

  const handleAddPerkSubmit = (e: React.FormEvent, tierId: string) => {
    e.preventDefault();
    if (!newPerkText.trim()) return;
    onAddPerk(tierId, newPerkText.trim());
    setNewPerkText('');
    setSelectedTierForPerk(null);
  };

  const handlePriceSave = (tierId: string) => {
    onUpdateTierPrice(tierId, editingPrice);
    setEditingTierId(null);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;
    onPostAnnouncement(announcementTitle, announcementMsg, announcementTier);
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementSent(false);
      setAnnouncementTitle('');
      setAnnouncementMsg('');
    }, 2000);
  };

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchSubscriber.toLowerCase()) ||
      s.handle.toLowerCase().includes(searchSubscriber.toLowerCase()) ||
      s.tierName.toLowerCase().includes(searchSubscriber.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-500" />
            Creator Subscription Tiers
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Build predictable recurring revenue with tiered memberships, exclusive perks, and subscriber-only shorts.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-right">
            <div className="text-[11px] font-medium text-neutral-400">Monthly Recurring Revenue</div>
            <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">
              ${totalMonthlyMRR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-right">
            <div className="text-[11px] font-medium text-neutral-400">Paying Subscribers</div>
            <div className="text-xl font-black text-white font-mono tabular-nums">
              {totalPaidSubscribers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'tiers' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Manage Tiers & Perks
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'roster' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Active Subscribers ({subscribers.length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'announcements' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Subscriber Announcement Drop
        </button>
      </div>

      {/* TAB 1: Tiers & Perks */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isEditing = editingTierId === tier.id;
            return (
              <div
                key={tier.id}
                className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                {tier.isPopular && (
                  <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 text-[10px] font-bold tracking-wide uppercase">
                    Core Driver
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {tier.id === 'vip' ? (
                      <Crown className="w-5 h-5 text-amber-400" />
                    ) : tier.id === 'supporter' ? (
                      <Zap className="w-5 h-5 text-rose-500" />
                    ) : (
                      <Users className="w-5 h-5 text-neutral-400" />
                    )}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {tier.name}
                    </h3>
                  </div>

                  {/* Pricing with in-place edit */}
                  <div className="flex items-baseline justify-between pt-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white font-mono">$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(parseFloat(e.target.value) || 0)}
                          className="w-20 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-sm font-bold text-white font-mono"
                        />
                        <button
                          onClick={() => handlePriceSave(tier.id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white font-mono">
                          {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-xs text-neutral-400 font-normal">/month</span>
                        )}
                        {tier.price > 0 && (
                          <button
                            onClick={() => {
                              setEditingTierId(tier.id);
                              setEditingPrice(tier.price);
                            }}
                            className="ml-2 text-neutral-500 hover:text-neutral-300 p-1"
                            title="Edit price"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Monthly stats for this tier */}
                  <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-medium">Subscribers</span>
                      <p className="font-bold text-white font-mono">{tier.subscriberCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-medium">Monthly Est.</span>
                      <p className="font-bold text-emerald-400 font-mono">
                        ${(tier.price * tier.subscriberCount).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {/* Perks list */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Active Perks ({tier.perks.length})
                      </span>
                      <button
                        onClick={() => setSelectedTierForPerk(tier.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Perk</span>
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{perk}</span>
                        </li>
                      ))}
                    </ul>

                    {/* New Perk input inline */}
                    {selectedTierForPerk === tier.id && (
                      <form
                        onSubmit={(e) => handleAddPerkSubmit(e, tier.id)}
                        className="mt-3 p-3 bg-neutral-950 border border-neutral-700 rounded-xl space-y-2"
                      >
                        <input
                          type="text"
                          autoFocus
                          placeholder="e.g. Monthly Live Q&A Room"
                          value={newPerkText}
                          onChange={(e) => setNewPerkText(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTierForPerk(null)}
                            className="px-2 py-1 text-[11px] text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!newPerkText.trim()}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-40"
                          >
                            Save Perk
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Active Subscribers Roster */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search subscriber by name or tier..."
                value={searchSubscriber}
                onChange={(e) => setSearchSubscriber(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Showing {filteredSubscribers.length} of {subscribers.length}
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                    <th className="py-3 px-4">Subscriber</th>
                    <th className="py-3 px-4">Membership Tier</th>
                    <th className="py-3 px-4">Member Since</th>
                    <th className="py-3 px-4 text-right">Lifetime Contributed</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-xs">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-850/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.avatarUrl}
                            alt={sub.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
                          />
                          <div>
                            <p className="font-semibold text-white">{sub.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{sub.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          sub.tierId === 'vip'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {sub.tierId === 'vip' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                          <span>{sub.tierName}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300 font-mono">
                        {sub.joinedDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                        ${sub.totalPaid.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {sub.status === 'active' ? 'Active' : 'Renewal Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Subscriber Announcement */}
      {activeTab === 'announcements' && (
        <div className="max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-rose-500" />
              Broadcast Drop / Perk Alert
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Send an instant notification and private message to your subscribed fans with secret links, LUT downloads, or BTS access.
            </p>
          </div>

          {announcementSent && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Announcement sent to {announcementTier === 'all' ? 'all active subscribers' : `${announcementTier} tier`}!</span>
            </div>
          )}

          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Audience Segment</label>
              <select
                value={announcementTier}
                onChange={(e) => setAnnouncementTier(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Paying Supporters & VIP Members</option>
                <option value="vip">VIP All-Access Only</option>
                <option value="supporter">Supporter Club Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Subject / Notification Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Secret LUTs Download & Next Location Reveal 🎬"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Message Content & Perks Links</label>
              <textarea
                rows={4}
                required
                placeholder="Hey club! Here is this week's private camera breakdown and secret Google Drive links..."
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!announcementTitle.trim() || !announcementMsg.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all disabled:opacity-40"
            >
              Broadcast Perk Announcement
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
