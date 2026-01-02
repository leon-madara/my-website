/**
 * Liquid Navigation
 * Handles the sliding indicator effect with animated transitions between pages
 */

(function () {
  const nav = document.querySelector(".nav-pills");
  if (!nav) return;

  const indicator = nav.querySelector(".indicator");
  const links = nav.querySelectorAll("a");
  if (!indicator || links.length === 0) return;

  // Find active link based on current URL
  function getActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";

    for (const link of links) {
      const href = link.getAttribute("href") || "";
      const linkPage = href.split("/").pop();

      if (
        currentPage === linkPage ||
        (currentPage === "" && linkPage === "index.html")
      ) {
        return link;
      }
    }
    return links[0];
  }

  // Move indicator to target link
  function moveIndicator(target, animate = true) {
    if (!target) return;

    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const left = targetRect.left - navRect.left;
    const width = targetRect.width;

    if (!animate) {
      indicator.style.transition = "none";
      indicator.offsetHeight; // Force reflow
    } else {
      indicator.style.transition =
        "left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)";
    }

    indicator.style.left = left + "px";
    indicator.style.width = width + "px";

    if (!animate) {
      indicator.offsetHeight; // Force reflow
      indicator.style.transition = "";
    }
  }

  // Set active class
  function setActive(target) {
    links.forEach((link) => link.classList.remove("active"));
    if (target) {
      target.classList.add("active");
    }
  }

  // Initialize
  function init() {
    const activeLink = getActiveLink();
    setActive(activeLink);
    moveIndicator(activeLink, false);
  }

  // Handle click - animate first, then navigate
  function handleClick(e) {
    const clickedLink = e.currentTarget;
    const href = clickedLink.getAttribute("href");

    if (!href) {
      e.preventDefault();
      return;
    }

    // Get current page for comparison
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";
    const targetPage = href.split("/").pop();

    // If it's the current page, do nothing
    const isCurrentPage =
      currentPage === targetPage ||
      (currentPage === "" && targetPage === "index.html") ||
      (currentPage === "index.html" && targetPage === "index.html");

    if (isCurrentPage) {
      e.preventDefault();
      return;
    }

    // Prevent default navigation
    e.preventDefault();

    try {
      // Animate indicator to clicked link
      setActive(clickedLink);
      moveIndicator(clickedLink, true);

      // Navigate after animation completes
      setTimeout(function () {
        window.location.href = href;
      }, 350); // Match the CSS transition duration
    } catch (error) {
      console.error("Navigation animation failed:", error);
      // Fallback: navigation immediately
      window.location.href = href;
    }
  }

  // Random color hover effect
  const hoverColors = ['#000000', '#ce1126', '#0da95f'];

  function getRandomColor() {
    return hoverColors[Math.floor(Math.random() * hoverColors.length)];
  }

  links.forEach(function (link) {
    // Attach click handler
    link.addEventListener("click", handleClick);

    // Attach hover handlers for random color
    link.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.color = getRandomColor();
      }
    });

    link.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.color = "";
      }
    });
  });

  // Wait for fonts and layout before initial positioning
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      requestAnimationFrame(init);
    });
  } else {
    requestAnimationFrame(init);
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const activeLink = nav.querySelector("a.active");
      moveIndicator(activeLink, false);
    }, 100);
  });
})();
