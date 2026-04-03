import type { RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export function useAboutHeroMotion(rootRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const heroImageWrapper =
      root.querySelector<HTMLElement>(".hero-image-wrapper");
    const heroText =
      root.querySelector<HTMLElement>(".about-text-container");
    const aboutWord = root.querySelector<HTMLElement>(".about-text");
    const underline = root.querySelector<HTMLElement>(".name-underline");

    if (!heroImageWrapper || !heroText) {
      return;
    }

    // Keep mobile stacked hero stable (no slide/scale).
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      gsap.set(heroText, { clearProps: "opacity,transform,filter" });
      gsap.set(underline, { scaleX: 1 });
      return () => {
        gsap.set(heroText, { clearProps: "opacity,transform,filter" });
        gsap.set(underline, { clearProps: "transform" });
      };
    }

    // Always start from a clean base (important for route re-entry / StrictMode).
    heroImageWrapper.style.removeProperty("left");
    heroImageWrapper.style.removeProperty("top");
    heroImageWrapper.style.removeProperty("transform");

    if (prefersReducedMotion) {
      gsap.set(heroImageWrapper, { x: "-40vw", scale: 0.5 });
      gsap.set(heroText, { autoAlpha: 1, scale: 1, y: 0, filter: "none" });
      gsap.set(underline, { scaleX: 1 });
      if (aboutWord) {
        aboutWord.textContent = aboutWord.textContent ?? "About";
      }
      return () => {
        gsap.set(heroImageWrapper, { clearProps: "x,scale" });
        gsap.set(heroText, { clearProps: "opacity,transform,filter" });
        gsap.set(underline, { clearProps: "transform" });
      };
    }

    const originalAboutWord = aboutWord?.textContent ?? "About";

    // Initial state: lion visible and centered; text hidden.
    gsap.set(heroImageWrapper, { x: 0, scale: 1 });
    gsap.set(heroText, { autoAlpha: 0, scale: 0.9 });
    gsap.set(underline, { scaleX: 0 });
    if (aboutWord) {
      aboutWord.textContent = "";
    }

    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    timeline.to(heroImageWrapper, {
      x: "-40vw",
      scale: 0.5,
      duration: 2.5,
      onComplete: () => {
        // Vanilla lock step: bake the final screen position into left/top so the
        // fixed element stays stable during subsequent scroll interactions.
        const rect = heroImageWrapper.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        heroImageWrapper.style.left = `${elementCenterX}px`;
        heroImageWrapper.style.top = `${elementCenterY}px`;
        heroImageWrapper.style.transform = "translate(-50%, -50%) scale(0.5)";
      }
    });

    timeline.to(
      heroText,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out"
      },
      ">-0.2"
    );

    if (aboutWord) {
      timeline.to(
        aboutWord,
        {
          scrambleText: {
            text: originalAboutWord,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            speed: 0.6
          },
          duration: 0.85,
          ease: "none"
        },
        "<0.05"
      );
    }

    timeline.to(
      underline,
      {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out"
      },
      ">-0.1"
    );

    return () => {
      timeline.kill();
      heroImageWrapper.style.removeProperty("left");
      heroImageWrapper.style.removeProperty("top");
      heroImageWrapper.style.removeProperty("transform");
      gsap.set(heroImageWrapper, { clearProps: "x,scale" });
      gsap.set(heroText, { clearProps: "opacity,transform,filter" });
      gsap.set(underline, { clearProps: "transform" });
      if (aboutWord) {
        aboutWord.textContent = originalAboutWord;
      }
    };
  }, { scope: rootRef, dependencies: [prefersReducedMotion] });
}
