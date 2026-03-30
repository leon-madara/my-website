import { RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

let pluginsRegistered = false;

function ensureGsapPlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }
}

export function useAboutAnimations(rootRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) {
      return;
    }

    ensureGsapPlugins();

    const shellTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".header-logo, .nav-pills, .theme-toggle-landscape, .theme-toggle-simple"
      )
    );

    shellTargets.forEach((target) => target.classList.add("about-shell-fade-target"));

    let scrollTimeout: number | undefined;
    let lastScrollY = window.scrollY;
    let shellHidden = false;

    const showShell = () => {
      if (!shellHidden) {
        return;
      }

      shellHidden = false;
      shellTargets.forEach((target) =>
        target.classList.remove("about-shell-fade-hidden")
      );
    };

    const hideShell = () => {
      if (shellHidden) {
        return;
      }

      shellHidden = true;
      shellTargets.forEach((target) => target.classList.add("about-shell-fade-hidden"));
    };

    const handleShellScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      if (Math.abs(delta) < 10) {
        return;
      }

      if (delta > 0) {
        hideShell();
        scrollTimeout = window.setTimeout(showShell, 1200);
      } else {
        showShell();
      }
    };

    window.addEventListener("scroll", handleShellScroll, { passive: true });

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 769px)",
          mobile: "(max-width: 768px)"
        },
        (context) => {
          const conditions = context.conditions as
            | { desktop?: boolean; mobile?: boolean }
            | undefined;

          const heroImage = root.querySelector<HTMLElement>(".hero-image-wrapper");
          const heroText = root.querySelector<HTMLElement>(".about-text-container");
          const heroUnderline = root.querySelector<HTMLElement>(".name-underline");
          const heroSection = root.querySelector<HTMLElement>(".parallax-hero");
          const sections = gsap.utils.toArray<HTMLElement>(
            root.querySelectorAll("[data-reveal-section]")
          );

          if (heroImage && heroText) {
            const introTimeline = gsap.timeline({
              defaults: { ease: "power3.out" }
            });

            introTimeline
              .fromTo(
                heroImage,
                conditions?.desktop
                  ? {
                      autoAlpha: 0
                    }
                  : {
                      autoAlpha: 0,
                      scale: 0.92,
                      xPercent: 0,
                      yPercent: 6
                    },
                conditions?.desktop
                  ? {
                      autoAlpha: 1,
                      duration: 1.15
                    }
                  : {
                      autoAlpha: 1,
                      scale: 1,
                      xPercent: 0,
                      yPercent: 0,
                      duration: 1.15
                    }
              )
              .fromTo(
                heroText,
                { autoAlpha: 0, y: 40, scale: 0.96 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
                "-=0.65"
              );

            if (heroUnderline) {
              introTimeline.fromTo(
                heroUnderline,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.75, ease: "power2.out" },
                "-=0.15"
              );
            }
          }

          if (heroSection && heroImage && heroText) {
            const heroTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: conditions?.mobile ? 0.55 : 0.9
              }
            }).to(
              heroText,
              {
                autoAlpha: 0,
                y: -80,
                scale: 0.92,
                ease: "none"
              },
              0
            );

            if (conditions?.mobile) {
              heroTimeline.to(
                heroImage,
                {
                  yPercent: -6,
                  scale: 0.92,
                  ease: "none"
                },
                0
              );
            }
          }

          sections.forEach((section) => {
            const titleChars = section.querySelectorAll<HTMLElement>(
              ".section-title .char-masked"
            );
            const revealItems = section.querySelectorAll<HTMLElement>(
              "[data-reveal-item]"
            );

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true
              }
            });

            if (titleChars.length > 0) {
              timeline.fromTo(
                titleChars,
                {
                  autoAlpha: 0,
                  yPercent: 110
                },
                {
                  autoAlpha: 1,
                  yPercent: 0,
                  duration: 0.72,
                  stagger: 0.018,
                  ease: "power2.out"
                }
              );
            }

            if (revealItems.length > 0) {
              timeline.fromTo(
                revealItems,
                {
                  autoAlpha: 0,
                  y: 28
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.65,
                  stagger: 0.08,
                  ease: "power2.out"
                },
                titleChars.length > 0 ? "-=0.35" : 0
              );
            }
          });
        }
      );

      return () => {
        mm.revert();
      };
    }, root);

    return () => {
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      window.removeEventListener("scroll", handleShellScroll);
      shellTargets.forEach((target) =>
        target.classList.remove("about-shell-fade-target", "about-shell-fade-hidden")
      );

      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion, rootRef]);
}
