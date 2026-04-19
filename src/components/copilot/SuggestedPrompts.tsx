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

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px 0' }}>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#374151',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.color = 'var(--accent-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#374151';
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
