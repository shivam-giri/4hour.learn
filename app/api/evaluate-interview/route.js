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
          temperature: 0.2,
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
      console.warn(`Groq model ${model} failed in evaluate-interview, trying next...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { language, QAs } = await request.json();
    if (!language || !QAs || !Array.isArray(QAs)) {
      return NextResponse.json({ error: 'Language and QAs array are required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an elite technical interviewer evaluating a candidate's theoretical knowledge and coding performance in: "${language}".
Grade the candidate's answers strictly. Assess if the candidate is fully ready (true) or not ready (false) to pass real-world tech interviews in this technology.

You must return valid JSON matching this schema:
{
  "ready": true,
  "score": 85,
  "summary": "Detailed overall assessment summary of the candidate's strengths and weaknesses. Be honest and direct.",
  "gaps": ["Gap or area to study 1", "Gap 2"],
  "breakdown": [
    {
      "id": 1,
      "question": "The question statement",
      "answer": "The user's answer text",
      "score": 80,
      "correctness": "Correct | Partially Correct | Incorrect",
      "feedback": "1-2 sentences explaining what was right, what was wrong, or bugs in the coding response."
    }
  ]
}`
      },
      {
        role: 'user',
        content: `Here is the interview transcript for technology: "${language}":
${JSON.stringify(QAs, null, 2)}`
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
    console.error('Interview evaluation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to evaluate interview responses' },
      { status: 500 }
    );
  }
}
