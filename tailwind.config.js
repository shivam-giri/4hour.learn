/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F4B7E2',
          dark: '#e896d0',
          50: '#fef3fb',
          100: '#fde8f7',
          200: '#fbd1ef',
          300: '#f9aae2',
          400: '#f4b7e2',
          500: '#e896d0',
          600: '#d56ab4',
          700: '#b8479a',
          800: '#96387e',
          900: '#7c3068',
        },
        secondary: '#C084FC',
        accent: '#7DD3FC',
        amber: '#FBBF24',
        emerald: '#34D399',
        'bg-deep': '#08080f',
        'bg-surface': '#0f0f1a',
        'bg-card': 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drift': 'drift 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(2deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(10px, -10px) scale(1.02)' },
          '50%': { transform: 'translate(-5px, -20px) scale(0.98)' },
          '75%': { transform: 'translate(-12px, -5px) scale(1.01)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244,183,226,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(244,183,226,0.5), 0 0 80px rgba(244,183,226,0.2)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(244,183,226,0.15) 0%, rgba(192,132,252,0.08) 40%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
