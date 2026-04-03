import type { RefObject } from "react";
import { useEffect } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

const ORIGINAL_IMAGE = "/images/lion1.PNG";
const ANIMAL_IMAGES = [
  "/images/lion1.PNG",
  "/images/lion2.png",
  "/images/giraffe1.png",
  "/images/frog1.png"
];

const SECTION_SELECTORS = [
  ".parallax-hero",
  ".what-i-do-section",
  ".skills-section",
  ".experience-section",
  ".education-section",
  ".projects-section",
  ".certifications-section"
];

function normalizeImageName(src: string) {
  try {
    const url = new URL(src, window.location.href);
    return url.pathname.split("/").pop()?.toLowerCase() ?? "";
  } catch {
    return src.split("/").pop()?.toLowerCase() ?? "";
  }
}

export function useAboutHeroImageRandomizer(rootRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const heroImage = root.querySelector<HTMLImageElement>(".hero-image");
    if (!heroImage) {
      return;
    }

    // Reduced motion policy: stable lion, no swapping.
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      heroImage.src = ORIGINAL_IMAGE;
      heroImage.style.opacity = "1";
      return;
    }

    let disposed = false;
    let isChanging = false;
    let currentSectionIndex = -1;
    let lastChangedTime = 0;
    const minChangeInterval = 800;
    let fadeTimeout: number | null = null;
    let fadeInTimeout: number | null = null;

    // Preload for smoother transitions.
    ANIMAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * ANIMAL_IMAGES.length);
      return ANIMAL_IMAGES[randomIndex];
    };

    const changeImage = (newSrc: string) => {
      const now = Date.now();
      if (disposed || isChanging || now - lastChangedTime < minChangeInterval) {
        return;
      }

      isChanging = true;
      lastChangedTime = now;

      heroImage.style.opacity = "0";

      fadeTimeout = window.setTimeout(() => {
        if (disposed) {
          return;
        }

        heroImage.src = newSrc;

        fadeInTimeout = window.setTimeout(() => {
          if (disposed) {
            return;
          }

          heroImage.style.opacity = "1";
          isChanging = false;
        }, 100);
      }, 600);
    };

    const elements = SECTION_SELECTORS.map((selector) =>
      root.querySelector<HTMLElement>(selector)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const section = entry.target as HTMLElement;
          const sectionIndex = elements.findIndex((el) => el === section);

          if (sectionIndex === -1 || sectionIndex === currentSectionIndex) {
            return;
          }

          currentSectionIndex = sectionIndex;

          if (sectionIndex === 0) {
            if (normalizeImageName(heroImage.src) !== normalizeImageName(ORIGINAL_IMAGE)) {
              changeImage(ORIGINAL_IMAGE);
            }
            return;
          }

          const currentName = normalizeImageName(heroImage.src);
          let nextImage = getRandomImage();
          let attempts = 0;

          while (
            normalizeImageName(nextImage) === currentName &&
            attempts < 10
          ) {
            nextImage = getRandomImage();
            attempts += 1;
          }

          changeImage(nextImage);
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.3
      }
    );

    elements.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      disposed = true;
      observer.disconnect();

      if (fadeTimeout !== null) {
        window.clearTimeout(fadeTimeout);
      }

      if (fadeInTimeout !== null) {
        window.clearTimeout(fadeInTimeout);
      }

      heroImage.style.opacity = "1";
    };
  }, [prefersReducedMotion, rootRef]);
}
