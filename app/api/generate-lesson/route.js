import { NextResponse } from 'next/server';

const apiKey = process.env.GROQ_API_KEY || '';
const MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant'
];

async function generateWithFallback(messages, responseFormatJson = true) {
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in .env.local');
  }

  let lastError;
  for (const model of MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          response_format: responseFormatJson ? { type: 'json_object' } : undefined,
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      console.warn(`Groq model ${model} failed, trying next fallback model...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { nodeLabel, nodeType, topic } = await request.json();
    if (!nodeLabel?.trim()) {
      return NextResponse.json({ error: 'Node label is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert teacher creating an engaging lesson for an interactive learning platform.
You must return valid JSON matching this schema:
{
  "explanation": "Clear, engaging explanation in 3-4 paragraphs. Use simple language, analogies, and be comprehensive yet concise.",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
  "codeExample": "A practical, runnable code example (20-30 lines). Include comments.",
  "codeLanguage": "javascript|python|typescript|bash|etc",
  "realWorldExample": "A real-world scenario or application of this concept in 2-3 sentences.",
  "exercise": "A hands-on practice exercise or challenge the learner can do right now."
}

Rules:
- codeExample should be practical and illustrative, not just pseudo-code.
- Choose codeLanguage based on what's most natural for the topic.
- keyConcepts should be specific, actionable items.
- exercise should be achievable in 10-15 minutes.`
      },
      {
        role: 'user',
        content: `Create a lesson for: "${nodeLabel}" (type: ${nodeType || 'concept'}) under the overall topic: "${topic}"`
      }
    ];

    const text = await generateWithFallback(messages, true);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format: No JSON object found');
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Lesson generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
