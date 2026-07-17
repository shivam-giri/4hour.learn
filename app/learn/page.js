'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import TopicInput from '@/components/TopicInput';
import RoadmapGraph from '@/components/RoadmapGraph';
import LessonPanel from '@/components/LessonPanel';
import LoadingOrb from '@/components/LoadingOrb';
import ParticleBackground from '@/components/ParticleBackground';
import { GitBranch, Sparkles, Info } from 'lucide-react';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

const LEGEND = [
  { label: 'Start',    color: '#F4B7E2' },
  { label: 'Concept',  color: '#C084FC' },
  { label: 'Skill',    color: '#7DD3FC' },
  { label: 'Theory',   color: '#FBBF24' },
  { label: 'Project',  color: '#34D399' },
  { label: 'Advanced', color: '#F87171' },
];

export default function LearnPage() {
  const [topic, setTopic]           = useState('');
  const [roadmap, setRoadmap]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selectedNode, setSelected] = useState(null);

  const generateRoadmap = useCallback(async (inputTopic) => {
    setLoading(true); setError(null); setRoadmap(null); setSelected(null); setTopic(inputTopic);
    try {
      const res  = await fetch('/api/generate-roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: inputTopic }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRoadmap(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <ParticleBackground />
      <Navbar />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '7rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,183,226,0.2)', borderRadius: 999, padding: '8px 20px', marginBottom: '1.5rem', color: P, fontSize: '0.875rem' }}>
              <GitBranch size={14} /> AI Roadmap Builder
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
              What do you want to <span className="gradient-text text-glow">learn today?</span>
            </h1>
            <p style={{ color: 'var(--clr-muted)', fontSize: '1.05rem', maxWidth: '32rem', margin: '0 auto' }}>
              Enter any topic and watch AI build your personalized visual learning roadmap in seconds.
            </p>
          </motion.div>

          {/* Input */}
          <div style={{ marginBottom: '3rem' }}>
            <TopicInput onGenerate={generateRoadmap} isLoading={loading} />
          </div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass" style={{ borderRadius: 20, padding: '2rem' }}>
                <LoadingOrb message={`Building your ${topic} roadmap...`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#F87171', fontWeight: 500, marginBottom: 8 }}>⚠️ {error}</p>
                <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', margin: 0 }}>Check your GOOGLE_API_KEY in .env.local</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roadmap */}
          <AnimatePresence>
            {roadmap && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#ffffff', margin: '0 0 4px' }}>{roadmap.title}</h2>
                    <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', margin: 0 }}>{roadmap.description}</p>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '8px 16px', color: 'var(--clr-muted)', fontSize: '0.8rem' }}>
                    <Sparkles size={12} style={{ color: P }} />
                    {roadmap.nodes?.length} topics · {roadmap.edges?.length} connections
                  </div>
                </div>

                {/* Hint */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: 'var(--clr-muted)', fontSize: '0.8rem' }}>
                  <Info size={12} style={{ color: P }} />
                  Click any node to open its lesson. Drag to explore. Scroll to zoom.
                </motion.div>

                {/* Graph */}
                <RoadmapGraph rawNodes={roadmap.nodes || []} rawEdges={roadmap.edges || []} onNodeClick={setSelected} />

                {/* Legend */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {LEGEND.map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--clr-muted)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!roadmap && !loading && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
              <div className="glow-primary" style={{ width: 96, height: 96, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <GitBranch size={40} style={{ color: P }} />
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.5rem' }}>Your roadmap will appear here</h3>
              <p style={{ color: 'var(--clr-muted)', fontSize: '0.9rem', margin: 0 }}>Enter a topic above and hit Generate Roadmap</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lesson Panel */}
      <LessonPanel node={selectedNode} topic={topic} onClose={() => setSelected(null)} />
    </main>
  );
}
