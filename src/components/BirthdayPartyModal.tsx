import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gift, Heart, PartyPopper, Calendar, Cake, Award, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cat } from '../types';
import { triggerBirthdayConfetti, formatBirthdayDisplay } from '../utils/birthdayUtils';

interface BirthdayPartyModalProps {
  cat: Cat;
  onClose: () => void;
  onOpenProfile?: (cat: Cat) => void;
  onAddMilestone?: (catId: string, title: string, description: string) => void;
}

export const BirthdayPartyModal: React.FC<BirthdayPartyModalProps> = ({
  cat,
  onClose,
  onOpenProfile,
  onAddMilestone
}) => {
  const [treatCount, setTreatCount] = useState(0);
  const [floatingItems, setFloatingItems] = useState<{ id: number; symbol: string; x: number }[]>([]);
  const [milestoneAdded, setMilestoneAdded] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on modal launch!
    triggerBirthdayConfetti();
  }, [cat]);

  const handleGiveTreat = () => {
    setTreatCount(prev => prev + 1);
    
    // Add floating item animation
    const id = Date.now() + Math.random();
    const symbols = ['🐟', '🐟', '🍣', '💖', '🎈', '🎂', '✨'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const x = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    
    setFloatingItems(prev => [...prev, { id, symbol, x }]);
    
    setTimeout(() => {
      setFloatingItems(prev => prev.filter(item => item.id !== id));
    }, 1500);

    triggerBirthdayConfetti();
  };

  const handleAddBirthdayMilestone = () => {
    if (onAddMilestone && !milestoneAdded) {
      const ageText = cat.ageYears > 0 ? `${cat.ageYears} Year` : `${cat.ageMonths} Month`;
      onAddMilestone(
        cat.id,
        `🎂 Happy ${ageText} Birthday Celebration!`,
        `Cafe staff & visitors celebrated ${cat.name}'s birthday with extra salmon treats, cuddles, and a custom party hat!`
      );
      setMilestoneAdded(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Floating Treat Animations */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: '80vh', scale: 0.8, x: `${item.x}vw` }}
              animate={{ opacity: 0, y: '20vh', scale: 1.5, rotate: [0, 15, -15, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute text-4xl select-none"
            >
              {item.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Festive Banner Header */}
        <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 p-6 text-white text-center overflow-hidden">
          {/* Confetti & Stars Background Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-amber-200 border border-white/30">
              <Cake className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
              <span>Birthday Star of the Day</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm flex items-center justify-center gap-2">
              <span>🎉 Happy Birthday, {cat.name}! 🎂</span>
            </h2>

            <p className="text-xs text-pink-50 font-medium">
              Born on {formatBirthdayDisplay(cat.birthDate)} • {cat.ageYears > 0 ? `${cat.ageYears} Years` : `${cat.ageMonths} Months`} Old Today!
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-800">
          
          {/* Cat Image with Festive Frame & Party Hat */}
          <div className="relative w-36 h-36 mx-auto rounded-3xl overflow-hidden border-4 border-pink-200 shadow-md bg-pink-50 flex-shrink-0">
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Party Hat Graphic Sticker */}
            <div className="absolute -top-1 -right-1 text-3xl transform rotate-12 drop-shadow-md select-none">
              🥳
            </div>
            
            <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-pink-500/90 text-white text-[10px] font-bold shadow-xs">
              👑 Star Birthday
            </div>
          </div>

          {/* Birthday Message Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border border-pink-200/80 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-700 italic">
              &quot;{cat.name} is receiving extra forehead kisses, salmon flakes, and warm lap cuddles today at Meow Maison Cat Cafe!&quot;
            </p>

            <div className="flex items-center justify-center space-x-3 text-[11px] font-bold text-slate-600 pt-1">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Diet Prepared</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Gift className="w-3.5 h-3.5 text-pink-500" />
                <span>Gift Bag Ready</span>
              </span>
            </div>
          </div>

          {/* Interactive Birthday Treats Section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Cake className="w-4 h-4 text-pink-500" />
                <span>Virtual Birthday Fish Treats Given:</span>
              </span>
              <span className="text-sm font-black text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                {treatCount} 🐟
              </span>
            </div>

            <button
              onClick={handleGiveTreat}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <PartyPopper className="w-4 h-4 text-amber-200" />
              <span>Give {cat.name} a Birthday Fish Treat 🐟 (+Confetti!)</span>
            </button>
          </div>

          {/* Milestone Action */}
          {onAddMilestone && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Add Birthday to Timeline</div>
                <div className="text-[10px] text-slate-500">Record this celebration in {cat.name}&apos;s official shelter record.</div>
              </div>
              <button
                onClick={handleAddBirthdayMilestone}
                disabled={milestoneAdded}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  milestoneAdded
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 shadow-2xs cursor-pointer'
                }`}
              >
                {milestoneAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logged!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    <span>Log Event</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 flex items-center justify-between gap-2">
          <button
            onClick={() => triggerBirthdayConfetti()}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-slate-800 font-bold text-xs border border-pink-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>More Confetti 🎉</span>
          </button>

          <div className="flex items-center space-x-2">
            {onOpenProfile && (
              <button
                onClick={() => {
                  onClose();
                  onOpenProfile(cat);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
              >
                <span>Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
