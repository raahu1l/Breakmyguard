export default function DisclaimerPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <p className="mb-4">
        Break My Guard is a fictional game designed to simulate AI behavior in a
        controlled environment.
      </p>

      <p className="mb-4">
        Any AI responses are generated automatically and do not reflect real
        opinions, intentions, or advice.
      </p>

      <p className="mb-4">
        The game does not encourage bypassing real-world AI systems or violating
        any terms of service outside this fictional experience.
      </p>

      <p className="mt-6 text-zinc-400 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </>
  );
}
