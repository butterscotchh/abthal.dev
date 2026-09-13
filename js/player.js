const PLAYLIST = [
  {
    title: "Wii Party Soundtrack - Main Menu",
    src:   "assets/music/Wii Party Soundtrack - Main Menu Music.mp3",
    cover: "assets/music/covers/2.png",
  },
  {
    title: "Recover Decoration (Remix) — Kana Hanazawa",
    src:   "assets/music/Kana Hanazawa - Recover Decoration (Remix).mp3",
    cover: "assets/music/covers/1.jpg",
  },
];

(function () {
  const audio       = document.getElementById("audioEl");
  const trackEl     = document.getElementById("playerTrackName");
  const progressFill= document.getElementById("playerProgressFill");
  const btnPlay     = document.getElementById("btnPlay");
  const btnPrev     = document.getElementById("btnPrev");
  const btnNext     = document.getElementById("btnNext");
  const coverImg    = document.getElementById("playerCover");
  const coverFallback = document.getElementById("playerCoverFallback");
  const marqueeWrap = trackEl ? trackEl.closest(".player-marquee-wrap") : null;

  if (!audio) return;

  let currentIndex = 0;
  let marqueeTimer = null;

  // ---- marquee logic ----
  // If the text is wider than its container, duplicate it and scroll.
  function applyMarquee() {
    if (!trackEl || !marqueeWrap) return;

    // reset first
    trackEl.classList.remove("is-scrolling");
    trackEl.style.removeProperty("--marquee-offset");
    // strip any duplication from previous call
    trackEl.textContent = trackEl.textContent.replace(/\s{4}.*$/, "");

    clearTimeout(marqueeTimer);

    // defer one frame so browser can measure after text update
    marqueeTimer = setTimeout(() => {
      const textW = trackEl.scrollWidth;
      const wrapW = marqueeWrap.clientWidth;

      if (textW <= wrapW) return; // fits — no scroll needed

      // duplicate text with a gap so the loop is seamless
      const gap = "    ✦    ";
      const original = trackEl.textContent;
      trackEl.textContent = original + gap + original;

      // offset = exactly half the total width (= one copy + gap)
      const totalW = trackEl.scrollWidth;
      const offset = -(totalW / 2);
      trackEl.style.setProperty("--marquee-offset", offset + "px");

      // speed: ~60px/s feels natural
      const duration = Math.abs(offset) / 60;
      trackEl.style.animationDuration = duration + "s";
      trackEl.classList.add("is-scrolling");
    }, 50);
  }

  // ---- cover art ----
  function loadCover(src) {
    if (!coverImg || !coverFallback) return;

    const DEFAULT = "assets/music/covers/default.png";
    const url = src || DEFAULT;

    coverImg.style.display = "block";
    coverFallback.style.display = "none";

    coverImg.src = url;
    coverImg.onerror = () => {
      if (coverImg.src.includes("default.png")) {
        coverImg.style.display = "none";
        coverFallback.style.display = "flex";
      } else {
        coverImg.src = DEFAULT;
      }
    };
  }

  // ---- track loader ----
  function loadTrack(index) {
    if (PLAYLIST.length === 0) {
      trackEl.textContent = "NO TRACKS — ADD TO PLAYLIST";
      loadCover(null);
      applyMarquee();
      return;
    }

    currentIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    const track = PLAYLIST[currentIndex];

    audio.src   = track.src;
    trackEl.textContent = track.title;
    progressFill.style.width = "0%";

    loadCover(track.cover);
    applyMarquee();
  }

  const SVG_PLAY  = `<svg id="iconPlay" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5.5 3.5 14.5 9l-9 5.5V3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="currentColor"/></svg>`;
  const SVG_PAUSE = `<svg id="iconPlay" width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="4.5" y="3.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="10.5" y="3.5" width="3" height="11" rx="1" fill="currentColor"/></svg>`;

  function playCurrent() {
    if (PLAYLIST.length === 0) return;
    audio.play();
    btnPlay.innerHTML = SVG_PAUSE;
  }

  function pauseCurrent() {
    audio.pause();
    btnPlay.innerHTML = SVG_PLAY;
  }

  // ---- controls ----
  btnPlay.addEventListener("click", () => {
    if (PLAYLIST.length === 0) return;
    if (!audio.src || audio.src === window.location.href) loadTrack(0);
    audio.paused ? playCurrent() : pauseCurrent();
  });

  btnNext.addEventListener("click", () => {
    if (PLAYLIST.length === 0) return;
    const wasPlaying = !audio.paused;
    loadTrack(currentIndex + 1);
    if (wasPlaying) playCurrent();
  });

  btnPrev.addEventListener("click", () => {
    if (PLAYLIST.length === 0) return;
    const wasPlaying = !audio.paused;
    // restart track if past 3s, otherwise go to prev
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      loadTrack(currentIndex - 1);
    }
    if (wasPlaying) playCurrent();
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  });

  audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1);
    playCurrent();
  });

  // re-measure marquee if window resizes
  window.addEventListener("resize", applyMarquee);

  // init — load first track without autoplaying
  loadTrack(0);
})();
