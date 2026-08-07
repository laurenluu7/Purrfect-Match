import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CATS } from './src/data/initialCats';
import { Cat } from './src/types';

// In-memory cat storage initialized with default cats
let catStore: Cat[] = [...INITIAL_CATS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize Gemini AI Client lazily or safely
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({ apiKey });
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', catsCount: catStore.length });
  });

  // Get all cats
  app.get('/api/cats', (req, res) => {
    res.json(catStore);
  });

  // Save/Replace all cats
  app.post('/api/cats/bulk', (req, res) => {
    if (Array.isArray(req.body)) {
      catStore = req.body;
      res.json({ success: true, count: catStore.length });
    } else {
      res.status(400).json({ error: 'Expected array of cats' });
    }
  });

  // Create cat
  app.post('/api/cats', (req, res) => {
    const newCat: Cat = {
      ...req.body,
      id: req.body.id || `cat-${Date.now()}`
    };
    catStore.unshift(newCat);
    res.json(newCat);
  });

  // Update cat
  app.put('/api/cats/:id', (req, res) => {
    const { id } = req.params;
    const index = catStore.findIndex((c) => c.id === id);
    if (index !== -1) {
      catStore[index] = { ...catStore[index], ...req.body };
      res.json(catStore[index]);
    } else {
      res.status(404).json({ error: 'Cat not found' });
    }
  });

  // Toggle Featured Cat of the Week
  app.post('/api/cats/:id/feature', (req, res) => {
    const { id } = req.params;
    const { tagline } = req.body;
    catStore = catStore.map((cat) => ({
      ...cat,
      featured: cat.id === id,
      featuredTagline: cat.id === id ? (tagline || cat.featuredTagline || 'Featured Star Cat!') : undefined
    }));
    res.json({ success: true, featuredCatId: id });
  });

  // Delete cat
  app.delete('/api/cats/:id', (req, res) => {
    const { id } = req.params;
    catStore = catStore.filter((c) => c.id !== id);
    res.json({ success: true, id });
  });

  // Reset to default sample dataset
  app.post('/api/cats/reset', (req, res) => {
    catStore = [...INITIAL_CATS];
    res.json(catStore);
  });

  // --- GEMINI AI ENDPOINTS ---

  // AI Profile Enhancer & Auto-Categorization
  app.post('/api/ai/enhance', async (req, res) => {
    try {
      const { name, age, gender, rawNotes, medicalNotes, traits } = req.body;
      const ai = getGeminiClient();

      const prompt = `
You are an expert, compassionate Cat Cafe Adoption Coordinator.
Generate an appealing, sleek, and friendly profile for a cafe cat looking for adoption.

Input Details:
- Name: ${name || 'Unknown'}
- Age: ${age || 'Unknown'}
- Gender: ${gender || 'Unknown'}
- Personality/Raw Notes: ${rawNotes || 'None provided'}
- Medical Notes: ${medicalNotes || 'None'}
- Key Traits: ${Array.isArray(traits) ? traits.join(', ') : traits || 'Friendly'}

Respond ONLY with valid JSON in this exact structure:
{
  "enhancedDescription": "A warm, engaging 2-3 sentence adoption bio highlighting their charm.",
  "suggestedCategory": "One of: Lounge Lovers, Playful Energetic, Quiet & Shy, Special Care, Lap Cats, Kittens",
  "personalityTraits": ["Array of 4-5 short descriptive tags, e.g. Cuddle Bug, Playful, Gentle"],
  "aiSummary": "One sentence quick takeaway for adopters (e.g. Perfect for quiet apartments or families).",
  "featuredTagline": "A short, cute headline catchy for Featured Cat of the Week",
  "careAdvice": "A quick medical & dietary reminder note for cafe staff and adopters."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from AI');
      }
      const data = JSON.parse(text);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/ai/enhance:', err);
      res.status(500).json({ error: err.message || 'AI Enhancement failed' });
    }
  });

  // AI Adoption Matchmaker & Operational Triage
  app.post('/api/ai/matchmaker', async (req, res) => {
    try {
      const { adopterProfile, cats } = req.body;
      const ai = getGeminiClient();

      const candidateCats = (cats || catStore).map((c: Cat) => {
        const behavioralTags = [
          ...(c.personalityTraits || []),
          c.category,
          c.goodWith && !c.goodWith.dogs ? 'No Dogs' : 'Good with Dogs',
          c.goodWith && !c.goodWith.kids ? 'No Small Kids' : 'Good with Kids',
          c.category === 'Quiet & Shy' ? 'Quiet Home Required' : ''
        ].filter(Boolean).join(', ');

        const careNotes = [
          c.medicalRecords?.specialNeeds,
          Array.isArray(c.medicalConcerns) ? c.medicalConcerns.join(', ') : '',
          c.medicalRecords?.dietaryNotes
        ].filter(Boolean).join('; ') || 'Standard shelter care';

        return {
          id: c.id,
          name: c.name,
          behavioral_tags: behavioralTags,
          care_notes: careNotes,
          adoption_status: c.adoptionStatus || c.loungeStatus || 'Available'
        };
      });

      const housingType = adopterProfile.housing_type || adopterProfile.homeType || 'Apartment';
      const noiseLevel = adopterProfile.noise_level || (adopterProfile.activityLevel?.includes('Quiet') ? 'Quiet' : adopterProfile.activityLevel?.includes('Active') ? 'Active' : 'Moderate');
      const existingPets = adopterProfile.existing_pets || [
        adopterProfile.hasDogs ? 'Dog' : '',
        adopterProfile.hasCats ? 'Cat' : ''
      ].filter(Boolean).join(', ') || 'None';
      const hoursAway = adopterProfile.hours_away_per_day || 6;
      const petExperience = adopterProfile.pet_experience || adopterProfile.experienceLevel || 'Intermediate';

      const prompt = `
SYSTEM PROMPT:
You are the lead matchmaking and operational triage assistant for Purrfect Match.
Your task is to analyze prospective adopter inputs against resident cat profiles to calculate a compatibility score, generate a rationale, and assign an application triage priority level for cafe staff.

INPUT DATA:
- Adopter Profile:
  - Housing Type: ${housingType} (e.g., Studio, Apartment, House)
  - Home Energy Level: ${noiseLevel} (Quiet, Moderate, Active)
  - Other Pets: ${existingPets}
  - Daily Schedule: ${hoursAway} hours away/day
  - Experience Level: ${petExperience}

- Candidate Cats List:
${JSON.stringify(candidateCats, null, 2)}

EVALUATION RULES:
1. Hard Constraints:
   - IF cat behavioral_tags includes "Quiet Home Required" AND adopter noise_level == "Active" -> Cap Score at 55%.
   - IF cat behavioral_tags includes "No Dogs" AND adopter existing_pets contains "Dog" -> Automatic Disqualification (0%).
2. Weighting:
   - Activity level match: 40%
   - Schedule compatibility (rest cycles vs. hours away): 30%
   - Living space fit: 30%

OUTPUT FORMAT (JSON):
Return a JSON array of match evaluation objects for each candidate cat, sorted from highest match_score to lowest match_score:
[
  {
    "catId": "cat id string",
    "match_score": 95, // integer 0-100
    "compatibility_tier": "High", // High | Moderate | Low
    "match_reasoning": "2 sentences explaining key alignment or friction points.",
    "triage_priority": "Priority 1: Immediate Review", // Priority 1: Immediate Review | Priority 2: Standard | Priority 3: Low Match
    "flagged_notes_for_staff": "Key concerns or questions for staff to ask during interview."
  }
]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from AI matchmaker');
      const rawResults = JSON.parse(text);

      const normalized = (Array.isArray(rawResults) ? rawResults : [rawResults]).map((item: any) => {
        const score = typeof item.match_score === 'number' ? item.match_score : parseInt(item.match_score, 10) || 75;
        return {
          catId: item.catId,
          match_score: score,
          score: score,
          compatibility_tier: item.compatibility_tier || (score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Low'),
          match_reasoning: item.match_reasoning || 'Good general alignment with lifestyle and environment.',
          triage_priority: item.triage_priority || (score >= 80 ? 'Priority 1: Immediate Review' : score >= 60 ? 'Priority 2: Standard' : 'Priority 3: Low Match'),
          flagged_notes_for_staff: item.flagged_notes_for_staff || 'Check pet introduction schedule during staff interview.',
          reasons: [item.match_reasoning || 'Good general fit based on lifestyle and home environment.'],
          advice: item.flagged_notes_for_staff || 'Staff interview note: Verify daily schedule.'
        };
      });

      res.json(normalized);
    } catch (err: any) {
      console.error('Error in /api/ai/matchmaker:', err);
      res.status(500).json({ error: err.message || 'Matchmaker analysis failed' });
    }
  });

  // --- VITE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cat Cafe Organizer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
