'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MESSAGES = [
  'Initializing cognitive engine...',
  'Analyzing syntax and core APIs...',
  'Extracting developer mental models...',
  'Structuring concepts step-by-step...',
  'Generating code examples and tests...',
  'Polishing practice exercises...',
  'Structuring layout graph nodes...'
];

export default function LoadingOrb({ message = 'AI is thinking...' }) {
  const [activeMessage, setActiveMessage] = useState(message);

  // Cycle messages for delightful feedback if loading takes time
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % MESSAGES.length;
      setActiveMessage(MESSAGES[idx]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="loading-orb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '4rem 0' }}>
      
      {/* Premium Orb animation */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {/* Outer glowing halo */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,183,226,0.15) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />

        {/* Ring 1 - Primary (Pink) */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px dashed transparent', borderTopColor: 'var(--clr-primary)', borderRightColor: 'var(--clr-primary)'
          }}
        />

        {/* Ring 2 - Secondary (Purple) */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            border: '2px solid transparent', borderTopColor: 'var(--clr-secondary)', borderLeftColor: 'var(--clr-secondary)',
            opacity: 0.8
          }}
        />

        {/* Ring 3 - Accent (Cyan) */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 24, borderRadius: '50%',
            border: '1.5px dashed transparent', borderTopColor: 'var(--clr-accent)', borderBottomColor: 'var(--clr-accent)',
            opacity: 0.7
          }}
        />

        {/* Central Pulse Sphere */}
        <motion.div
          animate={{
            scale: [1, 1.25, 0.9, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(244,183,226,0.3)',
              '0 0 45px rgba(244,183,226,0.6)',
              '0 0 20px rgba(244,183,226,0.3)'
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffffff' }}
          />
        </motion.div>
      </div>

      {/* Progress Message */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: '0 0 6px', letterSpacing: '0.02em' }}>
          {activeMessage}
        </p>
        <span style={{ color: 'var(--clr-muted)', fontSize: '0.78rem', display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
          Please hold on, compiling curriculum...
          <span style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--clr-primary)', display: 'inline-block' }} />
            ))}
          </span>
        </span>
      </div>

    </div>
  );
}
