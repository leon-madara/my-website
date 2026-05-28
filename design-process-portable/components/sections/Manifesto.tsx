import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Mono, CornerTicks } from "../primitives";
import { PixelImage } from "../PixelImage";
import DesignProcessEpicRatio from "../../assets/svg/DesignProcessEpicRatio.svg";
import DesignProcessMobileDark from "../../assets/svg/DesignProcessMobileDark.svg";

const RIGHT = "calc(clamp(1.5rem, 5vw, 5rem) + 15vw)";
const PIXEL_SESSION_KEY = "dp_manifesto_pixel_v1";

export function Manifesto() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelAlreadyPlayed =
      typeof window !== "undefined" && sessionStorage.getItem(PIXEL_SESSION_KEY) === "1";
    const textDelay = reduce || pixelAlreadyPlayed ? 0 : 2.3;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".dp-mani-line", { yPercent: 0, opacity: 1 });
        gsap.set(".dp-mani-meta", { opacity: 1, y: 0 });
        return;
      }

      gsap.from(".dp-mani-line", {
        yPercent: 110,
        duration: 1.1,
        delay: textDelay,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from(".dp-mani-meta", {
        opacity: 0,
        y: 12,
        duration: 0.8,
        delay: textDelay + 0.6,
        stagger: 0.05,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative dp-grain min-h-[100svh] overflow-hidden flex flex-col"
      style={{ background: "var(--dp-paper-tint-green)" }}
    >
      {/* SVG Background - Desktop */}
      <PixelImage
        src={DesignProcessEpicRatio}
        className="hidden md:block absolute bottom-0 left-0 w-full"
        imgClassName="w-full h-auto"
        grid="8x8"
        grayscaleAnimation={false}
        sessionKey={PIXEL_SESSION_KEY}
      />
      {/* SVG Background - Mobile */}
      <PixelImage
        src={DesignProcessMobileDark}
        className="md:hidden absolute inset-0 w-full h-full"
        imgClassName="w-full h-full object-cover object-bottom"
        grid="6x4"
        grayscaleAnimation={false}
        sessionKey={PIXEL_SESSION_KEY}
      />
      <div className="dp-grid-bg absolute inset-0 opacity-60" aria-hidden />
      <CornerTicks />

      {/* v.04 · CODE BY LEON — top right */}
      <div className="absolute dp-mani-meta" style={{ top: "10vh", right: RIGHT }}>
        <Mono style={{ color: "#000000" }}>v.04 · CODE BY LEON</Mono>
      </div>

      {/* Title — right-aligned, right edge matches v.04 line */}
      <div className="absolute" style={{ top: "16vh", right: RIGHT }}>
        <h1
          className="dp-display"
          style={{
            fontSize: "clamp(1.5rem, 5.5vw, 5rem)",
            color: "var(--dp-ink)",
            textAlign: "right",
            fontFamily: '"Organical", "Fraunces", ui-serif, Georgia, serif',
            fontWeight: 400,
          }}
        >
          <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
            <span className="dp-mani-line block">
              my <span style={{ color: "#947643" }}>design</span>
            </span>
          </span>
        </h1>
        <Mono
          className="dp-mani-meta block"
          style={{
            color: "var(--dp-ink)",
            display: "block",
            marginTop: "1rem",
            opacity: 0.7,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          Adaptive. Emotional. Research-driven. Never rigid.
        </Mono>
      </div>

      {/* Bottom right label */}
      <div className="absolute dp-mani-meta" style={{ bottom: "2rem", right: RIGHT }}>
        <Mono style={{ color: "white" }}>Field notes / 01 — manifesto</Mono>
      </div>
    </section>
  );
}
