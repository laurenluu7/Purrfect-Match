import { Cat } from '../types';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const currentDate = String(today.getDate()).padStart(2, '0');

// Mochi's birthday is today!
const mochiBirthDate = `${currentYear - 2}-${currentMonth}-${currentDate}`;

export const INITIAL_CATS: Cat[] = [
  {
    id: 'cat-1',
    name: 'Mochi',
    ageYears: 2,
    ageMonths: 0,
    gender: 'Female',
    birthDate: mochiBirthDate,
    arrivalDate: '2026-03-15',
    category: 'Lap Cats',
    adoptionStatus: 'Available',
    medicalConcerns: ['Sensitive Stomach'],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-07-10',
      dietaryNotes: 'Grain-free wet food only, avoids poultry protein',
      fivFelvStatus: 'Tested Clear'
    },
    personalityTraits: ['Affectionate', 'Purr Machine', 'Quiet', 'Gentle'],
    description: 'Mochi is a sweet marshmallow of a cat who loves nothing more than curling up in warm laps while cafe patrons sip their lattes. She makes quiet chirp sounds when greeted.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    featured: true,
    featuredTagline: 'Featured Star Cat! Cuddle Master & Soft Purr Champion',
    aiSummary: 'Ideal for quiet households or work-from-home adopters looking for an affectionate lap companion.',
    goodWith: {
      kids: true,
      dogs: false,
      otherCats: true
    },
    colorPattern: 'Calico / Soft Pastels'
  },
  {
    id: 'cat-2',
    name: 'Boba',
    ageYears: 0,
    ageMonths: 8,
    gender: 'Male',
    birthDate: '2025-11-20',
    arrivalDate: '2026-05-02',
    category: 'Playful Energetic',
    adoptionStatus: 'Available',
    medicalConcerns: [],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-07-01',
      dietaryNotes: 'High protein kitten/junior kibble',
      fivFelvStatus: 'Tested Clear'
    },
    personalityTraits: ['Playful', 'Curious', 'High Energy', 'Acrobatic'],
    description: 'Boba is an energetic tuxedo youngster who loves chasing feather wands and doing flips off cat trees. He brings endless joy and giggles to everyone at the cafe.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800',
    featured: false,
    goodWith: {
      kids: true,
      dogs: true,
      otherCats: true
    },
    colorPattern: 'Tuxedo Black & White'
  },
  {
    id: 'cat-3',
    name: 'Matcha',
    ageYears: 4,
    ageMonths: 1,
    gender: 'Female',
    birthDate: '2022-06-15',
    arrivalDate: '2026-01-20',
    category: 'Quiet & Shy',
    adoptionStatus: 'Available',
    medicalConcerns: ['Mild Dental Tartar'],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-06-18',
      dietaryNotes: 'Dental care kibble mixed with wet food',
      specialNeeds: 'Annual dental scale recommended',
      fivFelvStatus: 'Tested Clear',
      upcomingMedicalNeeds: 'Dental Scaling Checkup due Aug 12',
      medicalAlert: {
        hasAlert: true,
        level: 'warning',
        title: 'Dental Scaling Due',
        details: 'Routine dental scaling and tartar checkup scheduled for Aug 12',
        dueDate: '2026-08-12'
      }
    },
    personalityTraits: ['Observer', 'Sweet', 'Gentle', 'Needs Patience'],
    description: 'Matcha is a regal green-eyed tabby who takes her time opening up. Once she trusts you, she nudges your hand gently for chin scratches and purrs like a cozy engine.',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    featured: false,
    goodWith: {
      kids: false,
      dogs: false,
      otherCats: true
    },
    colorPattern: 'Silver Tabby'
  },
  {
    id: 'cat-4',
    name: 'Oliver',
    ageYears: 6,
    ageMonths: 0,
    gender: 'Male',
    birthDate: '2020-04-10',
    arrivalDate: '2025-11-10',
    category: 'Lounge Lovers',
    adoptionStatus: 'Pending',
    medicalConcerns: ['Joint Supplements'],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-07-22',
      dietaryNotes: 'Weight management formula with Cosequin',
      specialNeeds: 'Daily joint chew treat',
      fivFelvStatus: 'Tested Clear',
      medicationSchedule: '1 Cosequin joint chew daily with morning meal',
      medicalAlert: {
        hasAlert: true,
        level: 'info',
        title: 'Daily Joint Supplement',
        details: 'Administer 1 Cosequin joint chew treat with morning wet food',
        dueDate: 'Daily Morning'
      }
    },
    personalityTraits: ['Mellow', 'Sunbeam Chaser', 'Friendly', 'Low Maintenance'],
    description: 'Oliver is a handsome ginger gentleman who spends 90% of his day napping in sunbeams. He loves soft forehead kisses and greeting cafe guests at the entrance.',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800',
    featured: false,
    goodWith: {
      kids: true,
      dogs: true,
      otherCats: true
    },
    colorPattern: 'Ginger Marmalade'
  },
  {
    id: 'cat-5',
    name: 'Chai',
    ageYears: 1,
    ageMonths: 3,
    gender: 'Female',
    birthDate: '2025-04-25',
    arrivalDate: '2026-04-12',
    category: 'Special Care',
    adoptionStatus: 'Available',
    medicalConcerns: ['FIV Positive', 'Special Diet'],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-07-05',
      dietaryNotes: 'Immune support supplements & urinary care wet food',
      specialNeeds: 'Indoor-only, sole cat or with other FIV+ cats',
      fivFelvStatus: 'FIV Positive',
      medicationSchedule: 'Immune Support Chew (Daily @ 9:00 AM)',
      upcomingMedicalNeeds: 'FIV Immunity Panel & Bloodwork due Aug 15',
      medicalAlert: {
        hasAlert: true,
        level: 'urgent',
        title: 'Daily Medication & Immunity Check',
        details: 'Daily immune chew at 9:00 AM & upcoming FIV immunity bloodwork panel on Aug 15',
        dueDate: '2026-08-15'
      }
    },
    personalityTraits: ['Cuddle Bug', 'Talkative', 'Loyal', 'Charming'],
    description: 'Chai is an incredibly sweet Siamese mix with striking blue eyes. FIV+ cats can live long, full, happy lives indoors! Chai is eager for her forever cozy home.',
    imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800',
    featured: false,
    goodWith: {
      kids: true,
      dogs: false,
      otherCats: false
    },
    colorPattern: 'Siamese Point'
  },
  {
    id: 'cat-6',
    name: 'Peanut & Biscuit',
    ageYears: 0,
    ageMonths: 4,
    gender: 'Male',
    birthDate: '2026-03-01',
    arrivalDate: '2026-06-20',
    category: 'Kittens',
    adoptionStatus: 'Available',
    medicalConcerns: [],
    medicalRecords: {
      vaccinationsUpToDate: true,
      spayedNeutered: true,
      microchipped: true,
      lastCheckupDate: '2026-07-15',
      dietaryNotes: 'Kitten growth formula',
      fivFelvStatus: 'Tested Clear'
    },
    personalityTraits: ['Bonded Pair', 'Playful', 'Snuggly', 'Double Joy'],
    description: 'Peanut and Biscuit are bonded kitten brothers who must be adopted together. They wrestle, groom each other, and fall asleep curled in a tiny furry ball.',
    imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=800',
    featured: false,
    goodWith: {
      kids: true,
      dogs: true,
      otherCats: true
    },
    colorPattern: 'Cream & Orange Tabby Brothers'
  }
];
