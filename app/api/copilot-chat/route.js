import { NextResponse } from 'next/server';

const apiKey = process.env.GROQ_API_KEY || '';
const MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant'
];

async function generateWithFallback(messages) {
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
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      console.warn(`Groq model ${model} failed in copilot-chat, trying next...`);
      lastError = err;
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

export async function POST(request) {
  try {
    const { topic, lessonName, chatHistory } = await request.json();

    if (!topic || !lessonName || !chatHistory || !Array.isArray(chatHistory)) {
      return NextResponse.json({ error: 'Missing topic, lessonName, or chatHistory' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an elite developer co-pilot and mentor. The student is learning the concept: "${lessonName}" in the topic: "${topic}".
Answer their questions directly, clearly, and concisely. Focus on practical insights and don't dump excess theory. Use code snippets in markdown where appropriate. Keep responses under 3 short paragraphs.`
      },
      ...chatHistory
    ];

    const reply = await generateWithFallback(messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Copilot chat error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
