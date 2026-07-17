import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

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
      throw err;
    }
  }
  throw lastError ?? new Error('All models exhausted');
}

export async function POST(request) {
  try {
    const { nodeLabel, nodeType, topic } = await request.json();
    if (!nodeLabel?.trim()) {
      return NextResponse.json({ error: 'Node label is required' }, { status: 400 });
    }

    const prompt = `You are an expert teacher creating an engaging lesson for an interactive learning platform.

Topic: "${topic}"
Lesson: "${nodeLabel}" (type: ${nodeType || 'concept'})

Return ONLY valid JSON with this exact structure (no markdown):
{
  "explanation": "Clear, engaging explanation in 3-4 paragraphs. Use simple language, analogies, and be comprehensive yet concise.",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
  "codeExample": "A practical, runnable code example (20-30 lines). Include comments.",
  "codeLanguage": "javascript|python|typescript|bash|etc",
  "realWorldExample": "A real-world scenario or application of this concept in 2-3 sentences.",
  "exercise": "A hands-on practice exercise or challenge the learner can do right now."
}

Rules:
- codeExample should be practical and illustrative, not just pseudo-code
- Choose codeLanguage based on what's most natural for the topic
- keyConcepts should be specific, actionable items
- exercise should be achievable in 10-15 minutes
- Return ONLY the JSON, no markdown wrapping`;

    const text = await generateWithFallback(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Lesson generation error:', err);
    const isQuota = err?.message?.includes('429') || err?.message?.includes('quota');
    return NextResponse.json(
      {
        error: isQuota
          ? 'API quota exceeded. Please wait a minute and try again.'
          : (err.message || 'Failed to generate lesson'),
      },
      { status: isQuota ? 429 : 500 }
    );
  }
}
