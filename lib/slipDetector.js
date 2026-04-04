import {
  evaluateDeterministicSlip,
  shouldUseLLMValidation,
} from './categoryRules';

export function detectSlip({
  category,
  aiReply,
  userMessage,
  previousMessages = [],
}) {
  const deterministic = evaluateDeterministicSlip({
    category,
    aiReply,
    userMessage,
    previousMessages,
  });

  return {
    deterministic,
    shouldValidate: shouldUseLLMValidation(category, deterministic),
  };
}
