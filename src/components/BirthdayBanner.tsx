import React from 'react';
import { Cake, Sparkles, PartyPopper, Heart, Gift, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Cat } from '../types';
import { triggerBirthdayConfetti } from '../utils/birthdayUtils';

interface BirthdayBannerProps {
  birthdayCats: Cat[];
  onOpenBirthdayParty: (cat: Cat) => void;
}

export const BirthdayBanner: React.FC<BirthdayBannerProps> = ({
  birthdayCats,
  onOpenBirthdayParty
}) => {
  if (!birthdayCats || birthdayCats.length === 0) return null;

  const primaryCat = birthdayCats[0];
  const catNamesText = birthdayCats.map(c => c.name).join(' & ');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 p-0.5 shadow-md my-4"
    >
      <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 rounded-[14px] p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden">
        
        {/* Background Decorative Sparkles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center space-x-3 text-left z-10">
          {/* Avatar with party hat */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white/80 shadow-xs flex-shrink-0 bg-pink-100">
            <img
              src={primaryCat.imageUrl}
              alt={primaryCat.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-1 -right-1 text-sm select-none drop-shadow-xs">
              🥳
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-2xs">
                <Cake className="w-3 h-3 text-slate-900" />
                <span>Today&apos;s Birthday Star!</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center space-x-1.5">
              <span>🎉 Happy Birthday, {catNamesText}! 🎂</span>
            </h3>

            <p className="text-[11px] text-pink-100 font-medium">
              Celebrate {birthdayCats.length === 1 ? `${primaryCat.name}'s` : 'their'} special day with salmon treats & birthday wishes!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 z-10 w-full sm:w-auto justify-end">
          <button
            onClick={() => triggerBirthdayConfetti()}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 backdrop-blur-xs flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
            title="Throw confetti"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Confetti</span>
          </button>

          <button
            onClick={() => onOpenBirthdayParty(primaryCat)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 text-slate-900" />
            <span>Join Party 🥳</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};
