import { useEffect, useMemo, useRef } from "react";
import { useSpring, animated, easings } from "@react-spring/web";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedText from "./AnimatedText";

import toca from "./assets/toca.png";
import alice from "./assets/alice3.gif";
import gaiola from "./assets/gaiola.svg";
import espelho from "./assets/espelho.png";
import quadro1 from "./assets/quadro1.svg";
import livro1 from "./assets/livro1.svg";
import livro2 from "./assets/livro2.svg";
import velas from "./assets/velas.svg";
import relogio from "./assets/relogio.svg";
import cadeira from "./assets/cadeira.svg";
import carta from "./assets/carta.svg";
import estante from "./assets/estante.svg";

export default function MyComponent({
  pages = 10,
  sectionId = "parallax-section-1",
}) {
  const parallaxRef = useRef(null);

  // Refs dos livros
  const bookLeftRef = useRef(null);
  const bookRightRef = useRef(null);

  // Garante que factors não excedam o total de páginas
  const clampFactor = (offset, desiredFactor) => {
    const max = Math.max(0.1, pages - offset - 0.001);
    return Math.min(desiredFactor, max);
  };
  const clampStickyEnd = (desiredEnd) => Math.min(desiredEnd, pages - 0.001);

  // Animações leves que podem continuar com spring
  const mirrorAnimation = useSpring({
    from: { y: -20 },
    to: { y: 20 },
    loop: { reverse: true },
    config: { duration: 2000, easing: easings.easeInOutSine },
  });

  const chairAnimation = useSpring({
    from: { x: -20, y: 20, rotate: -5 },
    to: { x: 20, y: -20, rotate: 5 },
    loop: { reverse: true },
    config: { duration: 1000, easing: easings.easeInOutSine },
  });

  const Sparkle = ({ x, y, size, delay, duration, color, strong }) => {
    const styles = useSpring({
      from: { opacity: strong ? 0.7 : 0.2, transform: "scale(0.5)" },
      to: { opacity: 1, transform: "scale(1.3)" },
      loop: { reverse: true },
      config: { duration },
      delay,
    });
    return (
      <animated.div
        style={{
          ...styles,
          position: "absolute",
          top: y,
          left: x,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          boxShadow: strong
            ? `0 0 ${size} ${parseInt(size, 10) / 2}px ${color}`
            : `0 0 ${parseInt(size, 10) / 2}px ${color}`,
        }}
      />
    );
  };

  const starsLayer1 = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 6 + 2}px`,
        delay: Math.random() * 2000,
        duration: Math.random() * 800 + 200,
        color: ["white", "#aee", "#ccf", "#eef", "#ffd"][
          Math.floor(Math.random() * 5)
        ],
        strong: true,
      })),
    []
  );
  const starsLayer2 = useMemo(
    () =>
      Array.from({ length: 80 }).map(() => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 2}px`,
        delay: Math.random() * 2000,
        duration: Math.random() * 800 + 200,
        color: ["white", "#aee", "#ccf", "#eef", "#ffd"][
          Math.floor(Math.random() * 5)
        ],
        strong: false,
      })),
    []
  );
  const starsLayer3 = useMemo(
    () =>
      Array.from({ length: 100 }).map(() => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 2}px`,
        delay: Math.random() * 2000,
        duration: Math.random() * 800 + 200,
        color: ["white", "#aee", "#ccf", "#eef", "#ffd"][
          Math.floor(Math.random() * 5)
        ],
        strong: false,
      })),
    []
  );

  const fallingCards = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        x: Math.random() * 90,
        y: -50 - Math.random() * 100,
        size: 40 + Math.random() * 30,
        speed: 4000 + Math.random() * 4000,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 50,
      })),
    []
  );

  const FallingCard = ({ x, y, size, speed, rotate, drift }) => {
    const styles = useSpring({
      from: { transform: `translate(${x}vw, ${y}px) rotate(${rotate}deg)` },
      to: async (next) => {
        while (true) {
          await next({
            transform: `translate(${x + drift}vw, ${
              window.innerHeight + 50
            }px) rotate(${rotate + 360}deg)`,
          });
          const nx = Math.random() * 90;
          const ny = -50 - Math.random() * 100;
          const nr = Math.random() * 360;
          await next({
            transform: `translate(${nx}vw, ${ny}px) rotate(${nr}deg)`,
          });
          x = nx;
          y = ny;
          rotate = nr;
        }
      },
      config: { duration: speed, easing: easings.linear },
    });
    return (
      <animated.img
        src={carta}
        alt="Carta"
        style={{ ...styles, width: size, position: "absolute", zIndex: 5 }}
      />
    );
  };

  // ===== Utilitários para mapear o progresso do scroll =====
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeIn = gsap.parseEase("expo.out");
  const easeArc = (t) => Math.sin(t * Math.PI); // curva de arco
  const easeBack = gsap.parseEase("back.out(1.4)");
  const pageToT = (page, startPage, endPage) =>
    clamp01((page - startPage) / (endPage - startPage));

  // ScrollTrigger -> controla Parallax e Livros
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: `#${sectionId}`,
      start: "top top",
      end: () => `+=${pages * window.innerHeight}`,
      scrub: true,
      onUpdate: (self) => {
        const page = self.progress * (pages - 1);
        // Sincroniza Parallax
        parallaxRef.current?.scrollTo(page);

        // Ranges de scroll (em "páginas") para os livros
        const L_START = 3.0,
          L_END = 4.1; // aumentei a janela
        const R_START = 3.45,
          R_END = 4.6;

        // ===== Livro Esquerdo — “pop elástico”, arco + glow que respira =====
        if (bookLeftRef.current) {
          let t = pageToT(page, L_START, L_END);
          const tIn = clamp01(t * 1.4); // entrada mais rápida
          const tOut = clamp01((t - 0.6) / 0.4); // saída curta
          const tCore = clamp01((t - 0.1) / 0.8); // trecho principal

          // Entrada elástica
          const scale = lerp(0.86, 1.04, easeBack(tIn));
          const opacity = t <= 0 ? 0 : lerp(0.2, 1, easeIn(tIn));

          // Trajetória curva (arco) + leve “respiração”
          const arc = easeArc(tCore);
          const y = lerp(200, -24, tCore) - arc * 12;
          const x = lerp(300, 10, tCore) + Math.sin(tCore * Math.PI * 2) * 6;

          // Tilt/3D
          const rotation = lerp(-10, 6, tCore) + Math.sin(tCore * Math.PI) * 2;
          const rotationY = lerp(-60, -5, tCore);

          // Glow “respirando”
          const glow =
            lerp(0, 14, tCore) * (0.85 + 0.15 * Math.sin(tCore * Math.PI * 4));

          // Saída (apenas leve fade/scale down)
          const fadeOut = lerp(1, 0.85, tOut);
          const finalScale = scale * fadeOut;
          const finalOpacity = opacity * lerp(1, 0.75, tOut);

          gsap.set(bookLeftRef.current, {
            x,
            y,
            rotation,
            rotationY,
            scale: finalScale,
            opacity: finalOpacity,
            transformOrigin: "50% 50%",
            transformPerspective: 1000,
            force3D: true,
            filter: `drop-shadow(0 0 ${glow}px rgba(255,255,255,0.35))`,
          });
        }

        // ===== Livro Direito — “flip elegante”, arco invertido + leve zoom =====
        if (bookRightRef.current) {
          let t = pageToT(page, R_START, R_END);
          const tIn = clamp01(t * 1.2);
          const tOut = clamp01((t - 0.7) / 0.3);
          const tCore = clamp01((t - 0.05) / 0.85);

          const scale = lerp(0.9, 1.06, easeBack(tIn)) * lerp(1, 0.92, tOut);
          const opacity =
            t <= 0 ? 0 : lerp(0.25, 1, easeIn(tIn)) * lerp(1, 0.8, tOut);

          const arc = easeArc(tCore);
          const y = lerp(300, 10, tCore) - arc * 10;
          const x = lerp(-500, -200, tCore) + Math.sin(tCore * Math.PI * 2) * 5;

          const rotation = lerp(8, -8, tCore) + Math.sin(tCore * Math.PI) * 2;
          const rotationY = lerp(18, 34, tCore); // “flip” mais visível no fim

          const glow =
            lerp(0, 12, tCore) * (0.85 + 0.15 * Math.sin(tCore * Math.PI * 4));

          gsap.set(bookRightRef.current, {
            x,
            y,
            rotation,
            rotationY,
            scale,
            opacity,
            transformOrigin: "50% 50%",
            transformPerspective: 1000,
            force3D: true,
            filter: `drop-shadow(0 0 ${glow}px rgba(255,255,255,0.35))`,
          });
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

  // Desliga rolagem interna do Parallax
  useEffect(() => {
    const container = parallaxRef.current?.container?.current;
    if (container) container.style.overflow = "hidden";
  }, []);

  return (
    <div
      id={sectionId}
      className="parallax-viewport-1"
      style={{ perspective: 1000, perspectiveOrigin: "50% 40%" }}
    >
      <Parallax
        ref={parallaxRef}
        pages={pages}
        horizontal={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Fundo preto */}
        <ParallaxLayer
          offset={0}
          speed={0.5}
          factor={clampFactor(0, 2)}
          style={{ backgroundColor: "black" }}
        />

        {/* Fundo da Toca */}
        <ParallaxLayer
          offset={1}
          speed={0.5}
          factor={clampFactor(0, 11)}
          style={{
            backgroundImage: `url(${toca})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Estrelas */}
        <ParallaxLayer offset={0.8} factor={clampFactor(1.8, 3)} speed={0.4}>
          {starsLayer1.map((s, i) => (
            <Sparkle key={`s1-${i}`} {...s} />
          ))}
        </ParallaxLayer>
        <ParallaxLayer offset={1.5} factor={clampFactor(2.5, 3)} speed={0.4}>
          {starsLayer2.map((s, i) => (
            <Sparkle key={`s2-${i}`} {...s} />
          ))}
        </ParallaxLayer>
        <ParallaxLayer offset={4} factor={clampFactor(3, 8)} speed={0.6}>
          {starsLayer3.map((s, i) => (
            <Sparkle key={`s3-${i}`} {...s} />
          ))}
        </ParallaxLayer>

        {/* Cartas caindo */}
        <ParallaxLayer offset={5.9} factor={clampFactor(3.4, 5)} speed={0.8}>
          {fallingCards.map((card, i) => (
            <FallingCard key={`card-a-${i}`} {...card} />
          ))}
        </ParallaxLayer>
        <ParallaxLayer offset={7.8} factor={clampFactor(7.6, 5)} speed={0.8}>
          {fallingCards.map((card, i) => (
            <FallingCard key={`card-b-${i}`} {...card} />
          ))}
        </ParallaxLayer>

        {/* Alice sticky */}
        <ParallaxLayer
          sticky={{ start: 1.3, end: clampStickyEnd(10.3) }}
          style={{ textAlign: "center", zIndex: 1 }}
        >
          <animated.img src={alice} style={{ width: 1000 }} alt="Alice" />
        </ParallaxLayer>

        {/* Gaiola */}
        <ParallaxLayer offset={1.6} factor={clampFactor(1.6, 0.5)} speed={2}>
          <animated.img
            src={gaiola}
            style={{
              width: 200,
              position: "absolute",
              left: 0,
              ...mirrorAnimation,
            }}
            alt="Gaiola"
          />
        </ParallaxLayer>

        {/* Relógio */}
        <ParallaxLayer sticky={{ start: 2, end: 2 }}>
          <animated.img
            src={relogio}
            style={{
              width: 300,
              position: "absolute",
              right: -80,
              ...mirrorAnimation,
            }}
            alt="Relógio"
          />
        </ParallaxLayer>

        {/* Estante */}
        <ParallaxLayer sticky={{ start: 3, end: 3 }}>
          <animated.img
            src={estante}
            style={{
              width: 500,
              position: "absolute",
              left: -80,
              ...mirrorAnimation,
            }}
            alt="Estante"
          />
        </ParallaxLayer>

        {/* Livro 1 (esquerda) */}
        <ParallaxLayer sticky={{ start: 3.5, end: 4 }}>
          <img
            ref={bookLeftRef}
            src={livro1}
            alt="Livro esquerdo"
            style={{
              width: 200,
              position: "absolute",
              right: 400,
              pointerEvents: "none",
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity, filter",
              ...mirrorAnimation,
            }}
          />
        </ParallaxLayer>

        {/* Livro 2 (direita) */}
        <ParallaxLayer sticky={{ start: 4.5, end: 4.6 }}>
          <img
            ref={bookRightRef}
            src={livro2}
            alt="Livro direito"
            style={{
              width: 200,
              position: "absolute",
              left: 500,
              pointerEvents: "none",
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity, filter",
              ...mirrorAnimation,
            }}
          />
        </ParallaxLayer>

        {/* Lustre */}
        <ParallaxLayer sticky={{ start: 6.5, end: 6.5 }}>
          <animated.img
            src={velas}
            style={{
              width: 200,
              position: "absolute",
              right: -20,
              ...mirrorAnimation,
            }}
            alt="Velas"
          />
        </ParallaxLayer>

        {/* Espelho */}
        <ParallaxLayer sticky={{ start: 7, end: 7 }}>
          <animated.img
            src={espelho}
            style={{
              width: 600,
              position: "absolute",
              left: -140,
              ...mirrorAnimation,
            }}
            alt="Espelho"
          />
        </ParallaxLayer>

        {/* Cadeira */}
        <ParallaxLayer sticky={{ start: 8, end: 8 }}>
          <animated.img
            src={cadeira}
            style={{
              width: 400,
              position: "absolute",
              right: 0,
              ...chairAnimation,
            }}
            alt="Cadeira"
          />
        </ParallaxLayer>

        {/* Quadro */}
        <ParallaxLayer sticky={{ start: 9, end: 9 }}>
          <animated.img
            src={quadro1}
            style={{
              width: 200,
              position: "absolute",
              left: 0,
              ...mirrorAnimation,
            }}
            alt="Quadro"
          />
        </ParallaxLayer>

        {/* Textos */}
        {[
          {
            content: "Lá vamos nós...",
            position: { left: "100px" },
            offset: 0.6,
            direction: "left",
          },
          {
            content: "Um mundo desconhecido se abre.",
            position: { right: "100px" },
            offset: 0.9,
            direction: "right",
          },
          {
            content: "Alice segue em sua aventura...",
            position: { left: "100px" },
            offset: 1,
            direction: "left",
          },
          {
            content: "O tempo parece diferente aqui.",
            position: { right: "100px" },
            offset: 1.2,
            direction: "right",
          },
          {
            content: "Relógios param, mas o tempo corre",
            position: { left: "100px" },
            offset: 2.0,
            direction: "left",
          },
          {
            content: "A curiosidade é a chave",
            position: { right: "100px" },
            offset: 3.1,
            direction: "right",
          },
          {
            content: "Cada detalhe guarda um segredo",
            position: { left: "100px" },
            offset: 4,
            direction: "left",
          },
          {
            content: "Quanto mais fundo, mais mágico",
            position: { right: "100px" },
            offset: 5,
            direction: "right",
          },
          {
            content: "Bem-vindo ao Páís das Maravilhas",
            position: { left: "100px" },
            offset: 5.2,
            direction: "left",
          },

          {
            content: "A porta range ao longe",
            position: { right: "100px" },
            offset: 5.6,
            direction: "right",
          },
          {
            content: "Sussurros guiam o caminho",
            position: { left: "100px" },
            offset: 5.8,
            direction: "left",
          },
          {
            content: "O espelho conhece segredos",
            position: { right: "100px" },
            offset: 6,
            direction: "right",
          },
          {
            content: "Relógios marcam horas impossíveis",
            position: { left: "100px" },
            offset: 6.5,
            direction: "left",
          },
          {
            content: "A realidade dobra nas bordas",
            position: { right: "100px" },
            offset: 7.4,
            direction: "right",
          },
          {
            content: "A coragem acende a trilha",
            position: { left: "100px" },
            offset: 8.4,
            direction: "left",
          },
          {
            content: "Nada é o que parece",
            position: { right: "100px" },
            offset: 9.2,
            direction: "right",
          },
        ].map((t, i) => (
          <AnimatedText
            key={i}
            content={t.content}
            position={t.position}
            offset={t.offset}
            direction={t.direction}
          />
        ))}
      </Parallax>
    </div>
  );
}
