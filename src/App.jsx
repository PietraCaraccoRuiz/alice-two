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

    // Lenis ÚNICO na app
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    // GSAP ticker -> Lenis + ST
    const update = (time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Conectar o ScrollTrigger ao Lenis (scrollerProxy)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Um refresh basta (não chame lenis.update, essa API não existe)
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", onScroll);
      if (typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  return (
    <main className="app">
      {/* 1) HERO pinado por ScrollTrigger */}
      <Hero />

      {/* 2) PARALLAX — ocupando o fluxo do body.
            A altura externa precisa existir (pages * 100vh). */}
      <section
        id="parallax-section"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
        aria-label="Cena Parallax"
      >
        <MyComponent pages={PARALLAX_PAGES} />
      </section>

      {/* 3) CARTAS — sem Lenis próprio, só ST */}
      <Cartas />
    </main>
  );
}
