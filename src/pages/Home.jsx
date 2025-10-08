import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Hero from "../components/Hero";
import MyComponent from "../components/MyComponent";
import MyComponent2 from "../components/MyComponent2";
import grama from "../assets/flor.svg";
import Cartas from "../components/Cartas";
import "../index.css";

const PARALLAX_PAGES = 11;

export default function Home() {
    const lenisRef = useRef(null);
    const [atBottom, setAtBottom] = useState(false);
    const [showScrollIcon, setShowScrollIcon] = useState(true);

    // refs pra direção/posição (evita re-render por frame)
    const lastYRef = useRef(0);
    const hasHiddenOnceRef = useRef(false);

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

            // posição atual (robusto)
            const y = Math.max(
                window.scrollY || 0,
                document.documentElement?.scrollTop || 0
            );
            const maxScroll = (document.body?.scrollHeight || 0) - window.innerHeight;

            // direção simples
            const dy = y - (lastYRef.current ?? 0);
            const goingDown = dy > 0.5;
            const goingUp = dy < -0.5;

            // só some quando descer
            if (goingDown && !hasHiddenOnceRef.current) {
                hasHiddenOnceRef.current = true;
                setShowScrollIcon(false);
            }

            // se subir ou voltar pro topo, mostra de novo
            if (goingUp || y < 10) {
                hasHiddenOnceRef.current = false;
                setShowScrollIcon(true);
            }

            setAtBottom(y >= maxScroll - 100);
            lastYRef.current = y;
        };

        // estado inicial
        setShowScrollIcon(true);
        hasHiddenOnceRef.current = false;
        lastYRef.current = Math.max(
            window.scrollY || 0,
            document.documentElement?.scrollTop || 0
        );

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

    const scrollDown = () => {
        const lenis = lenisRef.current;
        if (!lenis) return;
        lenis.scrollTo(window.innerHeight, {
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 3),
        });
    };

    return (
        <main className="app">
            <Hero />

            {/* Ícone de rolagem (fica até rolar para baixo) */}
            <div
                className={`scroll-indicator ${showScrollIcon ? "visible" : "hidden"}`}
                role="button"
                tabIndex={0}
                onClick={scrollDown}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && scrollDown()}
                aria-label="Rolar para baixo"
            >
                <div className="mouse">
                    <div className="wheel" />
                </div>
                <p>Scroll</p>
            </div>

            {/* Botão flutuante dinâmico */}
            <button
                className={`scroll-end-btn ${atBottom ? "up" : "down"}`}
                onClick={atBottom ? scrollToTop : scrollToEnd}
                aria-label={atBottom ? "Voltar ao topo" : "Ir para o final"}
            >
                {atBottom ? "↑ Topo" : "↓ Final"}
            </button>

            {/* Musgo cobrindo a tela, sobre o Hero */}
            <div className="musgo-overlay">
                <img src={grama} alt="Musgo sobreposto" />
            </div>

            {/* Trilho 1 */}
            <section
                id="parallax-section-1"
                className="parallax-wrap"
                style={{ height: `${PARALLAX_PAGES * 100}vh` }}
            >
                <MyComponent pages={PARALLAX_PAGES} sectionId="parallax-section-1" />
            </section>

            <Cartas />

            {/* Trilho 2 */}
            <section
                id="parallax-section-2"
                className="parallax-wrap"
                style={{ height: `${5 * 100}vh` }}
            >
                <MyComponent2 pages={4} sectionId="parallax-section-2" />
            </section>
        </main>
    );
}
