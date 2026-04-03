import { RefObject, useEffect } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

function clearRevealState(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>("[data-reveal-state]")
    .forEach((element) => {
      delete element.dataset.revealState;
      element.style.removeProperty("--about-reveal-delay");
    });
}

export function useAboutSectionReveal(rootRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    clearRevealState(root);

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      return () => {
        clearRevealState(root);
      };
    }

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal-section]")
    );

    sections.forEach((section) => {
      section
        .querySelectorAll<HTMLElement>(".section-title .char-masked")
        .forEach((char, index) => {
          char.dataset.revealState = "pending";
          char.style.setProperty(
            "--about-reveal-delay",
            `${Math.min(index * 22, 240)}ms`
          );
        });

      section
        .querySelectorAll<HTMLElement>("[data-reveal-item]")
        .forEach((item, index) => {
          item.dataset.revealState = "pending";
          item.style.setProperty(
            "--about-reveal-delay",
            `${Math.min(index * 90, 360)}ms`
          );
        });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const section = entry.target as HTMLElement;

          section
            .querySelectorAll<HTMLElement>(".section-title .char-masked")
            .forEach((char) => {
              char.dataset.revealState = "visible";
            });

          section
            .querySelectorAll<HTMLElement>("[data-reveal-item]")
            .forEach((item) => {
              item.dataset.revealState = "visible";
            });

          observer.unobserve(section);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      clearRevealState(root);
    };
  }, [prefersReducedMotion, rootRef]);
}
