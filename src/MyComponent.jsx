import { useEffect, useMemo, useRef } from "react";
import { useSpring, animated, easings } from "@react-spring/web";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedText from './AnimatedText'

import toca from "./assets/toca.png";
import fundo2 from "./assets/fundo2.gif";
import fundo3 from "./assets/fundo3.jpg";
import fundo4 from "./assets/fundo4.jpg";

import alice from "./assets/alice3.gif";
import gaiola from "./assets/gaiola.svg";
import espelho from "./assets/espelho.png";
import quadro1 from "./assets/quadro1.svg";
import velas from "./assets/velas.svg";
import relogio from "./assets/relogio.svg";
import cadeira from "./assets/cadeira.svg";
import carta from "./assets/carta.svg";
import estante from "./assets/estante.svg";

export default function MyComponent({ pages = 10 }) {
  const parallaxRef = useRef(null);

  // Garante que layers não estouram o total
  const clampFactor = (offset, desiredFactor) => {
    const max = Math.max(0.1, pages - offset - 0.001);
    return Math.min(desiredFactor, max);
  };
  const clampStickyEnd = (desiredEnd) => Math.min(desiredEnd, pages - 0.001);

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
            transform: `translate(${x + drift}vw, ${window.innerHeight + 50
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

  // ScrollTrigger -> Parallax (o body/Lenis controla o scroll)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: "#parallax-section",
      start: "top top",
      end: () => `+=${pages * window.innerHeight}`,
      scrub: true,
      onUpdate: (self) => {
        const offset = self.progress * (pages - 1);
        parallaxRef.current?.scrollTo(offset);
      },
    });

    const onResize = () => st.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [pages]);

  // Desliga rolagem interna do Parallax e previne overflow
  useEffect(() => {
    const container = parallaxRef.current?.container?.current;
    if (container) {
      container.style.overflow = "hidden";
    }
  }, []);


  // Todos os textos
  const texts = [
    { content: "Lá vamos nós...", position: { left: "100px" }, offset: 0.5, direction: "left" },
    { content: "Um mundo desconhecido se abre.", position: { right: "100px" }, offset: 0.8, direction: "right" },
    { content: "Alice segue em sua aventura...", position: { left: "120px" }, offset: 1.2, direction: "left" },
    { content: "O tempo parece diferente aqui.", position: { right: "120px" }, offset: 1.7, direction: "right" },
    // adicione até 20 ou mais
  ];




  return (
    // Viewport sticky de 100vh
    <div className="parallax-viewport">
      <Parallax
        ref={parallaxRef}
        pages={pages}
        scrolling={false} // <— desliga scroll interno
        horizontal={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
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
        <ParallaxLayer offset={3.4} factor={clampFactor(3.4, 5)} speed={0.8}>
          {fallingCards.map((card, i) => (
            <FallingCard key={`card-${i}`} {...card} />
          ))}
        </ParallaxLayer>
        {/* Cartas caindo */}
        <ParallaxLayer offset={7.6} factor={clampFactor(3.4, 5)} speed={0.8}>
          {fallingCards.map((card, i) => (
            <FallingCard key={`card-${i}`} {...card} />
          ))}
        </ParallaxLayer>

        {/* Alice sticky */}
        <ParallaxLayer
          sticky={{ start: 1.3, end: clampStickyEnd(10.5) }}
          style={{ textAlign: "center" }}
        >
          <animated.img src={alice} style={{ width: 1000 }} alt="Alice" />
        </ParallaxLayer>

        {/* Gaiola */}
        <ParallaxLayer offset={1.6} factor={clampFactor(2.9, 0.5)} speed={2}>
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

        {/* Relogio */}
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
        <ParallaxLayer sticky={{ start: 2.6, end: 2.6 }}>
          <animated.img
            src={estante}
            style={{
              width: 500,
              position: "absolute",
              left: -80,
              ...mirrorAnimation,
            }}
            alt="Relógio"
          />
        </ParallaxLayer>

        {/* Velas */}
        <ParallaxLayer sticky={{ start: 3.5, end: 3.5 }}>
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
        <ParallaxLayer sticky={{ start: 4, end: 4 }}>
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
        <ParallaxLayer sticky={{ start: 5, end: 5 }}>
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

        <ParallaxLayer sticky={{ start: 6.5, end: 6.6 }}>
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
        {texts.map((t, i) => (
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
