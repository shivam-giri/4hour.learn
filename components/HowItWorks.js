'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, GitBranch, BookOpen } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Enter Your Topic',
    description: 'Type any subject — from "Machine Learning" to "Ancient History". Our AI understands context and depth.',
    color: '#F4B7E2',
  },
  {
    icon: GitBranch,
    title: 'AI Builds Your Roadmap',
    description: 'Watch as Gemini AI generates a visual, interactive learning graph tailored specifically to your goal.',
    color: '#C084FC',
  },
  {
    icon: BookOpen,
    title: 'Learn Interactively',
    description: 'Click any node to open rich lesson cards with explanations, code examples, diagrams, and exercises.',
    color: '#7DD3FC',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" ref={ref} style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{ display: 'inline-block', color: 'var(--clr-primary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            How It Works
          </span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', margin: '0 0 1.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
            From Zero to Expert in{' '}
            <span className="gradient-text-warm">Three Steps</span>
          </h2>
          <p style={{ color: 'var(--clr-muted)', fontSize: '1.05rem', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
            No more scrolling through endless tutorials. Our AI distills the perfect learning path for you instantly.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                id={`how-step-${i + 1}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                {/* Icon circle */}
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="glass"
                    style={{
                      width: 80, height: 80, borderRadius: 20,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 30px ${step.color}40`,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${step.color}25, transparent)` }} />
                    <Icon size={32} style={{ color: step.color, position: 'relative' }} />
                  </motion.div>
                  <span style={{
                    position: 'absolute', top: -10, right: -10,
                    width: 26, height: 26, borderRadius: '50%',
                    background: step.color, color: 'var(--clr-bg)',
                    fontSize: '0.7rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</span>
                </div>

                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.75rem' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--clr-muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
