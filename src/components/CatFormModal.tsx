import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Plus, Trash2, Camera, Heart, ShieldAlert, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { Cat, CatCategory, AdoptionStatus, Gender } from '../types';

interface CatFormModalProps {
  catToEdit?: Cat | null;
  onClose: () => void;
  onSave: (catData: Partial<Cat>) => void;
  onAIAutoEnhance?: (input: any) => Promise<any>;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=800'
];

export const CatFormModal: React.FC<CatFormModalProps> = ({
  catToEdit,
  onClose,
  onSave,
  onAIAutoEnhance
}) => {
  const [name, setName] = useState(catToEdit?.name || '');
  const [ageYears, setAgeYears] = useState(catToEdit?.ageYears || 1);
  const [ageMonths, setAgeMonths] = useState(catToEdit?.ageMonths || 0);
  const [birthDate, setBirthDate] = useState(catToEdit?.birthDate || '');
  const [gender, setGender] = useState<Gender>(catToEdit?.gender || 'Female');
  const [category, setCategory] = useState<CatCategory>(catToEdit?.category || 'Lap Cats');
  const [adoptionStatus, setAdoptionStatus] = useState<AdoptionStatus>(catToEdit?.adoptionStatus || 'Available');
  const [arrivalDate, setArrivalDate] = useState(catToEdit?.arrivalDate || new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState(catToEdit?.imageUrl || PRESET_IMAGES[0]);
  const [description, setDescription] = useState(catToEdit?.description || '');
  const [colorPattern, setColorPattern] = useState(catToEdit?.colorPattern || '');
  const [featuredTagline, setFeaturedTagline] = useState(catToEdit?.featuredTagline || '');

  // Personality traits
  const [traits, setTraits] = useState<string[]>(catToEdit?.personalityTraits || ['Friendly', 'Cuddle Bug']);
  const [newTrait, setNewTrait] = useState('');

  // Medical Concerns
  const [medicalConcerns, setMedicalConcerns] = useState<string[]>(catToEdit?.medicalConcerns || []);
  const [newMedicalConcern, setNewMedicalConcern] = useState('');

  // Medical Records
  const [vaccinationsUpToDate, setVaccinationsUpToDate] = useState(catToEdit?.medicalRecords?.vaccinationsUpToDate ?? true);
  const [spayedNeutered, setSpayedNeutered] = useState(catToEdit?.medicalRecords?.spayedNeutered ?? true);
  const [microchipped, setMicrochipped] = useState(catToEdit?.medicalRecords?.microchipped ?? true);
  const [lastCheckupDate, setLastCheckupDate] = useState(catToEdit?.medicalRecords?.lastCheckupDate || new Date().toISOString().split('T')[0]);
  const [dietaryNotes, setDietaryNotes] = useState(catToEdit?.medicalRecords?.dietaryNotes || '');
  const [specialNeeds, setSpecialNeeds] = useState(catToEdit?.medicalRecords?.specialNeeds || '');
  const [fivFelvStatus, setFivFelvStatus] = useState(catToEdit?.medicalRecords?.fivFelvStatus || 'Tested Clear');
  const [medicationSchedule, setMedicationSchedule] = useState(catToEdit?.medicalRecords?.medicationSchedule || '');
  const [upcomingMedicalNeeds, setUpcomingMedicalNeeds] = useState(catToEdit?.medicalRecords?.upcomingMedicalNeeds || '');

  // Active Medical Alert state
  const [hasAlert, setHasAlert] = useState(catToEdit?.medicalRecords?.medicalAlert?.hasAlert ?? false);
  const [alertLevel, setAlertLevel] = useState<'urgent' | 'warning' | 'info'>(catToEdit?.medicalRecords?.medicalAlert?.level || 'warning');
  const [alertTitle, setAlertTitle] = useState(catToEdit?.medicalRecords?.medicalAlert?.title || '');
  const [alertDetails, setAlertDetails] = useState(catToEdit?.medicalRecords?.medicalAlert?.details || '');
  const [alertDueDate, setAlertDueDate] = useState(catToEdit?.medicalRecords?.medicalAlert?.dueDate || '');

  // Compatibility
  const [goodWithKids, setGoodWithKids] = useState(catToEdit?.goodWith?.kids ?? true);
  const [goodWithDogs, setGoodWithDogs] = useState(catToEdit?.goodWith?.dogs ?? false);
  const [goodWithCats, setGoodWithCats] = useState(catToEdit?.goodWith?.otherCats ?? true);

  // AI Loading State
  const [aiLoading, setAiLoading] = useState(false);

  // File Upload & Drag-and-Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddTrait = () => {
    if (newTrait.trim() && !traits.includes(newTrait.trim())) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };

  const handleAddMedicalConcern = () => {
    if (newMedicalConcern.trim() && !medicalConcerns.includes(newMedicalConcern.trim())) {
      setMedicalConcerns([...medicalConcerns, newMedicalConcern.trim()]);
      setNewMedicalConcern('');
    }
  };

  const handleRemoveMedicalConcern = (item: string) => {
    setMedicalConcerns(medicalConcerns.filter(m => m !== item));
  };

  const handleAutoEnhanceWithAI = async () => {
    if (!onAIAutoEnhance) return;
    setAiLoading(true);
    try {
      const res = await onAIAutoEnhance({
        name,
        age: `${ageYears}y ${ageMonths}m`,
        gender,
        rawNotes: description || 'Friendly cat at the cafe',
        medicalNotes: medicalConcerns.join(', '),
        traits: traits.join(', ')
      });

      if (res) {
        if (res.enhancedDescription) setDescription(res.enhancedDescription);
        if (res.suggestedCategory) setCategory(res.suggestedCategory);
        if (Array.isArray(res.personalityTraits) && res.personalityTraits.length > 0) setTraits(res.personalityTraits);
        if (res.featuredTagline) setFeaturedTagline(res.featuredTagline);
      }
    } catch (e) {
      console.error('AI Enhance error:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: catToEdit?.id,
      name,
      ageYears: Number(ageYears),
      ageMonths: Number(ageMonths),
      gender,
      birthDate,
      category,
      adoptionStatus,
      arrivalDate,
      imageUrl,
      description,
      colorPattern,
      featuredTagline,
      personalityTraits: traits,
      medicalConcerns,
      medicalRecords: {
        vaccinationsUpToDate,
        spayedNeutered,
        microchipped,
        lastCheckupDate,
        dietaryNotes,
        specialNeeds,
        fivFelvStatus: fivFelvStatus as any,
        medicationSchedule,
        upcomingMedicalNeeds,
        medicalAlert: hasAlert ? {
          hasAlert: true,
          level: alertLevel,
          title: alertTitle || 'Medical Alert',
          details: alertDetails,
          dueDate: alertDueDate
        } : undefined
      },
      goodWith: {
        kids: goodWithKids,
        dogs: goodWithDogs,
        otherCats: goodWithCats
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-100 via-sky-50 to-pink-50 border-b border-pink-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {catToEdit ? `Edit Cat Profile: ${catToEdit.name}` : 'Add New Cafe Cat'}
            </h2>
            <p className="text-xs text-slate-600">
              Fill in adoption details, medical history, and personality notes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-900">
          
          {/* AI Auto-Fill Helper Banner */}
          <div className="p-3.5 bg-gradient-to-r from-sky-50 to-pink-50 rounded-2xl border border-sky-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>AI Profile Enhancer</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Type rough notes below and click Auto-Enhance to polish bios & personality tags!
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoEnhanceWithAI}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center space-x-1 shadow-xs disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Enhancing...' : 'Auto-Enhance'}</span>
            </button>
          </div>

          {/* Core Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block font-bold text-slate-900 mb-1">Cat Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mochi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-pink-400 font-semibold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Age (Years & Months)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
                  placeholder="Years"
                />
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
                  placeholder="Months"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-900">Birth Date (Birthday 🎂)</label>
                <button
                  type="button"
                  onClick={() => setBirthDate(new Date().toISOString().split('T')[0])}
                  className="text-[10px] font-bold text-pink-600 hover:text-pink-800 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 cursor-pointer"
                >
                  🎂 Set to Today
                </button>
              </div>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Arrival Date</label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Cafe Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CatCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none"
              >
                <option value="Lap Cats">Lap Cats</option>
                <option value="Playful Energetic">Playful Energetic</option>
                <option value="Lounge Lovers">Lounge Lovers</option>
                <option value="Quiet & Shy">Quiet & Shy</option>
                <option value="Special Care">Special Care</option>
                <option value="Kittens">Kittens</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Adoption Status</label>
              <select
                value={adoptionStatus}
                onChange={(e) => setAdoptionStatus(e.target.value as AdoptionStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none"
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Reserved">Reserved</option>
                <option value="Adopted">Adopted</option>
                <option value="Foster">Foster</option>
              </select>
            </div>

          </div>

          {/* Cat Photo Upload & Selection */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900">
              Cat Photo Upload *
            </label>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                isDragging
                  ? 'border-pink-500 bg-pink-50/80 scale-[0.99]'
                  : 'border-pink-200 bg-slate-50/70 hover:bg-pink-50/40 hover:border-pink-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Cat preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Photo Loaded</span>
                      </span>
                      {imageUrl.startsWith('data:') && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800">
                          Uploaded File
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      Click or drag a new image file here to replace this photo.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Different File</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Drag & drop a cat photo here, or <span className="text-pink-600 underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WEBP, and GIF files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Image URL input */}
            <div className="pt-1">
              <details className="group">
                <summary className="text-[11px] font-bold text-slate-600 cursor-pointer hover:text-pink-600 flex items-center space-x-1 select-none">
                  <span>Or enter a web photo URL / choose preset</span>
                </summary>
                <div className="mt-2 space-y-2 pt-1 border-t border-slate-100">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 outline-none text-xs"
                  />
                  <div className="flex items-center space-x-2 overflow-x-auto py-1">
                    <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Presets:</span>
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(img)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          imageUrl === img ? 'border-pink-500 ring-2 ring-pink-200 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">Personality Traits</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="e.g. Purr Machine, High Energy"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTrait(); } }}
              />
              <button
                type="button"
                onClick={handleAddTrait}
                className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-800 font-bold hover:bg-pink-200"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {traits.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-pink-50 text-slate-900 font-semibold border border-pink-200 flex items-center space-x-1">
                  <span>✨ {t}</span>
                  <button type="button" onClick={() => handleRemoveTrait(t)} className="text-pink-600 hover:text-pink-900 ml-1">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">Cat Bio & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe their story, cafe behavior, cuddliness, or quirks..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-900 outline-none leading-relaxed"
            />
          </div>

          {/* Medical Concerns Section */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Medical & Care Records
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vaccinationsUpToDate}
                  onChange={(e) => setVaccinationsUpToDate(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-300"
                />
                <span className="font-semibold text-slate-900">Vaccinated</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spayedNeutered}
                  onChange={(e) => setSpayedNeutered(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-300"
                />
                <span className="font-semibold text-slate-900">Spayed/Neutered</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={microchipped}
                  onChange={(e) => setMicrochipped(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-300"
                />
                <span className="font-semibold text-slate-900">Microchipped</span>
              </label>

              <div>
                <select
                  value={fivFelvStatus}
                  onChange={(e) => setFivFelvStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none"
                >
                  <option value="Tested Clear">Tested Clear</option>
                  <option value="FIV Positive">FIV Positive</option>
                  <option value="FeLV Positive">FeLV Positive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Medical Notices / Concerns Tags</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newMedicalConcern}
                  onChange={(e) => setNewMedicalConcern(e.target.value)}
                  placeholder="e.g. Sensitive Stomach, Joint Supplement"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddMedicalConcern}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 font-bold hover:bg-rose-200"
                >
                  + Add Concern
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {medicalConcerns.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-900 font-semibold border border-rose-200 flex items-center space-x-1">
                    <span>⚠ {m}</span>
                    <button type="button" onClick={() => handleRemoveMedicalConcern(m)} className="text-rose-600 hover:text-rose-900 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Dietary & Feeding Instructions</label>
              <input
                type="text"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                placeholder="e.g. Wet food twice daily, grain free"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Medication Schedule</label>
                <input
                  type="text"
                  value={medicationSchedule}
                  onChange={(e) => setMedicationSchedule(e.target.value)}
                  placeholder="e.g. Immune chew daily @ 9 AM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Upcoming Medical Need</label>
                <input
                  type="text"
                  value={upcomingMedicalNeeds}
                  onChange={(e) => setUpcomingMedicalNeeds(e.target.value)}
                  placeholder="e.g. Dental scaling due Aug 12"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Medical Alert Warning Badge Configurator */}
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAlert}
                  onChange={(e) => {
                    setHasAlert(e.target.checked);
                    if (e.target.checked && !alertTitle) {
                      setAlertTitle(medicationSchedule || upcomingMedicalNeeds || 'Medication / Care Alert');
                    }
                  }}
                  className="rounded text-amber-600 focus:ring-amber-400 w-4 h-4"
                />
                <span className="font-extrabold text-amber-950 text-xs flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Highlight with 'Medical Alert' Warning Badge on Profile Card</span>
                </span>
              </label>

              {hasAlert && (
                <div className="space-y-3 pt-2 border-t border-amber-200/80 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Alert Severity</label>
                      <select
                        value={alertLevel}
                        onChange={(e) => setAlertLevel(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 outline-none"
                      >
                        <option value="urgent">🚨 Urgent (Rose)</option>
                        <option value="warning">⚠️ Warning (Amber)</option>
                        <option value="info">ℹ️ Care Notice (Sky)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Alert Title *</label>
                      <input
                        type="text"
                        value={alertTitle}
                        onChange={(e) => setAlertTitle(e.target.value)}
                        placeholder="e.g. Daily Medication"
                        className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Due Date / Frequency</label>
                      <input
                        type="text"
                        value={alertDueDate}
                        onChange={(e) => setAlertDueDate(e.target.value)}
                        placeholder="e.g. Aug 15 or Daily @ 9 AM"
                        className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Alert Instructions / Details</label>
                    <input
                      type="text"
                      value={alertDetails}
                      onChange={(e) => setAlertDetails(e.target.value)}
                      placeholder="e.g. Administer 1 chew with morning wet food before cafe opens"
                      className="w-full p-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compatibility */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Home Compatibility
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goodWithKids}
                  onChange={(e) => setGoodWithKids(e.target.checked)}
                  className="rounded text-pink-500"
                />
                <span className="font-semibold text-slate-900">Good with Kids</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goodWithDogs}
                  onChange={(e) => setGoodWithDogs(e.target.checked)}
                  className="rounded text-pink-500"
                />
                <span className="font-semibold text-slate-900">Good with Dogs</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goodWithCats}
                  onChange={(e) => setGoodWithCats(e.target.checked)}
                  className="rounded text-pink-500"
                />
                <span className="font-semibold text-slate-900">Good with Cats</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-pink-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-xs transition-all"
            >
              {catToEdit ? 'Save Changes' : 'Create Cat Profile'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
