import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { Ride, SearchQuery, SmartMatchResult } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or when key is present
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Easy Commute API', timestamp: new Date().toISOString() });
});

// AI Smart Match Algorithm & API Endpoint
app.post('/api/smart-match', async (req, res) => {
  try {
    const { searchQuery, rides } = req.body as { searchQuery: SearchQuery; rides: Ride[] };

    if (!rides || rides.length === 0) {
      return res.json({ matches: [] });
    }

    const aiClient = getGenAIClient();

    // Fallback heuristic function if AI client is unavailable or errors out
    const calculateHeuristicMatches = (): SmartMatchResult[] => {
      return rides.map((ride) => {
        let score = 70; // baseline

        // Exact or partial location matching
        const pLower = (searchQuery.pickupLocation || '').toLowerCase();
        const dLower = (searchQuery.destination || '').toLowerCase();
        const oLower = (ride.origin || '').toLowerCase();
        const destLower = (ride.destination || '').toLowerCase();

        let routeSimilarity = 65;
        if (oLower.includes(pLower) || pLower.includes(oLower)) routeSimilarity += 20;
        if (destLower.includes(dLower) || dLower.includes(destLower)) routeSimilarity += 20;
        routeSimilarity = Math.min(98, routeSimilarity);

        // Time match
        let detourMin = Math.floor(Math.random() * 5) + 2; // 2 to 7 mins
        if (searchQuery.travelTime && ride.departureTime) {
          const [sH, sM] = searchQuery.travelTime.split(':').map(Number);
          const [rH, rM] = ride.departureTime.split(':').map(Number);
          if (!isNaN(sH) && !isNaN(rH)) {
            const timeDiffMin = Math.abs((sH * 60 + sM) - (rH * 60 + rM));
            if (timeDiffMin <= 15) score += 15;
            else if (timeDiffMin <= 30) score += 5;
            else score -= 15;
          }
        }

        // EV / Eco bonus
        if (ride.fuelType === 'EV') score += 10;
        if (ride.fuelType === 'Hybrid') score += 5;

        // Seat availability check
        if (ride.availableSeats < (searchQuery.seatsNeeded || 1)) {
          score -= 40;
        }

        // Price fairness
        const fairCost = Math.max(100, Math.round(ride.totalFuelCostDollars / (ride.totalSeats + 1)));

        const finalScore = Math.max(35, Math.min(99, Math.round((score + routeSimilarity) / 2)));

        const badges: string[] = [];
        if (finalScore >= 88) badges.push('Top AI Smart Match');
        if (detourMin <= 4) badges.push('Minimal Detour (+3 min)');
        if (ride.fuelType === 'EV') badges.push('Zero Emission EV');
        if (ride.availableSeats >= 2) badges.push('Spacious Travel');

        return {
          rideId: ride.id,
          matchScore: finalScore,
          routeSimilarityPercentage: routeSimilarity,
          estimatedPickupDetourMin: detourMin,
          detourExtraDistanceKm: Math.round((detourMin * 0.4) * 10) / 10,
          fairSplitCost: fairCost,
          co2SavedKg: Math.round((ride.carbonSavedKgPerSeat * (searchQuery.seatsNeeded || 1)) * 10) / 10,
          aiExplanation: `Great route alignment along ${ride.origin} to ${ride.destination}. Departure at ${ride.departureTime} fits your window with minimal detour (+${detourMin} mins) and fair cost share of Rs. ${fairCost}.`,
          badges
        };
      }).sort((a, b) => b.matchScore - a.matchScore);
    };

    if (!aiClient) {
      const fallbackResults = calculateHeuristicMatches();
      return res.json({ matches: fallbackResults, provider: 'heuristic' });
    }

    try {
      const prompt = `You are the Easy Commute AI Smart Match Engine in Pakistan. Analyze the commuter's request vs candidate driver rides across Islamabad and Rawalpindi routes and evaluate route similarity, timing fit, detour delay, fair cost split in Pakistani Rupees (PKR / Rs.), and carbon savings.

Commuter Search Request:
- Pickup: ${searchQuery.pickupLocation || 'Any local hub (e.g. Bahria Town, DHA, G-10)'}
- Destination: ${searchQuery.destination || 'City Hub (e.g. Blue Area, F-8, NUML)'}
- Preferred Departure Time: ${searchQuery.travelTime || '08:15'}
- Seats Needed: ${searchQuery.seatsNeeded || 1}
- Fuel Preference: ${searchQuery.fuelFilter || 'all'}

Available Driver Rides:
${JSON.stringify(rides, null, 2)}

Return a JSON array of match objects. For EACH ride in the list, output:
- rideId: string
- matchScore: integer between 35 and 99
- routeSimilarityPercentage: integer between 40 and 99
- estimatedPickupDetourMin: integer between 2 and 12
- detourExtraDistanceKm: float rounded to 1 decimal place
- fairSplitCost: integer cost per seat in Pakistani Rupees (PKR / Rs.)
- co2SavedKg: float carbon saved in kg
- aiExplanation: a concise, humanized 2-sentence explanation of why this ride matches well or where the detour/time trade-off occurs.
- badges: array of 2 to 3 short catchy highlight tags (e.g. "Top AI Match", "Minimal Detour", "Zero Emission EV", "Exact Time Sync", "Optimal Cost Share").`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rideId: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                routeSimilarityPercentage: { type: Type.INTEGER },
                estimatedPickupDetourMin: { type: Type.INTEGER },
                detourExtraDistanceKm: { type: Type.NUMBER },
                fairSplitCost: { type: Type.NUMBER },
                co2SavedKg: { type: Type.NUMBER },
                aiExplanation: { type: Type.STRING },
                badges: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['rideId', 'matchScore', 'routeSimilarityPercentage', 'estimatedPickupDetourMin', 'fairSplitCost', 'aiExplanation', 'badges']
            }
          }
        }
      });

      if (response.text) {
        const matches: SmartMatchResult[] = JSON.parse(response.text.trim());
        matches.sort((a, b) => b.matchScore - a.matchScore);
        return res.json({ matches, provider: 'gemini' });
      } else {
        throw new Error('Empty Gemini response text');
      }
    } catch (aiErr) {
      console.warn('Gemini Smart Match API failed or unconfigured, returning fallback heuristic:', aiErr);
      const fallbackResults = calculateHeuristicMatches();
      return res.json({ matches: fallbackResults, provider: 'heuristic_fallback' });
    }
  } catch (err: any) {
    console.error('Error processing smart match:', err);
    res.status(500).json({ error: 'Failed to process smart match' });
  }
});

// AI Commute Assistant Chat Endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { userMessage, availableRides } = req.body;
    const aiClient = getGenAIClient();

    if (!aiClient) {
      // Intelligent mock assistant response if API key is not present
      let replyText = "Hello! I'm your Easy Commute AI Assistant. I can help you find smart carpool matches across Islamabad and Rawalpindi, estimate your monthly fuel savings in PKR, or suggest optimal departure times!";
      const msgLower = (userMessage || '').toLowerCase();

      if (msgLower.includes('ev') || msgLower.includes('electric') || msgLower.includes('zero emission')) {
        replyText = "We have great Zero-Emission EV options! For example, Ayesha's MG ZS EV departs at 08:15 AM from Bahria Town Phase 8 to Blue Area. Sharing an EV ride saves up to 4.2 kg of CO₂ per trip!";
      } else if (msgLower.includes('save') || msgLower.includes('carbon') || msgLower.includes('co2') || msgLower.includes('cost') || msgLower.includes('pkr') || msgLower.includes('money')) {
        replyText = "By carpooling 4 days a week on Easy Commute across Islamabad/Rawalpindi, the average commuter saves ~Rs. 15,000/month in petrol costs and prevents ~68 kg of CO₂ emissions—equivalent to planting 3.2 trees every month!";
      } else if (msgLower.includes('blue area') || msgLower.includes('bahria') || msgLower.includes('dha') || msgLower.includes('numl') || msgLower.includes('nust')) {
        replyText = "I found top-rated drivers traveling toward Blue Area, F-8, and university campuses like NUML & NUST between 07:45 AM and 08:30 AM with 2-3 open seats. Would you like me to filter for minimal detour rides?";
      }

      return res.json({
        reply: replyText,
        provider: 'assistant_mock'
      });
    }

    const prompt = `You are the Easy Commute AI Concierge in Pakistan. Help commuters share rides across Islamabad and Rawalpindi, calculate fuel savings in PKR (Pakistani Rupees) and carbon savings, and find ideal matches. Keep your tone helpful, eco-conscious, friendly, and practical.

User Question: "${userMessage}"

Current Active Rides Data context:
${JSON.stringify(availableRides || [], null, 2)}

Provide a helpful, direct response (2-4 sentences max). If relevant, highlight specific driver rides or offer actionable commuting tips for Islamabad/Rawalpindi routes.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return res.json({
      reply: response.text || "I'm here to help you optimize your daily commute and reduce emissions!",
      provider: 'gemini'
    });
  } catch (err) {
    console.error('Error in AI assistant endpoint:', err);
    res.status(500).json({ error: 'Failed to generate assistant response' });
  }
});

// Vite middleware in dev mode / Static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Easy Commute server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
