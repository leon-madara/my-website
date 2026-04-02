import { RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useReducedMotion } from "../../hooks/useReducedMotion";

let pluginsRegistered = false;

function ensureGsapPlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
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

    // ── Shell scroll-fade (header/nav hide on scroll down) ──────────────────
    const shellTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".header-logo, .nav-pills, .theme-toggle-landscape, .theme-toggle-simple"
      )
    );

    shellTargets.forEach((t) => t.classList.add("about-shell-fade-target"));

    let scrollTimeout: number | undefined;
    let lastScrollY = window.scrollY;
    let shellHidden = false;

    const showShell = () => {
      if (!shellHidden) return;
      shellHidden = false;
      shellTargets.forEach((t) => t.classList.remove("about-shell-fade-hidden"));
    };

    const hideShell = () => {
      if (shellHidden) return;
      shellHidden = true;
      shellTargets.forEach((t) => t.classList.add("about-shell-fade-hidden"));
    };

    const handleShellScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      if (Math.abs(delta) < 10) return;
      if (delta > 0) {
        hideShell();
        scrollTimeout = window.setTimeout(showShell, 1200);
      } else {
        showShell();
      }
    };

    window.addEventListener("scroll", handleShellScroll, { passive: true });

    // ── GSAP context ─────────────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 769px)", mobile: "(max-width: 768px)" },
        (context) => {
          const cond = context.conditions as
            | { desktop?: boolean; mobile?: boolean }
            | undefined;

          const heroImage = root.querySelector<HTMLElement>(".hero-image-wrapper");
          const heroText  = root.querySelector<HTMLElement>(".about-text-container");
          const aboutTextEl = root.querySelector<HTMLElement>(".about-text");
          const nameTextEl  = root.querySelector<HTMLElement>(".name-text");
          const underline   = root.querySelector<HTMLElement>(".name-underline");
          const heroSection = root.querySelector<HTMLElement>(".parallax-hero");
          const sections    = gsap.utils.toArray<HTMLElement>(
            root.querySelectorAll("[data-reveal-section]")
          );

          // ── Hero entrance ─────────────────────────────────────────────────
          if (heroImage && heroText) {
            const intro = gsap.timeline({ defaults: { ease: "power2.inOut" } });

            if (cond?.desktop) {
              // Desktop: lion starts centered + full size, slides left + scales down
              gsap.set(heroImage, {
                xPercent: -50,
                yPercent: -50,
                left: "50%",
                top: "50%",
                scale: 1,
                autoAlpha: 1,
              });

              intro.to(heroImage, {
                left: "10%",
                scale: 0.5,
                duration: 2.5,
                ease: "power2.inOut",
              });
            } else {
              // Mobile: simple fade + subtle rise
              gsap.set(heroImage, { autoAlpha: 0, scale: 0.92, yPercent: 6 });
              intro.to(heroImage, {
                autoAlpha: 1,
                scale: 1,
                yPercent: 0,
                duration: 1.15,
              });
            }

            // Hero text fades in after lion settles
            gsap.set(heroText, { autoAlpha: 0, scale: 0.9 });
            intro.to(
              heroText,
              { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
              cond?.desktop ? "-=0.3" : "-=0.65"
            );

            // ScrambleText on "About" and "Leon Madara"
            // ScrambleText only touches text nodes so the name-underline
            // child span (which has no text) is left untouched.
            if (aboutTextEl && nameTextEl) {
              const aboutOriginal = aboutTextEl.textContent?.trim() ?? "About";
              const nameOriginal  = nameTextEl.textContent?.trim() ?? "Leon Madara";

              intro
                .from(aboutTextEl, {
                  duration: 1,
                  scrambleText: {
                    text: aboutOriginal,
                    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    revealDelay: 0.2,
                    speed: 0.4,
                  },
                }, ">-0.1")
                .from(nameTextEl, {
                  duration: 1.5,
                  scrambleText: {
                    text: nameOriginal,
                    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    revealDelay: 0.3,
                    speed: 0.3,
                  },
                }, ">-0.4");
            }

            // Red underline sweeps in
            if (underline) {
              intro.fromTo(
                underline,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.75, ease: "power2.out" },
                ">-0.2"
              );
            }
          }

          // ── Hero scroll: text disintegrates, lion stays ───────────────────
          if (heroSection && heroText) {
            const heroScroll = gsap.timeline({
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: cond?.mobile ? 0.55 : 0.9,
              },
            });

            heroScroll.to(heroText, {
              autoAlpha: 0,
              y: -80,
              scale: 0.92,
              ease: "none",
            }, 0);

            // On mobile the image scrolls with the page slightly
            if (cond?.mobile && heroImage) {
              heroScroll.to(heroImage, { yPercent: -6, scale: 0.92, ease: "none" }, 0);
            }
          }

          // ── Section scroll reveals ────────────────────────────────────────
          sections.forEach((section) => {
            const titleChars = section.querySelectorAll<HTMLElement>(
              ".section-title .char-masked"
            );
            const revealItems = section.querySelectorAll<HTMLElement>("[data-reveal-item]");

            const tl = gsap.timeline({
              scrollTrigger: { trigger: section, start: "top 78%", once: true },
            });

            if (titleChars.length > 0) {
              tl.fromTo(
                titleChars,
                { autoAlpha: 0, yPercent: 110 },
                { autoAlpha: 1, yPercent: 0, duration: 0.72, stagger: 0.018, ease: "power2.out" }
              );
            }

            if (revealItems.length > 0) {
              tl.fromTo(
                revealItems,
                { autoAlpha: 0, y: 28 },
                { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power2.out" },
                titleChars.length > 0 ? "-=0.35" : 0
              );
            }
          });

          return () => { mm.revert(); };
        }
      );
    }, root);

    return () => {
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleShellScroll);
      shellTargets.forEach((t) =>
        t.classList.remove("about-shell-fade-target", "about-shell-fade-hidden")
      );
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion, rootRef]);
}
