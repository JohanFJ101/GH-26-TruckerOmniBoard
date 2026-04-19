interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  "Who's my best driver for a Dallas pickup at 6am?",
  "Which loads are at risk of delay today?",
  "Why is my cost per mile up this week?",
  "Show me Ray Delgado's HOS status",
  "What's my fleet availability tomorrow morning?",
  "Which driver should I NOT assign to long hauls right now?",
  "Is the local AI model (Ollama) running and responding?",
];

const DEBUG_PROMPTS = new Set([
  "Is the local AI model (Ollama) running and responding?",
]);

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px 0' }}>
      {prompts.map((prompt) => {
        const isDebug = DEBUG_PROMPTS.has(prompt);
        return (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: `1px solid ${isDebug ? '#D1D5DB' : '#E2E8F0'}`,
            backgroundColor: isDebug ? '#F9FAFB' : '#FFFFFF',
            color: isDebug ? '#9CA3AF' : '#374151',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = isDebug ? '#9CA3AF' : 'var(--accent-primary)';
            e.currentTarget.style.color = isDebug ? '#6B7280' : 'var(--accent-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = isDebug ? '#D1D5DB' : '#E2E8F0';
            e.currentTarget.style.color = isDebug ? '#9CA3AF' : '#374151';
          }}
        >
          {isDebug && (
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', backgroundColor: '#E5E7EB', color: '#6B7280', padding: '1px 5px', borderRadius: '4px' }}>
              DEBUG
            </span>
          )}
          {prompt}
        </button>
        );
      })}
    </div>
  );
}
