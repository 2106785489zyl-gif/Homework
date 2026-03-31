"use strict";

const MAX_ANALYSIS_SIDE = 400;
const CORE_PREFS_KEY = "core-outline-prefs-v1";

const el = {
  fileInput: document.getElementById("coreFileInput"),
  strengthInput: document.getElementById("coreStrengthInput"),
  strengthLabel: document.getElementById("coreStrengthLabel"),
  runBtn: document.getElementById("coreRunBtn"),
  clearBtn: document.getElementById("coreClearBtn"),
  meta: document.getElementById("coreMeta"),
  status: document.getElementById("coreStatus"),
  dropZone: document.getElementById("coreDropZone"),
  baseCanvas: document.getElementById("coreBaseCanvas"),
  overlayCanvas: document.getElementById("coreOverlayCanvas"),
  toast: document.getElementById("toast"),
};

const baseCtx = el.baseCanvas.getContext("2d");
const overlayCtx = el.overlayCanvas.getContext("2d");

let state = {
  image: null,
  lastResult: null,
};

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function debounce(fn, wait) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

function isTypingContext() {
  const a = document.activeElement;
  if (!a) return false;
  const tag = a.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(a.isContentEditable);
}

function loadCorePrefs() {
  try {
    return JSON.parse(localStorage.getItem(CORE_PREFS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCorePrefs(partial) {
  const cur = loadCorePrefs();
  Object.assign(cur, partial);
  localStorage.setItem(CORE_PREFS_KEY, JSON.stringify(cur));
}

function isSupportedImageFile(file) {
  if (!file) return false;
  if (/image\/(png|jpeg)/.test(file.type)) return true;
  const name = (file.name || "").toLowerCase();
  return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
}

let toastTimer = null;
function showToast(message, duration = 2000) {
  const node = el.toast;
  if (!node) {
    setStatus(message);
    return;
  }
  node.textContent = message;
  node.hidden = false;
  requestAnimationFrame(() => node.classList.add("toast-visible"));
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    node.classList.remove("toast-visible");
    node.hidden = true;
  }, duration);
}

const runAnalysisDebounced = debounce(() => {
  if (state.image) runAnalysis();
}, 320);

function dist2(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function perpDist(p, a, b) {
  const A = b.x - a.x;
  const B = b.y - a.y;
  const num = Math.abs(B * p.x - A * p.y + b.x * a.y - b.y * a.x);
  const den = Math.hypot(A, B) || 1;
  return num / den;
}

function douglasPeucker(points, epsilon) {
  if (points.length < 3) return points.slice();
  let dmax = 0;
  let idx = 0;
  const end = points.length - 1;
  const pa = points[0];
  const pb = points[end];
  for (let i = 1; i < end; i++) {
    const d = perpDist(points[i], pa, pb);
    if (d > dmax) {
      dmax = d;
      idx = i;
    }
  }
  if (dmax > epsilon) {
    const r1 = douglasPeucker(points.slice(0, idx + 1), epsilon);
    const r2 = douglasPeucker(points.slice(idx), epsilon);
    return r1.slice(0, -1).concat(r2);
  }
  return [pa, pb];
}

function rgbToBuffer(canvas, w, h) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const data = ctx.getImageData(0, 0, w, h).data;
  const rgb = new Float32Array(w * h * 3);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    rgb[p * 3] = data[i];
    rgb[p * 3 + 1] = data[i + 1];
    rgb[p * 3 + 2] = data[i + 2];
  }
  return rgb;
}

function kMeans2Assign(rgb, w, h, iterations = 14) {
  const n = w * h;
  let c0 = [rgb[0], rgb[1], rgb[2]];
  let c1 = [rgb[(n - 1) * 3], rgb[(n - 1) * 3 + 1], rgb[(n - 1) * 3 + 2]];
  const centroids = [
    [c0[0], c0[1], c0[2]],
    [c1[0], c1[1], c1[2]],
  ];
  const assign = new Uint8Array(n);
  for (let it = 0; it < iterations; it++) {
    const newSum = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    const cnt = [0, 0];
    for (let p = 0; p < n; p++) {
      const o = p * 3;
      let d0 = 0;
      let d1 = 0;
      for (let c = 0; c < 3; c++) {
        const v = rgb[o + c];
        const t0 = v - centroids[0][c];
        const t1 = v - centroids[1][c];
        d0 += t0 * t0;
        d1 += t1 * t1;
      }
      const k = d0 <= d1 ? 0 : 1;
      assign[p] = k;
      newSum[k][0] += rgb[o];
      newSum[k][1] += rgb[o + 1];
      newSum[k][2] += rgb[o + 2];
      cnt[k] += 1;
    }
    for (let k = 0; k < 2; k++) {
      if (cnt[k] > 0) {
        centroids[k][0] = newSum[k][0] / cnt[k];
        centroids[k][1] = newSum[k][1] / cnt[k];
        centroids[k][2] = newSum[k][2] / cnt[k];
      }
    }
  }
  return { assign, centroids };
}

function borderVotes(assign, w, h) {
  const strip = Math.max(2, Math.floor(Math.min(w, h) * 0.045));
  const votes = [0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (y < strip || y >= h - strip || x < strip || x >= w - strip) {
        votes[assign[y * w + x]] += 1;
      }
    }
  }
  return votes[0] >= votes[1] ? 1 : 0;
}

function erode3(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      let m = 1;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          m &= mask[i + dy * w + dx];
        }
      }
      out[i] = m ? 1 : 0;
    }
  }
  return out;
}

function dilate3(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      let m = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          m |= mask[i + dy * w + dx];
        }
      }
      out[i] = m ? 1 : 0;
    }
  }
  return out;
}

function morphOpen(mask, w, h) {
  return dilate3(erode3(mask, w, h), w, h);
}

function largestComponentMask(mask, w, h) {
  const visited = new Uint8Array(w * h);
  let bestArea = 0;
  const out = new Uint8Array(w * h);
  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const start = sy * w + sx;
      if (!mask[start] || visited[start]) continue;
      const stack = [start];
      const local = new Uint8Array(w * h);
      visited[start] = 1;
      local[start] = 1;
      let area = 0;
      while (stack.length) {
        const j = stack.pop();
        area += 1;
        const x = j % w;
        const yy = (j / w) | 0;
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          const nx = x + dx;
          const ny = yy + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const n = ny * w + nx;
          if (!mask[n] || visited[n]) continue;
          visited[n] = 1;
          local[n] = 1;
          stack.push(n);
        }
      }
      if (area > bestArea) {
        bestArea = area;
        out.set(local);
      }
    }
  }
  return { mask: out, area: bestArea };
}

function extractBoundaryPoints(compMask, w, h) {
  const pts = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!compMask[i]) continue;
      const up = y > 0 ? compMask[i - w] : 0;
      const dn = y < h - 1 ? compMask[i + w] : 0;
      const lf = x > 0 ? compMask[i - 1] : 0;
      const rt = x < w - 1 ? compMask[i + 1] : 0;
      if (!up || !dn || !lf || !rt) pts.push({ x, y });
    }
  }
  return pts;
}

function traceBoundaryLoop(points) {
  if (points.length < 3) return points.slice();
  const key = (p) => `${p.x},${p.y}`;
  const set = new Set(points.map(key));
  const neigh = (p) => {
    const out = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = p.x + dx;
        const ny = p.y + dy;
        if (set.has(`${nx},${ny}`)) out.push({ x: nx, y: ny });
      }
    }
    return out;
  };
  let start = points[0];
  for (const p of points) {
    if (p.y < start.y || (p.y === start.y && p.x < start.x)) start = p;
  }
  const path = [start];
  let prev = null;
  let current = start;
  const maxIter = Math.min(points.length * 4, 200000);
  for (let iter = 0; iter < maxIter; iter++) {
    const n = neigh(current);
    let next = null;
    if (prev === null) {
      n.sort((a, b) => dist2(a, start) - dist2(b, start));
      next = n[0];
    } else {
      const candidates = n.filter((p) => p.x !== prev.x || p.y !== prev.y);
      if (!candidates.length) break;
      candidates.sort((a, b) => dist2(a, current) - dist2(b, current));
      next = candidates[0];
    }
    if (!next) break;
    if (next.x === start.x && next.y === start.y && path.length > 2) break;
    path.push(next);
    prev = current;
    current = next;
  }
  return path;
}

function sortBoundaryByAngle(points) {
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  cx /= points.length;
  cy /= points.length;
  return points.slice().sort((a, b) => {
    const ta = Math.atan2(a.y - cy, a.x - cx);
    const tb = Math.atan2(b.y - cy, b.x - cx);
    return ta - tb;
  });
}

function buildForegroundMask(assign, fgLabel, rgb, centroids, w, h, strength) {
  const n = w * h;
  const mask = new Uint8Array(n);
  for (let p = 0; p < n; p++) {
    if (assign[p] === fgLabel) mask[p] = 1;
  }
  let m = mask;
  const opens = Math.floor(strength / 34);
  for (let i = 0; i < opens; i++) m = morphOpen(m, w, h);
  const erodeTimes = Math.floor(strength / 38);
  for (let i = 0; i < erodeTimes; i++) m = erode3(m, w, h);
  if (strength > 58) {
    const fg = centroids[fgLabel];
    const thr = 38 + (strength - 58) * 0.35;
    const refined = new Uint8Array(n);
    for (let p = 0; p < n; p++) {
      if (!m[p]) continue;
      const o = p * 3;
      let d = 0;
      for (let c = 0; c < 3; c++) {
        const t = rgb[o + c] - fg[c];
        d += t * t;
      }
      refined[p] = d <= thr * thr ? 1 : 0;
    }
    m = refined;
  }
  return m;
}

function analyzeCoreOutline(image, strength) {
  const maxSide = MAX_ANALYSIS_SIDE;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const w = Math.max(8, Math.round(image.width * scale));
  const h = Math.max(8, Math.round(image.height * scale));
  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const wctx = work.getContext("2d");
  wctx.drawImage(image, 0, 0, w, h);
  const rgb = rgbToBuffer(work, w, h);
  const { assign, centroids } = kMeans2Assign(rgb, w, h);
  const fgLabel = borderVotes(assign, w, h);
  let mask = buildForegroundMask(assign, fgLabel, rgb, centroids, w, h, strength);
  const { mask: compMask, area } = largestComponentMask(mask, w, h);
  const total = w * h;
  if (area < total * 0.002) {
    return { ok: false, reason: "前景区域过小", areaRatio: area / total };
  }
  const pts = extractBoundaryPoints(compMask, w, h);
  if (pts.length < 8) {
    return { ok: false, reason: "边界点过少", areaRatio: area / total };
  }
  let loop = traceBoundaryLoop(pts);
  if (loop.length < pts.length * 0.25 || loop.length < 4) {
    loop = sortBoundaryByAngle(pts);
  }
  if (loop.length > 3 && (loop[0].x !== loop[loop.length - 1].x || loop[0].y !== loop[loop.length - 1].y)) {
    loop.push({ ...loop[0] });
  }
  const diag = Math.hypot(w, h);
  const epsilon = clamp(diag * 0.008, 0.8, 4.5);
  const simplified = douglasPeucker(loop, epsilon);
  return {
    ok: true,
    points: simplified,
    analysisW: w,
    analysisH: h,
    areaRatio: area / total,
    pointCount: simplified.length,
    scaleX: image.width / w,
    scaleY: image.height / h,
  };
}

function fitCanvases() {
  if (!state.image) return;
  const img = state.image;
  const zone = el.dropZone;
  const padX = parseFloat(getComputedStyle(zone).paddingLeft || "0") + parseFloat(getComputedStyle(zone).paddingRight || "0");
  const padY = parseFloat(getComputedStyle(zone).paddingTop || "0") + parseFloat(getComputedStyle(zone).paddingBottom || "0");
  const maxW = Math.max(120, zone.clientWidth - padX);
  const maxH = Math.max(120, Math.min(720, window.innerHeight * 0.65) - padY);
  const fit = Math.min(maxW / img.width, maxH / img.height, 1);
  const dw = Math.floor(img.width * fit);
  const dh = Math.floor(img.height * fit);
  el.baseCanvas.style.width = `${dw}px`;
  el.baseCanvas.style.height = `${dh}px`;
  el.overlayCanvas.style.width = `${dw}px`;
  el.overlayCanvas.style.height = `${dh}px`;
}

function drawBase() {
  if (!state.image) return;
  const img = state.image;
  el.baseCanvas.width = img.width;
  el.baseCanvas.height = img.height;
  baseCtx.clearRect(0, 0, img.width, img.height);
  baseCtx.drawImage(img, 0, 0);
  fitCanvases();
}

function drawOutline(result) {
  if (!state.image || !result || !result.ok) return;
  const img = state.image;
  el.overlayCanvas.width = img.width;
  el.overlayCanvas.height = img.height;
  overlayCtx.clearRect(0, 0, img.width, img.height);
  overlayCtx.save();
  overlayCtx.strokeStyle = "rgba(180, 45, 45, 0.92)";
  overlayCtx.lineWidth = Math.max(1.5, Math.min(4, Math.max(img.width, img.height) * 0.002));
  overlayCtx.lineJoin = "round";
  overlayCtx.lineCap = "round";
  overlayCtx.beginPath();
  const sx = result.scaleX;
  const sy = result.scaleY;
  for (let i = 0; i < result.points.length; i++) {
    const p = result.points[i];
    const x = p.x * sx;
    const y = p.y * sy;
    if (i === 0) overlayCtx.moveTo(x, y);
    else overlayCtx.lineTo(x, y);
  }
  overlayCtx.closePath();
  overlayCtx.stroke();
  overlayCtx.restore();
  fitCanvases();
}

function setMeta(text) {
  el.meta.textContent = text;
}

function setStatus(text) {
  el.status.textContent = text;
}

function runAnalysis() {
  if (!state.image) {
    setStatus("请先上传图片。");
    return;
  }
  const strength = Number(el.strengthInput.value) || 42;
  try {
    const result = analyzeCoreOutline(state.image, strength);
    state.lastResult = result;
    if (!result.ok) {
      overlayCtx.clearRect(0, 0, el.overlayCanvas.width, el.overlayCanvas.height);
      setMeta(`识别未成功：${result.reason || "未知"}。可尝试调整「识别强度」或换图。`);
      setStatus("未能生成轮廓，请调低强度或换一张主体与背景对比更明显的图。");
      return;
    }
    drawOutline(result);
    setMeta(
      [
        `核心区域占比（近似）: ${(result.areaRatio * 100).toFixed(1)}%`,
        `轮廓折线顶点数: ${result.pointCount}`,
        `分析分辨率: ${result.analysisW}×${result.analysisH} px（线段已映射回原图尺寸）`,
      ].join("\n"),
    );
    setStatus("已用红色线段勾勒核心区域外轮廓。");
  } catch (e) {
    console.error(e);
    setStatus(`分析出错：${e.message}`);
  }
}

async function loadFile(file) {
  if (!file || !isSupportedImageFile(file)) {
    setStatus("请使用 JPG 或 PNG 图片。");
    return;
  }
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result || ""));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("图片无法解码"));
    im.src = dataUrl;
  });
  state.image = img;
  el.runBtn.disabled = false;
  drawBase();
  overlayCtx.clearRect(0, 0, el.overlayCanvas.width, el.overlayCanvas.height);
  setMeta("分析中…");
  setStatus("正在识别核心区域…");
  requestAnimationFrame(() => {
    runAnalysis();
  });
}

function clearAll() {
  state.image = null;
  state.lastResult = null;
  el.fileInput.value = "";
  el.runBtn.disabled = true;
  el.baseCanvas.width = 0;
  el.baseCanvas.height = 0;
  el.overlayCanvas.width = 0;
  el.overlayCanvas.height = 0;
  setMeta("请先上传图片。");
  setStatus("拖拽或选择一张图片开始。");
}

function bind() {
  const prefs = loadCorePrefs();
  if (typeof prefs.strength === "number") {
    el.strengthInput.value = String(clamp(Math.round(prefs.strength), 0, 100));
  }
  el.strengthInput.addEventListener("input", () => {
    el.strengthLabel.textContent = el.strengthInput.value;
    const v = Number(el.strengthInput.value) || 0;
    saveCorePrefs({ strength: v });
    runAnalysisDebounced();
  });
  el.strengthLabel.textContent = el.strengthInput.value;
  el.fileInput.addEventListener("change", async (e) => {
    const f = e.target.files && e.target.files[0];
    try {
      await loadFile(f);
    } catch (err) {
      console.error(err);
      setStatus(`加载失败：${err.message}`);
    }
  });
  el.runBtn.addEventListener("click", runAnalysis);
  el.clearBtn.addEventListener("click", clearAll);

  document.addEventListener("paste", async (event) => {
    const items = event.clipboardData && event.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (!item.type.startsWith("image/")) continue;
      event.preventDefault();
      const file = item.getAsFile();
      if (!file || !isSupportedImageFile(file)) {
        setStatus("剪贴板图片格式不支持。");
        return;
      }
      try {
        await loadFile(file);
        showToast("已从剪贴板载入");
      } catch (err) {
        console.error(err);
        setStatus(`加载失败：${err.message}`);
      }
      break;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !isTypingContext()) {
      if (state.image) {
        clearAll();
        showToast("已清空");
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") {
      if (isTypingContext()) return;
      event.preventDefault();
      if (el.fileInput) el.fileInput.click();
    }
  });
  ["dragenter", "dragover"].forEach((n) => {
    el.dropZone.addEventListener(n, (e) => {
      e.preventDefault();
      el.dropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((n) => {
    el.dropZone.addEventListener(n, (e) => {
      e.preventDefault();
      el.dropZone.classList.remove("drag-over");
    });
  });
  el.dropZone.addEventListener("drop", async (e) => {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    try {
      await loadFile(f);
    } catch (err) {
      console.error(err);
      setStatus(`加载失败：${err.message}`);
    }
  });
  window.addEventListener("resize", () => {
    if (state.image) fitCanvases();
  });
}

bind();
