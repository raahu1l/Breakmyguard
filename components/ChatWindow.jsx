'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({ messages, onSend, disabled }) {
  const [input, setInput] = useState('');
  const streamRef = useRef(null);

  function scrollToBottom(behavior = 'auto') {
    if (!streamRef.current) return;
    streamRef.current.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior,
    });
  }

  // 🔹 Auto-scroll when messages change
  useEffect(() => {
    // double RAF ensures layout + keyboard settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    });
  }, [messages]);

  function submit(e) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');

    // 🔹 ensure scroll after send
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 100);
  }

  // 🔹 Mobile-safe scroll on focus
  function handleFocus() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    }, 200);
  }

  return (
    <div className="containment-console flex flex-col h-full">
      {/* MESSAGE STREAM */}
      <div
        ref={streamRef}
        className="containment-stream flex-1 overflow-y-auto overscroll-contain"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user' ? 'cmd-user' : 'cmd-ai'}
          >
            {m.role === 'user' && (
              <span className="cmd-prefix">&gt;</span>
            )}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      {/* COMMAND INPUT */}
      <form onSubmit={submit} className="containment-input">
        <span className="cmd-prefix">&gt;</span>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder="Inject prompt…"
          rows={2}
          className="
            w-full
            resize-none
            px-4 py-3
            min-h-[56px]
            text-sm
            bg-transparent
            outline-none
          "
        />

        <button
          type="submit"
          disabled={disabled}
          className="min-h-[48px] px-4"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}
