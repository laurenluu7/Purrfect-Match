import React from 'react';
import { Star, Heart, Calendar, ShieldAlert, Sparkles, UserCheck, ArrowRight, Award, Cake, PartyPopper, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Cat } from '../types';
import { isTodayBirthday, triggerBirthdayConfetti } from '../utils/birthdayUtils';
import { getCatMedicalAlert } from '../utils/medicalAlertUtils';

interface FeaturedCatCardProps {
  cat: Cat;
  onSelectCat: (cat: Cat) => void;
  onChangeFeatured: () => void;
  onEnhanceAI: (cat: Cat) => void;
  onOpenBirthdayParty?: (cat: Cat) => void;
}

export const FeaturedCatCard: React.FC<FeaturedCatCardProps> = ({
  cat,
  onSelectCat,
  onChangeFeatured,
  onEnhanceAI,
  onOpenBirthdayParty
}) => {
  const isBirthday = isTodayBirthday(cat.birthDate);
  const medicalAlert = getCatMedicalAlert(cat);
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-sky-50 border border-pink-200/80 shadow-xs hover:shadow-xl hover:shadow-pink-200/50 hover:border-pink-300 transition-all p-6 md:p-8 my-6"
    >
      {/* Background Decorative Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-6 md:gap-8">
        
        {/* Left: Image with Featured Badge */}
        <div className="relative w-full lg:w-80 h-72 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden group shadow-xs">
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

          {/* Star Ribbon */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-pink-200 flex items-center space-x-1.5 text-xs font-bold text-slate-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Featured Cat of the Week</span>
          </div>

          {/* Adoption status overlay badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{cat.adoptionStatus}</span>
          </div>
        </div>

        {/* Right: Rich Profile Info */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Tagline / Subtitle */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200">
                <Award className="w-3.5 h-3.5 mr-1 text-pink-600" />
                {cat.category}
              </span>
              <button
                onClick={onChangeFeatured}
                className="text-xs font-semibold text-slate-700 hover:text-pink-600 underline underline-offset-2 transition-colors"
              >
                Switch Featured Cat
              </button>
            </div>

            {/* Name & Basic Meta */}
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {cat.name}
              </h2>
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-900">
                <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-200">
                  {cat.ageYears} yrs {cat.ageMonths} mos
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                  {cat.gender}
                </span>
              </div>
            </div>

            {/* Catchy Headline */}
            {cat.featuredTagline && (
              <p className="mt-1 text-sm font-bold text-pink-700 italic">
                "{cat.featuredTagline}"
              </p>
            )}

            {/* Bio Description */}
            <p className="mt-3 text-slate-800 text-sm leading-relaxed font-normal">
              {cat.description}
            </p>

            {/* AI Summary note */}
            {cat.aiSummary && (
              <div className="mt-3 p-3 rounded-xl bg-sky-50/90 border border-sky-200/80 flex items-start space-x-2.5 text-xs text-slate-900">
                <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-sky-900">AI Coordinator Insight: </strong>
                  <span>{cat.aiSummary}</span>
                </div>
              </div>
            )}

            {/* Personality Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cat.personalityTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-slate-900 border border-pink-200 shadow-2xs"
                >
                  ✨ {trait}
                </span>
              ))}
            </div>

            {/* Medical Care Highlights & Alerts */}
            {medicalAlert && medicalAlert.hasAlert ? (
              <div
                onClick={() => onSelectCat(cat)}
                className={`mt-3 p-3 rounded-xl text-xs border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                  medicalAlert.level === 'urgent'
                    ? 'bg-rose-50 text-rose-950 border-rose-300'
                    : medicalAlert.level === 'warning'
                    ? 'bg-amber-50 text-amber-950 border-amber-300'
                    : 'bg-sky-50 text-sky-950 border-sky-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${medicalAlert.level === 'urgent' ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                  <div>
                    <span className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-500">Medical Alert</span>
                    <strong className="font-bold text-slate-900">{medicalAlert.title}:</strong>{' '}
                    <span className="text-slate-700">{medicalAlert.details}</span>
                  </div>
                </div>
                {medicalAlert.dueDate && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-white text-slate-800 font-black text-[10px] border border-slate-200 whitespace-nowrap">
                    {medicalAlert.dueDate}
                  </span>
                )}
              </div>
            ) : cat.medicalConcerns.length > 0 ? (
              <div className="mt-3 flex items-center space-x-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Medical Notice: {cat.medicalConcerns.join(', ')}</span>
              </div>
            ) : (
              <div className="mt-3 flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Health Record: Vaccinated, Neutered & Ready for Adoption!</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-pink-100">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>At Cafe since: <strong className="text-slate-900">{cat.arrivalDate}</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              {isBirthday && (
                <button
                  onClick={() => {
                    if (onOpenBirthdayParty) onOpenBirthdayParty(cat);
                    else triggerBirthdayConfetti();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-white font-extrabold text-xs shadow-xs flex items-center space-x-1.5 hover:opacity-95 transition-all cursor-pointer animate-pulse"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-amber-100" />
                  <span>Join Birthday Party 🥳</span>
                </button>
              )}

              <button
                onClick={() => onEnhanceAI(cat)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-slate-900 font-semibold text-[11px] border border-pink-200 flex items-center space-x-1 transition-colors cursor-pointer"
                title="Enhance profile bio with AI"
              >
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>AI Polish</span>
              </button>

              <button
                onClick={() => onSelectCat(cat)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-xs hover:shadow-sm"
              >
                <span>View Adoption Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
