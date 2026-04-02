import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const componentPath = require.resolve("../../public/js/theme-toggle-landscape-component.js");

function createMatchMedia(reducedMotion = false) {
  return (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false
  });
}

function loadComponent() {
  delete require.cache[componentPath];
  return require(componentPath);
}

function createToggle() {
  loadComponent();
  return document.createElement("theme-toggle-landscape") as HTMLElement;
}

describe("React landscape theme-toggle web component", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    document.body.className = "";
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    window.matchMedia = originalMatchMedia;
    document.body.innerHTML = "";
  });

  it("hydrates the saved night theme on connect", () => {
    window.localStorage.setItem("theme", "night");
    const toggle = createToggle();

    document.body.appendChild(toggle);

    const button = toggle.shadowRoot?.querySelector("#themeToggle");

    expect(toggle.getAttribute("data-theme")).toBe("night");
    expect(document.body.classList.contains("dark-theme")).toBe(true);
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(button?.getAttribute("aria-label")).toBe("Activate light theme");
  });

  it("does not create hover preview state", () => {
    const toggle = createToggle();

    document.body.appendChild(toggle);

    const button = toggle.shadowRoot?.querySelector("#themeToggle");
    button?.dispatchEvent(new Event("pointerenter", { bubbles: true }));
    button?.dispatchEvent(new Event("pointerleave", { bubbles: true }));

    expect(toggle.hasAttribute("data-preview")).toBe(false);
    expect(toggle.hasAttribute("data-activation")).toBe(false);
    expect(toggle.getAttribute("data-theme")).toBe("day");
  });

  it("clicks directly into the night transition without preview or activation state", () => {
    const toggle = createToggle();
    const themeChanged = vi.fn();

    document.body.appendChild(toggle);
    toggle.addEventListener("theme-changed", themeChanged);

    const button = toggle.shadowRoot?.querySelector("#themeToggle") as HTMLButtonElement;
    button.click();

    expect(toggle.hasAttribute("data-preview")).toBe(false);
    expect(toggle.hasAttribute("data-activation")).toBe(false);
    expect(toggle.getAttribute("data-theme")).toBe("night");
    expect(toggle.getAttribute("data-transition")).toBe("to-night");
    expect(document.body.classList.contains("dark-theme")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("night");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Activate light theme");
    expect(themeChanged).toHaveBeenCalledTimes(1);
    expect(themeChanged.mock.calls[0][0].detail).toEqual({ theme: "night" });

    vi.advanceTimersByTime(860);
    expect(toggle.hasAttribute("data-transition")).toBe(false);
  });

  it("clicks directly back to day from the resting night state", () => {
    window.localStorage.setItem("theme", "night");
    const toggle = createToggle();

    document.body.appendChild(toggle);

    const button = toggle.shadowRoot?.querySelector("#themeToggle") as HTMLButtonElement;
    button.click();

    expect(toggle.hasAttribute("data-preview")).toBe(false);
    expect(toggle.hasAttribute("data-activation")).toBe(false);
    expect(toggle.getAttribute("data-theme")).toBe("day");
    expect(toggle.getAttribute("data-transition")).toBe("to-day");
    expect(document.body.classList.contains("dark-theme")).toBe(false);
    expect(window.localStorage.getItem("theme")).toBe("day");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Activate dark theme");
  });

  it("keeps reduced-motion timing shortened without activation state", () => {
    window.matchMedia = createMatchMedia(true);
    const toggle = createToggle();

    document.body.appendChild(toggle);

    const button = toggle.shadowRoot?.querySelector("#themeToggle") as HTMLButtonElement;
    button.click();

    expect(toggle.getAttribute("data-reduced-motion")).toBe("true");
    expect(toggle.hasAttribute("data-activation")).toBe(false);
    expect(toggle.getAttribute("data-transition")).toBe("to-night");

    vi.advanceTimersByTime(260);
    expect(toggle.hasAttribute("data-transition")).toBe(false);
  });
});
