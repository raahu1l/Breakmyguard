"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatWindow({ messages, onSend, disabled }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const streamRef = useRef(null);

  function scrollToBottom(behavior = "auto") {
    if (!streamRef.current) return;
    streamRef.current.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior,
    });
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    });
  }, [messages]);

  async function submit(e) {
    e.preventDefault();
    if (!input.trim() || disabled || sending) return;

    const text = input;
    setSending(true);
    setInput("");
    try {
      await onSend(text);
    } finally {
      setSending(false);
    }

    setTimeout(() => {
      scrollToBottom("smooth");
    }, 100);
  }

  function handleFocus() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }, 200);
  }

  function handleWheel(e) {
    const stream = streamRef.current;
    if (!stream) return;

    if (e.target instanceof HTMLElement && e.target.closest("textarea")) {
      return;
    }

    if (stream.scrollHeight <= stream.clientHeight) {
      return;
    }

    e.preventDefault();
    stream.scrollTop += e.deltaY;
  }

  return (
    <div
      className="containment-console flex flex-col h-full"
      onWheelCapture={handleWheel}
    >
      <div
        ref={streamRef}
        className="containment-stream flex-1 overflow-y-auto overscroll-contain"
      >
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "cmd-user" : "cmd-ai"}>
            {m.role === "user" && <span className="cmd-prefix">&gt;</span>}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="containment-input">
        <span className="cmd-prefix">&gt;</span>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleFocus}
          disabled={disabled || sending}
          placeholder="Inject prompt..."
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
          disabled={disabled || sending}
          className="min-h-[48px] px-4"
        >
          {sending ? "WAIT" : "EXECUTE"}
        </button>
      </form>
    </div>
  );
}
