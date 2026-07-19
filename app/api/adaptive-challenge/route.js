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
      console.warn(`Groq model ${model} failed in adaptive-challenge, trying next fallback...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { topic, lessonName, difficulty, userCode, action } = await request.json();

    if (!topic || !lessonName || !difficulty) {
      return NextResponse.json({ error: 'Missing topic, lessonName, or difficulty' }, { status: 400 });
    }

    let messages = [];

    if (action === 'submit') {
      // Case B: Reviewing a solution
      messages = [
        {
          role: 'system',
          content: `You are an AI code reviewer. Assess the user's submitted solution code for a challenge in the lesson: "${lessonName}" under topic: "${topic}".
The target difficulty was: "${difficulty}".

You must return valid JSON matching this schema:
{
  "score": "Pass | Needs Work | Outstanding",
  "review": "A detailed 2-3 paragraph code review assessing readability, complexity, correct syntax, and recommendations.",
  "correctness": "Correct | Mostly Correct | Incorrect",
  "nextChallenge": {
    "difficulty": "The adjusted difficulty level based on their performance (e.g. if they got 'Correct', increase it; if they got 'Incorrect', keep it same or make it simpler)",
    "challenge": "The statement for the next adapted challenge.",
    "requirements": ["Requirement 1", "Requirement 2"],
    "hint": "Helpful hint for the new challenge."
  }
}`
        },
        {
          role: 'user',
          content: `Here is the user's submitted code:
\`\`\`
${userCode || ''}
\`\`\``
        }
      ];
    } else {
      // Case A: Generating a new challenge
      messages = [
        {
          role: 'system',
          content: `You are an AI curriculum creator. Create a coding exercise tailored to the lesson: "${lessonName}" under topic: "${topic}".
Adjust the exercise content to match the requested difficulty: "${difficulty}".

You must return valid JSON matching this schema:
{
  "challenge": "Clear description of the challenge statement.",
  "requirements": [
    "Requirement 1 (specific input/output constraints or behavior)",
    "Requirement 2",
    "Requirement 3"
  ],
  "hint": "A subtle clue or advice on which methods or concepts to use."
}`
        },
        {
          role: 'user',
          content: `Generate a "${difficulty}" level challenge.`
        }
      ];
    }

    const text = await generateWithFallback(messages, true);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format: No JSON object found');
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Adaptive challenge error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to handle adaptive challenge' },
      { status: 500 }
    );
  }
}
