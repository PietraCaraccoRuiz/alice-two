import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import cogumelo from "./assets/cogumelo.svg";
import parede1 from "./assets/parede1.svg";
import parede2 from "./assets/parede2.svg";
import musgo from "./assets/musgo.svg";

// Cards de exemplo
const cards = [
  { id: 1, title: "Capítulo 1", subtitle: "A toca", text: "Introdução ao mundo.", cta: "Ler" },
  { id: 2, title: "Capítulo 2", subtitle: "O espelho", text: "Atravessar ou não?", cta: "Abrir" },
  { id: 3, title: "Capítulo 3", subtitle: "O relógio", text: "Tempo se dobra.", cta: "Ver" },
  { id: 4, title: "Capítulo 4", subtitle: "A rainha", text: "Regras e caos.", cta: "Entrar" },
  { id: 5, title: "Capítulo 5", subtitle: "O chá", text: "Conversa torta.", cta: "Sentar" },
  { id: 6, title: "Capítulo 6", subtitle: "Cartas", text: "Faces e versos.", cta: "Virar" },
  { id: 7, title: "Capítulo 7", subtitle: "O jardim", text: "Sombra e luz.", cta: "Explorar" },
  { id: 8, title: "Capítulo 8", subtitle: "Saída", text: "Talvez.", cta: "Seguir" },
];

export default function MyComponent2({ pages = 5, sectionId = "parallax-section-2" }) {
  const parallaxRef = useRef(null);

  // Porta (metades)
  const doorLeftRef = useRef(null);
  const doorRightRef = useRef(null);

  // ===== Porta — tempo bem demorado =====
  const DOOR_START = 1;
  const DOOR_END   = 4.6;

  const SMOOTH_ALPHA = 0.08;
  const easeOuter = gsap.parseEase("sine.inOut");
  const easeInner = gsap.parseEase("power4.out");

  const targetTRef = useRef(0);
  const smoothTRef = useRef(0);

  // Desliga a rolagem interna do Parallax
  useEffect(() => {
    const container = parallaxRef.current?.container?.current;
    if (container) container.style.overflow = "hidden";
  }, []);

  // Estado inicial dos painéis (evita gsap em null)
  useLayoutEffect(() => {
    const left = doorLeftRef.current;
    const right = doorRightRef.current;
    if (left)  gsap.set(left,  { xPercent: 0, rotateY: 0, transformOrigin: "left center" });
    if (right) gsap.set(right, { xPercent: 0, rotateY: 0, transformOrigin: "right center" });
  }, []);

  // Controla Parallax + Porta
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: `#${sectionId}`,
      start: "top top",
      end: () => `+=${pages * window.innerHeight}`,
      scrub: true,
      onUpdate: (self) => {
        const offset = self.progress * (pages - 1);
        parallaxRef.current?.scrollTo?.(offset);

        // ====== Porta ======
        const raw = (offset - DOOR_START) / (DOOR_END - DOOR_START);
        const clamped = Math.max(0, Math.min(1, raw));
        const shaped = easeInner(easeOuter(clamped));

        targetTRef.current = shaped;
        smoothTRef.current = gsap.utils.interpolate(smoothTRef.current, targetTRef.current, SMOOTH_ALPHA);
        const t = smoothTRef.current;

        const left  = doorLeftRef.current;
        const right = doorRightRef.current;

        const leftX  = gsap.utils.interpolate(0, -115, t);
        const rightX = gsap.utils.interpolate(0,  115, t);
        const leftRot  = gsap.utils.interpolate(0, -6, t);
        const rightRot = gsap.utils.interpolate(0,  6, t);
        const scale = gsap.utils.interpolate(1.000, 1.008, t);

        const bgX = Math.round(gsap.utils.interpolate(50, 58, t));
        const bgPosLeft  = `${100 - bgX}% center`;
        const bgPosRight = `${bgX}% center`;

        if (left) {
          gsap.set(left, { xPercent: leftX, rotateY: leftRot, scale });
          const bg = left.querySelector(".door-bg");
          if (bg) bg.style.backgroundPosition = bgPosLeft;
        }
        if (right) {
          gsap.set(right, { xPercent: rightX, rotateY: rightRot, scale });
          const bg = right.querySelector(".door-bg");
          if (bg) bg.style.backgroundPosition = bgPosRight;
        }
      },
    });

    const onResize = () => st.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [pages, sectionId]);

  // Hover tilt leve pros cards
  const lerp = (a, b, t) => a + (b - a) * t;
  const mkTiltHandlers = useMemo(
    () => ({
      onMouseMove: (ev) => {
        const card = ev.currentTarget;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (ev.clientX - cx) / (rect.width / 2);
        const dy = (ev.clientY - cy) / (rect.height / 2);
        const rotX = lerp(10, -10, (dy + 1) / 2);
        const rotY = lerp(-10, 10, (dx + 1) / 2);
        card.style.transform = `translateZ(0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      },
      onMouseLeave: (ev) => {
        const card = ev.currentTarget;
        card.style.transform = "translateZ(0) rotateX(0) rotateY(0) scale(1)";
      },
    }),
    []
  );

  return (
    <div id={sectionId} className="parallax-viewport-2">
      <Parallax
        ref={parallaxRef}
        pages={pages}
        horizontal={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* FUNDO (atrás de tudo) */}
        <ParallaxLayer
          offset={0.8}
          speed={0.2}
          factor={Math.max(1, pages )}
          style={{
            zIndex: 0,
           background: "radial-gradient(circle at 50% 35%, #E8FBFF 0%, #39B8FF 35%, #0056A6 75%, #00162E 100%)",


            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* cogumelo */}
        <ParallaxLayer
          offset={2.5}
          speed={0.2}
          factor={Math.max(1, pages - 1)}
          style={{
            zIndex: 0,
            backgroundImage: `url(${cogumelo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* PORTA (abaixo do musgo) */}
        <ParallaxLayer
          sticky={{ start: DOOR_START, end: DOOR_END }}
          style={{ zIndex: 5, pointerEvents: "none" }}
        >
          <div className="door-wrap">
            <div ref={doorLeftRef} className="door-panel door-left">
              <div className="door-bg" style={{ backgroundImage: `url(${parede1})` }} />
            </div>
            <div ref={doorRightRef} className="door-panel door-right">
              <div className="door-bg" style={{ backgroundImage: `url(${parede2})` }} />
            </div>
          </div>
        </ParallaxLayer>

        {/* MUSGO (por cima) */}
        <ParallaxLayer
          sticky={{ start: 0.5, end: 0.5 }}
          style={{
            pointerEvents: "none",
            zIndex: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <img
            src={musgo}
            alt="Musgo"
            style={{
              width: "100%",
              height: "850px",
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </ParallaxLayer>

        {/* CARDS */}
        <ParallaxLayer
          offset={2.2}
          speed={0.55}
          factor={1.25}
          style={{
            pointerEvents: "auto",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6vh 4vw",
          }}
        >
          <div className="cards-grid">
            {cards.map((c) => (
              <article
                key={c.id}
                className="p-card"
                onMouseMove={mkTiltHandlers.onMouseMove}
                onMouseLeave={mkTiltHandlers.onMouseLeave}
                role="button"
                tabIndex={0}
                aria-label={`${c.title}: ${c.subtitle}`}
              >
                <header className="p-card__head">
                  <span className="p-card__kicker">{c.subtitle}</span>
                  <h3 className="p-card__title">{c.title}</h3>
                </header>
                <p className="p-card__text">{c.text}</p>
                <div className="p-card__cta">
                  <button className="p-card__btn" type="button">{c.cta}</button>
                </div>
                <div className="p-card__shine" aria-hidden />
              </article>
            ))}
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
