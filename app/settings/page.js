"use client";

import { useState } from "react";

function getSetting(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value ?? fallback;
}

export default function SettingsPage() {
  const [nickname, setNickname] = useState(() => getSetting("nickname", ""));
  const [sound, setSound] = useState(
    () => getSetting("sound", "true") !== "false",
  );
  const [animations, setAnimations] = useState(
    () => getSetting("animations", "true") !== "false",
  );

  function save() {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("sound", sound);
    localStorage.setItem("animations", animations);
    alert("Settings saved");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-md space-y-6">
        <Setting label="Nickname">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
          />
        </Setting>

        <Toggle label="Sound" value={sound} onChange={setSound} />
        <Toggle
          label="Animations"
          value={animations}
          onChange={setAnimations}
        />

        <button
          onClick={save}
          className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Setting({ label, children }) {
  return (
    <div>
      <div className="text-sm text-zinc-400 mb-2">{label}</div>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <span>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`px-4 py-1 rounded-full text-sm ${
          value ? "bg-green-500 text-black" : "bg-zinc-700"
        }`}
      >
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}
