import { useRef } from "react";
import { useSpring, animated, easings } from "@react-spring/web";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

import ceu from "./assets/ceu.png";
import toca from "./assets/toca.png";
import fundo2 from "./assets/fundo2.gif";
import flor from "./assets/flor.png";
import arvore from "./assets/arvore.png";
import escada from "./assets/escada.svg";
import coelho from "./assets/coelho.svg";

import alice from "./assets/alice3.gif";
import gaiola from "./assets/gaiola.svg";
import espelho from "./assets/espelho.png";
import quadro1 from "./assets/quadro1.svg";
import velas from "./assets/velas.svg";
import relogio from "./assets/relogio.svg";
import cadeira from "./assets/cadeira.svg";

import carta from "./assets/carta.svg";

function MyComponent() {
  const ref = useRef();

  // Céu pulsando
  const ceuAnimation = useSpring({
    from: { transform: "scale(1)", filter: "brightness(0.9)" },
    to: { transform: "scale(1.2)", filter: "brightness(1.2)" },
    loop: { reverse: true },
    config: { duration: 5000, easing: easings.easeInOutSine },
  });

  // Coelho animado
  const coelhoAnimation = useSpring({
    from: { transform: "translateX(-170%) translateY(0%)" },
    to: { transform: "translateX(400%) translateY(100%)" },
    loop: true,
    config: { duration: 2000, easing: easings.easeInOutSine },
  });

  // Espelho flutuando
  const mirrorAnimation = useSpring({
    from: { y: -20 },
    to: { y: 20 },
    loop: { reverse: true },
    config: { duration: 2000, easing: easings.easeInOutSine },
  });

  // Cadeira flutuando
  const chairAnimation = useSpring({
    from: { x: -20, y: 20, rotate: -5 },
    to: { x: 20, y: -20, rotate: 5 },
    loop: { reverse: true },
    config: { duration: 1000, easing: easings.easeInOutSine },
  });

  // Estrelas piscando
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
            ? `0 0 ${size} ${parseInt(size) / 2}px ${color}`
            : `0 0 ${parseInt(size) / 2}px ${color}`,
        }}
      />
    );
  };

  const generateStars = (amount, strong = false) =>
    Array.from({ length: amount }).map(() => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: `${Math.random() * (strong ? 6 : 4) + 2}px`,
      delay: Math.random() * 2000,
      duration: Math.random() * 800 + 200,
      color: ["white", "#aee", "#ccf", "#eef", "#ffd"][Math.floor(Math.random() * 5)],
      strong,
    }));

  const starsLayer1 = generateStars(60, true);
  const starsLayer2 = generateStars(80, false);
  const starsLayer3 = generateStars(100, false);

  // Gera cartas com drift e rotação aleatória
  const generateCards = (amount) =>
    Array.from({ length: amount }).map(() => ({
      x: Math.random() * 90,
      y: -50 - Math.random() * 100,
      size: 40 + Math.random() * 30,
      speed: 4000 + Math.random() * 4000,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 50,
    }));

  const fallingCards = generateCards(5);

  // Componente Carta
  const FallingCard = ({ x, y, size, speed, rotate, drift }) => {
    const styles = useSpring({
      from: { transform: `translate(${x}vw, ${y}px) rotate(${rotate}deg)` },
      to: async (next) => {
        while (true) {
          await next({
            transform: `translate(${x + drift}vw, ${window.innerHeight + 50}px) rotate(${rotate + 360}deg)`,
          });
          // Reset posição inicial
          x = Math.random() * 90;
          y = -50 - Math.random() * 100;
          rotate = Math.random() * 360;
          drift = (Math.random() - 0.5) * 50;
          await next({
            transform: `translate(${x}vw, ${y}px) rotate(${rotate}deg)`,
          });
        }
      },
      config: { duration: speed, easing: easings.linear },
    });

    return <animated.img src={carta} style={{ ...styles, width: size, position: "absolute", zIndex: 5 }} />;
  };

  return (
    <div className="container">
      <Parallax pages={8} ref={ref}>
        {/* Céu */}
        <ParallaxLayer offset={0} speed={1.8} factor={1}>
          <animated.div
            style={{
              ...ceuAnimation,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${ceu})`,
              backgroundSize: "cover",
            }}
          />
        </ParallaxLayer>

        {/* Flores */}
        <ParallaxLayer offset={0.3} speed={1.5} factor={0.7} style={{
          backgroundImage: `url(${flor})`,
          backgroundSize: "cover",
          zIndex: 2,
        }} />

        {/* Escada */}
        <ParallaxLayer offset={0.2} speed={1.7} factor={0.8} style={{
          backgroundImage: `url(${escada})`,
          backgroundSize: "cover",
          zIndex: 0,
          width: "80%",
        }} />

        {/* Árvore */}
        <ParallaxLayer offset={0} speed={1.8} factor={1}>
          <div style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            backgroundImage: `url(${arvore})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: "110vh",
            height: "100vh",
            zIndex: 2,
          }} />
        </ParallaxLayer>

        {/* Coelho */}
        <ParallaxLayer sticky={{ start: 0.1, end: 0.1 }} style={{ textAlign: "center" }}>
          <animated.img src={coelho} style={{ ...coelhoAnimation, width: "130px" }} />
        </ParallaxLayer>

        {/* Fundo da Toca */}
        <ParallaxLayer offset={2.2} speed={3} factor={10.5} style={{ backgroundImage: `url(${toca})`, backgroundSize: "cover" }} />

        {/* Estrelas */}
        <ParallaxLayer offset={1.8} factor={3} speed={0.4}>
          {starsLayer1.map((s, i) => <Sparkle key={`s1-${i}`} {...s} />)}
        </ParallaxLayer>
        <ParallaxLayer offset={2.5} factor={3} speed={0.4}>
          {starsLayer2.map((s, i) => <Sparkle key={`s2-${i}`} {...s} />)}
        </ParallaxLayer>
        <ParallaxLayer offset={3} factor={8} speed={0.6}>
          {starsLayer3.map((s, i) => <Sparkle key={`s3-${i}`} {...s} />)}
        </ParallaxLayer>

        {/* Cartas caindo */}
        <ParallaxLayer offset={3.4} factor={10} speed={0.8}>
          {fallingCards.map((card, i) => <FallingCard key={`card-${i}`} {...card} />)}
        </ParallaxLayer>

        {/* Alice */}
        <ParallaxLayer sticky={{ start: 1.3, end: 10.5 }} style={{ textAlign: "center" }}>
          <animated.img src={alice} style={{ width: "1000px" }} />
        </ParallaxLayer>

        {/* Gaiola */}
        <ParallaxLayer offset={2.9} factor={0.5} speed={2}>
          <animated.img src={gaiola} style={{ width: "200px", position: "absolute", left: "0px", ...mirrorAnimation }} />
        </ParallaxLayer>

        {/* Relógio */}
        <ParallaxLayer sticky={{ start: 2.8, end: 2.9 }}>
          <animated.img src={relogio} style={{ width: "300px", position: "absolute", right: "-80px", ...mirrorAnimation }} />
        </ParallaxLayer>

        {/* Espelho */}
        <ParallaxLayer sticky={{ start: 3.5, end: 3.5 }}>
          <animated.img src={espelho} style={{ width: "600px", position: "absolute", left: "-140px", ...mirrorAnimation }} />
        </ParallaxLayer>

        {/* Velas */}
        <ParallaxLayer sticky={{ start: 4.5, end: 4.6 }}>
          <animated.img src={velas} style={{ width: "200px", position: "absolute", left: "-20px", ...mirrorAnimation }} />
        </ParallaxLayer>

        {/* Cadeira */}
        <ParallaxLayer sticky={{ start: 5.2, end: 5.3 }}>
          <animated.img src={cadeira} style={{ width: "400px", position: "absolute", right: "0px", ...chairAnimation }} />
        </ParallaxLayer>

        {/* Quadro1 */}
        <ParallaxLayer sticky={{ start: 6.5, end: 6.6 }}>
          <animated.img src={quadro1} style={{ width: "200px", position: "absolute", left: "0px", ...mirrorAnimation }} />
        </ParallaxLayer>

        {/* Textos */}
        <ParallaxLayer offset={0.9} speed={0.6}><h2>Welcome to my Alice World</h2></ParallaxLayer>
        <ParallaxLayer offset={3} speed={2}><h2>Hi Mom!</h2></ParallaxLayer>

        {/* Fundo da Toca */}
        <ParallaxLayer offset={8} speed={3} factor={2} style={{ backgroundImage: `url(${fundo2})`, backgroundSize: "cover" }} />

      </Parallax>
    </div>
  );
}

export default MyComponent;
