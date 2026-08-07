export type Gender = 'Male' | 'Female';

export type AdoptionStatus = 'Available' | 'Pending' | 'Reserved' | 'Adopted' | 'Foster';

export type WaitlistStatus = 'Waiting' | 'Reserved' | 'Adopted' | 'Cancelled';

export interface WaitlistEntry {
  id: string;
  catId: string;
  catName: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  requestedDate: string;
  status: WaitlistStatus;
  notes?: string;
  homeDetails?: string;
}

export type CatCategory = 
  | 'Lounge Lovers' 
  | 'Playful Energetic' 
  | 'Quiet & Shy' 
  | 'Special Care' 
  | 'Lap Cats' 
  | 'Kittens';

export interface MedicalAlert {
  hasAlert: boolean;
  level?: 'urgent' | 'warning' | 'info';
  title: string;
  details?: string;
  dueDate?: string;
}

export interface MedicalRecords {
  vaccinationsUpToDate: boolean;
  spayedNeutered: boolean;
  microchipped: boolean;
  lastCheckupDate: string;
  dietaryNotes?: string;
  specialNeeds?: string;
  fivFelvStatus?: 'Negative' | 'FIV Positive' | 'FeLV Positive' | 'Tested Clear';
  medicationSchedule?: string;
  upcomingMedicalNeeds?: string;
  medicalAlert?: MedicalAlert;
}

export interface Compatibility {
  kids: boolean;
  dogs: boolean;
  otherCats: boolean;
}

export type TimelineEventType = 'status_change' | 'medical_note' | 'intake' | 'checkup' | 'milestone';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: TimelineEventType;
  description: string;
  author?: string;
  statusTag?: AdoptionStatus;
}

export interface Cat {
  id: string;
  name: string;
  ageYears: number;
  ageMonths: number;
  gender: Gender;
  birthDate?: string;
  arrivalDate: string;
  category: CatCategory;
  adoptionStatus: AdoptionStatus;
  medicalConcerns: string[];
  medicalRecords: MedicalRecords;
  personalityTraits: string[];
  description: string;
  imageUrl: string;
  featured: boolean;
  featuredTagline?: string;
  aiSummary?: string;
  goodWith: Compatibility;
  colorPattern?: string;
  loungeStatus?: 'Available' | 'On Break' | 'In Lounge' | 'Napping';
  restTimeMinutes?: number;
  timelineEvents?: TimelineEvent[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  adoptionStatus: string;
  gender: string;
  ageGroup: string; // 'all' | 'kitten' | 'young' | 'adult' | 'senior'
  medicalConcernFilter: string; // 'all' | 'none' | 'hasConcerns' | 'specialDiet'
}

export interface AdopterProfile {
  homeType?: string;
  housing_type?: string;
  noise_level?: 'Quiet' | 'Moderate' | 'Active' | string;
  existing_pets?: string;
  hours_away_per_day?: number | string;
  pet_experience?: string;
  hasKids?: boolean;
  hasDogs?: boolean;
  hasCats?: boolean;
  activityLevel?: string;
  experienceLevel?: string;
  preferences?: string;
}

export interface MatchResult {
  catId: string;
  match_score: number;
  score: number;
  compatibility_tier: 'High' | 'Moderate' | 'Low' | string;
  match_reasoning: string;
  triage_priority: 'Priority 1: Immediate Review' | 'Priority 2: Standard' | 'Priority 3: Low Match' | string;
  flagged_notes_for_staff: string;
  reasons?: string[];
  advice?: string;
}
