// ============================================================
// main.js — tab navigation (hash-based, works on GitHub Pages)
// ============================================================
(function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabSections = document.querySelectorAll(".tab-section");
  const validTabs = Array.from(tabSections).map((s) => s.id);

  function activateTab(tabId) {
    if (!validTabs.includes(tabId)) return;

    tabButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tab === tabId);
    });
    tabSections.forEach((section) => {
      section.classList.toggle("is-active", section.id === tabId);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      history.replaceState(null, "", "#" + tabId);
      activateTab(tabId);
      // bring main panel into view on mobile after switching tabs
      if (window.innerWidth <= 980) {
        document.querySelector(".panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const tabId = location.hash.replace("#", "");
    activateTab(tabId);
  });

  // open the tab from the URL hash on first load, if valid
  const initialTab = location.hash.replace("#", "");
  if (validTabs.includes(initialTab)) {
    activateTab(initialTab);
  }
})();

// ============================================================
// iframe block detection — show fallback if site refuses embed
// ============================================================
(function () {
  const iframe  = document.querySelector("#minesweeper iframe");
  const blocked = document.getElementById("minesweeperBlocked");
  if (!iframe || !blocked) return;

  // If the iframe fails to load or is blocked, show fallback overlay
  iframe.addEventListener("error", () => {
    blocked.style.display = "flex";
  });

  // Some sites load but show blank — check after a timeout
  // (can't read cross-origin content, but we can check natural height)
  iframe.addEventListener("load", () => {
    try {
      // will throw SecurityError if cross-origin & blocked
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML === "") {
        blocked.style.display = "flex";
      }
    } catch (e) {
      // cross-origin load is fine — site loaded, just can't inspect it
      // only show blocked if the iframe itself threw a load error
    }
  });
})();

// ============================================================
// visitor counter — cosmetic odometer, stored in localStorage
// (per-browser only; swap for a real counter service if you
// want a shared/global count across visitors)
// ============================================================
(function () {
  const el = document.getElementById("visitorCount");
  if (!el) return;

  const KEY = "pf_visitor_count";
  let count = parseInt(localStorage.getItem(KEY) || "0", 10);
  count += 1;
  localStorage.setItem(KEY, String(count));

  el.textContent = String(count).padStart(6, "0");
})();
