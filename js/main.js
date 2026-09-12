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

  iframe.addEventListener("error", () => {
    blocked.style.display = "flex";
  });

  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML === "") {
        blocked.style.display = "flex";
      }
    } catch (e) {
      // cross-origin load is fine
    }
  });
})();

// iframe block detection — windows 7
(function () {
  const iframe  = document.querySelector("#windows7 iframe");
  const blocked = document.getElementById("windows7Blocked");
  if (!iframe || !blocked) return;

  iframe.addEventListener("error", () => {
    blocked.style.display = "flex";
  });

  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML === "") {
        blocked.style.display = "flex";
      }
    } catch (e) {
      // cross-origin — fine, site loaded
    }
  });
})();

// iframe block detection — pointerpointer
(function () {
  const iframe  = document.querySelector("#pointerpointer iframe");
  const blocked = document.getElementById("pointerpointerBlocked");
  if (!iframe || !blocked) return;

  iframe.addEventListener("error", () => {
    blocked.style.display = "flex";
  });

  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML === "") {
        blocked.style.display = "flex";
      }
    } catch (e) {
      // cross-origin — fine, site loaded
    }
  });
})();

// ============================================================
// mobile navbar — toggle dropdown + sync active state
// ============================================================
(function () {
  const toggle   = document.getElementById("mobileNavToggle");
  const dropdown = document.getElementById("mobileNavDropdown");
  const mobileBtns = document.querySelectorAll(".mobile-tab-btn");
  if (!toggle || !dropdown) return;

  function openMenu() {
    dropdown.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    dropdown.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    dropdown.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", () => {
    dropdown.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  // close on outside tap
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".mobile-nav")) closeMenu();
  });

  // close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // sync active state and close on tab select
  mobileBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // also fire the main tab system
      const tabId = btn.dataset.tab;
      const mainBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (mainBtn) mainBtn.click();

      closeMenu();
      // scroll panel into view
      document.querySelector(".panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // keep mobile active state in sync when desktop tabs are clicked
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      mobileBtns.forEach(b => {
        b.classList.toggle("is-active", b.dataset.tab === tabId);
      });
    });
  });

  // set initial active from hash
  const initialTab = location.hash.replace("#", "");
  if (initialTab) {
    mobileBtns.forEach(b => {
      b.classList.toggle("is-active", b.dataset.tab === initialTab);
    });
  } else {
    // default to first tab
    const first = mobileBtns[0];
    if (first) first.classList.add("is-active");
  }
})();
// ============================================================
// slideshow widget — auto-scroll, no buttons
// ============================================================
(function () {
  const track   = document.getElementById("slideshowTrack");
  const dotsEl  = document.getElementById("slideshowDots");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".slide"));
  if (slides.length === 0) return;

  let current = 0;
  let timer   = null;
  const INTERVAL = 4000;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "slideshow-dot" + (i === 0 ? " is-active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll(".slideshow-dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === current);
    });
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  // pause on hover
  track.closest(".slideshow-wrap")?.addEventListener("mouseenter", () => clearInterval(timer));
  track.closest(".slideshow-wrap")?.addEventListener("mouseleave", resetTimer);

  // swipe support on touch
  let touchStartX = 0;
  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend",   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  resetTimer();
})();

// ============================================================
(function () {
  const daysEl     = document.getElementById("calDays");
  const monthEl    = document.getElementById("calMonthName");
  const yearEl     = document.getElementById("calYear");
  const btnPrev    = document.getElementById("calPrev");
  const btnNext    = document.getElementById("calNext");
  if (!daysEl) return;

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), 1);

  function render() {
    const year  = current.getFullYear();
    const month = current.getMonth();

    monthEl.textContent = MONTHS[month];
    yearEl.textContent  = year;

    daysEl.innerHTML = "";

    // day-of-week the 1st falls on (0=Sun)
    const startDow = new Date(year, month, 1).getDay();
    // total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // leading empty cells
    for (let i = 0; i < startDow; i++) {
      const blank = document.createElement("span");
      blank.className = "cal-day cal-day--empty";
      daysEl.appendChild(blank);
    }

    // day cells
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement("span");
      const dow  = (startDow + d - 1) % 7; // 0=Sun, 6=Sat

      let cls = "cal-day";
      if (dow === 0 || dow === 6) cls += " cal-day--weekend";
      if (
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) cls += " cal-day--today";

      cell.className   = cls;
      cell.textContent = d;
      daysEl.appendChild(cell);
    }
  }

  btnPrev.addEventListener("click", () => {
    current.setMonth(current.getMonth() - 1);
    render();
  });
  btnNext.addEventListener("click", () => {
    current.setMonth(current.getMonth() + 1);
    render();
  });

  render();
})();
// ============================================================
// about-grid slideshow — auto rotate
// ============================================================
(function () {
  const slideshows = document.querySelectorAll(".about-cell--slideshow");
  if (!slideshows.length) return;

  slideshows.forEach((box) => {
    const slides = Array.from(box.querySelectorAll(".slide"));
    if (slides.length <= 1) return;

    const interval = parseInt(box.dataset.interval, 10) || 3000;
    let current = 0;

    setInterval(() => {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, interval);
  });
})();
