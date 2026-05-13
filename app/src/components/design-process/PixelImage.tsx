import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  alt?: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number;
  maxAnimationDelay?: number;
  colorRevealDelay?: number;
  className?: string;
  imgClassName?: string;
  /** When set, the animation only plays the first time per sessionStorage entry. */
  sessionKey?: string;
  onComplete?: () => void;
}

const MIN_GRID = 1;
const MAX_GRID = 16;

export function PixelImage({
  src,
  alt = "",
  grid = "8x8",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  className,
  imgClassName,
  sessionKey,
  onComplete,
}: PixelImageProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showColor, setShowColor] = useState(true);
  const [isSettled, setIsSettled] = useState(true);

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (g?: Grid) => {
      if (!g) return false;
      return (
        Number.isInteger(g.rows) &&
        Number.isInteger(g.cols) &&
        g.rows >= MIN_GRID &&
        g.cols >= MIN_GRID &&
        g.rows <= MAX_GRID &&
        g.cols <= MAX_GRID
      );
    };
    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid];
  }, [customGrid, grid]);

  useEffect(() => {
    const shouldAnimate =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (!sessionKey || sessionStorage.getItem(sessionKey) !== "1");

    if (!shouldAnimate) {
      setIsSettled(true);
      setIsAnimating(false);
      setShowColor(true);
      onComplete?.();
      return;
    }

    setIsAnimating(true);
    setIsSettled(false);
    setShowColor(!grayscaleAnimation);
    const colorTimeout = window.setTimeout(() => setShowColor(true), colorRevealDelay);
    const totalDuration = Math.max(
      maxAnimationDelay + pixelFadeInDuration,
      colorRevealDelay + pixelFadeInDuration,
    );
    const completeTimeout = window.setTimeout(() => {
      setIsSettled(true);
      setIsAnimating(false);
      if (sessionKey) {
        try {
          sessionStorage.setItem(sessionKey, "1");
        } catch {
          /* storage may be blocked */
        }
      }
      onComplete?.();
    }, totalDuration);
    return () => {
      window.clearTimeout(colorTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [
    colorRevealDelay,
    maxAnimationDelay,
    pixelFadeInDuration,
    sessionKey,
    onComplete,
    grayscaleAnimation,
  ]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`;
      const delay = isAnimating ? Math.random() * maxAnimationDelay : 0;
      return { clipPath, delay };
    });
  }, [rows, cols, maxAnimationDelay, isAnimating]);

  return (
    <div className={cn("relative", className)}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        style={{ visibility: isSettled ? "visible" : "hidden" }}
        draggable={false}
      />
      {isAnimating && !isSettled && pieces.map((piece, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            clipPath: piece.clipPath,
            opacity: 0,
            overflow: "hidden",
            background: "transparent",
            backfaceVisibility: "hidden",
            willChange: "opacity",
            animation: `dp-pixel-fade-in ${pixelFadeInDuration}ms ease-out ${piece.delay}ms forwards`,
          }}
        >
          <img
            src={src}
            alt=""
            aria-hidden
            className={cn(
              imgClassName,
              grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale"),
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
