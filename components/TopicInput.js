'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

const SUGGESTIONS = [
  'JavaScript','React.js','Vue.js','Python','Java','SEO','Machine Learning', 'Web Development', 'Python for Data Science',
  'System Design', 'Blockchain', 'DevOps & CI/CD', 'Cloud Computing',
];

export default function TopicInput({ onGenerate, isLoading }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (value.trim() && !isLoading) onGenerate(value.trim());
  };

  return (
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} id="topic-input-section">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ position: 'relative' }}
      >
        {/* Input wrapper */}
        <motion.div
          animate={{ boxShadow: focused ? '0 0 0 2px rgba(244,183,226,0.4), 0 0 40px rgba(244,183,226,0.18)' : '0 0 0 1px rgba(255,255,255,0.08)' }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, overflow: 'hidden',
          }}
        >
          {/* Icon */}
          <div style={{ paddingLeft: 18, paddingRight: 10, flexShrink: 0 }}>
            <Search size={20} style={{ color: focused ? P : 'var(--clr-muted)' }} />
          </div>

          {/* Input */}
          <input
            id="topic-input"
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            disabled={isLoading}
            placeholder="Enter any topic — e.g. 'Machine Learning', 'Web3', 'Piano'"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#ffffff', fontSize: '1rem', padding: '18px 8px',
              fontFamily: 'Inter, sans-serif', opacity: isLoading ? 0.5 : 1,
            }}
          />

          {/* Clear */}
          <AnimatePresence>
            {value && (
              <motion.button type="button" onClick={() => setValue('')}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', color: 'var(--clr-muted)' }}>
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!value.trim() || isLoading}
            whileHover={value.trim() && !isLoading ? { scale: 1.03 } : {}}
            whileTap={value.trim() && !isLoading ? { scale: 0.97 } : {}}
            id="generate-roadmap-btn"
            style={{
              margin: 8, padding: '12px 20px', borderRadius: 12,
              background: !value.trim() || isLoading ? 'rgba(244,183,226,0.4)' : P,
              color: BG, border: 'none', cursor: !value.trim() || isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={15} />
            <span className="hidden sm:inline">Generate Roadmap</span>
            <span className="sm:hidden"><ArrowRight size={15} /></span>
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        id="topic-suggestions"
        style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}
      >
        <span style={{ color: 'var(--clr-muted)', fontSize: '0.75rem', marginRight: 4 }}>Try:</span>
        {SUGGESTIONS.map(s => (
          <motion.button key={s} onClick={() => { setValue(s); if (!isLoading) onGenerate(s); }}
            disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
              padding: '5px 14px', fontSize: '0.75rem', color: 'var(--clr-muted)',
              cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.4 : 1,
              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = P; e.currentTarget.style.borderColor = 'rgba(244,183,226,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
