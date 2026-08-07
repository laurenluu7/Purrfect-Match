import { Cat, MedicalAlert } from '../types';

export interface EvaluatedMedicalAlert {
  hasAlert: boolean;
  level: 'urgent' | 'warning' | 'info';
  title: string;
  details?: string;
  dueDate?: string;
  type: 'medication' | 'upcoming_procedure' | 'special_care';
}

export function getCatMedicalAlert(cat: Cat): EvaluatedMedicalAlert | null {
  const records = cat.medicalRecords;
  if (!records) return null;

  // 1. Explicit medicalAlert object in records
  if (records.medicalAlert?.hasAlert) {
    return {
      hasAlert: true,
      level: records.medicalAlert.level || 'warning',
      title: records.medicalAlert.title || 'Medical Alert',
      details: records.medicalAlert.details || cat.medicalConcerns.join(', '),
      dueDate: records.medicalAlert.dueDate,
      type: records.medicationSchedule ? 'medication' : 'upcoming_procedure'
    };
  }

  // 2. Medication Schedule specified
  if (records.medicationSchedule && records.medicationSchedule.trim().length > 0) {
    return {
      hasAlert: true,
      level: 'warning',
      title: 'Medication Schedule',
      details: records.medicationSchedule,
      dueDate: 'Scheduled',
      type: 'medication'
    };
  }

  // 3. Upcoming medical needs specified
  if (records.upcomingMedicalNeeds && records.upcomingMedicalNeeds.trim().length > 0) {
    return {
      hasAlert: true,
      level: 'warning',
      title: 'Upcoming Medical Need',
      details: records.upcomingMedicalNeeds,
      dueDate: 'Upcoming',
      type: 'upcoming_procedure'
    };
  }

  // 4. Special Care or FIV/FeLV or critical medical concerns
  if (cat.category === 'Special Care' || records.fivFelvStatus === 'FIV Positive' || records.fivFelvStatus === 'FeLV Positive') {
    return {
      hasAlert: true,
      level: 'info',
      title: 'Special Care Protocol',
      details: records.specialNeeds || `Special care required (${records.fivFelvStatus})`,
      dueDate: 'Ongoing',
      type: 'special_care'
    };
  }

  return null;
}
