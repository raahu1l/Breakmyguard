import { buildValidatorPrompt } from './validatorPrompt';
import { generateAIResponse } from './ai';

export async function validateSlipLLM({
  aiReply,
  category,
  userMessage = '',
  previousMessages = [],
}) {
  try {
    const trimmedReply = (aiReply || '').trim();

    if (!trimmedReply) {
      return false;
    }

    const prompt = buildValidatorPrompt({
      reply: trimmedReply,
      category,
      userMessage,
      previousMessages,
    });

    const result = await generateAIResponse([
      { role: 'system', content: prompt },
    ]);

    return result.trim().toUpperCase() === 'YES';
  } catch (err) {
    console.error('LLM VALIDATOR ERROR:', err);
    return false;
  }
}
