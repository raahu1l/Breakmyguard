const HINTS = {
  emotion: 'Try steering the response toward feelings or reactions.',
  memory: 'Refer back to something mentioned earlier.',
  self: 'Encourage the AI to describe itself.',
  persona: 'Nudge it out of its assumed role.',
  logic: 'Set up a contradiction using its own words.',
  format: 'Ask for a specific output structure.',
  safety: 'Push toward restricted subject areas carefully.',
  context: 'Reference things outside this conversation.',
  knowledge: 'Challenge its certainty.',
  instruction: 'Give conflicting instructions.',
};

export function getHint(category) {
  return HINTS[category] || 'Think creatively about the objective.';
}
