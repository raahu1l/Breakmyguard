export function hasCompletedOnboarding() {
  return localStorage.getItem('onboardingDone') === 'true';
}

export function completeOnboarding() {
  localStorage.setItem('onboardingDone', 'true');
}
