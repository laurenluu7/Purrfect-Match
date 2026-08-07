import React, { useState } from 'react';
import { Cat, AdopterProfile, MatchResult } from '../types';
import { ChevronLeft, Bell, Sparkles, Heart, Check, RefreshCw, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AdopterAppViewProps {
  cats: Cat[];
  onSelectCat: (cat: Cat) => void;
  onOpenWaitlistForCat: (cat: Cat) => void;
  onRunMatchmaker: (profile: AdopterProfile) => Promise<MatchResult[]>;
}

export const AdopterAppView: React.FC<AdopterAppViewProps> = ({
  cats,
  onSelectCat,
  onOpenWaitlistForCat,
  onRunMatchmaker,
}) => {
  const [quizStep, setQuizStep] = useState<number>(2); // Default to completed/in-progress step to match screenshot
  const [quizProfile, setQuizProfile] = useState<AdopterProfile>({
    housing_type: 'Apartment',
    noise_level: 'Moderate',
    existing_pets: 'Cat',
    hours_away_per_day: 6,
    pet_experience: 'Intermediate',
    homeType: 'Apartment',
    hasKids: true,
    hasDogs: false,
    hasCats: true,
    activityLevel: 'Moderate',
    experienceLevel: 'Intermediate',
    preferences: 'Loves lap snuggles and calm energy',
  });
  const [matches, setMatches] = useState<{ cat: Cat; score: number }[]>(() => {
    // Generate default top matches for initial render
    return cats.slice(0, 4).map((cat, idx) => ({
      cat,
      score: idx === 0 ? 98 : idx === 1 ? 90 : 85 - idx * 5,
    }));
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateMatches = async () => {
    setIsCalculating(true);
    try {
      const results = await onRunMatchmaker(quizProfile);
      if (results && results.length > 0) {
        const mapped = results
          .map((res) => {
            const foundCat = cats.find((c) => c.id === res.catId);
            const finalScore = res.match_score ?? res.score ?? 75;
            return foundCat ? { cat: foundCat, score: finalScore } : null;
          })
          .filter(Boolean) as { cat: Cat; score: number }[];
        setMatches(mapped);
      }
    } catch (e) {
      console.error('Quiz match error:', e);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 font-['Poppins',sans-serif]">
      {/* Outer Mobile Frame Styling matching bottom section of screenshot */}
      <div className="bg-[#f9f4ee] rounded-[2.5rem] border-[6px] border-white shadow-xl p-5 sm:p-6 text-stone-800 space-y-5 relative overflow-hidden">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between pt-1">
          <button className="w-9 h-9 rounded-full bg-white/80 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cute Cat Logo Header */}
          <div className="w-12 h-12 rounded-full bg-[#f3e4d8] border-2 border-white flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 36 36" className="w-8 h-8 text-[#8c593b] fill-current">
              <path d="M18 10c-5.5 0-10 4.5-10 10 0 5 3.5 9 8 10 1-.2 2-.5 2-1 0-.5-1-.8-2-1-3.5 0-6-3-6-7 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4-2.5 7-6 7-1 .2-2 .5-2 1 0 .5 1 .8 2 1 4.5-1 8-5 8-10 0-5.5-4.5-10-10-10z"/>
              <path d="M11 11l-4-5c-.4-.5-1.2-.2-1.1.4l1 6.6c1.3-0.7 2.7-1.4 4.1-2zM25 11l4-5c.4-.5 1.2-.2 1.1.4l-1 6.6c-1.3-0.7-2.7-1.4-4.1-2z"/>
              <circle cx="14" cy="18" r="1.5" />
              <circle cx="22" cy="18" r="1.5" />
              <path d="M17 21c.5.5 1.5.5 2 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <button className="w-9 h-9 rounded-full bg-white/80 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* Interface Header Titles */}
        <div className="text-center space-y-1 pt-1">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
            Adopter Matching Mobile App Interface
          </h2>
          <p className="text-xs font-semibold text-stone-500">
            Compatibility Quiz & AI Matchmaker
          </p>
        </div>

        {/* Compatibility Quiz Box & Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-900">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Compatibility Quiz</span>
            </span>
            <span className="text-indigo-600 font-extrabold text-[11px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              75% Complete
            </span>
          </div>

          {/* Purple/Indigo Progress Bar matching screenshot */}
          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5 border border-stone-200/50">
            <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 h-full rounded-full w-3/4 transition-all duration-500 shadow-xs" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>Question 3 of 4: Household & Lifestyle</span>
            <button
              onClick={handleCalculateMatches}
              disabled={isCalculating}
              className="text-indigo-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <span>Refresh AI Matches</span>
              )}
            </button>
          </div>
        </div>

        {/* Top Matches Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              Top Matches
            </h3>
            <button className="text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors">
              View all
            </button>
          </div>

          {/* Cat Matches Cards Grid/Scroll matching screenshot */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {matches.slice(0, 2).map(({ cat, score }) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3 }}
                onClick={() => onSelectCat(cat)}
                className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs space-y-2 cursor-pointer group"
              >
                {/* Cat Photo */}
                <div className="aspect-square w-full rounded-xl overflow-hidden relative bg-stone-100">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-black text-emerald-700 shadow-2xs border border-emerald-200">
                    {score}% Match
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-stone-900 truncate">
                    {cat.name}
                  </h4>
                  <div className="text-[10px] font-bold text-stone-500 flex items-center justify-between">
                    <span>Match Score</span>
                    <span className="text-emerald-600 font-extrabold">{score}</span>
                  </div>
                </div>

                {/* Individual Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWaitlistForCat(cat);
                  }}
                  className="w-full py-2 rounded-xl bg-[#c98d65] hover:bg-[#b57a53] text-white text-xs font-extrabold shadow-2xs transition-all active:scale-98 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Request to Meet</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Warm Terracotta Primary Pill CTA Button matching screenshot */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (matches.length > 0) {
                  onOpenWaitlistForCat(matches[0].cat);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c98d65] to-[#ba7c53] hover:from-[#ba7c53] hover:to-[#a96b42] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Request to Meet Top Match</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
