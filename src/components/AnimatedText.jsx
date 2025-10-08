// AnimatedText.jsx
import { animated, useSpring, easings } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { ParallaxLayer } from "@react-spring/parallax";

export default function AnimatedText({
  content,
  position = {},
  offset = 0,
  direction = "left",
  // controles de suavidade (opcionais)
  duration = 1400,      // tempo da animação (ms)
  distance = 80,        // quanto o texto entra deslocado (px)
  parallaxSpeed = 0.3,  // velocidade do ParallaxLayer
}) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  const fromX = direction === "left" ? -distance : distance;

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    // translate3d para fluidez usando GPU
    transform: inView
      ? "translate3d(0, 0, 0)"
      : `translate3d(${fromX}px, 0, 0)`,
    // leve blur que some junto do fade
    filter: inView ? "blur(0px)" : "blur(2px)",
    config: { duration, easing: easings.easeInOutCubic },
  });

  return (
    <ParallaxLayer offset={offset} speed={parallaxSpeed}>
      <animated.h2
        ref={ref}
        style={{
          ...spring,
          position: "absolute",
          ...position,
          fontSize: 28,
          lineHeight: 1.2,
          letterSpacing: 0.2,
          willChange: "transform, opacity, filter",
        }}
      >
        {content}
      </animated.h2>
    </ParallaxLayer>
  );
}
