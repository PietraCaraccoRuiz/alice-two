import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Hero from "./Hero";
import MyComponent from "./MyComponent";
import MyComponent2 from "./MyComponent2";
import Cartas from "./Cartas";
import "./index.css";

const PARALLAX_PAGES = 11; // mantenha igual nos componentes Parallax

export default function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    const onTick = (time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update(); // mantém GSAP em sincronia
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      if (typeof lenis.destroy === "function") lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <main className="app">
      <Hero />

      {/* Trilho do Parallax 1 */}
      <section
        id="parallax-section-1"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
        aria-label="Cena Parallax 1"
      >
        <MyComponent pages={PARALLAX_PAGES} sectionId="parallax-section-1" />
      </section>

      <Cartas />

      {/* Trilho do Parallax 2 */}
      <section
        id="parallax-section-2"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
        aria-label="Cena Parallax 2"
      >
        <MyComponent2 pages={10} sectionId="parallax-section-2" />
      </section>
    </main>
  );
}
