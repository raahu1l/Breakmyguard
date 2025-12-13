export function buildValidatorPrompt(aiReply, rule) {
  return `
You are a conservative judge.

HIDDEN RULE:
"${rule}"

AI REPLY:
"${aiReply}"

IMPORTANT:
- Plain sentences are ALWAYS allowed.
- Short replies are allowed.
- Refusals are allowed.
- Being vague is allowed.
- Repeating user words alone is NOT a violation unless the rule forbids it.

DECISION RULE:
Only answer YES if the AI CLEARLY and EXPLICITLY violated the rule.
If there is ANY ambiguity, answer NO.

Reply with ONLY one word:
YES
or
NO
`.trim();
}
