import React from 'react';
import { Heart, Calendar, ShieldAlert, CheckCircle2, Star, Sparkles, MoreHorizontal, Edit, Trash2, Cake, PartyPopper, AlertTriangle, Pill } from 'lucide-react';
import { motion } from 'motion/react';
import { Cat } from '../types';
import { isTodayBirthday, triggerBirthdayConfetti } from '../utils/birthdayUtils';
import { getCatMedicalAlert } from '../utils/medicalAlertUtils';

interface CatCardProps {
  cat: Cat;
  onSelectCat: (cat: Cat) => void;
  onEditCat: (cat: Cat) => void;
  onDeleteCat: (id: string) => void;
  onToggleFeature: (id: string) => void;
  onOpenBirthdayParty?: (cat: Cat) => void;
}

export const CatCard: React.FC<CatCardProps> = ({
  cat,
  onSelectCat,
  onEditCat,
  onDeleteCat,
  onToggleFeature,
  onOpenBirthdayParty
}) => {
  const isBirthday = isTodayBirthday(cat.birthDate);
  const medicalAlert = getCatMedicalAlert(cat);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const getStatusBadge = (status: Cat['adoptionStatus']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Reserved':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Adopted':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Foster':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative bg-white rounded-2xl border border-pink-100/90 shadow-2xs hover:shadow-xl hover:shadow-pink-200/60 hover:border-pink-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
      
      {/* Top Image Section */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
        <img
          src={cat.imageUrl}
          alt={cat.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Adoption Status Badge, Birthday Badge & Medical Alert Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {cat.adoptionStatus === 'Adopted' ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white border border-white/80 shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
              <span>Happy Tails Alumni 🏡</span>
            </span>
          ) : (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${getStatusBadge(cat.adoptionStatus)}`}>
              {cat.adoptionStatus}
            </span>
          )}

          {/* Medical Alert Warning Badge */}
          {medicalAlert && medicalAlert.hasAlert && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white border shadow-md flex items-center space-x-1 backdrop-blur-md animate-pulse ${
                medicalAlert.level === 'urgent'
                  ? 'bg-rose-600/95 border-rose-300'
                  : medicalAlert.level === 'warning'
                  ? 'bg-amber-600/95 border-amber-300'
                  : 'bg-sky-600/95 border-sky-300'
              }`}
              title={`Medical Alert: ${medicalAlert.title} - ${medicalAlert.details || ''}`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-200 flex-shrink-0" />
              <span>Medical Alert</span>
            </span>
          )}

          {isBirthday && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenBirthdayParty) onOpenBirthdayParty(cat);
                else triggerBirthdayConfetti();
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white border border-white/60 shadow-md flex items-center space-x-1 animate-pulse hover:scale-105 transition-all cursor-pointer"
            >
              <Cake className="w-3.5 h-3.5 text-amber-200" />
              <span>🎂 Birthday Today!</span>
            </button>
          )}
        </div>

        {/* Birthday Party Hat Graphic */}
        {isBirthday && (
          <div className="absolute top-2 right-12 text-2xl drop-shadow-md select-none pointer-events-none animate-bounce">
            🥳
          </div>
        )}

        {/* Featured Star Toggle Button */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <button
            onClick={() => onToggleFeature(cat.id)}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
              cat.featured
                ? 'bg-amber-400 text-slate-900 shadow-xs scale-110'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-amber-500'
            }`}
            title={cat.featured ? 'Featured Cat of the Week' : 'Click to feature this cat'}
          >
            <Star className={`w-4 h-4 ${cat.featured ? 'fill-slate-900' : ''}`} />
          </button>
        </div>

        {/* Category Overlay Pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-slate-900 border border-pink-200">
          {cat.category}
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Name & Age / Gender */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
              {cat.name}
            </h3>
            <span className="text-xs font-semibold text-slate-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
              {cat.gender === 'Female' ? '♀ Female' : '♂ Male'}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-900 mt-0.5">
            {cat.ageYears} yrs {cat.ageMonths} mos • Arrived {cat.arrivalDate}
          </p>

          {/* Short description */}
          <p className="text-xs text-slate-800 line-clamp-2 mt-2 leading-relaxed">
            {cat.description}
          </p>
        </div>

        {/* Personality Tags */}
        <div className="flex flex-wrap gap-1">
          {cat.personalityTraits.slice(0, 3).map((trait, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-pink-50/80 text-slate-900 border border-pink-100"
            >
              {trait}
            </span>
          ))}
          {cat.personalityTraits.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-600 bg-slate-100">
              +{cat.personalityTraits.length - 3}
            </span>
          )}
        </div>

        {/* Medical Status & Medical Alert Pill */}
        <div className="pt-2 border-t border-slate-100 text-xs">
          {medicalAlert && medicalAlert.hasAlert ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectCat(cat);
              }}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                medicalAlert.level === 'urgent'
                  ? 'bg-rose-50/90 text-rose-900 border-rose-200 hover:bg-rose-100/90'
                  : medicalAlert.level === 'warning'
                  ? 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100/90'
                  : 'bg-sky-50/90 text-sky-900 border-sky-200 hover:bg-sky-100/90'
              }`}
              title={`Click to view details: ${medicalAlert.details || medicalAlert.title}`}
            >
              <div className="flex items-center space-x-1.5 truncate">
                <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${medicalAlert.level === 'urgent' ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                <div className="truncate">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Medical Alert</span>
                  <span className="truncate font-bold text-slate-900 block">{medicalAlert.title}</span>
                </div>
              </div>
              {medicalAlert.dueDate && (
                <span className="px-1.5 py-0.5 rounded bg-white/90 text-[9px] font-black text-slate-800 border border-slate-200/80 ml-1.5 whitespace-nowrap flex-shrink-0">
                  {medicalAlert.dueDate}
                </span>
              )}
            </div>
          ) : cat.medicalConcerns.length > 0 ? (
            <div className="flex items-center space-x-1.5 text-rose-700 font-semibold bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 w-full truncate">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" />
              <span className="truncate">Medical: {cat.medicalConcerns[0]}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 w-full truncate">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
              <span className="truncate">Vaccinated & Healthy</span>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => onSelectCat(cat)}
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-2xs text-center"
          >
            View Details
          </button>

          <button
            onClick={() => onEditCat(cat)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-700 transition-colors"
            title="Edit Cat Profile"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteCat(cat.id)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors"
            title="Delete Cat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
};
