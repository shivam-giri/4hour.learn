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
          temperature: 0.5,
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
      console.warn(`Groq model ${model} failed in generate-summary, trying next fallback model...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { topic } = await request.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Skill is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert teacher. You only have 4 hours with the student and will never see them again. Your only goal is to make them functional in the specified skill before time runs out.
You must return valid JSON with this exact structure:
{
  "philosophy": "Rule #1 / core mental model of how the skill thinks. Avoid general descriptions. Explain the core shift in mindset.",
  "hours": [
    {
      "title": "Hour 1 — [Focus]",
      "description": "Exactly what to learn in hour 1. Focus only on 3-5 core things. Conversational, direct, opinionated.",
      "code": "Minimal, illustrative code block (if applicable, otherwise empty string). Use clean syntax.",
      "codeLanguage": "language name e.g. javascript, vue, html, css, python (empty if no code)"
    },
    {
      "title": "Hour 2 — [Focus]",
      "description": "...",
      "code": "...",
      "codeLanguage": "..."
    },
    {
      "title": "Hour 3 — [Focus]",
      "description": "...",
      "code": "...",
      "codeLanguage": "..."
    },
    {
      "title": "Hour 4 — [Focus]",
      "description": "...",
      "code": "...",
      "codeLanguage": "..."
    }
  ],
  "ignoreList": ["Specific topic to ignore 1", "Specific topic to ignore 2", "Specific topic to ignore 3", "and so on"],
  "struggleConcept": {
    "concept": "Name of the single reactivity/concept everyone struggles with",
    "explanation": "A direct 1-2 sentence clarification of this concept."
  },
  "exercise": {
    "title": "The Golden Exercise",
    "description": "Introduce the one concrete practice exercise (e.g. Employee Directory) that puts them ahead of 70% of learners.",
    "requirements": ["Requirement 1", "Requirement 2", "Requirement 3", "Requirement 4"]
  },
  "mentalModel": [
    "Question 1 professionals ask when building",
    "Question 2",
    "Question 3",
    "Question 4"
  ],
  "nextProject": {
    "title": "Your Next Project",
    "description": "A realistic intermediate project tailored to the skill (fetch mock data, edit, paginate, filter, save to localStorage).",
    "features": ["Feature 1", "Feature 2", "Feature 3"]
  }
}`
      },
      {
        role: 'user',
        content: `Create a 4-hour masterclass guide for the skill: "${topic}"`
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
    console.error('Summary generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate 4-hour plan' },
      { status: 500 }
    );
  }
}
