'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LoadingOrb from '@/components/LoadingOrb';
import ParticleBackground from '@/components/ParticleBackground';
import {
  Sparkles, ArrowLeft, ArrowRight, Brain, ShieldAlert, Award,
  CheckCircle2, XCircle, Code2, AlertTriangle, BookOpen, RefreshCw
} from 'lucide-react';
import Magnetic from '@/components/Magnetic';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

const LANGUAGES = [
  'JavaScript', 'React.js', 'Python', 'Vue.js', 'TypeScript', 'Node.js', 'C++', 'Java'
];

export default function InterviewPage() {
  const [lang, setLang]                         = useState('');
  const [step, setStep]                         = useState('setup'); // 'setup' | 'loading-q' | 'questions' | 'loading-eval' | 'result'
  const [questions, setQuestions]               = useState([]);
  const [currentIdx, setCurrentIdx]             = useState(0);
  const [answers, setAnswers]                   = useState([]);
  const [currentAnswer, setCurrentAnswer]       = useState('');
  const [result, setResult]                     = useState(null);
  const [error, setError]                       = useState(null);

  const startInterview = useCallback(async (selectedLang) => {
    if (!selectedLang.trim()) return;
    setError(null);
    setStep('loading-q');
    setLang(selectedLang);
    setAnswers([]);
    setCurrentIdx(0);
    setCurrentAnswer('');

    try {
      const res = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: selectedLang }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions || []);
      setStep('questions');
    } catch (err) {
      setError(err.message || 'Failed to initialize mock interview panel.');
      setStep('setup');
    }
  }, []);

  const handleNext = () => {
    // Record current QA
    const currentQ = questions[currentIdx];
    const newAnswers = [
      ...answers,
      {
        question: currentQ.question,
        answer: currentAnswer.trim() || 'Skipped/No response provided.',
        type: currentQ.type
      }
    ];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Evaluate all answers
      submitEvaluation(newAnswers);
    }
  };

  const submitEvaluation = async (finalAnswers) => {
    setStep('loading-eval');
    setError(null);
    try {
      const res = await fetch('/api/evaluate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, QAs: finalAnswers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Failed to evaluate interview answers.');
      setStep('setup');
    }
  };

  const resetInterview = () => {
    setLang('');
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers([]);
    setCurrentAnswer('');
    setResult(null);
    setError(null);
    setStep('setup');
  };

  const currentQ = questions[currentIdx];
  const progressPercent = questions.length ? ((currentIdx) / questions.length) * 100 : 0;

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}
    >
      <ParticleBackground />
      <Navbar />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '7rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ maxWidth: '46rem', margin: '0 auto' }}>

          {/* ── STEP 1: SETUP ── */}
          {step === 'setup' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,183,226,0.2)', borderRadius: 999, padding: '8px 20px', marginBottom: '1.5rem', color: P, fontSize: '0.875rem' }}>
                <Brain size={14} /> AI Mock Interview Panel
              </div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 5vw, 3rem)', lineHeight: 1.1 }}>
                Are you ready for <span className="gradient-text text-glow">the Interview?</span>
              </h1>
              <p style={{ color: 'var(--clr-muted)', fontSize: '1rem', maxWidth: '28rem', margin: '0 auto', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Select a language or framework. Our AI panel will ask 3 theoretical and 3 coding questions to grade your readiness.
              </p>

              {/* Language Search */}
              <div style={{ display: 'flex', gap: 10, maxWidth: '32rem', margin: '0 auto 2rem' }}>
                <input
                  type="text"
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  placeholder="Type a language (e.g. JavaScript, C++, Vue)"
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '14px 20px', color: '#ffffff', fontSize: '1rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif'
                  }}
                  onKeyDown={e => e.key === 'Enter' && startInterview(lang)}
                />
                <Magnetic tolerance={50} pull={0.35}>
                  <button
                    onClick={() => startInterview(lang)}
                    disabled={!lang.trim()}
                    style={{
                      background: P, color: BG, border: 'none', cursor: lang.trim() ? 'pointer' : 'not-allowed',
                      borderRadius: 14, padding: '14px 24px', fontSize: '0.9rem', fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif', opacity: lang.trim() ? 1 : 0.5
                    }}
                  >
                    Start
                  </button>
                </Magnetic>
              </div>

              {/* Quick Picks */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    onClick={() => startInterview(l)}
                    style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 999, padding: '6px 16px', fontSize: '0.8rem', color: 'var(--clr-muted)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = P; e.currentTarget.style.borderColor = 'rgba(244,183,226,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {error && (
                <p style={{ color: '#F87171', fontSize: '0.875rem', marginTop: '2rem' }}>⚠️ {error}</p>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: LOADING QUESTIONS ── */}
          {step === 'loading-q' && (
            <div className="glass" style={{ borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
              <LoadingOrb message={`Assembling technical interview panel for ${lang}...`} />
            </div>
          )}

          {/* ── STEP 3: MOCK QUESTIONS FLOW ── */}
          {step === 'questions' && currentQ && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="glass" style={{ borderRadius: 24, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--clr-muted)', fontWeight: 600 }}>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 8,
                  background: currentQ.type === 'theory' ? 'rgba(244,183,226,0.15)' : 'rgba(125,211,252,0.15)',
                  color: currentQ.type === 'theory' ? P : 'var(--clr-accent)'
                }}>
                  {currentQ.type === 'theory' ? 'Conceptual' : 'Coding Challenge'}
                </span>
              </div>
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: `linear-gradient(90deg, ${P}, var(--clr-secondary))` }} />
              </div>

              {/* Question Statement */}
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#ffffff', fontSize: '1.25rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {currentQ.question}
              </h2>

              {/* Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {currentQ.type === 'theory' ? <BookOpen size={13} /> : <Code2 size={13} />}
                  {currentQ.type === 'theory' ? 'Write your theoretical explanation:' : 'Write your solution code:'}
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={e => setCurrentAnswer(e.target.value)}
                  placeholder={currentQ.type === 'theory' ? 'Explain the concepts clearly, naming best practices...' : '// Write your implementation here...'}
                  style={{
                    width: '100%', height: 180, background: '#0a0a12', color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16,
                    fontFamily: currentQ.type === 'coding' ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
                    fontSize: '0.875rem', outline: 'none', resize: 'vertical', lineHeight: 1.6
                  }}
                />
              </div>

              {/* Triggers */}
              <div style={{ display: 'flex', gap: 12 }}>
                <Magnetic tolerance={60} pull={0.4}>
                  <button
                    onClick={handleNext}
                    style={{
                      background: P, color: BG, border: 'none', cursor: 'pointer',
                      borderRadius: 12, padding: '14px 28px', fontSize: '0.9rem', fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'Submit Answers for Grading'}
                    <ArrowRight size={16} />
                  </button>
                </Magnetic>
                <button
                  onClick={() => { setCurrentAnswer('Skipped Question.'); handleNext(); }}
                  style={{
                    background: 'rgba(255,255,255,0.04)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '0 20px', cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  Skip
                </button>
              </div>

            </motion.div>
          )}

          {/* ── STEP 4: LOADING EVALUATION ── */}
          {step === 'loading-eval' && (
            <div className="glass" style={{ borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
              <LoadingOrb message={`Panel is assessing your mock interview...`} />
            </div>
          )}

          {/* ── STEP 5: INTERVIEW EVALUATION RESULT ── */}
          {step === 'result' && result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Verdict header */}
              <div style={{
                borderRadius: 24, padding: '2.5rem', textAlign: 'center',
                background: result.ready ? 'rgba(52,211,153,0.05)' : 'rgba(248,113,113,0.05)',
                border: `1.5px solid ${result.ready ? '#34D399' : '#F87171'}`,
                boxShadow: result.ready ? '0 0 40px rgba(52,211,153,0.1)' : '0 0 40px rgba(248,113,113,0.1)'
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: result.ready ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', marginBottom: 16 }}>
                  {result.ready ? <CheckCircle2 size={36} style={{ color: '#34D399' }} /> : <XCircle size={36} style={{ color: '#F87171' }} />}
                </div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem', color: '#ffffff', margin: '0 0 6px' }}>
                  {result.ready ? 'VERDICT: YOU ARE READY! 🎉' : 'VERDICT: NOT READY YET 📚'}
                </h2>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '4px 14px', fontSize: '0.85rem', color: P, fontWeight: 700, marginBottom: 12 }}>
                  Score: {result.score}%
                </div>
                <p style={{ color: 'var(--clr-muted)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                  {result.summary}
                </p>
              </div>

              {/* Strengths & Gaps */}
              {result.gaps?.length > 0 && (
                <div className="glass" style={{ borderRadius: 20, padding: '2rem', borderLeft: '4px solid var(--clr-amber)' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} style={{ color: 'var(--clr-amber)' }} />
                    Identified Gaps (Focus Areas to Study)
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.gaps.map((gapItem, idx) => (
                      <li key={idx} style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                        {gapItem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Question Breakdown Accordion */}
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.35rem', color: '#ffffff', marginBottom: '1rem' }}>
                  Question-by-Question Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {result.breakdown?.map((item, idx) => (
                    <div key={idx} className="glass" style={{ borderRadius: 16, padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--clr-muted)', fontWeight: 600 }}>Q{idx + 1}. {item.type === 'theory' ? 'Theory' : 'Coding'}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 6,
                            background: item.correctness === 'Correct' ? 'rgba(52,211,153,0.12)' : item.correctness === 'Partially Correct' ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)',
                            color: item.correctness === 'Correct' ? '#34D399' : item.correctness === 'Partially Correct' ? '#FBBF24' : '#F87171'
                          }}>
                            {item.correctness}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: P, fontWeight: 700 }}>({item.score}%)</span>
                        </div>
                      </div>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>
                        {item.question}
                      </p>
                      
                      <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Your Answer:</p>
                        <p style={{ color: '#e5e7eb', fontSize: '0.8rem', fontFamily: item.type === 'coding' ? 'JetBrains Mono, monospace' : 'Inter, sans-serif', whiteSpace: 'pre-wrap', margin: 0 }}>
                          {item.answer}
                        </p>
                      </div>

                      <p style={{ color: 'var(--clr-muted)', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>
                        💡 <span style={{ fontWeight: 600, color: '#ffffff' }}>AI Review:</span> {item.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 14, marginTop: '1.5rem' }}>
                <Magnetic tolerance={60} pull={0.4}>
                  <button
                    onClick={resetInterview}
                    style={{
                      background: P, color: BG, border: 'none', cursor: 'pointer',
                      borderRadius: 14, padding: '14px 28px', fontSize: '0.9rem', fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <RefreshCw size={16} /> Try Another Mock Interview
                  </button>
                </Magnetic>
                <button
                  onClick={() => window.location.href = '/learn'}
                  style={{
                    background: 'rgba(255,255,255,0.04)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '0 24px', cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  Go to Roadmap Builder
                </button>
              </div>

            </motion.div>
          )}

        </div>
      </div>
    </motion.main>
  );
}
