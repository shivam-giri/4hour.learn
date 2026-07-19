'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import HowItWorks from '@/components/HowItWorks';
import FeaturesGrid from '@/components/FeaturesGrid';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';
import Magnetic from '@/components/Magnetic';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const CYCLING_WORDS = ['React', 'Python', 'Machine Learning', 'Web3', 'TypeScript', 'Data Science', 'Rust', 'DevOps'];

const P = 'var(--clr-primary)';
const MUTED = 'var(--clr-muted)';
const BG = 'var(--clr-bg)';

export default function Home() {
  const heroRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  // Typewriter
  useEffect(() => {
    const word = CYCLING_WORDS[wordIndex];
    let t;
    if (!isDeleting && displayWord.length < word.length)
      t = setTimeout(() => setDisplayWord(word.slice(0, displayWord.length + 1)), 100);
    else if (!isDeleting && displayWord.length === word.length)
      t = setTimeout(() => setIsDeleting(true), 2000);
    else if (isDeleting && displayWord.length > 0)
      t = setTimeout(() => setDisplayWord(displayWord.slice(0, -1)), 50);
    else { setIsDeleting(false); setWordIndex(i => (i + 1) % CYCLING_WORDS.length); }
    return () => clearTimeout(t);
  }, [displayWord, isDeleting, wordIndex]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo('.hero-badge',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo('.hero-title-line', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-sub',        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.hero-cta',        { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.3')
        .fromTo('.hero-stats',      { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');
      gsap.to(orb1Ref.current, { y: -25, x: 15,  duration: 7,  repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(orb2Ref.current, { y: 20,  x: -10, duration: 9,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to(orb3Ref.current, { y: -15, x: -20, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ backgroundColor: BG }}
      className="relative min-h-screen overflow-x-hidden"
    >
      <ParticleBackground />
      <Navbar />

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16"
        id="hero"
      >
        {/* Orbs */}
        <div ref={orb1Ref} className="orb-pink absolute pointer-events-none" style={{ top: '25%', left: '8%', width: 280, height: 280 }} />
        <div ref={orb2Ref} className="orb-cyan absolute pointer-events-none" style={{ bottom: '25%', right: '6%', width: 360, height: 360 }} />
        <div ref={orb3Ref} className="orb-purple absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, opacity: 0.2 }} />

        {/* Hero bg */}
        <div className="hero-bg-gradient absolute inset-0 pointer-events-none" />

        {/* Badge */}
        <div className="hero-badge opacity-0 mb-8 relative z-10">
          <span className="glass glow-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            style={{ color: P, borderColor: 'rgba(244,183,226,0.2)' }}>
            <Sparkles size={14} style={{ color: P }} />
            AI-Powered Learning Experience
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--clr-emerald)' }} />
          </span>
        </div>

        {/* Headline */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <h1 className="font-outfit font-black leading-tight mb-8 tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.05 }}>
            <span className="hero-title-line opacity-0 block" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', color: '#ffffff' }}>
              Learn <span className="gradient-text text-glow">Anything</span>
            </span>
            <span className="hero-title-line opacity-0 block mt-2" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', color: '#ffffff' }}>
              With <span className="text-glow" style={{ color: P }}>AI-Generated</span>
            </span>
            <span className="hero-title-line opacity-0 block mt-2" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', color: '#ffffff' }}>
              Roadmaps
            </span>
          </h1>

          {/* Typewriter */}
          <div className="hero-title-line opacity-0 flex flex-wrap items-center justify-center gap-3 mb-8">
            <span style={{ color: MUTED, fontSize: '1.25rem', fontWeight: 300 }}>Currently mastering:</span>
            <span style={{ color: P, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', minWidth: 180 }}>
              {displayWord}<span className="cursor-blink" style={{ color: P }}>|</span>
            </span>
          </div>

          <p className="hero-sub opacity-0 max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ color: MUTED, fontSize: '1.1rem' }}>
            Enter any topic and get an AI-generated visual learning path. Interactive lessons, code examples,
            and a personalized roadmap — ready in seconds.
          </p>

          {/* CTAs */}
          <div className="hero-cta opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ position: 'relative', zIndex: 20 }}>
            <Magnetic tolerance={70} pull={0.35}>
              <Link href="/learn" id="start-learning-cta" style={{ display: 'inline-block' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(244,183,226,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 rounded-2xl font-bold text-lg px-8 py-4 transition-all duration-300"
                  style={{ backgroundColor: P, color: BG, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', border: 'none' }}
                >
                  <Brain size={20} />
                  Start Learning Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </Magnetic>
            <Magnetic tolerance={60} pull={0.4}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                id="see-how-it-works-btn"
                className="glass flex items-center gap-2 rounded-2xl font-medium text-lg px-8 py-4 transition-all duration-300"
                style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}
              >
                <Zap size={18} style={{ color: P }} />
                See How It Works
              </motion.button>
            </Magnetic>
          </div>

          {/* Stats */}
          <div className="hero-stats opacity-0 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: '50K+', label: 'Learners' },
              { value: '1M+', label: 'Roadmaps Generated' },
              { value: '4hrs', label: 'Avg. to Proficiency' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }} className="text-center">
                <div className="gradient-text font-black text-3xl" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
                <div style={{ color: MUTED, fontSize: '0.85rem', marginTop: 4 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="flex items-start justify-center p-1 rounded-full"
            style={{ width: 24, height: 40, border: '2px solid rgba(255,255,255,0.2)' }}>
            <div className="animate-bounce rounded-full" style={{ width: 6, height: 12, backgroundColor: P }} />
          </div>
        </motion.div>
      </motion.section>

      <HowItWorks />
      <FeaturesGrid />
      <Footer />
    </motion.main>
  );
}
