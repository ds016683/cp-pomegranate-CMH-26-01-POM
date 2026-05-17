import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/odin-chat`;

function OdinIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stylized raven/all-seeing eye for Odin */}
      <circle cx="20" cy="20" r="18" fill="#1a1a2e" />
      <ellipse cx="20" cy="20" rx="9" ry="9" fill="#8B1E2D" opacity="0.9" />
      <circle cx="20" cy="20" r="4" fill="#fde8e8" />
      <circle cx="20" cy="20" r="2" fill="#16232f" />
      <path d="M5 20 Q12 14 20 20 Q12 26 5 20Z" fill="#8B1E2D" opacity="0.4" />
      <path d="M35 20 Q28 14 20 20 Q28 26 35 20Z" fill="#8B1E2D" opacity="0.4" />
    </svg>
  );
}

export function OdinChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Get Supabase session token for auth
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error ?? 'Unknown error from Odin');
      }

      const data = await res.json();
      const reply = data.content?.[0]?.text ?? '(no response)';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <OdinIcon size={32} />
        <div>
          <h2 className="text-sm font-bold text-[#1a2e45]">Ask Odin</h2>
          <p className="text-[10px] text-gray-400">Strategic intelligence · claude-opus-4-5 · CMH-26-01-POM</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#f7f9fc]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 pt-16">
            <OdinIcon size={48} />
            <p className="text-sm font-medium text-[#1a2e45]">Odin is ready.</p>
            <p className="text-xs text-gray-400 max-w-xs">Ask anything about the Pomegranate Market FIM engagement — strategy, payers, deliverables, or the evidence base.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="mt-1 shrink-0"><OdinIcon size={20} /></div>
            )}
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#8B1E2D] text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="mt-1 shrink-0"><OdinIcon size={20} /></div>
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
            ⚠ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-6 py-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Odin about the engagement…"
            rows={2}
            className="flex-1 resize-none rounded-lg bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#1a2e45] focus:outline-none transition"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-[#8B1E2D] px-4 py-2.5 text-white hover:bg-[#a0243a] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-300">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  );
}
