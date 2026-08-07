import React from 'react';
import { Search, Filter, X, LayoutGrid, List, RotateCcw, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types';

interface SearchAndFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalCount
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.adoptionStatus !== 'all' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.ageGroup !== 'all' ? 1 : 0) +
    (filters.medicalConcernFilter !== 'all' ? 1 : 0);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-100 p-4 md:p-5 shadow-2xs space-y-4">
      
      {/* Top Row: Search Input, Sorting, View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search cat by name, personality, color or medical notes..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Happy Tails Toggle & Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end w-full md:w-auto">
          
          {/* Happy Tails Toggle Filter */}
          <button
            onClick={() => {
              if (filters.adoptionStatus === 'Adopted') {
                onFilterChange({ ...filters, adoptionStatus: 'all' });
              } else {
                onFilterChange({ ...filters, adoptionStatus: 'Adopted' });
              }
            }}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs flex-1 sm:flex-initial justify-center ${
              filters.adoptionStatus === 'Adopted'
                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white border border-amber-300 ring-2 ring-pink-200 shadow-md scale-102'
                : 'bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-slate-900 border border-pink-200 hover:border-pink-300'
            }`}
            title="Toggle Happy Tails Wall of Fame to view successfully adopted alumni"
          >
            <span className="text-sm">🐾</span>
            <span>Happy Tails</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              filters.adoptionStatus === 'Adopted' ? 'bg-white/30 text-white' : 'bg-pink-200 text-pink-900'
            }`}>
              {filters.adoptionStatus === 'Adopted' ? 'Active' : 'Adopted'}
            </span>
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            {/* Sort Selector */}
            <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 flex-1 sm:flex-initial">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer w-full"
              >
                <option value="newest">Newest Arrival</option>
                <option value="name">Name (A-Z)</option>
                <option value="ageAsc">Age (Youngest First)</option>
                <option value="ageDesc">Age (Oldest First)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 flex-shrink-0">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table Directory View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
        
        {/* Adoption Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.adoptionStatus}
            onChange={(e) => onFilterChange({ ...filters, adoptionStatus: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-pink-50/60 border border-pink-200/80 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Reserved">Reserved</option>
            <option value="Adopted">Adopted</option>
            <option value="Foster">Foster</option>
          </select>
        </div>

        {/* Age Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
            Age
          </label>
          <select
            value={filters.ageGroup}
            onChange={(e) => onFilterChange({ ...filters, ageGroup: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-sky-50/60 border border-sky-200/80 text-xs font-semibold text-slate-900 outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="all">All Ages</option>
            <option value="kitten">Kitten (&lt; 1 yr)</option>
            <option value="young">Young (1 - 3 yrs)</option>
            <option value="adult">Adult (3 - 7 yrs)</option>
            <option value="senior">Senior (7+ yrs)</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        {/* Medical Concerns Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
            Medical Needs
          </label>
          <select
            value={filters.medicalConcernFilter}
            onChange={(e) => onFilterChange({ ...filters, medicalConcernFilter: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-rose-50/60 border border-rose-200/80 text-xs font-semibold text-slate-900 outline-none focus:border-rose-400 cursor-pointer"
          >
            <option value="all">All Health Profiles</option>
            <option value="alertsOnly">🚨 Urgent Medical Alerts Only</option>
            <option value="hasConcerns">Has Medical Notes</option>
            <option value="specialDiet">Special Diet / Care</option>
            <option value="none">Clear / No Concerns</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
            Cafe Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Lounge Lovers">Lounge Lovers</option>
            <option value="Playful Energetic">Playful Energetic</option>
            <option value="Quiet & Shy">Quiet & Shy</option>
            <option value="Special Care">Special Care</option>
            <option value="Lap Cats">Lap Cats</option>
            <option value="Kittens">Kittens</option>
          </select>
        </div>

      </div>

      {/* Filter Summary & Clear */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="text-slate-900 font-medium">
          Showing <strong className="font-bold text-slate-900">{totalFilteredCount}</strong> of <strong className="font-bold text-slate-900">{totalCount}</strong> cats
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters ({activeFilterCount})</span>
          </button>
        )}
      </div>

    </div>
  );
};
