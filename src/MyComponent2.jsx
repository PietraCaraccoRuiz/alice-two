import { useRef, useMemo, useEffect } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fundo1 from "./assets/fundo-light.svg";
import musgo from "./assets/musgo.svg";

export default function MyComponent2({ pages = 5, sectionId = "parallax-section-2" }) {
  const parallaxRef = useRef(null);

  // Desliga a rolagem interna
  useEffect(() => {
    const container = parallaxRef.current?.container?.current;
    if (container) container.style.overflow = "hidden";
  }, []);

  // Controla via ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: `#${sectionId}`,
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
  }, [pages, sectionId]);

  return (
    <div className="parallax-viewport-2">
      <Parallax ref={parallaxRef} pages={pages} horizontal={false} style={{ width: "100%", height: "100%" }}>
        {/* Musgo fixo entre 3 e 4 */}
        <ParallaxLayer
          sticky={{ start: 0.5, end: 0.5}}
          style={{
            pointerEvents: "none",
            zIndex: 2,
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
            }}
          />
        </ParallaxLayer>

        {/* Fundo */}
        <ParallaxLayer
          offset={0.8}
          speed={0.2}
          factor={10}
          style={{
            backgroundImage: `url(${fundo1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Parallax>
    </div>
  );
}
