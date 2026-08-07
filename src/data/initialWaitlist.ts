import { WaitlistEntry } from '../types';

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl-1',
    catId: 'cat-4', // Leo
    catName: 'Leo',
    adopterName: 'Samantha Vance',
    adopterEmail: 'samantha.v@example.com',
    adopterPhone: '(555) 234-8901',
    requestedDate: '2026-07-28',
    status: 'Reserved',
    notes: 'Home visit passed! Adopter bringing cat carrier on Saturday morning.',
    homeDetails: 'Quiet single-family home with cat wall trees & no dogs.'
  },
  {
    id: 'wl-2',
    catId: 'cat-1', // Mochi
    catName: 'Mochi',
    adopterName: 'David K. Miller',
    adopterEmail: 'david.m@example.com',
    adopterPhone: '(555) 912-3456',
    requestedDate: '2026-08-01',
    status: 'Waiting',
    notes: 'Inquired during birthday celebration party. Wants a lap cat.',
    homeDetails: 'Apartment with sunroom, experienced cat owner.'
  },
  {
    id: 'wl-3',
    catId: 'cat-2', // Oliver
    catName: 'Oliver',
    adopterName: 'Elena Rostova',
    adopterEmail: 'elena.rostova@example.com',
    adopterPhone: '(555) 678-1234',
    requestedDate: '2026-07-15',
    status: 'Adopted',
    notes: 'Finalized adoption paperwork and microchip transfer.',
    homeDetails: 'Has two friendly rescue cats, spacious house.'
  }
];
