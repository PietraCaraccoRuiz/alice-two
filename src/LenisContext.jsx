// contexts/LenisContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext();

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
};

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
};