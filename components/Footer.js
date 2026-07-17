'use client';

import Link from 'next/link';
import { Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const P  = 'var(--clr-primary)';
const BG = 'var(--clr-bg)';

function GithubSVG() {
  return <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
}
function XSocialSVG() {
  return <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function LinkedInSVG() {
  return <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

const SOCIAL = [
  { id: 'footer-github',   icon: <GithubSVG /> },
  { id: 'footer-twitter',  icon: <XSocialSVG /> },
  { id: 'footer-linkedin', icon: <LinkedInSVG /> },
];

export default function Footer() {
  return (
    <footer id="footer" style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#F4B7E2,#C084FC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} style={{ color: BG }} />
              </div>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '1.2rem' }}>
                <span style={{ color: '#fff' }}>FourHour</span>
                <span className="gradient-text">.Learn</span>
              </span>
            </Link>
            <p style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280, margin: '0 0 1.5rem' }}>
              AI-powered interactive learning platform. Enter any topic, get a visual roadmap, learn faster than ever.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {SOCIAL.map(s => (
                <motion.a key={s.id} href="#" id={s.id}
                  whileHover={{ scale: 1.15, color: P }}
                  style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Product</h4>
            {['Features', 'How It Works', 'Roadmap Builder', 'Examples'].map(item => (
              <div key={item} style={{ marginBottom: '0.75rem' }}>
                <a href="#" style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = P}
                  onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}>{item}</a>
              </div>
            ))}
          </div>

          {/* Company links */}
          <div>
            <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Company</h4>
            {['About', 'Blog', 'Privacy Policy', 'Terms of Service'].map(item => (
              <div key={item} style={{ marginBottom: '0.75rem' }}>
                <a href="#" style={{ color: 'var(--clr-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = P}
                  onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}>{item}</a>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider" style={{ marginBottom: '2rem' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ color: 'var(--clr-muted)', fontSize: '0.75rem', margin: 0 }}>
            © 2024 FourHour.Learn. All rights reserved.
          </p>
          <p style={{ color: 'var(--clr-muted)', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            Made with <Heart size={12} style={{ color: P, fill: P }} /> using Next.js & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
