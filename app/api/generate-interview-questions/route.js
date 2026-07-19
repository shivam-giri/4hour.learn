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
          temperature: 0.4,
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
      console.warn(`Groq model ${model} failed in generate-interview-questions, trying next...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { language } = await request.json();
    if (!language?.trim()) {
      return NextResponse.json({ error: 'Language/Technology is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a technical interviewer testing a candidate for a professional developer role.
Generate exactly 6 interview questions for the specified technology/language.
The list MUST contain exactly 3 theoretical questions first, followed by exactly 3 coding challenge questions.

You must return valid JSON matching this schema:
{
  "questions": [
    {
      "id": 1,
      "type": "theory",
      "question": "A clear, professional theoretical question checking core concepts, design patterns, internals, or mechanics."
    },
    {
      "id": 4,
      "type": "coding",
      "question": "A coding challenge statement asking the candidate to write a function or logic to solve a specific problem (no boilerplates, keeps requirements precise)."
    }
  ]
}

Ensure there are exactly 6 questions (IDs 1 to 6). The first 3 (IDs 1, 2, 3) must be type: "theory". The last 3 (IDs 4, 5, 6) must be type: "coding".`
      },
      {
        role: 'user',
        content: `Generate interview questions for technology: "${language}"`
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
    console.error('Interview questions generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate interview questions' },
      { status: 500 }
    );
  }
}
