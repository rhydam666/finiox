import React, { useState } from 'react';
import { ShortVideo, CreatorProfile } from '../../types';
import { X, UploadCloud, Sparkles, Image, Lock, DollarSign, Check, Eye } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile;
  onPublish: (newVideo: Omit<ShortVideo, 'id' | 'likesCount' | 'isLiked' | 'commentsCount' | 'sharesCount' | 'tipsTotal' | 'metrics' | 'createdAt'>) => void;
}

const PRESET_CLIPS = [
  {
    title: 'Holographic Handheld Tech Review',
    url: '/src/assets/images/tech_gadget_short_1791002757701.jpg',
    sound: 'Cyber Pulse - Synth Odyssey',
  },
  {
    title: 'Artisanal Flambé Skillet Drop',
    url: '/src/assets/images/culinary_chef_short_1791002771977.jpg',
    sound: 'Acoustic Kitchen Grooves',
  },
  {
    title: 'Olympic Snatch Form Drill',
    url: '/src/assets/images/fitness_workout_short_1791002784349.jpg',
    sound: 'Hardstyle Heavy Drop 140',
  },
  {
    title: 'Volcanic Arctic Waves 4K Aerial',
    url: '/src/assets/images/travel_adventure_short_1791002794845.jpg',
    sound: 'Nordic Ambient Waves',
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  creator,
  onPublish,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('#TechShorts, #CreatorEconomy');
  const [soundTitle, setSoundTitle] = useState('Pulse Original Audio - Maya Tech');
  const [soundAuthor, setSoundAuthor] = useState(creator.name);
  const [selectedImage, setSelectedImage] = useState(PRESET_CLIPS[0].url);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [requiredTier, setRequiredTier] = useState<'supporter' | 'vip' | 'none'>('none');
  const [duration, setDuration] = useState(35);
  const [enableTips, setEnableTips] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    onPublish({
      title: title.trim(),
      description: description.trim(),
      tags: parsedTags,
      imageUrl: selectedImage,
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        avatarUrl: creator.avatarUrl,
        isVerified: creator.isVerified,
      },
      duration,
      soundTitle,
      soundAuthor,
      isSubscriberOnly,
      requiredTier: isSubscriberOnly ? requiredTier : 'none',
    });

    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-rose-500" />
              Creator Studio Upload
            </h2>
            <p className="text-xs text-neutral-400">
              Publish a new vertical short, configure access tiers, and monetize.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Left Form, Right 9:16 Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">
                Short Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={85}
                placeholder="e.g. 3 Pro Video Tricks with Smartphone 📱"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">
                Caption & Details
              </label>
              <textarea
                rows={2}
                placeholder="Tell viewers what happens in this clip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 resize-none"
              />
            </div>

            {/* Tags & Sound */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Hashtags</label>
                <input
                  type="text"
                  placeholder="#Tech, #Trending"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Sound Track Title</label>
                <input
                  type="text"
                  value={soundTitle}
                  onChange={(e) => setSoundTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Video / Visual Asset Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Select 9:16 Vertical Video Asset</span>
                <span className="text-[11px] text-neutral-400 font-normal">Choose preset or upload file</span>
              </label>

              {/* Preset Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_CLIPS.map((clip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedImage(clip.url);
                      setSoundTitle(clip.sound);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[9/16] border transition-all ${
                      selectedImage === clip.url
                        ? 'border-rose-500 ring-2 ring-rose-500/40 scale-102'
                        : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={clip.url}
                      alt={clip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === clip.url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* File upload trigger */}
              <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-neutral-700 rounded-xl bg-neutral-950/60 hover:bg-neutral-950 hover:border-rose-500/50 cursor-pointer transition-colors text-xs text-neutral-400">
                <UploadCloud className="w-4 h-4 text-rose-500" />
                <span>Upload custom 9:16 clip/image</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Access & Monetization Settings */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Subscriber-Only Exclusive Drop
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Gate this short exclusively to paying club members.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSubscriberOnly}
                  onChange={(e) => {
                    setIsSubscriberOnly(e.target.checked);
                    if (e.target.checked && requiredTier === 'none') {
                      setRequiredTier('supporter');
                    }
                  }}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </div>

              {isSubscriberOnly && (
                <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">Required Tier:</span>
                  <button
                    type="button"
                    onClick={() => setRequiredTier('supporter')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      requiredTier === 'supporter'
                        ? 'bg-rose-600 text-white'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Supporter ($4.99/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequiredTier('vip')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      requiredTier === 'vip'
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    VIP All-Access ($14.99/mo)
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Enable SuperTips on this Video
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Allow audience to send direct cash tips with messages.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableTips}
                  onChange={(e) => setEnableTips(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-md shadow-rose-950/40 disabled:opacity-40"
              >
                Publish Short Now
              </button>
            </div>
          </form>

          {/* Right Live 9:16 Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-neutral-950/60 rounded-2xl p-4 border border-neutral-800/80">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Live Phone Preview
            </span>
            <div className="relative w-full max-w-[220px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-xl bg-black">
              <img
                src={selectedImage}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
              {isSubscriberOnly && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-neutral-950 text-[9px] font-bold">
                  {requiredTier === 'vip' ? 'VIP ONLY' : 'SUPPORTER ONLY'}
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 space-y-1">
                <div className="flex items-center gap-1">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-[10px] font-bold text-white truncate">
                    {creator.handle}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-white line-clamp-2 leading-tight">
                  {title || 'Your Short Title Here...'}
                </p>
                <p className="text-[9px] text-rose-400 truncate">
                  {tags}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
