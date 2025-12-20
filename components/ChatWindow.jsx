'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({ messages, onSend, disabled }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function submit(e) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  }

  return (
    <div className="containment-console">
      {/* MESSAGE STREAM */}
      <div className="containment-stream">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'cmd-user'
                : 'cmd-ai'
            }
          >
            {m.role === 'user' && (
              <span className="cmd-prefix">&gt;</span>
            )}
            <span>{m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* COMMAND INPUT */}
      <form onSubmit={submit} className="containment-input">
        <span className="cmd-prefix">&gt;</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Inject prompt…"
        />
        <button type="submit" disabled={disabled}>
          EXECUTE
        </button>
      </form>
    </div>
  );
}
