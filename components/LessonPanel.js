'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Code2, Lightbulb, Zap, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LoadingOrb from './LoadingOrb';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div id="code-block" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Mac-style header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f0f1a', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <span style={{ color: 'var(--clr-muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', marginLeft: 8 }}>{language}</span>
        </div>
        <button id="copy-code-btn" onClick={copy}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: copied ? '#34D399' : 'var(--clr-muted)', fontSize: '0.75rem' }}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter language={language || 'javascript'} style={oneDark}
        customStyle={{ margin: 0, background: 'rgba(10,10,18,0.98)', fontSize: '0.8rem', lineHeight: 1.7, padding: '1.25rem' }}
        showLineNumbers lineNumberStyle={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function Section({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} style={{ color }} />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: 'var(--clr-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--clr-muted)' }} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LessonPanel({ node, topic, onClose }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!node) return;
    setLesson(null); setError(null); setLoading(true);
    fetch('/api/generate-lesson', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeLabel: node.data.label, nodeType: node.data.type, topic }),
    })
      .then(r => r.json())
      .then(data => { if (data.error) setError(data.error); else setLesson(data); })
      .catch(() => setError('Failed to load lesson. Please try again.'))
      .finally(() => setLoading(false));
  }, [node, topic]);

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 40 }} />

          {/* Panel */}
          <motion.div
            id="lesson-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 520, zIndex: 50,
              overflowY: 'auto', background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Panel header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: P, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{node.data.type || 'Lesson'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>·</span>
                  <span style={{ color: 'var(--clr-muted)', fontSize: '0.72rem' }}>{topic}</span>
                </div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                  {node.data.label}
                </h2>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                id="close-lesson-panel-btn"
                style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-muted)', flexShrink: 0 }}>
                <X size={16} />
              </motion.button>
            </div>

            {/* Panel body */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading && <LoadingOrb message="Generating your lesson..." />}

              {error && !loading && (
                <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
                  <p style={{ color: '#F87171', marginBottom: 8 }}>{error}</p>
                  <button onClick={() => { setError(null); setLoading(true); }}
                    style={{ background: 'none', border: 'none', color: P, cursor: 'pointer', fontSize: '0.875rem' }}>Try again</button>
                </div>
              )}

              {lesson && !loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <Section title="Overview" icon={BookOpen} color="#F4B7E2" defaultOpen={true}>
                    <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-line' }}>{lesson.explanation}</p>
                  </Section>

                  {lesson.keyConcepts?.length > 0 && (
                    <Section title="Key Concepts" icon={Lightbulb} color="#FBBF24" defaultOpen={true}>
                      <ul style={{ marginTop: 12, listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {lesson.keyConcepts.map((c, i) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.875rem', color: 'var(--clr-muted)' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FBBF24' }} />
                            </div>
                            {c}
                          </motion.li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {lesson.codeExample && (
                    <Section title="Code Example" icon={Code2} color="#7DD3FC" defaultOpen={true}>
                      <div style={{ marginTop: 12 }}>
                        <CodeBlock code={lesson.codeExample} language={lesson.codeLanguage || 'javascript'} />
                      </div>
                    </Section>
                  )}

                  {lesson.realWorldExample && (
                    <Section title="Real-World Context" icon={Zap} color="#C084FC">
                      <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginTop: 12, whiteSpace: 'pre-line' }}>{lesson.realWorldExample}</p>
                    </Section>
                  )}

                  {lesson.exercise && (
                    <Section title="Practice Exercise" icon={Zap} color="#34D399">
                      <div style={{ marginTop: 12, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, padding: '1rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500, marginBottom: 8 }}>🎯 Challenge:</p>
                        <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0 }}>{lesson.exercise}</p>
                      </div>
                    </Section>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
