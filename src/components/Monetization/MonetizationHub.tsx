import React, { useState } from 'react';
import { TipTransaction, SubscriptionTier } from '../../types';
import { 
  DollarSign, 
  ArrowUpRight, 
  Wallet, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Gift,
  ShieldCheck,
  X
} from 'lucide-react';

interface MonetizationHubProps {
  tips: TipTransaction[];
  tiers: SubscriptionTier[];
  availableBalance: number;
  onWithdrawFunds: (amount: number) => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  tips,
  tiers,
  availableBalance,
  onWithdrawFunds,
}) => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const mrr = tiers.reduce((acc, t) => acc + (t.price * t.subscriberCount), 0);
  const totalTipsSum = tips.reduce((acc, t) => acc + t.amount, 0);
  const adRevenueEst = 2840.40;
  const lifetimeGross = mrr + totalTipsSum + adRevenueEst;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount) || availableBalance;
    if (amt <= 0 || amt > availableBalance) return;

    onWithdrawFunds(amt);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Monetization & Payouts Engine
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time breakdown of your creator income streams: subscriptions, live SuperTips, and ad-rev share.
          </p>
        </div>

        <button
          onClick={() => {
            setWithdrawAmount(availableBalance.toFixed(2));
            setIsWithdrawOpen(true);
          }}
          disabled={availableBalance <= 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-950/30 transition-all active:scale-95 disabled:opacity-40"
        >
          <Wallet className="w-4 h-4" />
          <span>Withdraw Available Balance</span>
        </button>
      </div>

      {/* Revenue Stream Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Available for Payout</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tabular-nums">
            ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-neutral-400 mt-2">
            Instant Stripe / ACH Transfer ready
          </p>
        </div>

        {/* Monthly Recurring Subscriptions */}
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Subscription MRR</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            ${mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-rose-400 mt-2 font-mono">
            {tiers.reduce((a, b) => a + b.subscriberCount, 0).toLocaleString()} active members
          </p>
        </div>

        {/* SuperTips Total */}
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">SuperTips Received</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono tabular-nums">
            ${totalTipsSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-amber-300/80 mt-2">
            {tips.length} verified fan tips
          </p>
        </div>

        {/* Ad-Rev Pool Share */}
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Shorts Ad Revenue Pool</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            ${adRevenueEst.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-sky-400 mt-2 font-mono">
            $0.78 RPM on public feeds
          </p>
        </div>
      </div>

      {/* Main Grid: Tips Ledger + Monetization Program Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tips & Fan Support Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              Live SuperTips & Fan Messages
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              Latest {tips.length} transactions
            </span>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-4 divide-y divide-neutral-800/80 shadow-lg">
            {tips.map((tip) => (
              <div key={tip.id} className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={tip.senderAvatar}
                    alt={tip.senderName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        {tip.senderName}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        · {tip.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed bg-neutral-950/50 p-2 rounded-xl border border-neutral-850">
                      "{tip.message}"
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 truncate">
                      on: {tip.videoTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-amber-400 font-mono tabular-nums">
                    +${tip.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization Controls & Settings */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Monetization Standing & Settings
          </h3>

          <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4 shadow-lg">
            {/* Creator Program Status */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-400">
                  Pulse Creator Partner (Verified)
                </p>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  100% eligible for SuperTips, ad-revenue share, and paid subscriber tiers.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Revenue Split</span>
                <span className="font-bold text-white font-mono">85% Creator / 15% Platform</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Automatic Payout Schedule</span>
                <span className="font-bold text-white">1st of Every Month</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Connected Payout Account</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Stripe Express (•••• 4921)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Minimum SuperTip Threshold</span>
                <span className="font-bold text-white font-mono">$1.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Withdrawal Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Transfer Initiated!</h3>
                <p className="text-xs text-neutral-300">
                  ${parseFloat(withdrawAmount).toFixed(2)} is on its way to your Stripe Express account.
                </p>
                <p className="text-[11px] text-neutral-400">
                  Estimated arrival: 1-2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Withdraw Creator Balance</h3>
                </div>

                <p className="text-xs text-neutral-400">
                  Available funds ready for payout: <span className="font-bold text-emerald-400 font-mono">${availableBalance.toFixed(2)}</span>
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Withdraw Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="text-white font-mono">Chase Bank (•••• 4921)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payout Fee:</span>
                    <span className="text-emerald-400 font-mono">$0.00 (Zero Fee)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-40"
                >
                  Confirm Payout Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
