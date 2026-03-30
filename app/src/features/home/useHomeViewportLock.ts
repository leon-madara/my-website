import { useEffect } from "react";

export function useHomeViewportLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      html.style.setProperty("--vh", `${vh}px`);
      html.style.setProperty("--app-vh", `${vh}px`);
      html.classList.add("no-scroll", "has-overflow");
      body.classList.add("has-overflow");
    };

    const handleOrientationChange = () => {
      window.setTimeout(setViewportHeight, 100);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", handleOrientationChange);
      html.classList.remove("no-scroll", "has-overflow");
      body.classList.remove("has-overflow");
      html.style.removeProperty("--vh");
      html.style.removeProperty("--app-vh");
      html.style.overflowY = "auto";
      html.style.overflowX = "hidden";
    };
  }, []);
}
