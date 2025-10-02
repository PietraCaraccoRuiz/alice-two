import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Cartas.css";

export default function Cartas() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const smoothStep = (p) => p * p * (3 - 2 * p);

    const ctx = gsap.context(() => {
      // HERO
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
            if (i === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
            } else if (i === 2) {
              x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
            }

            gsap.set(card, { y, x, scale, rotation, willChange: "transform" });

            const inner = card.querySelector(".flip-card-inner");
            if (inner) {
              const rotY = gsap.utils.interpolate(0, 90, smoothStep(cardProgress));
              gsap.set(inner, { rotationY: rotY, transformPerspective: 1000, willChange: "transform" });
            }
          });
        },
      });

      // SERVICES (cabeçalho aparece de baixo)
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

      // CARDS (pin + flip)
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
            if (cardProgress < 0.4) {
              const n = cardProgress / 0.4;
              y = gsap.utils.interpolate("-100%", "50%", n);
            } else if (cardProgress < 0.6) {
              const n = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate("50%", "0%", n);
            } else {
              y = "0%";
            }

            // scale
            let scale;
            if (cardProgress < 0.4) {
              const n = cardProgress / 0.4;
              scale = gsap.utils.interpolate(0.25, 0.75, n);
            } else if (cardProgress < 0.6) {
              const n = (cardProgress - 0.4) / 0.2;
              scale = gsap.utils.interpolate(0.75, 1, n);
            } else {
              scale = 1;
            }

            // opacity
            const opacity = cardProgress < 0.2 ? cardProgress / 0.2 : 1;

            // x, rotate, rotationY
            let x, rotate, rotationY;
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else {
              const n = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", n);
              rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, n);
              rotationY = n * 180;
            }

            gsap.set(card, { opacity, y, x, rotate, scale, willChange: "transform, opacity" });
            if (innerCard) gsap.set(innerCard, { rotationY, transformPerspective: 1000, willChange: "transform" });
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* HERO (baralho menor) */}
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
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO CARD 2 */}
          <div className="card" id="hero-card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing spades" data-rank="Q" data-suit="♠">
                  <div className="corner tl"><span className="rank">Q</span><span className="suit">♠</span></div>
                  <div className="pips face-card">
                    <span className="face-label">QUEEN</span>
                    <span className="big-suit">♠</span>
                  </div>
                  <div className="corner br"><span className="rank">Q</span><span className="suit">♠</span></div>
                </div>
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
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
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" ref={servicesRef} aria-label="Serviços">
        <div className="services-header">
          <h1>SLla oq ue sei la o que</h1>
        </div>
      </section>

      {/* CARDS pinados */}
      <section className="cards" ref={cardsRef} aria-label="Cards">
        <div className="cards-container">
          {/* CARD 1 */}
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing hearts" data-rank="A" data-suit="♥">
                  <div className="corner tl"><span className="rank">A</span><span className="suit">♥</span></div>
                  <div className="pips face-ace"><span className="pip">♥</span></div>
                  <div className="corner br"><span className="rank">A</span><span className="suit">♥</span></div>
                </div>
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front playing spades" data-rank="Q" data-suit="♠">
                  <div className="corner tl"><span className="rank">Q</span><span className="suit">♠</span></div>
                  <div className="pips face-card">
                    <span className="face-label">QUEEN</span>
                    <span className="big-suit">♠</span>
                  </div>
                  <div className="corner br"><span className="rank">Q</span><span className="suit">♠</span></div>
                </div>
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
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
                <div className="flip-card-back card-back">
                  <div className="back-pattern"></div>
                  <div className="back-logo">DECK</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="outro" aria-label="Fim">
        <h1>Fim</h1>
      </section>
    </div>
  );
}
