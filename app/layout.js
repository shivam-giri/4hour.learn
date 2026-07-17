import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'FourHour.Learn – AI-Powered Interactive Learning',
  description: 'Enter any topic and get an AI-generated visual learning roadmap with interactive lessons, code snippets, and personalized guidance. Master anything in four hours.',
  keywords: 'AI learning, interactive roadmap, programming tutorials, AI education, learn to code',
  openGraph: {
    title: 'FourHour.Learn – AI-Powered Interactive Learning',
    description: 'Master any topic with AI-generated visual roadmaps and interactive lesson cards.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
