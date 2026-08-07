import React, { useState } from 'react';
import { Cat, FilterState, WaitlistEntry, WaitlistStatus } from '../types';
import { 
  Cat as CatIcon, LayoutDashboard, Users, BarChart3, Calendar, Settings, 
  Search, Bell, Plus, FileSpreadsheet, RefreshCw, MoreHorizontal, ShieldAlert,
  Heart, Clock, CheckCircle2, AlertTriangle, Sparkles, UserPlus, Eye, Edit, Trash2, Smartphone, ChevronDown
} from 'lucide-react';
import { AdopterAppView } from './AdopterAppView';
import { getCatMedicalAlert } from '../utils/medicalAlertUtils';

interface StaffOperationsDashboardProps {
  cats: Cat[];
  filteredCats: Cat[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  waitlistCount: number;
  currentUser: { name: string; role: 'visitor' | 'staff'; email: string } | null;
  onLogout?: () => void;
  onSelectCat: (cat: Cat) => void;
  onEditCat: (cat: Cat) => void;
  onDeleteCat: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenMatchmaker: () => void;
  onOpenWaitlist: () => void;
  onOpenSheetsSync: () => void;
  onResetData: () => void;
  onOpenWaitlistForCat: (cat: Cat) => void;
  onRunMatchmaker: any;
}

export const StaffOperationsDashboard: React.FC<StaffOperationsDashboardProps> = ({
  cats,
  filteredCats,
  filters,
  setFilters,
  waitlistCount,
  currentUser,
  onLogout,
  onSelectCat,
  onEditCat,
  onDeleteCat,
  onOpenAddModal,
  onOpenMatchmaker,
  onOpenWaitlist,
  onOpenSheetsSync,
  onResetData,
  onOpenWaitlistForCat,
  onRunMatchmaker,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cats' | 'analytics' | 'events' | 'adopter_app' | 'settings'>('dashboard');
  const [activeCatMenuId, setActiveCatMenuId] = useState<string | null>(null);

  // Statistics
  const totalCats = cats.length;
  const availableCats = cats.filter(c => c.adoptionStatus === 'Available').length;
  const onBreakCats = cats.filter(c => c.adoptionStatus === 'Pending' || c.adoptionStatus === 'Reserved' || c.category === 'Quiet & Shy').length;
  const alertCount = cats.filter(c => {
    const alert = getCatMedicalAlert(c);
    return alert && alert.hasAlert;
  }).length;

  return (
    <div className="min-h-screen bg-[#f7f1ea] text-stone-800 font-['Poppins',sans-serif] flex flex-col lg:flex-row antialiased">
      
      {/* 1. LEFT SIDEBAR / MOBILE DROPDOWN NAVIGATION */}
      <aside className="w-full lg:w-64 bg-[#f0e8e0]/90 border-b lg:border-b-0 lg:border-r border-[#e6dad0] flex-shrink-0 p-4 lg:p-5 flex flex-col justify-between">
        
        {/* MOBILE VIEW (Compressed Tabs Dropdown) */}
        <div className="lg:hidden flex items-center justify-between gap-3 w-full">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f5dfce] border-2 border-white flex items-center justify-center shadow-xs text-[#8c593b]">
              <svg viewBox="0 0 36 36" className="w-6 h-6 fill-current">
                <path d="M18 10c-5.5 0-10 4.5-10 10 0 5 3.5 9 8 10 1-.2 2-.5 2-1 0-.5-1-.8-2-1-3.5 0-6-3-6-7 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4-2.5 7-6 7-1 .2-2 .5-2 1 0 .5 1 .8 2 1 4.5-1 8-5 8-10 0-5.5-4.5-10-10-10z"/>
                <path d="M11 11l-4-5c-.4-.5-1.2-.2-1.1.4l1 6.6c1.3-0.7 2.7-1.4 4.1-2zM25 11l4-5c.4-.5 1.2-.2 1.1.4l-1 6.6c-1.3-0.7-2.7-1.4-4.1-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 text-base leading-tight">Meo Hub</h1>
              <p className="text-[10px] font-semibold text-stone-500">Meow Maison Cafe</p>
            </div>
          </div>

          {/* Compressed Mobile Dropdown Option Button */}
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="appearance-none bg-white border border-[#e2d5c8] text-stone-900 font-extrabold text-xs pl-3.5 pr-8 py-2.5 rounded-2xl shadow-2xs outline-none focus:ring-2 focus:ring-[#c98d65]/30 cursor-pointer"
            >
              <option value="dashboard">📊 Dashboard</option>
              <option value="cats">🐱 Resident Cats ({totalCats})</option>
              <option value="adopter_app">📱 Adopter App View</option>
              <option value="analytics">📈 Analytics</option>
              <option value="events">📅 Events & Care</option>
              <option value="settings">⚙️ Settings</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* DESKTOP VIEW (Full Sidebar) */}
        <div className="hidden lg:flex lg:flex-col justify-between h-full space-y-6">
          <div className="space-y-6">
            
            {/* Logo Brand Header */}
            <div className="flex items-center space-x-3 px-2 pt-1">
              <div className="w-11 h-11 rounded-2xl bg-[#f5dfce] border-2 border-white flex items-center justify-center shadow-xs text-[#8c593b]">
                <svg viewBox="0 0 36 36" className="w-7 h-7 fill-current">
                  <path d="M18 10c-5.5 0-10 4.5-10 10 0 5 3.5 9 8 10 1-.2 2-.5 2-1 0-.5-1-.8-2-1-3.5 0-6-3-6-7 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4-2.5 7-6 7-1 .2-2 .5-2 1 0 .5 1 .8 2 1 4.5-1 8-5 8-10 0-5.5-4.5-10-10-10z"/>
                  <path d="M11 11l-4-5c-.4-.5-1.2-.2-1.1.4l1 6.6c1.3-0.7 2.7-1.4 4.1-2zM25 11l4-5c.4-.5 1.2-.2 1.1.4l-1 6.6c-1.3-0.7-2.7-1.4-4.1-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-stone-900 text-base leading-tight tracking-tight">
                  Meo Hub
                </h1>
                <p className="text-[11px] font-semibold text-stone-500">
                  Meow Maison Cafe
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 stroke-[2.2]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('cats')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'cats'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <CatIcon className="w-4 h-4 stroke-[2.2]" />
                <span>Resident Cats ({totalCats})</span>
              </button>

              <button
                onClick={() => setActiveTab('adopter_app')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'adopter_app'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-4 h-4 stroke-[2.2] text-indigo-600" />
                <span>Adopter App View</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 stroke-[2.2]" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <Calendar className="w-4 h-4 stroke-[2.2]" />
                <span>Events & Care</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#e2cbb8] text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:bg-[#e8ded4] hover:text-stone-900'
                }`}
              >
                <Settings className="w-4 h-4 stroke-[2.2]" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* User Badge / Quick Actions at bottom of sidebar */}
          <div className="pt-4 border-t border-[#e2d5c8] space-y-2">
            {currentUser && (
              <div className="px-3 py-2 rounded-2xl bg-white/70 border border-[#e2d5c8] flex items-center justify-between text-xs font-bold text-stone-800">
                <div className="truncate">
                  <span className="block truncate font-extrabold">{currentUser.name}</span>
                  <span className="text-[10px] text-stone-500 font-medium capitalize">{currentUser.role} Operations</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
            <button
              onClick={onResetData}
              className="w-full py-2 rounded-xl bg-white/50 hover:bg-white text-stone-600 hover:text-stone-900 text-[11px] font-bold border border-[#e2d5c8] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* TOP HEADER BAR matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#ebdcd0]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Staff Operations Dashboard
            </h2>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">
              Real-time cat cafe operations, lounge status, and medical alerts
            </p>
          </div>

          {/* Search Box & Top Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search cats..."
                className="pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#e2d5c8] text-xs font-semibold text-stone-800 placeholder:text-stone-400 shadow-2xs outline-none focus:border-stone-400 w-44 sm:w-56"
              />
            </div>

            <button className="w-9 h-9 rounded-2xl bg-white border border-[#e2d5c8] flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded-2xl bg-[#c98d65] hover:bg-[#b57a53] text-white text-xs font-extrabold shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Cat</span>
            </button>

            <button
              onClick={onOpenSheetsSync}
              className="p-2 rounded-2xl bg-white border border-[#e2d5c8] text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
              title="Sync Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={onOpenWaitlist}
              className="px-3 py-2 rounded-2xl bg-[#e8ded4] border border-[#d8c8ba] text-stone-800 text-xs font-extrabold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#8c593b]" />
              <span>Waitlist ({waitlistCount})</span>
            </button>
          </div>
        </div>

        {/* CONDITIONALLY RENDER ADOPTER APP VIEW TAB */}
        {activeTab === 'adopter_app' ? (
          <AdopterAppView
            cats={cats}
            onSelectCat={onSelectCat}
            onOpenWaitlistForCat={onOpenWaitlistForCat}
            onRunMatchmaker={onRunMatchmaker}
          />
        ) : (
          /* DASHBOARD & RESIDENT CATS VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLUMNS: RESIDENT CATS LIST / TABLE */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#ebe0d5] shadow-xs space-y-4">
                
                {/* Table Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-stone-900 tracking-tight">
                      Resident Cats
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f3e8de] text-stone-700 text-xs font-extrabold">
                      {filteredCats.length} total
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-1.5 text-xs font-bold">
                    <button
                      onClick={() => setFilters(p => ({ ...p, adoptionStatus: 'all' }))}
                      className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                        filters.adoptionStatus === 'all'
                          ? 'bg-[#e2cbb8] text-stone-900'
                          : 'bg-stone-100 text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilters(p => ({ ...p, adoptionStatus: 'Available' }))}
                      className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                        filters.adoptionStatus === 'Available'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Available
                    </button>
                  </div>
                </div>

                {/* Resident Cats Table matching exact mockup columns */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-semibold text-stone-800">
                      {filteredCats.map((cat, idx) => {
                        const alert = getCatMedicalAlert(cat);
                        // Alternate mock status for break vs available to match screenshot
                        const isBreak = idx % 2 === 0 && cat.adoptionStatus === 'Available';
                        const statusLabel = alert && alert.hasAlert
                          ? 'Medical Notice'
                          : isBreak
                          ? 'On Break'
                          : cat.adoptionStatus;

                        return (
                          <tr
                            key={cat.id}
                            onClick={() => onSelectCat(cat)}
                            className="hover:bg-[#fbf7f3] transition-colors cursor-pointer group"
                          >
                            {/* Avatar & Name Column */}
                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-10 h-10 rounded-full object-cover border border-stone-200/80 shadow-2xs group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="font-extrabold text-stone-900 flex items-center space-x-1 text-sm">
                                    <span>{cat.name}</span>
                                    {cat.featured && <span className="text-amber-500 text-xs">★</span>}
                                  </div>
                                  <div className="text-[11px] font-medium text-stone-400">
                                    Resident Cat • {cat.category}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Status Column matching soft pastel pills in screenshot */}
                            <td className="py-3 px-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center space-x-1.5 ${
                                  statusLabel === 'On Break'
                                    ? 'bg-[#fef3c7] text-[#92400e]'
                                    : statusLabel === 'Available'
                                    ? 'bg-[#dcfce7] text-[#166534]'
                                    : 'bg-[#ffe4e6] text-[#9f1239]'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  statusLabel === 'On Break' ? 'bg-amber-500' : statusLabel === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`} />
                                <span>{statusLabel}</span>
                              </span>
                            </td>

                            {/* Action Buttons Column */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectCat(cat);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#f2e2d5] text-stone-800 text-xs font-bold border border-stone-200/80 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Log Health Notes
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCatMenuId(activeCatMenuId === cat.id ? null : cat.id);
                                  }}
                                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer relative"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* MOBILE ADOPTER MATCHING APP INTERFACE CARD AT BOTTOM */}
              <div className="pt-2">
                <AdopterAppView
                  cats={cats}
                  onSelectCat={onSelectCat}
                  onOpenWaitlistForCat={onOpenWaitlistForCat}
                  onRunMatchmaker={onRunMatchmaker}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: ANALYTICS WIDGETS matching screenshot */}
            <div className="space-y-5">
              
              {/* WIDGET 1: ROOM CAPACITY */}
              <div className="bg-white rounded-3xl p-5 border border-[#ebe0d5] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">
                      Room Capacity
                    </h3>
                    <p className="text-[11px] font-semibold text-stone-400">
                      Lounge cat occupancy timeline
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#f5e9de] text-[#8c593b] font-black text-xs">
                    {totalCats} / 20 Max
                  </span>
                </div>

                {/* Occupancy Timeline Chart Graphic matching screenshot */}
                <div className="pt-2 space-y-3">
                  <div className="relative h-28 w-full bg-[#faf6f2] rounded-2xl p-3 border border-stone-200/60 flex items-end justify-between gap-1.5">
                    {/* Tooltip callout badge e.g. 200s or 85% */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center space-x-1">
                      <span>Peak: 88% (200s)</span>
                    </div>

                    {/* Chart Bars */}
                    {[45, 60, 50, 75, 90, 80, 65, 88, 70, 82].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          style={{ height: `${height}%` }}
                          className={`w-full rounded-t-md transition-all ${
                            i === 7 ? 'bg-indigo-500' : 'bg-[#e0cfc1] hover:bg-[#c98d65]'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] font-extrabold text-stone-400 px-1">
                    <span>1s</span>
                    <span>5s</span>
                    <span>7s</span>
                    <span>9s</span>
                    <span>12s</span>
                  </div>
                </div>
              </div>

              {/* WIDGET 2: AVERAGE REST TIME */}
              <div className="bg-white rounded-3xl p-5 border border-[#ebe0d5] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">
                      Average Rest Time
                    </h3>
                    <p className="text-[11px] font-semibold text-stone-400">
                      Daily napping & lounge rest cycles
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
                    102 mins
                  </span>
                </div>

                {/* Rest Time Curve Chart Graphic matching screenshot */}
                <div className="pt-2 space-y-3">
                  <div className="relative h-28 w-full bg-[#faf6f2] rounded-2xl p-3 border border-stone-200/60 flex items-center justify-center">
                    
                    {/* Smooth SVG Area Curve Graphic */}
                    <svg viewBox="0 0 200 60" className="w-full h-full text-indigo-500 overflow-visible">
                      <defs>
                        <linearGradient id="restGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,40 Q 30,10 60,35 T 120,15 T 180,45 L 200,30 L 200,60 L 0,60 Z"
                        fill="url(#restGradient)"
                      />
                      <path
                        d="M 0,40 Q 30,10 60,35 T 120,15 T 180,45 L 200,30"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                      />
                      {/* Marker callout at 102m */}
                      <circle cx="120" cy="15" r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Dark callout badge matching screenshot */}
                    <div className="absolute top-1 left-[55%] -translate-x-1/2 bg-stone-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      102ms
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] font-extrabold text-stone-400 px-1">
                    <span>1s</span>
                    <span>5s</span>
                    <span>8s</span>
                    <span>12s</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
