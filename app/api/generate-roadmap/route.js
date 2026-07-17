import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Try models in priority order — first available wins
const MODEL_FALLBACKS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
];

async function generateWithFallback(prompt) {
  let lastError;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      const status = err?.status ?? err?.statusCode;
      const isQuota = status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
      const isNotFound = status === 404 || err?.message?.includes('404');
      if (isQuota || isNotFound) {
        console.warn(`Model ${modelName} unavailable (${status}), trying next...`);
        lastError = err;
        continue;
      }
      throw err; // non-quota error — surface immediately
    }
  }
  throw lastError ?? new Error('All models exhausted');
}

export async function POST(request) {
  try {
    const { topic } = await request.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `You are an expert curriculum designer. Generate a comprehensive, structured learning roadmap for the topic: "${topic}".

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "title": "Roadmap title",
  "description": "Brief 1-sentence description",
  "nodes": [
    {
      "id": "1",
      "label": "Short node title (max 4 words)",
      "description": "One sentence description of this topic",
      "type": "start|concept|skill|project|theory|advanced"
    }
  ],
  "edges": [
    { "source": "1", "target": "2" }
  ]
}

Rules:
- Generate 10-15 nodes total
- First node type must be "start"
- Include at least 1 "project" node
- Include at least 1 "advanced" node
- Edges define prerequisites (source must be learned before target)
- Node ids are strings "1", "2", etc.
- Make it a realistic, logical learning progression
- Labels must be concise (2-4 words max)
- Return ONLY the JSON object, nothing else`;

    const text = await generateWithFallback(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Roadmap generation error:', err);
    const isQuota = err?.message?.includes('429') || err?.message?.includes('quota');
    return NextResponse.json(
      {
        error: isQuota
          ? 'API quota exceeded. Please wait a minute and try again, or upgrade your Gemini plan at https://ai.google.dev'
          : (err.message || 'Failed to generate roadmap'),
      },
      { status: isQuota ? 429 : 500 }
    );
  }
}
