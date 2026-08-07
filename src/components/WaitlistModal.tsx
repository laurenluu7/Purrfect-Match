import React, { useState } from 'react';
import { 
  X, UserPlus, Search, Filter, Phone, Mail, Calendar, Cat as CatIcon, 
  CheckCircle2, Clock, AlertCircle, Heart, Trash2, Edit3, Sparkles, 
  ChevronRight, ShieldCheck, Tag, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cat, WaitlistEntry, WaitlistStatus, AdoptionStatus } from '../types';

interface WaitlistModalProps {
  cats: Cat[];
  waitlist: WaitlistEntry[];
  onClose: () => void;
  onAddWaitlistEntry: (entry: Omit<WaitlistEntry, 'id'>, updateCatStatus?: boolean) => void;
  onUpdateWaitlistStatus: (id: string, newStatus: WaitlistStatus) => void;
  onDeleteWaitlistEntry: (id: string) => void;
  onOpenCatProfile?: (cat: Cat) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  cats,
  waitlist,
  onClose,
  onAddWaitlistEntry,
  onUpdateWaitlistStatus,
  onDeleteWaitlistEntry,
  onOpenCatProfile
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New entry form state
  const [selectedCatId, setSelectedCatId] = useState<string>(cats[0]?.id || '');
  const [adopterName, setAdopterName] = useState('');
  const [adopterEmail, setAdopterEmail] = useState('');
  const [adopterPhone, setAdopterPhone] = useState('');
  const [entryStatus, setEntryStatus] = useState<WaitlistStatus>('Reserved');
  const [homeDetails, setHomeDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered waitlist items
  const filteredList = waitlist.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = 
      item.catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.adopterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.adopterEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adopterName.trim()) {
      setFormError('Please enter adopter name');
      return;
    }
    if (!adopterEmail.trim()) {
      setFormError('Please enter adopter contact email');
      return;
    }

    const selectedCat = cats.find(c => c.id === selectedCatId);
    const catName = selectedCat ? selectedCat.name : 'Unknown Cat';

    const todayStr = new Date().toISOString().split('T')[0];

    onAddWaitlistEntry({
      catId: selectedCatId,
      catName,
      adopterName: adopterName.trim(),
      adopterEmail: adopterEmail.trim(),
      adopterPhone: adopterPhone.trim() || undefined,
      requestedDate: todayStr,
      status: entryStatus,
      homeDetails: homeDetails.trim() || undefined,
      notes: notes.trim() || undefined
    }, true);

    // Reset form
    setAdopterName('');
    setAdopterEmail('');
    setAdopterPhone('');
    setHomeDetails('');
    setNotes('');
    setIsAddingNew(false);
    setFormError(null);
  };

  const getStatusBadge = (status: WaitlistStatus) => {
    switch (status) {
      case 'Reserved':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Adopted':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Waiting':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30">
              <UserPlus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight">Adoption Waiting & Reservation List</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-900 text-[10px] font-black uppercase">
                  {waitlist.length} Records
                </span>
              </div>
              <p className="text-xs text-pink-100 font-medium">
                Flag cats as Reserved or Adopted and manage linked adopter contact information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-pink-50/60 border-b border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cat or adopter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-pink-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'waiting', 'reserved', 'adopted', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-pink-500 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingNew ? 'Close Form' : 'Reserve Cat for Adopter'}</span>
          </button>

        </div>

        {/* Expandable Add New Reservation Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateEntry}
              className="bg-gradient-to-r from-pink-50/90 to-sky-50/90 border-b border-pink-200 p-5 space-y-4 text-left overflow-hidden flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-pink-600" />
                  <span>Link Cat Reservation or Adoption Record</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">Updates cat status automatically</span>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Select Cat</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-bold text-slate-900 outline-none focus:border-pink-400"
                  >
                    {cats.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.adoptionStatus})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Adopter Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lauren Smith"
                    value={adopterName}
                    onChange={(e) => setAdopterName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Status Flag</label>
                  <select
                    value={entryStatus}
                    onChange={(e) => setEntryStatus(e.target.value as WaitlistStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-bold text-slate-900 outline-none focus:border-pink-400"
                  >
                    <option value="Reserved">🔒 Reserved for Adopter</option>
                    <option value="Adopted">🏠 Adopted (Completed)</option>
                    <option value="Waiting">📋 Waiting List Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Adopter Email *</label>
                  <input
                    type="email"
                    placeholder="adopter@example.com"
                    value={adopterEmail}
                    onChange={(e) => setAdopterEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="(555) 000-0000"
                    value={adopterPhone}
                    onChange={(e) => setAdopterPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Home & Living Details</label>
                  <input
                    type="text"
                    placeholder="e.g. House with yard, no other pets"
                    value={homeDetails}
                    onChange={(e) => setHomeDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Shelter / Staff Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Deposit paid, scheduled pickup for Saturday"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Reservation & Link Adopter</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Content Body List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
              <CatIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">No matching waiting list records found.</p>
              <p className="text-xs text-slate-400">Click &quot;Reserve Cat for Adopter&quot; above to link a prospective owner.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredList.map((entry) => {
                const linkedCat = cats.find(c => c.id === entry.catId);

                return (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl border border-pink-100/90 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Linked Cat & Adopter info */}
                    <div className="flex items-start space-x-3.5">
                      {/* Cat Avatar */}
                      <div
                        onClick={() => linkedCat && onOpenCatProfile && onOpenCatProfile(linkedCat)}
                        className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-pink-200 flex-shrink-0 bg-pink-50 cursor-pointer group"
                        title="Click to view cat profile"
                      >
                        {linkedCat ? (
                          <img
                            src={linkedCat.imageUrl}
                            alt={linkedCat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pink-400">
                            <CatIcon className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center font-bold truncate">
                          {entry.catName}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-sm">{entry.adopterName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusBadge(entry.status)}`}>
                            {entry.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-600 font-medium flex-wrap gap-y-1">
                          <span className="flex items-center space-x-1">
                            <CatIcon className="w-3.5 h-3.5 text-pink-500" />
                            <span>Reserved Cat: <strong className="text-slate-900">{entry.catName}</strong></span>
                          </span>

                          <span className="flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-sky-500" />
                            <a href={`mailto:${entry.adopterEmail}`} className="hover:underline text-slate-800 font-semibold">{entry.adopterEmail}</a>
                          </span>

                          {entry.adopterPhone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{entry.adopterPhone}</span>
                            </span>
                          )}
                        </div>

                        {entry.homeDetails && (
                          <div className="text-[11px] text-slate-500 font-medium italic">
                            🏡 Home: {entry.homeDetails}
                          </div>
                        )}

                        {entry.notes && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                            📝 <strong>Staff Note:</strong> {entry.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Quick Status Changer & Controls */}
                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      
                      <select
                        value={entry.status}
                        onChange={(e) => onUpdateWaitlistStatus(entry.id, e.target.value as WaitlistStatus)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 outline-none cursor-pointer"
                      >
                        <option value="Reserved">🔒 Reserved</option>
                        <option value="Adopted">🏠 Adopted</option>
                        <option value="Waiting">📋 Waiting</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>

                      {linkedCat && onOpenCatProfile && (
                        <button
                          onClick={() => onOpenCatProfile(linkedCat)}
                          className="p-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition-colors cursor-pointer"
                          title="View Cat Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteWaitlistEntry(entry.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Waitlist Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500 font-medium flex-shrink-0">
          <span>Linked entries update cat status badges in real-time</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
