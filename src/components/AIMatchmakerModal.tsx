import React, { useState } from 'react';
import { X, Sparkles, Heart, CheckCircle2, User, Home, Dog, Cat as CatIcon, ArrowRight } from 'lucide-react';
import { Cat, AdopterProfile, MatchResult } from '../types';

interface AIMatchmakerModalProps {
  cats: Cat[];
  onClose: () => void;
  onSelectCat: (cat: Cat) => void;
  onRunMatchmaker: (profile: AdopterProfile) => Promise<MatchResult[]>;
}

export const AIMatchmakerModal: React.FC<AIMatchmakerModalProps> = ({
  cats,
  onClose,
  onSelectCat,
  onRunMatchmaker
}) => {
  const [profile, setProfile] = useState<AdopterProfile>({
    housing_type: 'Apartment',
    noise_level: 'Moderate',
    existing_pets: 'None',
    hours_away_per_day: 6,
    pet_experience: 'Intermediate',
    preferences: 'Looking for a gentle companion who fits well in my routine.'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const matchResults = await onRunMatchmaker(profile);
      setResults(matchResults);
    } catch (err) {
      console.error('Matchmaker error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-100 via-pink-100 to-sky-50 border-b border-sky-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Purrfect Match AI Matchmaker & Triage
              </h2>
              <p className="text-xs text-slate-600">
                Calculates compatibility scores, triage priority & interview flags for cafe staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-900">
          
          {/* Adopter Questionnaire */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Prospective Adopter Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Housing Type</label>
                <select
                  value={profile.housing_type || 'Apartment'}
                  onChange={(e) => setProfile({ ...profile, housing_type: e.target.value, homeType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                >
                  <option value="Studio">Studio</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Home Energy Level</label>
                <select
                  value={profile.noise_level || 'Moderate'}
                  onChange={(e) => setProfile({ ...profile, noise_level: e.target.value, activityLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                >
                  <option value="Quiet">Quiet</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Other Pets</label>
                <select
                  value={profile.existing_pets || 'None'}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfile({
                      ...profile,
                      existing_pets: val,
                      hasDogs: val.includes('Dog'),
                      hasCats: val.includes('Cat')
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                >
                  <option value="None">None</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog & Cat">Dog & Cat</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Daily Schedule (Hours Away / Day)</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={profile.hours_away_per_day || 6}
                  onChange={(e) => setProfile({ ...profile, hours_away_per_day: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Experience Level</label>
              <select
                value={profile.pet_experience || 'Intermediate'}
                onChange={(e) => setProfile({ ...profile, pet_experience: e.target.value, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
              >
                <option value="First-time owner / Beginner">First-time owner / Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Experienced / Medical special care">Experienced / Medical special care</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'AI Matchmaker Analyzing Cats & Calculating Triage...' : 'Run Purrfect Match Triage'}</span>
            </button>
          </form>

          {/* Results List */}
          {results && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>2. Match Results & Operational Triage ({results.length})</span>
                <span className="text-[11px] font-normal text-slate-500">Evaluated with system constraints & weighting</span>
              </h3>

              <div className="space-y-3">
                {results.map((res) => {
                  const cat = cats.find((c) => c.id === res.catId);
                  if (!cat) return null;

                  const isPriority1 = res.triage_priority?.includes('Priority 1');
                  const isPriority3 = res.triage_priority?.includes('Priority 3') || res.score === 0;

                  return (
                    <div
                      key={res.catId}
                      className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row items-start justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3.5 flex-1">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-sky-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                            
                            {/* Match Score */}
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                              {res.match_score ?? res.score}% Match
                            </span>

                            {/* Compatibility Tier */}
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold text-[10px]">
                              Tier: {res.compatibility_tier || 'Moderate'}
                            </span>

                            {/* Staff Triage Priority */}
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              isPriority1
                                ? 'bg-emerald-600 text-white'
                                : isPriority3
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {res.triage_priority || 'Priority 2: Standard'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-medium">
                            {cat.ageYears}y {cat.ageMonths}m • {cat.gender} • {cat.category}
                          </p>

                          {/* Match Reasoning (2 sentences) */}
                          <div className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <span className="font-bold text-slate-900 block mb-0.5">Match Rationale:</span>
                            {res.match_reasoning || (res.reasons ? res.reasons.join(' ') : 'Good fit for profile.')}
                          </div>

                          {/* Flagged Notes for Staff */}
                          {res.flagged_notes_for_staff && (
                            <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-start space-x-1.5">
                              <span>⚠️</span>
                              <span><strong>Staff Flag:</strong> {res.flagged_notes_for_staff}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectCat(cat);
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 flex-shrink-0 self-end md:self-center cursor-pointer"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
