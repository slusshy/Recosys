import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const HeroSection = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-50, 50], [8, -8]);
  const rotateY = useTransform(mx, [-50, 50], [-8, 8]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 6 + Math.random() * 16,
      delay: i * 0.2,
      opacity: 0.2 + Math.random() * 0.4,
      blur: 4 + Math.random() * 8,
    }));
  }, []);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mx.set(Math.max(-50, Math.min(50, x / 6)));
    my.set(Math.max(-50, Math.min(50, y / 6)));
  };

  const scrollToAIChat = () => {
    const el = document.getElementById('chat-interface');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />

      <div className="absolute inset-0 pointer-events-none">
        {mounted && particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.top}%`,
              left: `${p.left}%`,
              background: 'rgba(229, 9, 20, 0.85)',
              boxShadow: '0 0 20px rgba(229, 9, 20, 0.45)',
              filter: `blur(${p.blur}px)`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <div onMouseMove={onMove} className="relative container-max py-20 sm:py-28 flex flex-col items-center text-center">
        <motion.div
          style={{
            transform: `rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`
          }}
          className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-accent/30 to-transparent border border-red-900/30 shadow-red-glow flex items-center justify-center mb-8 will-change-transform"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-red-500/40 to-red-700/20 blur-[1px]"
          />
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Your <span className="text-accent">AI</span> Recommendation Hub
        </h1>
        <p className="mt-4 max-w-2xl text-gray-300">Let AI understand your taste and suggest what you’ll love next.</p>

        <button onClick={scrollToAIChat} className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 bg-accent text-white font-medium shadow-red-glow hover:shadow-red-glow-strong transition-all duration-300">
          Start Exploring
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
