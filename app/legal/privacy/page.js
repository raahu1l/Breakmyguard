export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Break My Guard respects your privacy. We do not store chat conversations
        or personal messages.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        What We Collect
      </h2>

      <ul className="list-disc ml-6 space-y-2">
        <li>Anonymous gameplay statistics (wins, losses, categories)</li>
        <li>Optional nickname stored locally in your browser</li>
        <li>Anonymous feedback ratings</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        What We Do NOT Collect
      </h2>

      <ul className="list-disc ml-6 space-y-2">
        <li>Chat messages or prompts</li>
        <li>Email addresses or passwords</li>
        <li>Real-world identity data</li>
      </ul>

      <p className="mt-6">
        All gameplay data is anonymized and used only to improve difficulty
        balancing and game experience.
      </p>

      <p className="mt-4 text-zinc-400 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </>
  );
}
