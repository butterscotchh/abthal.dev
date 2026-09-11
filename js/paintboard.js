// ============================================================
// paintboard.js — MS Paint-style drawing widget
// ============================================================
(function () {
  const canvas        = document.getElementById("paintCanvas");
  if (!canvas) return;

  const ctx           = canvas.getContext("2d");
  const colorsWrap    = document.getElementById("paintColors");
  const brushSizeInput= document.getElementById("brushSize");
  const btnClear      = document.getElementById("btnClear");
  const btnSave       = document.getElementById("btnSave");
  const fgPreview     = document.getElementById("fgPreview");
  const bgPreview     = document.getElementById("bgPreview");
  const brushPreview  = document.getElementById("brushPreview");
  const coordsEl      = document.getElementById("paintCoords");
  const toolEl        = document.getElementById("paintTool");
  const sizeEl        = document.getElementById("paintSize");

  // ---- MS Paint default 28-color palette ----
  const PALETTE = [
    "#000000","#808080","#800000","#808000","#008000","#008080",
    "#000080","#800080","#ffffff","#c0c0c0","#ff0000","#ffff00",
    "#00ff00","#00ffff","#0000ff","#ff00ff","#ff8040","#804000",
    "#80ff00","#004040","#0080ff","#8000ff","#ff0080","#ff8080",
    "#ffff80","#80ff80","#80ffff","#8080ff",
  ];

  // ---- state ----
  let currentTool  = "pencil";
  let fgColor      = "#000000";
  let bgColor      = "#ffffff";
  let brushSize    = parseInt(brushSizeInput.value, 10);
  let drawing      = false;
  let lastPoint    = null;

  // ---- helpers ----
  function fillBackground() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function updateFgPreview() {
    if (fgPreview) fgPreview.style.background = fgColor;
  }

  function updateBgPreview() {
    if (bgPreview) bgPreview.style.background = bgColor;
  }

  function updateBrushPreview() {
    if (!brushPreview) return;
    const size = Math.min(brushSize * 1.8, 24);
    brushPreview.style.width  = size + "px";
    brushPreview.style.height = size + "px";
    brushPreview.style.background = fgColor;
  }

  function updateStatusTool() {
    if (toolEl) toolEl.textContent = "tool: " + currentTool;
  }

  function updateStatusSize() {
    if (sizeEl) sizeEl.textContent = "size: " + brushSize;
  }

  function getPos(evt) {
    const rect    = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: Math.round(((clientX - rect.left)  / rect.width)  * canvas.width),
      y: Math.round(((clientY - rect.top)   / rect.height) * canvas.height),
    };
  }

  // ---- init ----
  fillBackground();
  updateFgPreview();
  updateBgPreview();
  updateBrushPreview();
  updateStatusTool();
  updateStatusSize();

  // ---- build palette ----
  PALETTE.forEach((color, i) => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "paint-swatch" + (i === 0 ? " is-active" : "");
    btn.style.background = color;
    btn.setAttribute("aria-label", color);
    btn.title = color;

    // left-click = set fg, right-click = set bg
    btn.addEventListener("click", () => {
      fgColor = color;
      colorsWrap.querySelectorAll(".paint-swatch").forEach(s => s.classList.remove("is-active"));
      btn.classList.add("is-active");
      updateFgPreview();
      updateBrushPreview();
    });
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      bgColor = color;
      updateBgPreview();
    });

    colorsWrap.appendChild(btn);
  });

  // ---- tool buttons ----
  document.querySelectorAll(".mspaint-tool[data-tool]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      currentTool = btn.dataset.tool;
      document.querySelectorAll(".mspaint-tool").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      updateStatusTool();
    });
  });

  // ---- brush size ----
  brushSizeInput.addEventListener("input", () => {
    brushSize = parseInt(brushSizeInput.value, 10);
    updateBrushPreview();
    updateStatusSize();
  });

  // ---- draw logic ----
  function startDraw(evt) {
    drawing   = true;
    lastPoint = getPos(evt);
    // single dot on click
    paint(lastPoint, lastPoint);
    evt.preventDefault();
  }

  function paint(from, to) {
    ctx.lineCap   = "round";
    ctx.lineJoin  = "round";
    ctx.lineWidth = brushSize;

    if (currentTool === "eraser") {
      ctx.strokeStyle = bgColor;
      ctx.lineWidth   = brushSize * 3; // eraser is chunkier
    } else {
      ctx.strokeStyle = fgColor;
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x,   to.y);
    ctx.stroke();
  }

  function continueDraw(evt) {
    const pos = getPos(evt);
    if (coordsEl) coordsEl.textContent = pos.x + ", " + pos.y;
    if (!drawing) return;
    paint(lastPoint, pos);
    lastPoint = pos;
    evt.preventDefault();
  }

  function endDraw() {
    drawing   = false;
    lastPoint = null;
  }

  canvas.addEventListener("mousedown",  startDraw);
  canvas.addEventListener("mousemove",  continueDraw);
  window.addEventListener("mouseup",    endDraw);

  canvas.addEventListener("touchstart", startDraw,    { passive: false });
  canvas.addEventListener("touchmove",  continueDraw, { passive: false });
  canvas.addEventListener("touchend",   endDraw);

  // coords reset when mouse leaves canvas
  canvas.addEventListener("mouseleave", () => {
    if (coordsEl) coordsEl.textContent = "0, 0";
  });

  // ---- clear (the ✕ title bar button) ----
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      fillBackground();
    });
  }

  // ---- save ----
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const link      = document.createElement("a");
      link.download   = "paintboard.png";
      link.href       = canvas.toDataURL("image/png");
      link.click();
    });
  }
})();
