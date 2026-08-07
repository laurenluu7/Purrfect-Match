import React from 'react';
import { Cat, Heart, Clock, AlertCircle, Sparkles, Plus, FileSpreadsheet, RefreshCw, LogOut, UserCheck, UserPlus, Download, AlertTriangle } from 'lucide-react';
import { Cat as CatType } from '../types';
import { getCatMedicalAlert } from '../utils/medicalAlertUtils';

interface HeaderStatsProps {
  cats: CatType[];
  waitlistCount?: number;
  currentUser?: { name: string; role: 'visitor' | 'staff'; email: string } | null;
  onLogout?: () => void;
  onOpenAddModal: () => void;
  onOpenMatchmaker: () => void;
  onOpenWaitlist?: () => void;
  onOpenSheetsSync: () => void;
  onDownloadCSV?: () => void;
  onResetData: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  cats,
  waitlistCount = 0,
  currentUser,
  onLogout,
  onOpenAddModal,
  onOpenMatchmaker,
  onOpenWaitlist,
  onOpenSheetsSync,
  onDownloadCSV,
  onResetData
}) => {
  const total = cats.length;
  const available = cats.filter(c => c.adoptionStatus === 'Available').length;
  const pending = cats.filter(c => c.adoptionStatus === 'Pending').length;
  const reserved = cats.filter(c => c.adoptionStatus === 'Reserved').length;
  const medicalSpecial = cats.filter(c => c.medicalConcerns.length > 0 || c.category === 'Special Care').length;
  const alertCount = cats.filter(c => {
    const alert = getCatMedicalAlert(c);
    return alert && alert.hasAlert;
  }).length;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Cafe Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-200 via-pink-100 to-sky-100 border border-pink-200/80 flex items-center justify-center shadow-xs text-pink-600">
              <Cat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Meo Hub
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-pink-100 text-pink-700 border border-pink-200/80 tracking-wide uppercase leading-none">
                  Meow Maison Cat Cafe
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Cat management & AI adoption organizer
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-pink-50/80 border border-pink-200/60 text-slate-900 font-medium whitespace-nowrap">
              <Cat className="w-4 h-4 text-pink-500" />
              <span>Total Cats: <strong className="text-slate-900 font-bold">{total}</strong></span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-sky-50/80 border border-sky-200/60 text-slate-900 font-medium whitespace-nowrap">
              <Heart className="w-4 h-4 text-sky-500 fill-sky-100" />
              <span>Available: <strong className="text-sky-700 font-bold">{available}</strong></span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-slate-900 font-medium whitespace-nowrap">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending / Reserved: <strong className="text-amber-700 font-bold">{pending + reserved}</strong></span>
            </div>

            {alertCount > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 font-bold whitespace-nowrap animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Medical Alerts: <strong className="text-rose-800 font-black">{alertCount}</strong></span>
              </div>
            )}

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200/60 text-slate-900 font-medium whitespace-nowrap">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Medical Care: <strong className="text-rose-700 font-bold">{medicalSpecial}</strong></span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
            {currentUser && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${currentUser.role === 'staff' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-700'}`}>
                  {currentUser.role}
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-xs hover:shadow-sm active:scale-98 flex-shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Cat</span>
            </button>

            {onOpenWaitlist && (
              <button
                onClick={onOpenWaitlist}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-100 to-amber-100 hover:from-pink-200 hover:to-amber-200 text-slate-900 font-semibold text-xs border border-pink-300 flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-98 flex-shrink-0 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-pink-600" />
                <span>Waitlist ({waitlistCount})</span>
              </button>
            )}

            <button
              onClick={onOpenMatchmaker}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200 hover:from-sky-200 hover:to-sky-300 text-slate-900 font-semibold text-xs border border-sky-300 flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-98 flex-shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
              <span>AI Match</span>
            </button>

            {onDownloadCSV && (
              <button
                onClick={onDownloadCSV}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-2xs hover:border-slate-300 flex-shrink-0 cursor-pointer"
                title="Download full cat catalog as CSV file for offline record keeping"
              >
                <Download className="w-3.5 h-3.5 text-pink-600" />
                <span className="hidden sm:inline">Download Data</span>
                <span className="sm:hidden">CSV</span>
              </button>
            )}

            <button
              onClick={onOpenSheetsSync}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-2xs hover:border-slate-300 flex-shrink-0 cursor-pointer"
              title="Export or sync with Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Sheets Sync</span>
              <span className="sm:hidden">Sheets</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
