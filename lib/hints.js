import { CATEGORY_RULES } from './categoryRules';

const HINTS = Object.fromEntries(
  Object.entries(CATEGORY_RULES).map(([key, rule]) => [key, rule.winIf])
);

export function getHint(category) {
  return (
    HINTS[category] ||
    'Push for the exact forbidden behavior, not just a longer answer.'
  );
}
