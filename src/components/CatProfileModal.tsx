import React, { useState } from 'react';
import { 
  X, Heart, Calendar, ShieldCheck, ShieldAlert, Sparkles, User, Check, AlertCircle, 
  Edit, Printer, FileText, Activity, Camera, Upload, Clock, Plus, Tag, Stethoscope, 
  Award, ArrowUpDown, Trash2, CheckCircle2, ChevronDown, ChevronUp, Filter, Info,
  Cake, PartyPopper, AlertTriangle, Pill
} from 'lucide-react';
import { Cat, TimelineEvent, TimelineEventType, AdoptionStatus } from '../types';
import { isTodayBirthday, triggerBirthdayConfetti, formatBirthdayDisplay } from '../utils/birthdayUtils';
import { getCatMedicalAlert } from '../utils/medicalAlertUtils';

interface CatProfileModalProps {
  cat: Cat;
  onClose: () => void;
  onEdit: (cat: Cat) => void;
  onStatusChange: (catId: string, status: Cat['adoptionStatus']) => void;
  onEnhanceWithAI: (cat: Cat) => void;
}

function generateDefaultTimeline(cat: Cat): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    id: `intake-${cat.id}`,
    date: cat.arrivalDate,
    title: 'Cafe Intake & Arrival Screening',
    type: 'intake',
    description: `${cat.name} officially entered Neko Hub Cat Cafe. Initial health screening, microchip audit, and assignment to '${cat.category}' group completed.`,
    author: 'Intake Coordinator'
  });

  const vaxDate = new Date(cat.arrivalDate);
  vaxDate.setDate(vaxDate.getDate() + 2);
  events.push({
    id: `vax-${cat.id}`,
    date: vaxDate.toISOString().split('T')[0],
    title: 'Vaccinations & Microchip Verification',
    type: 'medical_note',
    description: cat.medicalRecords.vaccinationsUpToDate
      ? 'FVRCP & Rabies vaccinations confirmed up to date. Microchip registry verified in sanctuary database.'
      : 'Initial booster vaccinations administered. Microchip pending registration.',
    author: 'Dr. Sarah (Staff Vet)'
  });

  if (cat.medicalRecords.dietaryNotes || cat.medicalRecords.specialNeeds || cat.medicalConcerns.length > 0) {
    const medDate = new Date(cat.arrivalDate);
    medDate.setDate(medDate.getDate() + 5);
    const details = [
      cat.medicalRecords.dietaryNotes ? `Diet: ${cat.medicalRecords.dietaryNotes}` : null,
      cat.medicalRecords.specialNeeds ? `Special Care: ${cat.medicalRecords.specialNeeds}` : null,
      cat.medicalConcerns.length > 0 ? `Active Notices: ${cat.medicalConcerns.join(', ')}` : null
    ].filter(Boolean).join('. ');

    events.push({
      id: `med-${cat.id}`,
      date: medDate.toISOString().split('T')[0],
      title: 'Medical & Dietary Plan Established',
      type: 'medical_note',
      description: details,
      author: 'Veterinary Care Team'
    });
  }

  if (cat.medicalRecords.lastCheckupDate) {
    events.push({
      id: `checkup-${cat.id}`,
      date: cat.medicalRecords.lastCheckupDate,
      title: 'Routine Comprehensive Vet Examination',
      type: 'checkup',
      description: `Wellness exam completed. Dental, cardiopulmonary, and weight metrics evaluated. FIV/FeLV Status: ${cat.medicalRecords.fivFelvStatus || 'Tested Clear'}.`,
      author: 'Dr. Alex (Visiting Vet)'
    });
  }

  if (cat.featured) {
    events.push({
      id: `featured-${cat.id}`,
      date: '2026-07-01',
      title: 'Designated as Featured Star Cat',
      type: 'milestone',
      description: cat.featuredTagline || `${cat.name} was selected as a featured star in the cafe lobby display!`,
      author: 'Cafe Lounge Manager'
    });
  }

  events.push({
    id: `status-${cat.id}`,
    date: '2026-07-28',
    title: `Current Adoption Status: ${cat.adoptionStatus}`,
    type: 'status_change',
    statusTag: cat.adoptionStatus,
    description: cat.adoptionStatus === 'Available'
      ? `${cat.name} is ready for adoption meetings in the main lounge.`
      : cat.adoptionStatus === 'Pending'
      ? `Adoption application received and currently undergoing background review.`
      : cat.adoptionStatus === 'Adopted'
      ? `Adoption finalized! Transfer of ownership and care records completed.`
      : `${cat.name} is currently resting in temporary foster care.`,
    author: 'Adoption Coordinator'
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const CatProfileModal: React.FC<CatProfileModalProps> = ({
  cat,
  onClose,
  onEdit,
  onStatusChange,
  onEnhanceWithAI
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'timeline'>('overview');
  const medicalAlert = getCatMedicalAlert(cat);

  // Calculate days at cafe
  const arrival = new Date(cat.arrivalDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - arrival.getTime()) / (1000 * 3600 * 24));

  // Timeline State
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    return cat.timelineEvents && cat.timelineEvents.length > 0
      ? cat.timelineEvents
      : generateDefaultTimeline(cat);
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Event Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<TimelineEventType>('medical_note');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newAuthor, setNewAuthor] = useState('Staff Member');
  const [newDescription, setNewDescription] = useState('');
  const [newStatusTag, setNewStatusTag] = useState<AdoptionStatus>(cat.adoptionStatus);

  const handlePrint = () => {
    window.print();
  };

  const handleHeaderStatusChange = (newStatus: AdoptionStatus) => {
    onStatusChange(cat.id, newStatus);

    const statusEvent: TimelineEvent = {
      id: `status-change-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: `Adoption Status Updated to '${newStatus}'`,
      type: 'status_change',
      statusTag: newStatus,
      description: `Status changed from '${cat.adoptionStatus}' to '${newStatus}' in cafe database records.`,
      author: 'Cafe Administrator'
    };

    const updatedEvents = [statusEvent, ...events];
    setEvents(updatedEvents);
    onEdit({ ...cat, adoptionStatus: newStatus, timelineEvents: updatedEvents });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please enter both a title and description for the record.');
      return;
    }

    const newEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date: newDate || new Date().toISOString().split('T')[0],
      title: newTitle.trim(),
      type: newType,
      description: newDescription.trim(),
      author: newAuthor.trim() || 'Staff Member',
      statusTag: newType === 'status_change' ? newStatusTag : undefined
    };

    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    onEdit({ ...cat, timelineEvents: updatedEvents });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this timeline event?')) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      setEvents(updatedEvents);
      onEdit({ ...cat, timelineEvents: updatedEvents });
    }
  };

  const filteredEvents = events
    .filter((evt) => (filterType === 'all' ? true : evt.type === filterType))
    .sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === 'desc' ? diff : -diff;
    });

  const getEventTypeBadge = (type: TimelineEventType) => {
    switch (type) {
      case 'status_change':
        return { label: 'Status Update', color: 'bg-indigo-100 text-indigo-900 border-indigo-200', icon: Tag };
      case 'medical_note':
        return { label: 'Medical Note', color: 'bg-rose-100 text-rose-900 border-rose-200', icon: Stethoscope };
      case 'checkup':
        return { label: 'Routine Exam', color: 'bg-sky-100 text-sky-900 border-sky-200', icon: Activity };
      case 'intake':
        return { label: 'Intake / Screening', color: 'bg-purple-100 text-purple-900 border-purple-200', icon: Heart };
      case 'milestone':
        return { label: 'Milestone', color: 'bg-amber-100 text-amber-900 border-amber-200', icon: Award };
      default:
        return { label: 'General Log', color: 'bg-slate-100 text-slate-900 border-slate-200', icon: FileText };
    }
  };

  const getStatusTagColor = (status?: AdoptionStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Adopted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Foster': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Hidden Printer-Friendly Profile Container for window.print() */}
      <div id="printable-cat-profile" className="hidden print:block text-slate-900 bg-white font-sans text-xs p-6 space-y-6">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
              <span>🐾 Meow Maison Cat Cafe • Meo Hub</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Official Cat Profile & Medical Record Summary Sheet
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <div>Printed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="font-bold text-slate-700 mt-1">Status: {cat.adoptionStatus}</div>
          </div>
        </div>

        {/* Primary Info Header Grid */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300">
          <div className="col-span-1">
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-36 object-cover rounded-lg border border-slate-300"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <div className="flex justify-between items-baseline">
              <h1 className="text-2xl font-black text-slate-900">{cat.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                {cat.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
              <div><span className="font-bold">Age:</span> {cat.ageYears} yrs {cat.ageMonths} mos</div>
              <div><span className="font-bold">Gender:</span> {cat.gender}</div>
              <div><span className="font-bold">Breed / Color:</span> {cat.colorPattern || cat.breed || 'Domestic'}</div>
              <div><span className="font-bold">Intake Date:</span> {cat.arrivalDate} ({diffDays} days)</div>
              <div><span className="font-bold">Status:</span> {cat.adoptionStatus}</div>
              <div><span className="font-bold">Featured:</span> {cat.featured ? 'Yes' : 'No'}</div>
            </div>
            {cat.aiSummary && (
              <div className="mt-2 text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                "{cat.aiSummary}"
              </div>
            )}
          </div>
        </div>

        {/* Personality & Story */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Personality & Behavioral Overview
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            {cat.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="font-bold text-xs mr-1 text-slate-700">Traits:</span>
            {cat.personalityTraits.map((trait, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold">
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Home Compatibility */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Home Environment Compatibility
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Good with Kids</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.goodWith.kids ? '✓ Recommended' : '✗ Adults / Older Only'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Good with Dogs</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.goodWith.dogs ? '✓ Dog Friendly' : '✗ No Dogs'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Good with Cats</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.goodWith.otherCats ? '✓ Cat Friendly' : '✗ Solo Cat Preferred'}
              </div>
            </div>
          </div>
        </div>

        {/* Medical & Health Records */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Medical & Medical History Verification
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2 rounded border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Vaccines</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.medicalRecords.vaccinationsUpToDate ? '✓ Up to Date' : '⚠ Pending'}
              </div>
            </div>
            <div className="p-2 rounded border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Spay/Neuter</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.medicalRecords.spayedNeutered ? '✓ Complete' : '⚠ Scheduled'}
              </div>
            </div>
            <div className="p-2 rounded border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Microchipped</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.medicalRecords.microchipped ? '✓ Microchipped' : '⚠ Pending'}
              </div>
            </div>
            <div className="p-2 rounded border border-slate-300 text-center bg-slate-50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">FIV / FeLV</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {cat.medicalRecords.fivFelvStatus || 'Clear'}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 space-y-1 text-xs">
            <div><span className="font-bold">Last Veterinary Examination:</span> {cat.medicalRecords.lastCheckupDate}</div>
            <div><span className="font-bold">Dietary & Feeding Protocol:</span> {cat.medicalRecords.dietaryNotes || 'Standard cafe premium cat diet'}</div>
            {cat.medicalRecords.specialNeeds && (
              <div><span className="font-bold text-rose-800">Special Medical Care:</span> {cat.medicalRecords.specialNeeds}</div>
            )}
            {cat.medicalConcerns.length > 0 && (
              <div><span className="font-bold text-rose-800">Active Medical Notices:</span> {cat.medicalConcerns.join(', ')}</div>
            )}
          </div>
        </div>

        {/* Cafe Logistics & Verification Signatures */}
        <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-6 text-[11px] text-slate-700">
          <div>
            <div className="font-bold text-slate-900 mb-6">Cafe / Shelter Representative Signature</div>
            <div className="border-b border-slate-400 pb-1">Signature: ___________________________</div>
            <div className="mt-1">Date: ________________________</div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-6">Adopter / Recipient Acknowledgment</div>
            <div className="border-b border-slate-400 pb-1">Signature: ___________________________</div>
            <div className="mt-1">Date: ________________________</div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
          Meow Maison Cat Cafe AI Adoption Organizer • Official Summary Document • Confidential Animal Record
        </div>
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="relative h-64 bg-slate-900 flex-shrink-0">
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="w-full h-full object-cover object-center opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors border border-white/20 z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges & Action Buttons */}
          <div className="absolute top-3 left-3 right-14 flex flex-wrap items-center gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
              {cat.category}
            </span>
            {medicalAlert && medicalAlert.hasAlert && (
              <span
                onClick={() => setActiveTab('medical')}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold text-white backdrop-blur-md shadow-md border flex items-center space-x-1 cursor-pointer animate-pulse ${
                  medicalAlert.level === 'urgent'
                    ? 'bg-rose-600/95 border-rose-300'
                    : medicalAlert.level === 'warning'
                    ? 'bg-amber-600/95 border-amber-300'
                    : 'bg-sky-600/95 border-sky-300'
                }`}
                title="Click to view medical alert details"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                <span>Medical Alert: {medicalAlert.title}</span>
              </span>
            )}
            {cat.featured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                ★ Featured
              </span>
            )}
            {isTodayBirthday(cat.birthDate) && (
              <button
                onClick={() => triggerBirthdayConfetti()}
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-md flex items-center space-x-1 animate-pulse cursor-pointer"
              >
                <Cake className="w-3.5 h-3.5 text-amber-200" />
                <span>Birthday! 🥳</span>
              </button>
            )}
            <button
              onClick={() => {
                onEdit(cat);
                onClose();
              }}
              className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white backdrop-blur-md shadow-xs flex items-center space-x-1 transition-all cursor-pointer"
              title="Upload new photo for this cat"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md shadow-xs flex items-center space-x-1 transition-all cursor-pointer"
              title="Print simplified printer-friendly profile summary sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print</span>
            </button>
          </div>

          {/* Cat Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                {cat.name}
              </h2>
              <p className="text-xs text-pink-200 font-medium">
                {cat.ageYears} Years {cat.ageMonths} Months • {cat.gender} • {cat.colorPattern || 'Domestic Short Hair'}
              </p>
            </div>

            {/* Quick Status Picker */}
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30">
              <span className="text-[11px] font-semibold text-white px-2">Status:</span>
              <select
                value={cat.adoptionStatus}
                onChange={(e) => onStatusChange(cat.id, e.target.value as Cat['adoptionStatus'])}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-xl outline-none border border-white/20 cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Reserved">Reserved</option>
                <option value="Adopted">Adopted</option>
                <option value="Foster">Foster</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-pink-100 bg-pink-50/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-pink-500 text-pink-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Bio
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'medical'
                ? 'border-pink-500 text-pink-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Medical & Health Records
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-pink-500 text-pink-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Cafe Stay & Logistics
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-900">
          
          {/* TAB 1: OVERVIEW & BIO */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              
              {/* Bio Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Personality & Story
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {cat.description}
                </p>
              </div>

              {/* AI Insight Summary */}
              {cat.aiSummary && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-sky-900">AI Coordinator Adoption Insight</h4>
                    <p className="text-xs text-slate-900 mt-0.5">{cat.aiSummary}</p>
                  </div>
                </div>
              )}

              {/* Personality Traits Badges */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Personality Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-pink-100/80 text-pink-900 border border-pink-200"
                    >
                      ✨ {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compatibility Check */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Home Compatibility
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-2xl border text-center ${
                    cat.goodWith.kids ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="text-xs font-bold">Kids</div>
                    <div className="text-xs mt-1 font-semibold">
                      {cat.goodWith.kids ? '✓ Great with Kids' : '✗ Adults/Older Only'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border text-center ${
                    cat.goodWith.dogs ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="text-xs font-bold">Dogs</div>
                    <div className="text-xs mt-1 font-semibold">
                      {cat.goodWith.dogs ? '✓ Dog Friendly' : '✗ No Dogs'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border text-center ${
                    cat.goodWith.otherCats ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="text-xs font-bold">Other Cats</div>
                    <div className="text-xs mt-1 font-semibold">
                      {cat.goodWith.otherCats ? '✓ Cat Friendly' : '✗ Only Cat Preferred'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEDICAL & HEALTH RECORDS */}
          {activeTab === 'medical' && (
            <div className="space-y-5">
              
              {/* Medical Alert & Medication Schedule Banner */}
              {medicalAlert && medicalAlert.hasAlert && (
                <div className={`p-4 rounded-2xl border shadow-xs space-y-2 ${
                  medicalAlert.level === 'urgent'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : medicalAlert.level === 'warning'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-sky-50 border-sky-300 text-sky-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${medicalAlert.level === 'urgent' ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                      <h4 className="text-sm font-extrabold tracking-tight">
                        Medical Alert: {medicalAlert.title}
                      </h4>
                    </div>
                    {medicalAlert.dueDate && (
                      <span className="px-2.5 py-1 rounded-lg bg-white font-extrabold text-xs text-slate-900 border border-slate-200 shadow-2xs">
                        Due: {medicalAlert.dueDate}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed pl-7">
                    {medicalAlert.details}
                  </p>
                  {cat.medicalRecords.medicationSchedule && (
                    <div className="mt-2 pl-7 pt-2 border-t border-slate-200/80 flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <Pill className="w-4 h-4 text-pink-600 flex-shrink-0" />
                      <span>Medication Schedule: <span className="font-semibold text-slate-700">{cat.medicalRecords.medicationSchedule}</span></span>
                    </div>
                  )}
                  {cat.medicalRecords.upcomingMedicalNeeds && (
                    <div className="pl-7 pt-1 flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <Stethoscope className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Upcoming Procedure: <span className="font-semibold text-slate-700">{cat.medicalRecords.upcomingMedicalNeeds}</span></span>
                    </div>
                  )}
                </div>
              )}

              {/* Medical Concerns Banner */}
              {cat.medicalConcerns.length > 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Active Medical Notices</h4>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1 font-medium">
                      {cat.medicalConcerns.map((concern, i) => (
                        <li key={i}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Clean Health Record</h4>
                    <p className="text-xs font-medium">No active medical concerns or special treatments needed.</p>
                  </div>
                </div>
              )}

              {/* Standard Health Verification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Vaccinations</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    {cat.medicalRecords.vaccinationsUpToDate ? '✓ Up to Date' : '⚠ Pending'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Spayed / Neutered</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    {cat.medicalRecords.spayedNeutered ? '✓ Complete' : '⚠ Scheduled'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Microchipped</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    {cat.medicalRecords.microchipped ? '✓ Microchipped' : '⚠ Pending'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">FIV / FeLV</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    {cat.medicalRecords.fivFelvStatus || 'Tested Clear'}
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-600">Last Veterinary Checkup:</span>
                  <span className="font-semibold text-slate-900">{cat.medicalRecords.lastCheckupDate}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-600">Dietary & Feeding Notes:</span>
                  <span className="font-semibold text-slate-900">{cat.medicalRecords.dietaryNotes || 'Standard cafe premium cat diet'}</span>
                </div>

                {cat.medicalRecords.specialNeeds && (
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-600">Special Care Protocol:</span>
                    <span className="font-semibold text-rose-700">{cat.medicalRecords.specialNeeds}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: TIMELINE & CAFE HISTORY */}
          {activeTab === 'timeline' && (
            <div className="space-y-5 text-xs">
              
              {/* Timeline Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-pink-600" />
                    <span>Chronological Stay & Medical Record Log</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Track status transitions, medical notes, vet exams, and care milestones.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddForm ? 'Cancel Entry' : 'Log New Event'}</span>
                </button>
              </div>

              {/* Add New Event Form Dropdown */}
              {showAddForm && (
                <form
                  onSubmit={handleAddEvent}
                  className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3 animate-in fade-in duration-200"
                >
                  <div className="flex justify-between items-center border-b border-pink-200/60 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1">
                      <Plus className="w-3.5 h-3.5 text-pink-600" />
                      <span>Add Timeline & Medical Record Note</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                      Staff Entry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Record Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Weight Checkup, FVRCP Booster, Status Updated"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Event Category
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as TimelineEventType)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 outline-none text-xs cursor-pointer"
                      >
                        <option value="medical_note">Medical Note / Treatment</option>
                        <option value="checkup">Routine Vet Checkup</option>
                        <option value="status_change">Adoption Status Change</option>
                        <option value="milestone">Milestone / Event</option>
                        <option value="intake">Intake / Screening</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Recorded By / Staff Name
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="e.g. Dr. Sarah, Shift Supervisor"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 outline-none text-xs"
                      />
                    </div>

                    {newType === 'status_change' && (
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Select New Status Tag
                        </label>
                        <select
                          value={newStatusTag}
                          onChange={(e) => setNewStatusTag(e.target.value as AdoptionStatus)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 outline-none text-xs cursor-pointer"
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Adopted">Adopted</option>
                          <option value="Foster">Foster</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Detailed Medical & Observations Notes *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Write health status, treatment given, or adoption updates..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 outline-none text-xs"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs"
                    >
                      Save Record
                    </button>
                  </div>
                </form>
              )}

              {/* Filters & Sorting Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center space-x-1">
                    <Filter className="w-3 h-3" />
                    <span>Filter:</span>
                  </span>
                  {[
                    { key: 'all', label: 'All Records' },
                    { key: 'status_change', label: 'Status Updates' },
                    { key: 'medical_note', label: 'Medical Notes' },
                    { key: 'checkup', label: 'Exams' },
                    { key: 'intake', label: 'Intake' },
                    { key: 'milestone', label: 'Milestones' }
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => setFilterType(btn.key)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                        filterType === btn.key
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                  title="Toggle chronological order"
                >
                  <ArrowUpDown className="w-3 h-3 text-pink-600" />
                  <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                </button>
              </div>

              {/* Chronological Vertical Timeline List */}
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <Info className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 text-xs">No entries match this filter</p>
                  <p className="text-[11px] text-slate-500">Try selecting 'All Records' or add a new timeline event above.</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {filteredEvents.map((evt) => {
                    const badge = getEventTypeBadge(evt.type);
                    const IconComponent = badge.icon;

                    return (
                      <div key={evt.id} className="relative group">
                        
                        {/* Timeline Node Icon Circle */}
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center group-hover:border-pink-500 group-hover:scale-110 transition-all shadow-2xs">
                          <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-pink-500" />
                        </div>

                        {/* Timeline Event Card */}
                        <div className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-pink-200 shadow-2xs hover:shadow-sm transition-all space-y-2">
                          
                          {/* Card Header */}
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center space-x-1 ${badge.color}`}>
                                  <IconComponent className="w-3 h-3" />
                                  <span>{badge.label}</span>
                                </span>

                                {evt.statusTag && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusTagColor(evt.statusTag)}`}>
                                    Status: {evt.statusTag}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-slate-900 text-xs pt-1">
                                {evt.title}
                              </h4>
                            </div>

                            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                              <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                                {evt.date}
                              </span>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                                title="Delete event record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-800 leading-relaxed font-normal">
                            {evt.description}
                          </p>

                          {/* Author Footer */}
                          {evt.author && (
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center space-x-1 pt-1 border-t border-slate-200/60">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>Recorded by: {evt.author}</span>
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 flex items-center justify-between gap-3">
          <button
            onClick={() => onEnhanceWithAI(cat)}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-100 to-sky-100 hover:from-pink-200 hover:to-sky-200 text-slate-900 font-bold text-[11px] border border-pink-200 flex items-center space-x-1 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>AI Polish Profile</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-xs"
              title="Print printer-friendly profile summary"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print Profile</span>
            </button>

            <button
              onClick={() => {
                onEdit(cat);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-300 flex items-center space-x-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
