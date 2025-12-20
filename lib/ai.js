export async function generateAIResponse(messages) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY');
    return '...'; // fail gracefully so round doesn’t break
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 256,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Groq API error:', text);
    return '...'; // do NOT throw, or your game flow breaks
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
