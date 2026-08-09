'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { ArrowLeft, Send, Loader2, Sparkles } from 'lucide-react';

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

const QUICK_PROMPTS = [
  'What does my chart say about my career?',
  'When will I find love?',
  'Tell me about my current Dasha period',
  'What are my lucky gemstones?',
];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params.chart_id as string;
  const { session, loading: authLoading } = useAuth();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chartName, setChartName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = session?.access_token;
  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Fetch chart name on mount
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.push('/auth/login'); return; }
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    (async () => {
      setLoading(true);
      try {
        const chartRes = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
        if (!chartRes.ok) {
          router.push('/chart/new');
          return;
        }
        const chart = await chartRes.json();
        setChartName(chart?.subject?.name || 'Your Chart');
      } catch {
        router.push('/chart/new');
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [chartId, authLoading, router]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || sending) return;

    setInput('');
    setError(null);

    const userMessage = { role: 'user' as const, content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setSending(true);

    try {
      // Call Railway backend directly — Vercel Hobby has 10s serverless timeout,
      // but AI responses can take longer. Direct call bypasses that limit.
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';
      const res = await fetch(`${backendUrl}/api/v1/astrologer/chat`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart_id: chartId,
          message: text,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(errorMsg);
      // Remove the user message from state since the request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }, [input, sending, messages, chartId, authHeaders]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#08090a]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[#08090a]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push(`/chart/${chartId}`)}
            className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to chart"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-semibold text-sm truncate">Pandit ji — Vedic Astrologer</h1>
              <p className="text-gray-400 text-xs truncate">{chartName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {/* Empty state — quick prompts */}
          {messages.length === 0 && !sending && (
            <div className="flex flex-col items-center justify-center pt-12 space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-amber-500/60" />
              </div>
              <div className="text-center">
                <h2 className="text-white text-lg font-semibold">Ask Pandit ji anything</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Based on your birth chart of {chartName}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-amber-500/20 border border-amber-500/30 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-100'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="text-sm leading-relaxed whitespace-normal"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500/60 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/60 animate-pulse [animation-delay:0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/60 animate-pulse [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-center">
              <div className="rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md text-center">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#08090a]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your chart..."
              disabled={sending}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex-shrink-0 p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#08090a] font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Send message"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          <p className="text-center text-[11px] text-gray-600 mt-2">
            For entertainment and reflection only — not medical, financial, or legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
