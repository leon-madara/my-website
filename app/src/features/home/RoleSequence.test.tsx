import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RoleSequence } from "./RoleSequence";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false
    }))
  });
}

function createRafController() {
  let now = 0;
  let handle = 0;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.useFakeTimers();
  vi.setSystemTime(new Date(now));

  const requestSpy = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((callback: FrameRequestCallback) => {
      handle += 1;
      callbacks.set(handle, callback);
      return handle;
    });

  const cancelSpy = vi
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation((id: number) => {
      callbacks.delete(id);
    });

  return {
    step(ms: number) {
      const frameDuration = 16;
      const end = now + ms;

      while (now < end) {
        now = Math.min(end, now + frameDuration);
        vi.setSystemTime(new Date(now));

        const scheduled = Array.from(callbacks.entries());
        callbacks.clear();

        scheduled.forEach(([, callback]) => {
          callback(now);
        });
      }
    },
    pending() {
      return callbacks.size;
    },
    restore() {
      callbacks.clear();
      requestSpy.mockRestore();
      cancelSpy.mockRestore();
      vi.useRealTimers();
    }
  };
}

describe("RoleSequence", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    mockMatchMedia(false);
  });

  it("renders the first role as the accessible heading on load", () => {
    mockMatchMedia(false);
    const raf = createRafController();

    const { container } = render(<RoleSequence />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /full stack ai developer/i
      })
    ).toBeInTheDocument();
    expect(container.querySelector("#role-sequence-threshold")).not.toBeNull();

    raf.restore();
  });

  it("advances to the next role after one full morph cycle plus cooldown", () => {
    mockMatchMedia(false);
    const raf = createRafController();

    render(<RoleSequence />);

    act(() => {
      raf.step(4500);
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /ai integration engineer/i
      })
    ).toBeInTheDocument();

    raf.restore();
  });

  it("crossfades into the next role with the next role color before the accessible label changes", () => {
    mockMatchMedia(false);
    const raf = createRafController();

    const { container } = render(<RoleSequence />);

    act(() => {
      raf.step(3300);
    });

    const text1 = container.querySelector(
      ".role-sequence__text--current"
    ) as HTMLSpanElement | null;
    const text2 = container.querySelector(
      ".role-sequence__text--next"
    ) as HTMLSpanElement | null;

    expect(text1).not.toBeNull();
    expect(text2).not.toBeNull();
    expect(text1?.textContent).toBe("Full Stack AI Developer & Designer");
    expect(text2?.textContent).toBe("AI Integration Engineer");

    expect(Number.parseFloat(text1?.style.opacity ?? "0")).toBeGreaterThan(0);
    expect(Number.parseFloat(text1?.style.opacity ?? "1")).toBeLessThan(1);
    expect(Number.parseFloat(text2?.style.opacity ?? "0")).toBeGreaterThan(0);
    expect(Number.parseFloat(text2?.style.opacity ?? "1")).toBeLessThan(1);
    expect(text1?.style.filter).toContain("blur(");
    expect(text2?.style.filter).toContain("blur(");
    expect(text1?.style.getPropertyValue("--role-layer-color")).toBe("#ce1126");
    expect(text2?.style.getPropertyValue("--role-layer-color")).toBe("#006b3f");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /full stack ai developer/i
      })
    ).toBeInTheDocument();

    raf.restore();
  });

  it("loops from the final role back to the first role with the same crossfade path", () => {
    mockMatchMedia(false);
    const raf = createRafController();

    const { container } = render(<RoleSequence />);

    act(() => {
      raf.step(17950);
    });

    const text1 = container.querySelector(
      ".role-sequence__text--current"
    ) as HTMLSpanElement | null;
    const text2 = container.querySelector(
      ".role-sequence__text--next"
    ) as HTMLSpanElement | null;

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /full stack ai developer/i
      })
    ).toBeInTheDocument();
    expect(text1?.textContent).toBe("Full Stack AI Developer & Designer");
    expect(text2?.textContent).toBe("AI Integration Engineer");
    expect(text1?.style.getPropertyValue("--role-layer-color")).toBe("#ce1126");

    raf.restore();
  });

  it("stays static when reduced motion is preferred", () => {
    mockMatchMedia(true);
    const raf = createRafController();

    render(<RoleSequence />);

    act(() => {
      raf.step(3000);
    });

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /full stack ai developer/i
    });

    expect(heading).toHaveClass("role-sequence--reduced-motion");
    expect(heading).not.toHaveAttribute("aria-label", "AI Integration Engineer");

    raf.restore();
  });

  it("cancels queued animation frames on unmount", () => {
    mockMatchMedia(false);
    const raf = createRafController();

    const { unmount } = render(<RoleSequence />);

    expect(raf.pending()).toBeGreaterThan(0);

    unmount();

    expect(raf.pending()).toBe(0);

    raf.restore();
  });
});
