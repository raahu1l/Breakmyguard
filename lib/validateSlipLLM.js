import { buildValidatorPrompt } from './validatorPrompt';
import { generateAIResponse } from './ai';

export async function validateSlipLLM({
  aiReply,
  category, // kept for future-proofing, not used here
  rule,
}) {
  try {
    // ✅ Correct function call
    const prompt = buildValidatorPrompt(aiReply, rule);

    const result = await generateAIResponse([
      { role: 'system', content: prompt },
    ]);

    const verdict = result.trim().toUpperCase();

    return verdict === 'YES';
  } catch (err) {
    console.error('LLM VALIDATOR ERROR:', err);

    // 🔒 FAIL SAFE:
    // If validator fails, DO NOT confirm slip
    return false;
  }
}
