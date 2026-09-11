// ============================================================
// player.js — mini mp3 player
//
// HOW TO ADD YOUR OWN SONGS:
// 1. Put your .mp3 files inside assets/music/
// 2. Add one entry per song to the PLAYLIST array below.
//    "title" is what shows up in the player, "src" is the file path.
// ============================================================
const PLAYLIST = [
  // { title: "Nama Lagu — Artis", src: "assets/music/lagu-1.mp3" },
  // { title: "Lagu Kedua — Artis", src: "assets/music/lagu-2.mp3" },
];

(function () {
  const audio = document.getElementById("audioEl");
  const trackNameEl = document.getElementById("playerTrackName");
  const progressFill = document.getElementById("playerProgressFill");
  const btnPlay = document.getElementById("btnPlay");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  if (!audio) return;

  let currentIndex = 0;

  function loadTrack(index) {
    if (PLAYLIST.length === 0) {
      trackNameEl.textContent = "belum ada lagu — isi js/player.js";
      return;
    }
    currentIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    const track = PLAYLIST[currentIndex];
    audio.src = track.src;
    trackNameEl.textContent = track.title;
    progressFill.style.width = "0%";
  }

  function playCurrent() {
    if (PLAYLIST.length === 0) return;
    audio.play();
    btnPlay.textContent = "⏸";
  }

  function pauseCurrent() {
    audio.pause();
    btnPlay.textContent = "▶";
  }

  btnPlay.addEventListener("click", () => {
    if (PLAYLIST.length === 0) return;
    if (!audio.src) loadTrack(0);
    if (audio.paused) {
      playCurrent();
    } else {
      pauseCurrent();
    }
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
    loadTrack(currentIndex - 1);
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

  // initialise with the first track (without autoplaying)
  loadTrack(0);
})();
