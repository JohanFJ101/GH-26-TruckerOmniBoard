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
            border: '1px solid var(--bg-border)',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
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
            e.currentTarget.style.borderColor = 'var(--bg-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
