import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Cartas.css";

import coelhocarta from "../assets/coelhocarta.svg";
import chapeleiro from "../assets/chapeleiro.svg";
import gato from "../assets/gato.svg";
import gatoDetails from "../assets/gato-details.svg";
import coelhoDetails from "../assets/coelho-details.svg";
import chapeleiroDetails from "../assets/chapeleiro-details.svg";

export default function Cartas() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const smoothStep = (p) => p * p * (3 - 2 * p);

    // ---------- HOVER HELPERS (funciona para QUALQUER .card) ----------
    const bindHover = (card) => {
      const inner = card.querySelector(".flip-card-inner");
      if (!inner) return;

      const back = inner.querySelector(".card-back.base");
      const details = inner.querySelector(".card-back.details");

      // estado inicial do crossfade
      if (back && details) {
        gsap.set(back, { autoAlpha: 1 });
        gsap.set(details, { autoAlpha: 0 });
      }
      if (card.dataset.scrollRot == null) card.dataset.scrollRot = "0";

      const onEnter = () => {
        card.dataset.hovering = "1";
        gsap.to(inner, {
          rotationY: 180,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
          transformPerspective: 1000,
        });
        if (back && details) {
          gsap.to(back, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
          gsap.to(details, { autoAlpha: 1, duration: 0.2, overwrite: "auto", delay: 0.05 });
        }
      };

      const onLeave = () => {
        delete card.dataset.hovering;
        const target = Number.isFinite(parseFloat(card.dataset.scrollRot))
          ? parseFloat(card.dataset.scrollRot)
          : 0;
        gsap.to(inner, {
          rotationY: target,
          duration: 0.45,
          ease: "power2.inOut",
          overwrite: "auto",
          transformPerspective: 1000,
          onUpdate: () => {
            // quando sai da região de ~180°, volta a mostrar a base
            if (back && details) {
              const current = Number(gsap.getProperty(inner, "rotationY"));
              if (Math.abs(current - 180) > 1) {
                gsap.set(back, { autoAlpha: 1 });
                gsap.set(details, { autoAlpha: 0 });
              }
            }
          },
        });
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      card._onEnter = onEnter;
      card._onLeave = onLeave;
    };

    const unbindHover = (card) => {
      if (card?._onEnter) card.removeEventListener("pointerenter", card._onEnter);
      if (card?._onLeave) card.removeEventListener("pointerleave", card._onLeave);
      delete card._onEnter;
      delete card._onLeave;
    };

    const attachHoverToAll = () => {
      const all = rootRef.current.querySelectorAll(".card");
      all.forEach((c) => { unbindHover(c); bindHover(c); });
    };

    // ---------- ANIMAÇÕES ----------
    const ctx = gsap.context(() => {
      // =========================
      // HERO — ENTRADA "ARC SWING"
      // =========================
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const heroEl = heroRef.current;

      if (heroEl) gsap.set(heroEl, { perspective: 1200 });

      if (!reduceMotion && heroEl) {
        const heroCards = [
          heroEl.querySelector("#hero-card-1"),
          heroEl.querySelector("#hero-card-2"),
          heroEl.querySelector("#hero-card-3"),
        ].filter(Boolean);

        heroCards.forEach((cardEl, i) => {
          const inner = cardEl.querySelector(".flip-card-inner");

          const side = i === 0 ? "left" : i === 2 ? "right" : "center";
          const fromX = side === "left" ? -120 : side === "right" ? 120 : 0;
          const peakX = side === "left" ? -40 : side === "right" ? 40 : 0;
          const fromY = side === "center" ? 90 : 60;
          const peakY = side === "center" ? 20 : 10;
          const fromRotZ = side === "left" ? -18 : side === "right" ? 18 : 12;
          const fromRotX = side === "center" ? -25 : -15;
          const fromSkewY = side === "left" ? -6 : side === "right" ? 6 : 0;

          gsap.set(cardEl, {
            autoAlpha: 0,
            xPercent: fromX,
            yPercent: fromY,
            rotateZ: fromRotZ,
            rotateX: fromRotX,
            skewY: fromSkewY,
            scale: 0.8,
            filter: "blur(14px) saturate(0.7) brightness(0.85)",
            transformOrigin: "50% 60%",
            willChange: "transform, opacity, filter",
          });
          if (inner) {
            gsap.set(inner, {
              rotationY: side === "center" ? -60 : -35,
              transformPerspective: 1200,
              willChange: "transform",
            });
            cardEl.dataset.scrollRot = "0";
          }

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: cardEl, start: "top 110%", end: "top 40%", scrub: 1.2 },
          });

          tl.to(cardEl, {
            xPercent: peakX, yPercent: peakY,
            rotateZ: fromRotZ * 0.35, rotateX: fromRotX * 0.4, skewY: fromSkewY * 0.3,
            scale: 0.92,
            filter: "blur(6px) saturate(0.9) brightness(0.95)",
            autoAlpha: 1, duration: 0.5,
          })
          .to(cardEl, {
            xPercent: 0, yPercent: 0, rotateZ: side === "center" ? -2 : 2,
            rotateX: 0, skewY: 0, scale: 1, filter: "blur(0px) saturate(1) brightness(1)",
            duration: 0.35,
          })
          .to(cardEl, { rotateZ: 0, duration: 0.15 });

          if (inner) tl.to(inner, { rotationY: 0, duration: 0.6, clearProps: "willChange" }, 0.15);
        });
      } else if (heroEl) {
        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((sel) => {
          const cardEl = heroEl.querySelector(sel);
          const inner = cardEl?.querySelector(".flip-card-inner");
          if (cardEl) gsap.set(cardEl, {
            autoAlpha: 1, xPercent: 0, yPercent: 0, rotateZ: 0, rotateX: 0, skewY: 0, scale: 1, filter: "none",
            clearProps: "transform,opacity,filter",
          });
          if (inner) { gsap.set(inner, { rotationY: 0, clearProps: "transform" }); cardEl.dataset.scrollRot = "0"; }
        });
      }

      // =========================
      // HERO (efeito durante o scroll)
      // =========================
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "150% top",
        scrub: 2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const heroCardsContainer = heroRef.current?.querySelector(".hero-cards");
          if (heroCardsContainer) {
            const opacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));
            gsap.set(heroCardsContainer, { opacity });
          }

          ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((sel, i) => {
            const card = heroRef.current?.querySelector(sel);
            if (!card) return;

            const delay = i * 0.9;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));

            const y = gsap.utils.interpolate("0%", "250%", smoothStep(cardProgress));
            const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));
            let x = "0%";
            let rotation = 0;
            if (i === 0) { x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress)); rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress)); }
            else if (i === 2) { x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress)); rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress)); }

            gsap.set(card, { y, x, scale, rotation, willChange: "transform" });

            const inner = card.querySelector(".flip-card-inner");
            if (inner && !card.dataset.hovering) {
              const rotY = gsap.utils.interpolate(0, 90, smoothStep(cardProgress));
              gsap.set(inner, { rotationY: rotY, transformPerspective: 1000, willChange: "transform" });
              card.dataset.scrollRot = String(rotY);
            }
          });
        },
      });

      // =========================
      // SERVICES (cabeçalho sobe)
      // =========================
      ScrollTrigger.create({
        trigger: servicesRef.current,
        start: "top bottom",
        end: () => `+=${window.innerHeight * 2}`,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          const headerY = gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress));
          const headerEl = servicesRef.current?.querySelector(".services-header");
          if (headerEl) gsap.set(headerEl, { y: headerY, willChange: "transform" });
        },
      });

      // =========================
      // CARDS PINADAS — animação + salvar scrollRot
      // =========================
      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          ["#card-1", "#card-2", "#card-3"].forEach((idSel, index) => {
            const card = cardsRef.current?.querySelector(idSel);
            if (!card) return;
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
            const innerCard = card.querySelector(".flip-card-inner");

            // y
            let y;
            if (cardProgress < 0.4) y = gsap.utils.interpolate("-100%", "50%", cardProgress / 0.4);
            else if (cardProgress < 0.6) y = gsap.utils.interpolate("50%", "0%", (cardProgress - 0.4) / 0.2);
            else y = "0%";

            // scale
            let scale;
            if (cardProgress < 0.4) scale = gsap.utils.interpolate(0.25, 0.75, cardProgress / 0.4);
            else if (cardProgress < 0.6) scale = gsap.utils.interpolate(0.75, 1, (cardProgress - 0.4) / 0.2);
            else scale = 1;

            const opacity = cardProgress < 0.2 ? cardProgress / 0.2 : 1;

            let x, rotate;
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            } else {
              const n = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", n);
              rotate = gsap.utils.interpolate(index === 0 ? -5 : 5, 0, n);
            }

            // rotação do scroll: 0 → 180
            let rotationY;
            if (cardProgress < 0.6) rotationY = 0;
            else rotationY = ((cardProgress - 0.6) / 0.4) * 180;

            gsap.set(card, { opacity, y, x, rotate, scale, willChange: "transform, opacity" });

            if (innerCard) {
              card.dataset.scrollRot = String(rotationY);
              if (!card.dataset.hovering) {
                gsap.set(innerCard, {
                  rotationY,
                  transformPerspective: 1000,
                  willChange: "transform",
                  transformStyle: "preserve-3d",
                });
                const back = innerCard.querySelector(".card-back.base");
                const details = innerCard.querySelector(".card-back.details");
                if (back && details) {
                  gsap.set(back, { autoAlpha: 1 });
                  gsap.set(details, { autoAlpha: 0 });
                }
              }
            }
          });
        },
      });

      // --------- HOVER EM TODAS AS CARTAS (HERO + PINADAS) ----------
      attachHoverToAll();
      const onRefresh = () => attachHoverToAll();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      // Cleanup
      return () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        const all = rootRef.current?.querySelectorAll(".card") || [];
        all.forEach(unbindHover);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // =========================
  // RENDER
  // =========================
  return (
    <div ref={rootRef}>
      {/* HERO */}
      <section className="hero" ref={heroRef} aria-label="Hero">
        <div className="hero-cards">
          {/* HERO CARD 1 */}
          <div className="card" id="hero-card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing hearts" data-rank="A" data-suit="♥">
                  <div className="corner tl"><span className="rank">A</span><span className="suit">♥</span></div>
                  <div className="pips face-ace"><span className="pip">♥</span></div>
                  <div className="corner br"><span className="rank">A</span><span className="suit">♥</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${coelhocarta})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${coelhoDetails})` }} />
              </div>
            </div>
          </div>

          {/* HERO CARD 2 */}
          <div className="card" id="hero-card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing spades" data-rank="Q" data-suit="♠">
                  <div className="corner tl"><span className="rank">Q</span><span className="suit">♠</span></div>
                  <div className="pips face-card"><span className="face-label">QUEEN</span><span className="big-suit">♠</span></div>
                  <div className="corner br"><span className="rank">Q</span><span className="suit">♠</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${gato})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${gatoDetails})` }} />
              </div>
            </div>
          </div>

          {/* HERO CARD 3 */}
          <div className="card" id="hero-card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing diamonds" data-rank="10" data-suit="♦">
                  <div className="corner tl"><span className="rank">10</span><span className="suit">♦</span></div>
                  <div className="pips grid-10">
                    {Array.from({ length: 10 }).map((_, i) => <span key={i} className="pip">♦</span>)}
                  </div>
                  <div className="corner br"><span className="rank">10</span><span className="suit">♦</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${chapeleiro})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${chapeleiroDetails})` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" ref={servicesRef}>
        <div className="services-header">
          <h1>Conheça os personagens</h1>
        </div>
      </section>

      {/* CARDS PINADAS */}
      <section className="cards" ref={cardsRef}>
        <div className="cards-container">
          {/* CARD 1 */}
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing hearts">
                  <div className="corner tl"><span className="rank">1</span><span className="suit">♥</span></div>
                  <div className="pips face-ace"><span className="pip">♥</span></div>
                  <div className="corner br"><span className="rank">1</span><span className="suit">♥</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${gato})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${gatoDetails})` }} />
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing spades" data-rank="Q" data-suit="♠">
                  <div className="corner tl"><span className="rank">Q</span><span className="suit">♠</span></div>
                  <div className="pips face-card"><span className="face-label">QUEEN</span><span className="big-suit">♠</span></div>
                  <div className="corner br"><span className="rank">Q</span><span className="suit">♠</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${coelhocarta})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${coelhoDetails})` }} />
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="card" id="card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing diamonds" data-rank="10" data-suit="♦">
                  <div className="corner tl"><span className="rank">10</span><span className="suit">♦</span></div>
                  <div className="pips grid-10">
                    {Array.from({ length: 10 }).map((_, i) => <span key={i} className="pip">♦</span>)}
                  </div>
                  <div className="corner br"><span className="rank">10</span><span className="suit">♦</span></div>
                </div>
                <div className="flip-card-back card-back base" style={{ backgroundImage: `url(${chapeleiro})` }} />
                <div className="flip-card-back card-back details" style={{ backgroundImage: `url(${chapeleiroDetails})` }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      

      <section className="outro">
      </section>
    </div>
  );
}
