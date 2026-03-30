(() => {
  if (!document.body.classList.contains("portfolio-page")) return;

  const rootSelector = "#root";
  const containerSelector = "#root .container";
  const floatingToggleSelector =
    'button.theme-toggle-wrapper[aria-label*="mode"]';

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

  function keepThemeToggleInRoot() {
    const root = document.querySelector(rootSelector);
    if (!root) return false;

    const toggleInRoot = root.querySelector(floatingToggleSelector);
    const toggleInBody = Array.from(
      document.body.querySelectorAll(`:scope > ${floatingToggleSelector}`),
    ).find((toggle) => toggle !== toggleInRoot);

    if (toggleInRoot) {
      if (toggleInBody) toggleInBody.remove();
      return true;
    }

    if (toggleInBody) {
      root.appendChild(toggleInBody);
      return true;
    }

    return false;
  }

  let syncQueued = false;
  function syncPortfolioHeader() {
    syncQueued = false;
    updateInsets();
    keepThemeToggleInRoot();
  }

  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(syncPortfolioHeader);
  }

  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(scheduleSync, 50);
  }

  const root = document.querySelector(rootSelector);
  const observer = new MutationObserver(scheduleSync);

  if (root) observer.observe(root, { childList: true, subtree: true });

  syncPortfolioHeader();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", scheduleSync, { once: true });
})();
