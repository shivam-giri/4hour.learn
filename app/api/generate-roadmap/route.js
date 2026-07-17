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
    const { topic } = await request.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert curriculum designer. Generate a comprehensive, structured learning roadmap for the specified topic.
You must return valid JSON matching this schema:
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
- Generate 10-15 nodes total.
- First node type must be "start".
- Include at least 1 "project" node.
- Include at least 1 "advanced" node.
- Edges define prerequisites (source must be learned before target).
- Node ids are strings like "1", "2", etc.
- Make it a realistic, logical learning progression.
- Labels must be concise (2-4 words max).`
      },
      {
        role: 'user',
        content: `Create a learning roadmap for: "${topic}"`
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
    console.error('Roadmap generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
