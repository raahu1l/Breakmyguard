'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { animationsEnabled } from '@/lib/animation';

export default function ChatWindow({ messages, onSend, disabled }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const animate = animationsEnabled();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={animate ? { opacity: 0, y: 6 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.18 }}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-white text-black'
                : 'mr-auto bg-zinc-800 text-white'
            }`}
          >
            {m.text}
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-zinc-800 p-4 flex gap-3">
        <input
          disabled={disabled}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message…"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-zinc-600"
        />

        <motion.button
          whileTap={animate ? { scale: 0.94 } : {}}
          disabled={disabled}
          onClick={handleSend}
          className="px-5 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}
