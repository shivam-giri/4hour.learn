'use client';

import { motion } from 'framer-motion';

const P  = 'var(--clr-primary)';
const SEC = 'var(--clr-secondary)';
const ACC = 'var(--clr-accent)';

export default function LoadingOrb({ message = 'AI is thinking...' }) {
  return (
    <div id="loading-orb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '4rem 0' }}>
      {/* Rotating rings */}
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        {/* Outer */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: P, borderRightColor: 'rgba(244,183,226,0.3)' }} />
        {/* Middle */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '2px solid transparent', borderTopColor: SEC, borderLeftColor: 'rgba(192,132,252,0.3)' }} />
        {/* Inner */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 28, borderRadius: '50%', border: '2px solid transparent', borderTopColor: ACC, borderRightColor: 'rgba(125,211,252,0.3)' }} />
        {/* Center dot */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: P }} />
        </motion.div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: P }} />
        ))}
      </div>

      <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{message}</p>
    </div>
  );
}
