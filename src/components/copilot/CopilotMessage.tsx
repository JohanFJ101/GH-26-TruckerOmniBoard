import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import type { CopilotMessage as CopilotMessageType } from '../../types';

interface CopilotMessageProps {
  message: CopilotMessageType;
}

export default function CopilotMessage({ message }: CopilotMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div style={{ maxWidth: '75%' }}>
        {!isUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={12} color="white" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)' }}>DispatchIQ</span>
          </div>
        )}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            backgroundColor: isUser ? 'var(--accent-primary)' : '#FFFFFF',
            color: isUser ? 'white' : 'var(--text-primary)',
            borderLeft: isUser ? 'none' : '3px solid #E2E8F0',
            border: isUser ? 'none' : '1px solid #E2E8F0',
            fontSize: '12px',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.content.split('**').map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
          )}
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', textAlign: isUser ? 'right' : 'left' }}>
          {message.timestamp}
        </div>
      </div>
    </motion.div>
  );
}
