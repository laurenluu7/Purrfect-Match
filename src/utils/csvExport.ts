import { Cat } from '../types';

export function exportCatsToCSV(cats: Cat[], filename = 'neko_hub_cats.csv') {
  const headers = [
    'ID',
    'Name',
    'Category',
    'Gender',
    'Adoption Status',
    'Age (Years)',
    'Age (Months)',
    'Birth Date',
    'Arrival Date',
    'Color/Pattern',
    'Good With Kids',
    'Good With Dogs',
    'Good With Cats',
    'Personality Traits',
    'Vaccines Up To Date',
    'Spayed/Neutered',
    'Microchipped',
    'FIV/FeLV Status',
    'Last Checkup Date',
    'Special Needs',
    'Dietary Notes',
    'Medical Concerns',
    'Description'
  ];

  const escapeCSV = (value: string | number | boolean | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const stringVal = String(value).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = cats.map(cat => [
    escapeCSV(cat.id),
    escapeCSV(cat.name),
    escapeCSV(cat.category),
    escapeCSV(cat.gender),
    escapeCSV(cat.adoptionStatus),
    escapeCSV(cat.ageYears),
    escapeCSV(cat.ageMonths),
    escapeCSV(cat.birthDate || ''),
    escapeCSV(cat.arrivalDate),
    escapeCSV(cat.colorPattern || ''),
    escapeCSV(cat.goodWith?.kids ? 'Yes' : 'No'),
    escapeCSV(cat.goodWith?.dogs ? 'Yes' : 'No'),
    escapeCSV(cat.goodWith?.otherCats ? 'Yes' : 'No'),
    escapeCSV(Array.isArray(cat.personalityTraits) ? cat.personalityTraits.join('; ') : ''),
    escapeCSV(cat.medicalRecords?.vaccinationsUpToDate ? 'Yes' : 'No'),
    escapeCSV(cat.medicalRecords?.spayedNeutered ? 'Yes' : 'No'),
    escapeCSV(cat.medicalRecords?.microchipped ? 'Yes' : 'No'),
    escapeCSV(cat.medicalRecords?.fivFelvStatus || 'Tested Clear'),
    escapeCSV(cat.medicalRecords?.lastCheckupDate || ''),
    escapeCSV(cat.medicalRecords?.specialNeeds || ''),
    escapeCSV(cat.medicalRecords?.dietaryNotes || ''),
    escapeCSV(Array.isArray(cat.medicalConcerns) ? cat.medicalConcerns.join('; ') : ''),
    escapeCSV(cat.description || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
