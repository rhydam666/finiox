import React, { useState } from 'react';
import { SubscriptionTier, CreatorProfile } from '../../types';
import { X, Check, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile;
  tiers: SubscriptionTier[];
  currentTierId: string;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  creator,
  tiers,
  currentTierId,
  onSelectTier,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = (tier: SubscriptionTier) => {
    onSelectTier(tier);
    setSuccessMsg(`You are now enrolled in the ${tier.name}!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50"
            />
            <div className="text-left">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                {creator.name}
                <ShieldCheck className="w-4 h-4 text-rose-400" />
              </h3>
              <p className="text-xs text-neutral-400 font-mono">{creator.handle}</p>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Creator Memberships & Perks
          </h2>
          <p className="text-xs text-neutral-400">
            Support {creator.name} directly and unlock subscriber-only vertical shorts, behind-the-scenes B-roll, and badges.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in zoom-in">
            <Sparkles className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => {
            const isCurrent = currentTierId === tier.id;
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-neutral-800/90 border-rose-500/80 shadow-lg shadow-rose-950/20'
                    : isPopular
                    ? 'bg-neutral-850 border-amber-500/40 hover:border-amber-500'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 text-[10px] font-bold tracking-wide uppercase shadow">
                    Most Popular
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      {tier.name}
                    </span>
                    {tier.id === 'vip' && <Crown className="w-4 h-4 text-amber-400" />}
                    {tier.id === 'supporter' && <Zap className="w-4 h-4 text-rose-400" />}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-xs text-neutral-400 font-normal">/month</span>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-normal min-h-[32px]">
                    {tier.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Included Perks
                    </p>
                    <ul className="space-y-1.5">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={() => handleChoose(tier)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-neutral-800 text-rose-400 border border-rose-500/40 cursor-default'
                        : isPopular
                        ? 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-md active:scale-[0.98]'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white active:scale-[0.98]'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : tier.price === 0 ? 'Select Free' : `Join for $${tier.price}/mo`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
