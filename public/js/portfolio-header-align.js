(() => {
  if (!document.body.classList.contains("portfolio-page")) return;

  const rootSelector = "#root";
  const containerSelector = "#root .container";

  function updateInsets() {
    const container = document.querySelector(containerSelector);
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    const styles = window.getComputedStyle(container);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
    const viewportWidth =
      document.documentElement?.clientWidth || window.innerWidth || 0;

    const leftInset = Math.max(0, Math.round(rect.left + paddingLeft));
    const rightInset = Math.max(
      0,
      Math.round(viewportWidth - rect.right + paddingRight),
    );

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
