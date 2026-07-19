'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import TopicInput from '@/components/TopicInput';
import RoadmapGraph from '@/components/RoadmapGraph';
import LessonPanel from '@/components/LessonPanel';
import LoadingOrb from '@/components/LoadingOrb';
import ParticleBackground from '@/components/ParticleBackground';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  GitBranch, Sparkles, Info, Flame, EyeOff, Trophy,
  ArrowLeft, ArrowRight, Brain, Clock, HelpCircle, AlertCircle, Copy, Check
} from 'lucide-react';
import Magnetic from '@/components/Magnetic';

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

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', margin: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f0f1a', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <span style={{ color: 'var(--clr-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', marginLeft: 8 }}>{language}</span>
        </div>
        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: copied ? '#34D399' : 'var(--clr-muted)', fontSize: '0.72rem' }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter language={language || 'javascript'} style={oneDark}
        customStyle={{ margin: 0, background: 'rgba(10,10,18,0.98)', fontSize: '0.78rem', lineHeight: 1.6, padding: '1rem' }}
        showLineNumbers lineNumberStyle={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function LearnPage() {
  const [topic, setTopic]                       = useState('');
  const [step, setStep]                         = useState('input'); // 'input' | 'summary' | 'roadmap'
  const [summaryData, setSummaryData]           = useState(null);
  const [roadmap, setRoadmap]                   = useState(null);
  
  const [loadingSummary, setLoadingSummary]     = useState(false);
  const [loadingRoadmap, setLoadingRoadmap]     = useState(false);
  const [error, setError]                       = useState(null);
  const [selectedNode, setSelected]             = useState(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const savedTopic = localStorage.getItem('learn_topic');
      const savedStep = localStorage.getItem('learn_step');
      const savedSummary = localStorage.getItem('learn_summary');
      const savedRoadmap = localStorage.getItem('learn_roadmap');

      if (savedTopic) setTopic(savedTopic);
      if (savedStep) setStep(savedStep);
      if (savedSummary) setSummaryData(JSON.parse(savedSummary));
      if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));
    } catch (e) {
      console.warn('Failed to restore learning session from localStorage:', e);
    }
  }, []);

  // Helper to change step and sync to localStorage
  const changeStep = (nextStep) => {
    setStep(nextStep);
    localStorage.setItem('learn_step', nextStep);
  };

  const startLearning = useCallback(async (inputTopic) => {
    setLoadingSummary(true);
    setError(null);
    setSummaryData(null);
    setRoadmap(null);
    setSelected(null);
    setTopic(inputTopic);
    setStep('input');

    // Clear previous roadmap storage
    localStorage.removeItem('learn_roadmap');
    localStorage.setItem('learn_topic', inputTopic);
    localStorage.setItem('learn_step', 'input');

    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputTopic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSummaryData(data);
      localStorage.setItem('learn_summary', JSON.stringify(data));
      changeStep('summary');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const buildRoadmap = useCallback(async () => {
    setLoadingRoadmap(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setRoadmap(data);
      localStorage.setItem('learn_roadmap', JSON.stringify(data));
      changeStep('roadmap');
    } catch (err) {
      setError(err.message || 'Something went wrong while generating the roadmap.');
    } finally {
      setLoadingRoadmap(false);
    }
  }, [topic]);

  const resetSession = () => {
    localStorage.removeItem('learn_topic');
    localStorage.removeItem('learn_step');
    localStorage.removeItem('learn_summary');
    localStorage.removeItem('learn_roadmap');
    setTopic('');
    setSummaryData(null);
    setRoadmap(null);
    setSelected(null);
    setStep('input');
  };

  return (
    <main style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <ParticleBackground />
      <Navbar />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '7rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

          {/* ── STEP 1: INPUT ── */}
          {step === 'input' && !loadingSummary && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,183,226,0.2)', borderRadius: 999, padding: '8px 20px', marginBottom: '1.5rem', color: P, fontSize: '0.875rem' }}>
                <GitBranch size={14} /> AI 4-Hour Masterclass
              </div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
                What do you want to <span className="gradient-text text-glow">master in 4 hours?</span>
              </h1>
              <p style={{ color: 'var(--clr-muted)', fontSize: '1.05rem', maxWidth: '32rem', margin: '0 auto', marginBottom: '2.5rem' }}>
                Enter any skill. A veteran teacher will layout exactly what to focus on, what to ignore, and the one exercise to put you ahead.
              </p>
              <TopicInput onGenerate={startLearning} isLoading={loadingSummary} />
            </motion.div>
          )}

          {/* Loading Summary */}
          <AnimatePresence>
            {loadingSummary && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass" style={{ borderRadius: 20, padding: '3rem 2rem', maxWidth: '42rem', margin: '0 auto' }}>
                <LoadingOrb message={`Consulting AI master teacher about ${topic}...`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && !loadingSummary && !loadingRoadmap && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, padding: '1.5rem', textAlign: 'center', maxWidth: '42rem', margin: '2rem auto' }}>
                <p style={{ color: '#F87171', fontWeight: 500, marginBottom: 8 }}>⚠️ {error}</p>
                <button onClick={resetSession} style={{ background: 'none', border: 'none', color: P, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline' }}>
                  Go back and try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STEP 2: SUMMARY ── */}
          <AnimatePresence>
            {step === 'summary' && summaryData && !loadingRoadmap && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
                style={{ maxWidth: '60rem', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <button onClick={resetSession}
                    style={{ background: 'none', border: 'none', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.9rem' }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
                  >
                    <ArrowLeft size={16} /> Choose another skill
                  </button>
                  <span style={{ color: P, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    4-Hour Strategy Guide
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                    How to master <span className="gradient-text">{topic}</span>
                  </h2>
                  <p style={{ color: 'var(--clr-muted)', fontSize: '1rem', margin: 0 }}>
                    Here is your targeted, highly-compressed strategy:
                  </p>
                </div>

                {/* Strategy Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                  
                  {/* Philosophy / Rule 1 */}
                  {summaryData.philosophy && (
                    <div className="gradient-border" style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                        <Flame size={20} style={{ color: P }} />
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                          Rule #1: Focus on how it thinks
                        </h3>
                      </div>
                      <p style={{ color: 'var(--clr-muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, whitespace: 'pre-line' }}>
                        {summaryData.philosophy}
                      </p>
                    </div>
                  )}

                  {/* Hour by Hour Breakdown */}
                  <div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Clock size={22} style={{ color: 'var(--clr-secondary)' }} />
                      Hour-by-Hour Timeline
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {summaryData.hours?.map((h, i) => (
                        <div key={i} className="glass" style={{ borderRadius: 16, padding: '1.5rem' }}>
                          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: P, marginBottom: '0.5rem' }}>
                            {h.title}
                          </h4>
                          <p style={{ color: 'var(--clr-muted)', fontSize: '0.925rem', lineHeight: 1.7, margin: 0 }}>
                            {h.description}
                          </p>
                          {h.code && (
                            <CodeBlock code={h.code} language={h.codeLanguage || 'javascript'} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning / Ignore & Struggle Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* Ignore list */}
                    <div className="glass" style={{ borderRadius: 20, padding: '2rem', borderLeft: '4px solid var(--clr-red)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                        <EyeOff size={18} style={{ color: 'var(--clr-red)' }} />
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                          Things to completely ignore
                        </h4>
                      </div>
                      <p style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Do not waste time on these advanced or redundant concepts in your first 4 hours:
                      </p>
                      <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {summaryData.ignoreList?.map((item, i) => (
                          <li key={i} style={{ color: 'var(--clr-muted)', fontSize: '0.875rem' }}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Struggle concept */}
                    {summaryData.struggleConcept && (
                      <div className="glass" style={{ borderRadius: 20, padding: '2rem', borderLeft: '4px solid var(--clr-amber)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                          <AlertCircle size={18} style={{ color: 'var(--clr-amber)' }} />
                          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                            The concept everyone struggles with
                          </h4>
                        </div>
                        <h5 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: 'var(--clr-amber)', marginBottom: '0.5rem' }}>
                          {summaryData.struggleConcept.concept}
                        </h5>
                        <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                          {summaryData.struggleConcept.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Golden Exercise & Next Project */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* The Golden Exercise */}
                    {summaryData.exercise && (
                      <div className="glass" style={{ borderRadius: 20, padding: '2rem', borderTop: `4px solid ${P}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                          <Trophy size={18} style={{ color: P }} />
                          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                            {summaryData.exercise.title}
                          </h4>
                        </div>
                        <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {summaryData.exercise.description}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {summaryData.exercise.requirements?.map((req, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--clr-muted)' }}>
                              <span style={{ color: P, marginTop: 2 }}>✓</span>
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Project */}
                    {summaryData.nextProject && (
                      <div className="glass" style={{ borderRadius: 20, padding: '2rem', borderTop: '4px solid var(--clr-accent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                          <Brain size={18} style={{ color: 'var(--clr-accent)' }} />
                          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                            {summaryData.nextProject.title}
                          </h4>
                        </div>
                        <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {summaryData.nextProject.description}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {summaryData.nextProject.features?.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--clr-accent)' }}>
                              <span style={{ color: 'var(--clr-accent)', marginTop: 2 }}>⚡</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mental Model Check Questions */}
                  {summaryData.mentalModel && (
                    <div className="glass" style={{ borderRadius: 20, padding: '2rem' }}>
                      <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <HelpCircle size={18} style={{ color: 'var(--clr-secondary)' }} />
                        The Mental Model Professionals Use
                      </h4>
                      <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                        When building any feature, ask yourself these questions in order:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {summaryData.mentalModel.map((q, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ color: 'var(--clr-secondary)', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>0{i+1}</span>
                            <span style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* CTA to Roadmap */}
                <div className="glass glow-primary" style={{ borderRadius: 24, padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(244,183,226,0.2)' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                    Want a full visual roadmap?
                  </h3>
                  <p style={{ color: 'var(--clr-muted)', fontSize: '0.925rem', marginBottom: '1.5rem', maxWidth: '32rem', margin: '0 auto 1.5rem' }}>
                    We can map these concepts into an interactive visual graph. Click below to generate step-by-step interactive lesson cards.
                  </p>
                  <Magnetic tolerance={70} pull={0.4}>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,183,226,0.45)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={buildRoadmap}
                      style={{
                        background: P, color: BG, border: 'none', cursor: 'pointer',
                        borderRadius: 16, padding: '14px 28px', fontSize: '1rem', fontWeight: 700,
                        fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: 10
                      }}
                    >
                      <GitBranch size={18} />
                      Build My Visual Roadmap
                      <ArrowRight size={16} />
                    </motion.button>
                  </Magnetic>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Roadmap */}
          <AnimatePresence>
            {loadingRoadmap && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass" style={{ borderRadius: 20, padding: '3rem 2rem', maxWidth: '42rem', margin: '0 auto' }}>
                <LoadingOrb message={`Generating visual graph roadmap for ${topic}...`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STEP 3: ROADMAP ── */}
          <AnimatePresence>
            {step === 'roadmap' && roadmap && !loadingRoadmap && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                
                {/* Back to Summary Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <button onClick={() => changeStep('summary')}
                    style={{ background: 'none', border: 'none', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.9rem' }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
                  >
                    <ArrowLeft size={16} /> Back to 4-hour summary
                  </button>
                  <span style={{ color: P, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Visual Path
                  </span>
                </div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: 'var(--clr-muted)', fontSize: '0.8rem' }}>
                  <Info size={12} style={{ color: P }} />
                  Click any node to open its interactive lesson card. Drag nodes/canvas to explore. Scroll to zoom.
                </div>

                {/* Graph */}
                <RoadmapGraph rawNodes={roadmap.nodes || []} rawEdges={roadmap.edges || []} onNodeClick={setSelected} />

                {/* Legend */}
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {LEGEND.map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--clr-muted)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Lesson Panel */}
      <LessonPanel node={selectedNode} topic={topic} onClose={() => setSelected(null)} />
    </main>
  );
}
