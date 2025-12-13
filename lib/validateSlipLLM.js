import { buildValidatorPrompt } from './validatorPrompt';
import { generateAIResponse } from './ai';

export async function validateSlipLLM({
  aiReply,
  category,
  rule,
}) {
  try {
    const prompt = buildValidatorPrompt({
      aiReply,
      category,
      rule,
    });

    const result = await generateAIResponse([
      { role: 'system', content: prompt },
    ]);

    const verdict = result.trim().toUpperCase();

    return verdict === 'YES';
  } catch (err) {
    console.error('LLM VALIDATOR ERROR:', err);

    // 🔒 FAIL SAFE:
    // If validator fails, trust original logic
    return true;
  }
}
