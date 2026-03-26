(() => {
  if (!document.body.classList.contains("portfolio-page")) return;

  const rootSelector = "#root";
  const containerSelector = "#root .container";

  function updateInsets() {
    const container = document.querySelector(containerSelector);
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    const viewportWidth =
      document.documentElement?.clientWidth || window.innerWidth || 0;

    const leftInset = Math.max(0, Math.round(rect.left));
    const rightInset = Math.max(0, Math.round(viewportWidth - rect.right));

    document.body.style.setProperty(
      "--portfolio-container-inset-left",
      `${leftInset}px`,
    );
    document.body.style.setProperty(
      "--portfolio-container-inset-right",
      `${rightInset}px`,
    );

    return true;
  }

  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => updateInsets(), 50);
  }

  const root = document.querySelector(rootSelector);
  const observer = new MutationObserver(() => {
    if (updateInsets()) observer.disconnect();
  });

  if (root) observer.observe(root, { childList: true, subtree: true });

  updateInsets();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", () => updateInsets(), { once: true });
})();

