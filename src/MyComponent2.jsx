import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import fundo1 from "./assets/fundo-light.svg";
import parede1 from "./assets/parede1.svg";
import parede2 from "./assets/parede2.svg";
import musgo from "./assets/musgo.svg";
import cogumelo from "./assets/cogumelo.svg";

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

  // COGUMELOS
  const mushroomsRef = useRef([]);
  const mushrooms = useMemo(
    () => [
      // canto, janela local (em páginas do Parallax), tamanho em vw, profundidade, rotação final
      { id: "tl-1", corner: "tl", start: 0.6, end: 1.6, sizeVW: 10, depth: 1.0, rot: 12 },
      { id: "tr-1", corner: "tr", start: 1.0, end: 2.2, sizeVW: 8,  depth: 0.9, rot: -10 },
      { id: "bl-1", corner: "bl", start: 1.4, end: 2.8, sizeVW: 12, depth: 1.15, rot: 8 },
      { id: "br-1", corner: "br", start: 2.0, end: 3.4, sizeVW: 9,  depth: 1.0, rot: -14 },
      { id: "tl-2", corner: "tl", start: 2.4, end: 3.8, sizeVW: 7,  depth: 0.8, rot: 16 },
      { id: "tr-2", corner: "tr", start: 3.0, end: 4.4, sizeVW: 11, depth: 1.2, rot: -12 },
    ],
    []
  );

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

  // Controla Parallax + Porta + Cogumelos
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

        // ====== Cogumelos (grudados nas bordas) ======
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        mushrooms.forEach((m, i) => {
          const el = mushroomsRef.current[i];
          if (!el) return;

          // progresso local do cogumelo
          const rawM = (offset - m.start) / (m.end - m.start);
          const tM = Math.max(0, Math.min(1, rawM));
          const eM = easeInner(easeOuter(tM));

          // deslocamento curto pra dentro do quadro (≈6% do viewport), multiplicado pela profundidade
          const dxMax = 0.06 * vw * m.depth;
          const dyMax = 0.06 * vh * m.depth;

          // direção conforme o canto
          let x = 0, y = 0, origin = "center center";
          if (m.corner === "tl") { x = +dxMax * eM; y = +dyMax * eM; origin = "left top"; }
          if (m.corner === "tr") { x = -dxMax * eM; y = +dyMax * eM; origin = "right top"; }
          if (m.corner === "bl") { x = +dxMax * eM; y = -dyMax * eM; origin = "left bottom"; }
          if (m.corner === "br") { x = -dxMax * eM; y = -dyMax * eM; origin = "right bottom"; }

          // bobbing sutil
          const bob = Math.sin((offset + i) * 0.8) * 3 * eM;

          // rotação/escala crescendo
          const rot = m.rot * eM;
          const sc  = gsap.utils.interpolate(0.8, 1, eM);

          gsap.set(el, {
            x, y: y + bob,
            rotation: rot,
            scale: sc,
            opacity: eM,
            transformOrigin: origin,
          });
        });
      },
    });

    const onResize = () => st.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [pages, sectionId, mushrooms]);

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
    <div className="parallax-viewport-2">
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
          factor={Math.max(2, pages - 1)}
          style={{
            zIndex: 0,
            backgroundImage: `url(${fundo1})`,
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

        {/* COGUMELOS (grudados nas bordas; abaixo do musgo, acima da porta/fundo) */}
        <ParallaxLayer
          sticky={{ start: 0, end: pages - 0.01 }}
          style={{ zIndex: 7, pointerEvents: "none" }}
        >
          <div className="mushrooms-layer">
            {mushrooms.map((m, i) => (
              <img
                key={m.id}
                ref={(el) => (mushroomsRef.current[i] = el)}
                src={cogumelo}
                alt="Cogumelo"
                className={`mushroom mushroom-${m.corner}`}
                style={{ width: `${m.sizeVW}vw`, opacity: 0 }}
                aria-hidden
              />
            ))}
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
          offset={3.8}
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
