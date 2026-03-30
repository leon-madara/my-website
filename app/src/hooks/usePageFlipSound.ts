import { useCallback, useRef } from "react";

/**
 * Lazily loads soundFlipping.mp3 and exposes a `play` callback.
 * The Audio object is created on first call so we never touch the
 * network until the user actually interacts with the portfolio.
 *
 * Autoplay-policy notes:
 *   - Modern browsers require a user gesture before audio can play.
 *     Because every call site is inside a click / keydown handler this
 *     is always satisfied.
 *   - We intentionally swallow any play() rejection (e.g. when the
 *     browser blocks audio) so the UI never breaks.
 */
export function usePageFlipSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/soundFlipping.mp3");
        audioRef.current.volume = 0.45;
      }

      // Rewind to start so rapid clicks always produce sound
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silently ignore autoplay policy rejections
      });
    } catch {
      // Silently ignore any other errors (e.g. jsdom in tests)
    }
  }, []);

  return play;
}
