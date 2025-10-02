import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Hero from "./Hero";
import MyComponent from "./MyComponent";
import Cartas from "./Cartas";
import "./index.css";

const PARALLAX_PAGES = 10; // mantenha igual ao <MyComponent pages={...} />

export default function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis único
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    // Lenis no ticker do GSAP
    const update = (time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // scrollerProxy confiável (usa window.scrollY)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          window.scrollTo(0, value);
        }
        return window.scrollY || window.pageYOffset || 0;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: innerWidth, height: innerHeight };
      },
      // Opcional: define o pinType correto
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", onScroll);
      if (typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  return (
    <main className="app">
      <Hero />

      {/* Trilho do parallax (altura externa pages*100vh) */}
      <section
        id="parallax-section"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
        aria-label="Cena Parallax"
      >
        <MyComponent pages={PARALLAX_PAGES} />
      </section>

      <Cartas />
    </main>
  );
}
