import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

const frameCount = 187;
const currentFrame = (i) => `/video/frame_${String(i + 1).padStart(4, "0")}.jpg`;

export default function Hero() {
  const canvasRef = useRef(null);
  const videoFrames = useRef({ frame: 0 });
  const imagesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Lenis scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    rafRef.current = rafFn;

    // Ajusta canvas
    const setCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(pixelRatio, pixelRatio);
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Carregar imagens
    let imagesToLoad = frameCount;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = img.onerror = () => {
        imagesToLoad--;
        if (imagesToLoad === 0) {
          renderFrame();
          setupScrollTrigger();
        }
      };
      imagesRef.current.push(img);
    }

    const renderFrame = () => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      // Preenche o fundo para evitar flash branco
      context.fillStyle = "black"; // Pode trocar para qualquer cor
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      const img = imagesRef.current[videoFrames.current.frame];
      if (!img) return;

      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, drawX, drawY;
      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imageAspect;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imageAspect;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      }

      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    const setupScrollTrigger = () => {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "+=400%", // Dura 4 telas
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const targetFrame = Math.min(
            frameCount - 1,
            Math.round(self.progress * (frameCount - 1))
          );
          videoFrames.current.frame = targetFrame;
          renderFrame();
        },
      });
    };

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
    };
  }, []);

  return (
    <section
      className="hero"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      ></canvas>
    </section>
  );
}
