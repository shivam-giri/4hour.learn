'use client';

import { useCallback, useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [ParticlesComponent, setParticlesComponent] = useState(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    // Dynamically import tsparticles (client-side only)
    let initDone = false;
    import('@tsparticles/react').then(async ({ default: Particles, initParticlesEngine }) => {
      if (!initDone) {
        const { loadSlim } = await import('@tsparticles/slim');
        await initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        });
        initDone = true;
        setParticlesComponent(() => Particles);
        setEngineReady(true);
      }
    }).catch(() => {
      // silently fail — particles are decorative
    });
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  const options = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
        onClick: { enable: true, mode: 'push' },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.25 } },
        push: { quantity: 2 },
      },
    },
    particles: {
      color: { value: ['#F4B7E2', '#C084FC', '#7DD3FC', '#ffffff'] },
      links: {
        color: '#F4B7E2',
        distance: 150,
        enable: true,
        opacity: 0.07,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: { density: { enable: true, area: 900 }, value: 70 },
      opacity: {
        value: { min: 0.05, max: 0.35 },
        animation: { enable: true, speed: 0.8 },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 0.5, max: 2.5 },
        animation: { enable: true, speed: 2 },
      },
    },
    detectRetina: true,
  };

  if (!engineReady || !ParticlesComponent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <ParticlesComponent
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
