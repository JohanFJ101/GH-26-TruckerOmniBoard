import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Truck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { askCopilot, pingOllama } from '../../lib/ollamaApi';
import CopilotMessage from './CopilotMessage';
import SuggestedPrompts from './SuggestedPrompts';
import type { CopilotMessage as MessageType } from '../../types';

const WELCOME = `Welcome to **DispatchIQ Copilot**. I have access to your full fleet data — 6 drivers, active loads, alerts, and cost metrics.

Ask me anything about your fleet: driver recommendations, HOS status, cost analysis, delay risks, or dispatch planning. I'll give you direct, actionable answers.`;

export default function CopilotPanel() {
  const { drivers, loads, alerts, metrics } = useStore();
  const [messages, setMessages] = useState<MessageType[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME, timestamp: 'just now' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: MessageType = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const streamId = `a-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const isPing = /local ai model|ollama/i.test(text) && /running|responding|status|up|online/i.test(text);

      if (isPing) {
        const response = await pingOllama();
        setMessages((prev) => [...prev, { id: streamId, role: 'assistant', content: response, timestamp }]);
        return;
      }

      let firstToken = true;
      let buffer = '';
      let flushTimer: ReturnType<typeof setTimeout> | null = null;

      const flush = () => {
        if (!buffer) return;
        const chunk = buffer;
        buffer = '';
        setMessages((prev) =>
          prev.map((m) => m.id === streamId ? { ...m, content: m.content + chunk } : m)
        );
      };

      const finalResponse = await askCopilot(
        text.trim(),
        history,
        { drivers, loads, alerts, metrics },
        (token) => {
          if (firstToken) {
            firstToken = false;
            setLoading(false);
            setMessages((prev) => [...prev, { id: streamId, role: 'assistant', content: token, timestamp }]);
          } else {
            buffer += token;
            if (!flushTimer) {
              flushTimer = setTimeout(() => {
                flushTimer = null;
                flush();
              }, 60);
            }
          }
        }
      );

      if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
      flush();

      // If no tokens were streamed (Ollama unreachable → fallback returned), show the fallback
      setMessages((prev) => {
        if (prev.find((m) => m.id === streamId)) return prev;
        return [...prev, { id: streamId, role: 'assistant', content: finalResponse, timestamp }];
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: streamId, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([
      { id: 'welcome', role: 'assistant', content: WELCOME, timestamp: 'just now' },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 104px)' }}>
      {/* Header */}
      <div className="card" style={{ padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={16} color="white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dispatch Copilot</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={clearChat} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            <Trash2 size={14} /> Clear
          </button>
          <button className="btn-secondary" style={{ fontSize: '12px' }}>Export</button>
        </div>
      </div>

      {/* Messages */}
      <div className="card" style={{ flex: 1, overflow: 'auto', padding: '12px', borderRadius: 0, borderTop: 'none', borderBottom: 'none' }}>
        {messages.length === 1 && <SuggestedPrompts onSelect={handlePromptSelect} />}

        {messages.map((msg) => (
          <CopilotMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={12} color="white" />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="card" style={{ padding: '10px 16px', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
        {messages.length > 1 && <SuggestedPrompts onSelect={handlePromptSelect} />}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about your fleet..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '2px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontFamily: 'Sora, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{ padding: '8px 16px', opacity: !input.trim() || loading ? 0.5 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
