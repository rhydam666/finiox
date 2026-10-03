import React, { useState } from 'react';
import { ShortVideo } from '../../types';
import { X, DollarSign, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: ShortVideo;
  onSendTip: (amount: number, message: string) => void;
}

const PRESET_AMOUNTS = [2, 5, 10, 25, 50];

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  video,
  onSendTip,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSend = () => {
    if (currentAmount <= 0) return;
    onSendTip(currentAmount, message.trim() || 'SuperTip for amazing content!');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setMessage('');
      setCustomAmount('');
      setSelectedAmount(5);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Close tip modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">SuperTip Sent!</h3>
            <p className="text-xs text-neutral-300">
              You sent <span className="font-semibold text-emerald-400">${currentAmount.toFixed(2)}</span> to {video.creator.name}.
            </p>
            <p className="text-[11px] text-neutral-400">
              Thank you for fueling independent creator economy!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header info */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SuperTip Creator Support</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Support {video.creator.name}
              </h3>
              <p className="text-xs text-neutral-400 truncate px-4">
                "{video.title}"
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Select Amount</label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold font-mono transition-all border ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                        : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border-neutral-700/60'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400">Or Custom Amount ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 15"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Message input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400">Attached Fan Message</label>
              <textarea
                rows={2}
                maxLength={140}
                placeholder="Leave an encouraging note with your tip..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 resize-none"
              />
              <div className="text-right text-[10px] text-neutral-400 font-mono">
                {message.length}/140
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSend}
              disabled={currentAmount <= 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-neutral-950" />
              <span>Send SuperTip of ${currentAmount.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
