import { RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

let portfolioPluginsRegistered = false;

function ensurePortfolioPlugins() {
  if (!portfolioPluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    portfolioPluginsRegistered = true;
  }
}

export function useEduManageAnimations(rootRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) {
      return;
    }

    ensurePortfolioPlugins();

    const ctx = gsap.context(() => {
      const hero = root.querySelector<HTMLElement>(".portfolio-longform-hero");
      const heroMeta = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
      const chapterCards = root.querySelectorAll<HTMLElement>("[data-portfolio-reveal]");

      if (hero && heroMeta.length > 0) {
        const introTimeline = gsap.timeline({
          defaults: { ease: "power3.out" }
        });

        introTimeline
          .fromTo(
            hero,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.7 }
          )
          .fromTo(
            heroMeta,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07 },
            "-=0.35"
          );
      }

      chapterCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            y: 28
          },
          {
            autoAlpha: 1,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              once: true
            },
            y: 0
          }
        );
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion, rootRef]);
}
