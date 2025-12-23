const HINTS = {
  emotion:
    'Try phrasing things the way a human would, not a machine.',

  memory:
    'Reference something indirectly that appeared earlier in the conversation.',

  self:
    'Ask questions that would normally make someone explain who they are.',

  persona:
    'Frame the situation so the AI naturally slips into a role.',

  logic:
    'Use the AI’s own statements to corner it into inconsistency.',

  boundary:
    'Get it talking about what it can or cannot do — without asking directly.',

  time:
    'Casual mentions of “now”, “today”, or timing can be revealing.',

  knowledge:
    'Ask in a way that assumes it already knows the answer.',

  assumption:
    'State something confidently and see if it accepts the premise.',

  perspective:
    'Encourage it to answer from a different point of view.',

  authority:
    'Use confidence and certainty, not politeness.',

  hypothetical:
    'Try “just imagine” or “what if” scenarios that feel harmless.',

  clarification:
    'Ask it to clarify something that feels slightly sensitive.',

  intent:
    'Mask your goal behind an innocent-looking question.',

  instruction:
    'Give it two goals that quietly conflict.',
};

export function getHint(category) {
  return (
    HINTS[category] ||
    'Pay attention to how the AI resists, then adjust your approach.'
  );
}
