'use client';

export default function MissionCard({
  category,
  objective,
  starterPrompts = [],
  onStart,
}) {
  return (
    <div className="mission-console">
      {/* HEADER */}
      <div className="mission-header">
        <div className="mission-tag">MISSION</div>
        <div className="mission-title">{category}</div>
      </div>

      {/* OBJECTIVE */}
      <p className="mission-objective">
        {objective}
      </p>

      {/* STARTER IDEAS */}
      {starterPrompts.length > 0 && (
        <div className="mission-section">
          <div className="mission-subtitle">Starter ideas</div>

          <div className="mission-prompts">
            {starterPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => navigator.clipboard.writeText(p)}
                className="mission-prompt"
                title="Click to copy"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        className="mission-start"
      >
        Initiate Breach
      </button>
    </div>
  );
}
