export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        By using Break My Guard, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Usage
      </h2>

      <p className="mb-4">
        This game is provided for entertainment and educational purposes only.
        You agree not to misuse the service or attempt to exploit it outside of
        normal gameplay.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Availability
      </h2>

      <p className="mb-4">
        We do not guarantee uninterrupted availability. Features may change,
        reset, or be removed without notice.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Liability
      </h2>

      <p>
        Break My Guard is provided “as is” without warranties of any kind. We are
        not responsible for any loss or damages arising from use of the game.
      </p>

      <p className="mt-6 text-zinc-400 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </>
  );
}
