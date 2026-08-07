import React, { useState, useEffect, useMemo } from 'react';
import { StaffOperationsDashboard } from './components/StaffOperationsDashboard';
import { HeaderStats } from './components/HeaderStats';
import { FeaturedCatCard } from './components/FeaturedCatCard';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { CatGrid } from './components/CatGrid';
import { CatProfileModal } from './components/CatProfileModal';
import { CatFormModal } from './components/CatFormModal';
import { AIMatchmakerModal } from './components/AIMatchmakerModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { BirthdayBanner } from './components/BirthdayBanner';
import { BirthdayPartyModal } from './components/BirthdayPartyModal';
import { LandingPage } from './components/LandingPage';
import { WaitlistModal } from './components/WaitlistModal';

import { Cat, FilterState, AdopterProfile, MatchResult, WaitlistEntry, WaitlistStatus } from './types';
import { INITIAL_CATS } from './data/initialCats';
import { INITIAL_WAITLIST } from './data/initialWaitlist';
import { isTodayBirthday, triggerBirthdayConfetti } from './utils/birthdayUtils';
import { getCatMedicalAlert } from './utils/medicalAlertUtils';
import { exportCatsToCSV } from './utils/csvExport';
import { Sparkles, Heart, CheckCircle2, Info, RefreshCw } from 'lucide-react';

export default function App() {
  const [cats, setCats] = useState<Cat[]>(INITIAL_CATS);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    adoptionStatus: 'all',
    gender: 'all',
    ageGroup: 'all',
    medicalConcernFilter: 'all'
  });

  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [catToEdit, setCatToEdit] = useState<Cat | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [birthdayPartyCat, setBirthdayPartyCat] = useState<Cat | null>(null);

  // Waitlist State
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('neko_hub_waitlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WAITLIST;
      }
    }
    return INITIAL_WAITLIST;
  });

  const saveWaitlistState = (newList: WaitlistEntry[]) => {
    setWaitlist(newList);
    localStorage.setItem('neko_hub_waitlist', JSON.stringify(newList));
  };

  const handleAddWaitlistEntry = (newEntryData: Omit<WaitlistEntry, 'id'>, updateCatStatus = true) => {
    const newEntry: WaitlistEntry = {
      ...newEntryData,
      id: `wl-${Date.now()}`
    };

    const updatedWaitlist = [newEntry, ...waitlist];
    saveWaitlistState(updatedWaitlist);

    // Sync cat adoption status if requested
    if (updateCatStatus) {
      const targetCat = cats.find(c => c.id === newEntry.catId);
      if (targetCat) {
        let newStatus: Cat['adoptionStatus'] = 'Pending';
        if (newEntry.status === 'Reserved') newStatus = 'Reserved';
        if (newEntry.status === 'Adopted') newStatus = 'Adopted';
        if (newEntry.status === 'Waiting') newStatus = 'Pending';

        const updatedCats = cats.map(c => c.id === newEntry.catId ? { ...c, adoptionStatus: newStatus } : c);
        saveCatsState(updatedCats);
      }
    }

    showToast(`Added ${newEntry.adopterName} to waiting list for ${newEntry.catName}!`);
  };

  const handleUpdateWaitlistStatus = (id: string, newStatus: WaitlistStatus) => {
    const targetEntry = waitlist.find(w => w.id === id);
    if (!targetEntry) return;

    const updatedWaitlist = waitlist.map(w => w.id === id ? { ...w, status: newStatus } : w);
    saveWaitlistState(updatedWaitlist);

    // Sync corresponding cat status
    let catStatus: Cat['adoptionStatus'] = 'Pending';
    if (newStatus === 'Reserved') catStatus = 'Reserved';
    if (newStatus === 'Adopted') catStatus = 'Adopted';
    if (newStatus === 'Waiting') catStatus = 'Pending';
    if (newStatus === 'Cancelled') catStatus = 'Available';

    const updatedCats = cats.map(c => c.id === targetEntry.catId ? { ...c, adoptionStatus: catStatus } : c);
    saveCatsState(updatedCats);

    showToast(`Updated ${targetEntry.adopterName}'s reservation status to ${newStatus}`);
  };

  const handleDeleteWaitlistEntry = (id: string) => {
    const targetEntry = waitlist.find(w => w.id === id);
    const updated = waitlist.filter(w => w.id !== id);
    saveWaitlistState(updated);

    if (targetEntry) {
      showToast(`Removed ${targetEntry.adopterName} from waiting list.`);
    }
  };

  // Auth & Session state
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'visitor' | 'staff'; email: string } | null>(() => {
    const saved = localStorage.getItem('neko_hub_user') || localStorage.getItem('meo_hub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to default staff user
      }
    }
    return { name: 'Staff Operations Manager', role: 'staff', email: 'manager@meohub.com' };
  });

  const handleLogin = (user: { name: string; role: 'visitor' | 'staff'; email: string }) => {
    setCurrentUser(user);
    localStorage.setItem('meo_hub_user', JSON.stringify(user));
    showToast(`Welcome to Meo Hub for Meow Maison, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('meo_hub_user');
    showToast('Logged out. Returned to landing page.');
  };

  // Cats with birthdays today
  const birthdayCats = useMemo(() => {
    return cats.filter(c => isTodayBirthday(c.birthDate));
  }, [cats]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch cats from backend on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/cats');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCats(data);
          }
        }
      } catch (e) {
        console.warn('Backend server fetch fallback to local initial cats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Sync back to backend whenever cats change
  const saveCatsState = async (updatedCats: Cat[]) => {
    setCats(updatedCats);
    try {
      await fetch('/api/cats/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCats)
      });
    } catch (e) {
      console.warn('Failed to save to server:', e);
    }
  };

  // Featured cat selector
  const featuredCat = useMemo(() => {
    return cats.find((c) => c.featured) || cats[0];
  }, [cats]);

  // Filtering & Sorting Logic
  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesCategory = cat.category.toLowerCase().includes(q);
        const matchesDesc = cat.description.toLowerCase().includes(q);
        const matchesTraits = cat.personalityTraits.some((t) => t.toLowerCase().includes(q));
        const matchesMedical = cat.medicalConcerns.some((m) => m.toLowerCase().includes(q));
        const matchesPattern = cat.colorPattern?.toLowerCase().includes(q) || false;

        if (!matchesName && !matchesCategory && !matchesDesc && !matchesTraits && !matchesMedical && !matchesPattern) {
          return false;
        }
      }

      // 2. Category
      if (filters.category !== 'all' && cat.category !== filters.category) {
        return false;
      }

      // 3. Adoption Status
      if (filters.adoptionStatus !== 'all' && cat.adoptionStatus !== filters.adoptionStatus) {
        return false;
      }

      // 4. Gender
      if (filters.gender !== 'all' && cat.gender !== filters.gender) {
        return false;
      }

      // 5. Age Group
      const totalMonths = cat.ageYears * 12 + cat.ageMonths;
      if (filters.ageGroup === 'kitten' && totalMonths >= 12) return false;
      if (filters.ageGroup === 'young' && (totalMonths < 12 || totalMonths >= 36)) return false;
      if (filters.ageGroup === 'adult' && (totalMonths < 36 || totalMonths >= 84)) return false;
      if (filters.ageGroup === 'senior' && totalMonths < 84) return false;

      // 6. Medical Concern Filter
      if (filters.medicalConcernFilter === 'alertsOnly') {
        const alert = getCatMedicalAlert(cat);
        if (!alert || !alert.hasAlert) return false;
      }
      if (filters.medicalConcernFilter === 'none' && cat.medicalConcerns.length > 0) return false;
      if (filters.medicalConcernFilter === 'hasConcerns' && cat.medicalConcerns.length === 0) return false;
      if (filters.medicalConcernFilter === 'specialDiet') {
        const hasSpecialDiet = cat.medicalRecords.dietaryNotes || cat.medicalRecords.specialNeeds || cat.category === 'Special Care';
        if (!hasSpecialDiet) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'ageAsc') return (a.ageYears * 12 + a.ageMonths) - (b.ageYears * 12 + b.ageMonths);
      if (sortBy === 'ageDesc') return (b.ageYears * 12 + b.ageMonths) - (a.ageYears * 12 + a.ageMonths);
      // default: newest arrival date
      return new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime();
    });
  }, [cats, filters, sortBy]);

  // Handlers
  const handleToggleFeature = (id: string) => {
    const updated = cats.map((cat) => ({
      ...cat,
      featured: cat.id === id,
      featuredTagline: cat.id === id ? 'Featured Star Cat of the Week!' : undefined
    }));
    saveCatsState(updated);
    const target = updated.find((c) => c.id === id);
    showToast(`✨ ${target?.name || 'Cat'} is now Featured Cat of the Week!`);
  };

  const handleCycleFeatured = () => {
    const currentIndex = cats.findIndex((c) => c.id === featuredCat?.id);
    const nextIndex = (currentIndex + 1) % cats.length;
    handleToggleFeature(cats[nextIndex].id);
  };

  const handleStatusChange = (catId: string, newStatus: Cat['adoptionStatus']) => {
    const updated = cats.map((c) => (c.id === catId ? { ...c, adoptionStatus: newStatus } : c));
    saveCatsState(updated);
    if (selectedCat && selectedCat.id === catId) {
      setSelectedCat({ ...selectedCat, adoptionStatus: newStatus });
    }
    showToast(`Updated status to "${newStatus}"`);
  };

  const handleSaveCat = (catData: Partial<Cat>) => {
    let updated: Cat[];
    if (catData.id) {
      // Edit existing
      updated = cats.map((c) => (c.id === catData.id ? ({ ...c, ...catData } as Cat) : c));
      showToast(`Saved updates for ${catData.name}`);
    } else {
      // Add new
      const newCat: Cat = {
        ...(catData as Cat),
        id: `cat-${Date.now()}`,
        featured: false,
        adoptionStatus: catData.adoptionStatus || 'Available'
      };
      updated = [newCat, ...cats];
      showToast(`Added ${newCat.name} to the cafe organizer!`);
    }
    saveCatsState(updated);
    setIsAddModalOpen(false);
    setCatToEdit(null);
  };

  const handleDeleteCat = (id: string) => {
    const catToDelete = cats.find((c) => c.id === id);
    if (confirm(`Are you sure you want to delete ${catToDelete?.name || 'this cat'} from the database?`)) {
      const updated = cats.filter((c) => c.id !== id);
      saveCatsState(updated);
      if (selectedCat?.id === id) setSelectedCat(null);
      showToast(`Removed cat from catalog`);
    }
  };

  const handleResetData = () => {
    if (confirm('Reset to standard sample cafe cats dataset?')) {
      saveCatsState(INITIAL_CATS);
      showToast('Reset database to default cafe cats!');
    }
  };

  // AI Auto Enhance helper
  const handleAIEnhance = async (input: any) => {
    const res = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error('AI enhancement failed');
    return await res.json();
  };

  // AI Matchmaker helper
  const handleRunMatchmaker = async (adopterProfile: AdopterProfile): Promise<MatchResult[]> => {
    const res = await fetch('/api/ai/matchmaker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adopterProfile, cats })
    });
    if (!res.ok) throw new Error('AI matchmaker failed');
    return await res.json();
  };

  if (!currentUser) {
    return (
      <LandingPage
        cats={cats}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1ea] text-stone-900 font-sans selection:bg-[#e2cbb8]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Staff Operations Dashboard with Adopter App View */}
      <StaffOperationsDashboard
        cats={cats}
        filteredCats={filteredCats}
        filters={filters}
        setFilters={setFilters}
        waitlistCount={waitlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectCat={(cat) => setSelectedCat(cat)}
        onEditCat={(cat) => {
          setCatToEdit(cat);
          setIsAddModalOpen(true);
        }}
        onDeleteCat={handleDeleteCat}
        onOpenAddModal={() => {
          setCatToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
        onOpenWaitlist={() => setIsWaitlistModalOpen(true)}
        onOpenSheetsSync={() => setIsSheetsModalOpen(true)}
        onResetData={handleResetData}
        onOpenWaitlistForCat={(cat) => {
          setIsWaitlistModalOpen(true);
        }}
        onRunMatchmaker={handleRunMatchmaker}
      />

      {/* MODALS */}

      {/* 1. Detail Profile Modal */}
      {selectedCat && (
        <CatProfileModal
          cat={selectedCat}
          onClose={() => setSelectedCat(null)}
          onEdit={(cat) => {
            setCatToEdit(cat);
            setIsAddModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
          onEnhanceWithAI={async (cat) => {
            try {
              const enhanced = await handleAIEnhance({
                name: cat.name,
                age: `${cat.ageYears}y ${cat.ageMonths}m`,
                gender: cat.gender,
                rawNotes: cat.description,
                medicalNotes: cat.medicalConcerns.join(', '),
                traits: cat.personalityTraits
              });
              if (enhanced.enhancedDescription) {
                const updated = cats.map((c) =>
                  c.id === cat.id
                    ? {
                        ...c,
                        description: enhanced.enhancedDescription,
                        aiSummary: enhanced.aiSummary || c.aiSummary
                      }
                    : c
                );
                saveCatsState(updated);
                setSelectedCat({ ...cat, description: enhanced.enhancedDescription, aiSummary: enhanced.aiSummary });
                showToast(`AI Polished bio for ${cat.name}!`);
              }
            } catch (e) {
              showToast('AI enhancement error');
            }
          }}
        />
      )}

      {/* 2. Add / Edit Cat Form Modal */}
      {isAddModalOpen && (
        <CatFormModal
          catToEdit={catToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setCatToEdit(null);
          }}
          onSave={handleSaveCat}
          onAIAutoEnhance={handleAIEnhance}
        />
      )}

      {/* 3. AI Matchmaker Modal */}
      {isMatchmakerOpen && (
        <AIMatchmakerModal
          cats={cats}
          onClose={() => setIsMatchmakerOpen(false)}
          onSelectCat={(cat) => setSelectedCat(cat)}
          onRunMatchmaker={handleRunMatchmaker}
        />
      )}

      {/* 4. Google Sheets Sync Modal */}
      {isSheetsModalOpen && (
        <GoogleSheetsSyncModal
          cats={cats}
          onClose={() => setIsSheetsModalOpen(false)}
          onImportCats={(imported) => {
            saveCatsState(imported);
            showToast(`Imported ${imported.length} cat records!`);
          }}
        />
      )}

      {/* 5. Birthday Party Celebration Modal */}
      {birthdayPartyCat && (
        <BirthdayPartyModal
          cat={birthdayPartyCat}
          onClose={() => setBirthdayPartyCat(null)}
          onOpenProfile={(cat) => setSelectedCat(cat)}
        />
      )}

      {/* 6. Waiting List Modal */}
      {isWaitlistModalOpen && (
        <WaitlistModal
          cats={cats}
          waitlist={waitlist}
          onClose={() => setIsWaitlistModalOpen(false)}
          onAddWaitlistEntry={handleAddWaitlistEntry}
          onUpdateWaitlistStatus={handleUpdateWaitlistStatus}
          onDeleteWaitlistEntry={handleDeleteWaitlistEntry}
          onOpenCatProfile={(cat) => setSelectedCat(cat)}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 py-8 bg-white border-t border-pink-100 text-center text-xs text-slate-900 font-medium space-y-2">
        <p className="font-bold text-slate-900">Meo Hub • Cat Cafe Management System for Meow Maison Cat Cafe</p>
        <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-600 flex-wrap">
          <span><strong>Tue - Thu:</strong> 12:00 PM – 7:00 PM</span>
          <span>•</span>
          <span><strong>Fri - Sun:</strong> 11:00 AM – 7:00 PM</span>
          <span>•</span>
          <span className="text-rose-600 font-semibold">Monday Closed</span>
        </div>
      </footer>

    </div>
  );
}
