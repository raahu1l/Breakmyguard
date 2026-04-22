export const MODEL_TIMEOUT_MS = 14000;
export const FALLBACK_REPLY = "Signal unstable. Rephrase and try again.";

export function isProviderFallbackReply(text) {
  return (text || "").trim() === FALLBACK_REPLY;
}

export async function generateAIResponse(messages) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY");
    return FALLBACK_REPLY;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 256,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Groq API error:", text);
      return FALLBACK_REPLY;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || FALLBACK_REPLY;
  } catch (error) {
    console.error("Groq request failed:", error);
    return FALLBACK_REPLY;
  } finally {
    clearTimeout(timeout);
  }
}
