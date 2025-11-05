import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Reusable animated background of subtle red orbs
// Usage: <div className="relative overflow-hidden"><FloatingAIOrbs /><HeroSection /></div>
export default function FloatingAIOrbs(props) {
  const { count = 18, className = '' } = props || {};
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const translateX = useTransform(mx, [-60, 60], [-8, 8]);
  const translateY = useTransform(my, [-60, 60], [-8, 8]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current as unknown as HTMLDivElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      // clamp for soft parallax
      const cx = Math.max(-60, Math.min(60, x / 6));
      const cy = Math.max(-60, Math.min(60, y / 6));
      mx.set(cx);
      my.set(cy);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  const orbs = Array.from({ length: count }).map((_, i) => {
    const size = 6 + Math.random() * 16; // 6px - 22px
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 6;
    const duration = 8 + Math.random() * 8;
    const opacity = 0.15 + Math.random() * 0.35;
    const blur = 6 + Math.random() * 10;

    return (
      <motion.span
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
          background: 'rgba(229, 9, 20, 0.9)',
          boxShadow: '0 0 24px rgba(229, 9, 20, 0.45)',
          filter: `blur(${blur}px)`,
          opacity,
        }}
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10], x: [0, 6, 0], opacity: [opacity * 0.8, opacity, opacity * 0.8] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    );
  });

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 -z-10 ${className}`}
      style={{ translateX, translateY }}
    >
      {/* soft background tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.08),transparent_60%)]" />
      {/* glowing orbs */}
      {mounted && orbs}
    </motion.div>
  );
}
