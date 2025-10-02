// AnimatedText.jsx
import { animated, useSpring } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { ParallaxLayer } from "@react-spring/parallax";

export default function AnimatedText({ content, position, offset, direction }) {
    const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.3 });

    const spring = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView
            ? "translateX(0px)"
            : direction === "left"
                ? "translateX(-100px)"
                : "translateX(100px)",
        config: { tension: 1000, friction: 200 },
    });

    return (
        <ParallaxLayer offset={offset} speed={2}>
            <animated.h2 ref={ref} style={{ ...spring, position: "absolute", ...position, fontSize: 25 }}>
                {content}
            </animated.h2>
        </ParallaxLayer>
    );
}
