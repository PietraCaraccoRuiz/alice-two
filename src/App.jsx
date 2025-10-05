import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Hero from "./Hero";
import MyComponent from "./MyComponent";
import MyComponent2 from "./MyComponent2";
import Cartas from "./Cartas";
import "./index.css";

const PARALLAX_PAGES = 11;

export default function App() {
  const lenisRef = useRef(null);
  const [atBottom, setAtBottom] = useState(false);

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
      ScrollTrigger.update();
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => {
      ScrollTrigger.update();

      const scroll = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      // se estiver a menos de 100px do fim, troca o botão
      setAtBottom(scroll >= maxScroll - 100);
    };

    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(onTick);
      if (typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  const scrollToEnd = () => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(document.body.scrollHeight, {
      duration: 2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  };

  const scrollToTop = () => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, {
      duration: 2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  };

  return (
    <main className="app">
      <Hero />

      {/* Botão flutuante dinâmico */}
      <button
        className={`scroll-end-btn ${atBottom ? "up" : "down"}`}
        onClick={atBottom ? scrollToTop : scrollToEnd}
        aria-label={atBottom ? "Voltar ao topo" : "Ir para o final"}
      >
        {atBottom ? "↑ Topo" : "↓ Final"}
      </button>

      <section
        id="parallax-section-1"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
      >
        <MyComponent pages={PARALLAX_PAGES} sectionId="parallax-section-1" />
      </section>

      <Cartas />

      <section
        id="parallax-section-2"
        className="parallax-wrap"
        style={{ height: `${PARALLAX_PAGES * 100}vh` }}
      >
        <MyComponent2 pages={10} sectionId="parallax-section-2" />
      </section>
    </main>
  );
}
