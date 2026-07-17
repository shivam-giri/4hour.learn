'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Map, Code2, Zap, Globe, Lock } from 'lucide-react';

const FEATURES = [
  { icon: Cpu,   title: 'Gemini AI Powered',    description: "Backed by Google's Gemini 1.5 Flash for blazing-fast, accurate roadmap generation with deep subject knowledge.", color: '#F4B7E2', wide: false },
  { icon: Map,   title: 'Visual Learning Graph', description: 'Interactive React Flow graph with draggable nodes, zoom, pan, and click-to-learn — your knowledge map, visualized.',  color: '#C084FC', wide: true  },
  { icon: Code2, title: 'Code-First Lessons',    description: 'Every lesson card includes syntax-highlighted code snippets, runnable examples, and hands-on exercises.',               color: '#7DD3FC', wide: true  },
  { icon: Zap,   title: 'Instant Generation',    description: 'Complete personalized roadmaps generated in under 5 seconds. No waiting, no sign-up required.',                        color: '#FBBF24', wide: false },
  { icon: Globe, title: 'Any Topic',             description: 'From quantum physics to cooking techniques — if it can be learned, we can map it.',                                   color: '#34D399', wide: false },
  { icon: Lock,  title: 'Private & Secure',      description: 'Your learning data stays private. No tracking, no selling your data — just pure learning.',                           color: '#F4B7E2', wide: false },
];

function FeatureCard({ feature, index, inView }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = feature.icon;

  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 18, y: -((e.clientY - r.top) / r.height - 0.5) * 18 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      id={`feature-card-${index}`}
      style={{
        gridColumn: feature.wide ? 'span 2' : 'span 1',
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '2rem',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Hover glow bg */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        background: `radial-gradient(circle at 30% 30%, ${feature.color}12, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        style={{
          width: 48, height: 48, borderRadius: 14, marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${feature.color}18`, boxShadow: `0 0 20px ${feature.color}30`,
          position: 'relative',
        }}
      >
        <Icon size={22} style={{ color: feature.color }} />
      </motion.div>

      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', margin: '0 0 0.75rem' }}>
        {feature.title}
      </h3>
      <p style={{ color: 'var(--clr-muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
        {feature.description}
      </p>

      {/* Corner accent */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 64, height: 64, borderRadius: '12px 0 0 0', background: feature.color, opacity: 0.05 }} />
    </motion.div>
  );
}

export default function FeaturesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{ display: 'inline-block', color: 'var(--clr-primary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Features
          </span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', margin: 0, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
            Everything You Need to{' '}
            <span className="gradient-text">Master Any Skill</span>
          </h2>
        </motion.div>

        {/* Responsive grid: 3 cols on desktop, 1 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}
          className="features-grid"
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .features-grid > * { grid-column: span 1 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
