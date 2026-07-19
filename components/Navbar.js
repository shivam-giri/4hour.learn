'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Brain, Menu, X, Sparkles } from 'lucide-react';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Roadmap',      href: '/learn' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleAnchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        id="main-navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.4s ease',
          ...(scrolled ? {
            background: 'rgba(15,15,26,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          } : {
            background: 'transparent',
          }),
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="navbar-logo" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F4B7E2, #C084FC)' }}
            >
              <Brain size={18} style={{ color: BG }} />
            </motion.div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem' }}>
              <span style={{ color: '#ffffff' }}>FourHour</span>
              <span className="gradient-text">.Learn</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link key={link.label} href={link.href}
                onClick={e => handleAnchor(e, link.href)}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = P}
                onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/interview" id="navbar-start-btn">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(244,183,226,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl transition-all"
                style={{ backgroundColor: P, color: BG, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', padding: '10px 18px', border: 'none', cursor: 'pointer' }}
              >
                <Sparkles size={14} /> Are you ready for Interview?
              </motion.button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-toggle"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)' }}>
            {mobileOpen ? <X size={22} style={{ color: '#fff' }} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="glass-strong rounded-2xl flex flex-col gap-4"
            style={{ position: 'fixed', top: 72, left: 16, right: 16, zIndex: 40, padding: '1.5rem' }}
          >
            {NAV_LINKS.map(link => (
              <Link key={link.label} href={link.href}
                onClick={e => handleAnchor(e, link.href)}
                style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontWeight: 500, paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {link.label}
              </Link>
            ))}
            <Link href="/interview">
              <button style={{ width: '100%', backgroundColor: P, color: BG, fontFamily: 'Outfit, sans-serif', fontWeight: 700, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 8 }}>
                Are you ready for Interview?
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
