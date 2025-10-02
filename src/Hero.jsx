import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 187;
const getFrameSrc = (i) => `/video/frame_${String(i + 1).padStart(4, "0")}.jpg`;
const SCREENS = 4;

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const stateRef = useRef({ frame: 0, loaded: 0 });

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = imagesRef.current[stateRef.current.frame];
    if (!canvas || !ctx || !img) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);

    const imageAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cw / ch;

    let dw, dh, dx, dy;
    if (imageAspect > canvasAspect) {
      dh = ch;
      dw = dh * imageAspect;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = dw / imageAspect;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    canvas.width = Math.max(1, Math.floor(cw * dpr));
    canvas.height = Math.max(1, Math.floor(ch * dpr));

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    draw();
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctxGSAP = gsap.context(() => {
      // Canvas
      const canvas = canvasRef.current;
      const ctx2d = canvas.getContext("2d");
      ctxRef.current = ctx2d;

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Preload
      imagesRef.current = Array.from({ length: FRAME_COUNT }).map((_, i) => {
        const im = new Image();
        im.src = getFrameSrc(i);
        im.onload = () => {
          stateRef.current.loaded += 1;
          if (i === 0) draw();
        };
        im.onerror = () => (stateRef.current.loaded += 1);
        return im;
      });

      // ScrollTrigger usando o scroll global (Lenis + body)
      const st = ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: () => `+=${SCREENS * window.innerHeight}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const frame = Math.min(
            FRAME_COUNT - 1,
            Math.round(self.progress * (FRAME_COUNT - 1))
          );
          if (frame !== stateRef.current.frame) {
            stateRef.current.frame = frame;
            draw();
          }
        },
      });

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        st.kill();
      };
    }, heroRef);

    return () => ctxGSAP.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
        }}
        role="img"
        aria-label="Animação de frames no scroll"
      />
    </section>
  );
}
