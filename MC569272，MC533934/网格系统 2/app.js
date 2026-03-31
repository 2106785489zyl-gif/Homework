"use strict";

const STORAGE_KEY = "poster-grid-library-v2";
const TEMPLATE_STORAGE_KEY = "poster-grid-learned-templates-v1";
const GRID_BANK_STORAGE_KEY = "poster-grid-bank-v1";
const LAYOUT_PROJECT_STORAGE_KEY = "poster-layout-projects-v1";
const UI_PREFS_KEY = "poster-grid-ui-prefs-v1";
const FORM_DRAFT_KEY = "poster-grid-form-draft-v1";
const STORAGE_POSTER_MAX_SIDE = 1800;
const STORAGE_LAYOUT_IMAGE_MAX_SIDE = 1400;
const STORAGE_JPEG_QUALITY = 0.8;

const state = {
  image: null,
  imageDataUrl: "",
  imageName: "",
  canvasDraft: null,
  layoutItems: [],
  activeLayoutItemId: "",
  grid: null,
  gridConfirmed: false,
  confirmedGrid: null,
  gridVisible: true,
  posterVisible: true,
  style: null,
  library: [],
  templates: [],
  gridBank: [],
  layoutProjects: [],
  autoLayoutVariants: [],
  layoutAnalysis: null,
  analysisOverlayVisible: true,
  snapToGrid: true,
  snapThreshold: 16,
  snapSpan: true,
  minSpan: 1,
  textDefaults: {
    fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
    fontSize: 32,
    fontWeight: 500,
    color: "#171717",
  },
  layoutUndoStack: [],
  layoutRedoStack: [],
  locale: "zh",
};

const el = {
  posterInput: document.getElementById("posterInput"),
  detectBtn: document.getElementById("detectBtn"),
  clearBtn: document.getElementById("clearBtn"),
  applyGridBtn: document.getElementById("applyGridBtn"),
  fitPosterGridBtn: document.getElementById("fitPosterGridBtn"),
  confirmGridBtn: document.getElementById("confirmGridBtn"),
  savePosterBtn: document.getElementById("savePosterBtn"),
  analyzeLayoutZonesBtn: document.getElementById("analyzeLayoutZonesBtn"),
  analysisOverlaySelect: document.getElementById("analysisOverlaySelect"),
  layoutAnalysisMeta: document.getElementById("layoutAnalysisMeta"),
  analysisPanel: document.getElementById("analysisPanel"),
  layoutPanel: document.getElementById("layoutPanel"),
  searchBtn: document.getElementById("searchBtn"),
  resetSearchBtn: document.getElementById("resetSearchBtn"),
  dropZone: document.getElementById("dropZone"),
  statusText: document.getElementById("statusText"),
  gridMeta: document.getElementById("gridMeta"),
  posterCanvas: document.getElementById("posterCanvas"),
  gridCanvas: document.getElementById("gridCanvas"),
  layoutOverlay: document.getElementById("layoutOverlay"),
  alignmentGuides: document.getElementById("alignmentGuides"),
  transformInfo: document.getElementById("transformInfo"),
  colsInput: document.getElementById("colsInput"),
  rowsInput: document.getElementById("rowsInput"),
  marginLeftInput: document.getElementById("marginLeftInput"),
  marginRightInput: document.getElementById("marginRightInput"),
  marginTopInput: document.getElementById("marginTopInput"),
  marginBottomInput: document.getElementById("marginBottomInput"),
  angleInput: document.getElementById("angleInput"),
  gridColorInput: document.getElementById("gridColorInput"),
  gridAlphaInput: document.getElementById("gridAlphaInput"),
  dashInput: document.getElementById("dashInput"),
  gapInput: document.getElementById("gapInput"),
  lineWidthInput: document.getElementById("lineWidthInput"),
  templateNameInput: document.getElementById("templateNameInput"),
  learnTemplateBtn: document.getElementById("learnTemplateBtn"),
  applyTemplateBtn: document.getElementById("applyTemplateBtn"),
  templateSelect: document.getElementById("templateSelect"),
  deleteTemplateBtn: document.getElementById("deleteTemplateBtn"),
  posterNameInput: document.getElementById("posterNameInput"),
  posterTagsInput: document.getElementById("posterTagsInput"),
  canvasWidthInput: document.getElementById("canvasWidthInput"),
  canvasHeightInput: document.getElementById("canvasHeightInput"),
  canvasBgInput: document.getElementById("canvasBgInput"),
  gridBankSelect: document.getElementById("gridBankSelect"),
  gridVisibleSelect: document.getElementById("gridVisibleSelect"),
  analysisGridVisibleSelect: document.getElementById("analysisGridVisibleSelect"),
  posterVisibleSelect: document.getElementById("posterVisibleSelect"),
  snapToGridSelect: document.getElementById("snapToGridSelect"),
  snapThresholdInput: document.getElementById("snapThresholdInput"),
  createCanvasBtn: document.getElementById("createCanvasBtn"),
  applyBankGridBtn: document.getElementById("applyBankGridBtn"),
  editAnalyzedGridBtn: document.getElementById("editAnalyzedGridBtn"),
  addTextBlockBtn: document.getElementById("addTextBlockBtn"),
  addImageBlockBtn: document.getElementById("addImageBlockBtn"),
  autoLayoutBtn: document.getElementById("autoLayoutBtn"),
  autoLayoutVariantSelect: document.getElementById("autoLayoutVariantSelect"),
  textFontFamilySelect: document.getElementById("textFontFamilySelect"),
  textFontSizeInput: document.getElementById("textFontSizeInput"),
  textFontWeightSelect: document.getElementById("textFontWeightSelect"),
  textColorInput: document.getElementById("textColorInput"),
  bringForwardBtn: document.getElementById("bringForwardBtn"),
  sendBackwardBtn: document.getElementById("sendBackwardBtn"),
  deleteActiveItemBtn: document.getElementById("deleteActiveItemBtn"),
  duplicateActiveItemBtn: document.getElementById("duplicateActiveItemBtn"),
  undoLayoutBtn: document.getElementById("undoLayoutBtn"),
  redoLayoutBtn: document.getElementById("redoLayoutBtn"),
  activeLayerOpacityInput: document.getElementById("activeLayerOpacityInput"),
  layoutImageInput: document.getElementById("layoutImageInput"),
  clearLayoutBtn: document.getElementById("clearLayoutBtn"),
  exportLayoutBtn: document.getElementById("exportLayoutBtn"),
  exportGridPngBtn: document.getElementById("exportGridPngBtn"),
  exportPsdBtn: document.getElementById("exportPsdBtn"),
  exportSvgBtn: document.getElementById("exportSvgBtn"),
  exportIdmlBtn: document.getElementById("exportIdmlBtn"),
  layerList: document.getElementById("layerList"),
  snapSpanSelect: document.getElementById("snapSpanSelect"),
  minSpanInput: document.getElementById("minSpanInput"),
  layoutProjectNameInput: document.getElementById("layoutProjectNameInput"),
  layoutProjectSelect: document.getElementById("layoutProjectSelect"),
  layoutProjectList: document.getElementById("layoutProjectList"),
  saveLayoutProjectBtn: document.getElementById("saveLayoutProjectBtn"),
  loadLayoutProjectBtn: document.getElementById("loadLayoutProjectBtn"),
  deleteLayoutProjectBtn: document.getElementById("deleteLayoutProjectBtn"),
  searchColsInput: document.getElementById("searchColsInput"),
  searchRowsInput: document.getElementById("searchRowsInput"),
  searchCategoryInput: document.getElementById("searchCategoryInput"),
  searchTextInput: document.getElementById("searchTextInput"),
  libraryList: document.getElementById("libraryList"),
  zoomSelect: document.getElementById("zoomSelect"),
  colorPaletteEmpty: document.getElementById("colorPaletteEmpty"),
  colorPaletteGrid: document.getElementById("colorPaletteGrid"),
  toast: document.getElementById("toast"),
  graphicsEmpty: document.getElementById("graphicsEmpty"),
  graphicsContent: document.getElementById("graphicsContent"),
  graphicsFeatureList: document.getElementById("graphicsFeatureList"),
  graphicsAtmosphere: document.getElementById("graphicsAtmosphere"),
  graphicsInterpretation: document.getElementById("graphicsInterpretation"),
  semanticsSearchInput: document.getElementById("semanticsSearchInput"),
  semanticsList: document.getElementById("semanticsList"),
  autoLayoutVariantCards: document.getElementById("autoLayoutVariantCards"),
  langZhBtn: document.getElementById("langZhBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
};

const posterCtx = el.posterCanvas.getContext("2d");
const gridCtx = el.gridCanvas.getContext("2d");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function polygonPointsToCss(points) {
  if (!Array.isArray(points) || points.length < 3) return "0% 0%,100% 0%,100% 100%,0% 100%";
  return points
    .map((p) => `${(clamp(Number(p.x) || 0, 0, 1) * 100).toFixed(2)}% ${(clamp(Number(p.y) || 0, 0, 1) * 100).toFixed(2)}%`)
    .join(",");
}

function getAbsoluteShapePolygonPoints(item) {
  if (!item || item.shapeKind !== "polygon" || !Array.isArray(item.points) || item.points.length < 3) return [];
  return item.points.map((p) => ({
    x: item.x + clamp(Number(p.x) || 0, 0, 1) * item.width,
    y: item.y + clamp(Number(p.y) || 0, 0, 1) * item.height,
  }));
}

function cloneLayoutItemDeep(item) {
  if (!item || typeof item !== "object") return item;
  const next = { ...item };
  if (Array.isArray(item.points)) {
    next.points = item.points.map((p) => ({ x: Number(p.x) || 0, y: Number(p.y) || 0 }));
  }
  if (item.textStyle && typeof item.textStyle === "object") {
    next.textStyle = { ...item.textStyle };
  }
  return next;
}

function cloneLayoutItemsDeep(items) {
  return Array.isArray(items) ? items.map((item) => cloneLayoutItemDeep(item)) : [];
}

function cloneLayoutAnalysisDeep(analysis) {
  if (!analysis || typeof analysis !== "object") return null;
  return {
    source: analysis.source || "auto",
    blockCount: Number(analysis.blockCount) || 0,
    contourCount: Number(analysis.contourCount) || 0,
    updatedAt: analysis.updatedAt || new Date().toISOString(),
    items: cloneLayoutItemsDeep(analysis.items),
  };
}

const MAX_LAYOUT_UNDO = 45;

function snapshotLayoutStateForUndo() {
  return {
    items: cloneLayoutItemsDeep(state.layoutItems),
    activeLayoutItemId: state.activeLayoutItemId,
  };
}

function resetLayoutHistory() {
  state.layoutUndoStack = [];
  state.layoutRedoStack = [];
}

function pushLayoutUndo() {
  if (!stageExists()) return;
  state.layoutRedoStack = [];
  state.layoutUndoStack.push(snapshotLayoutStateForUndo());
  while (state.layoutUndoStack.length > MAX_LAYOUT_UNDO) state.layoutUndoStack.shift();
}

function restoreLayoutSnapshot(snap) {
  if (!snap) return;
  state.layoutItems = cloneLayoutItemsDeep(snap.items);
  state.activeLayoutItemId = snap.activeLayoutItemId || "";
  renderLayoutItems();
  updateTextControlsByActiveItem();
  updateOpacityControlFromActive();
  renderLayerList();
}

function undoLayout() {
  if (!state.layoutUndoStack.length) {
    setStatus(tr("m_noUndo"));
    return;
  }
  const current = snapshotLayoutStateForUndo();
  const prev = state.layoutUndoStack.pop();
  state.layoutRedoStack.push(current);
  restoreLayoutSnapshot(prev);
  setStatus(tr("m_undoDone"));
  showToast(tr("m_toastUndo"));
}

function redoLayout() {
  if (!state.layoutRedoStack.length) {
    setStatus(tr("m_noRedo"));
    return;
  }
  const current = snapshotLayoutStateForUndo();
  const next = state.layoutRedoStack.pop();
  state.layoutUndoStack.push(current);
  restoreLayoutSnapshot(next);
  setStatus(tr("m_redoDone"));
  showToast(tr("m_toastRedo"));
}

function getItemsForExport() {
  const layoutItems = cloneLayoutItemsDeep(state.layoutItems);
  const hasImportedAnalysis = layoutItems.some((item) => item && item.fromAnalysis === true);
  if (hasImportedAnalysis) return layoutItems;
  const analysisItems = cloneLayoutItemsDeep(state.layoutAnalysis?.items || []).map((item) => ({
    ...item,
    fromAnalysis: true,
    visible: item.visible !== false,
    name: item.name || "分析图层",
  }));
  return [...layoutItems, ...analysisItems];
}

function switchToLayoutEditingPanel() {
  if (el.analysisPanel) el.analysisPanel.open = false;
  if (el.layoutPanel) el.layoutPanel.open = true;
}

function openGridEditorPanel() {
  if (el.analysisPanel) el.analysisPanel.open = true;
  if (el.layoutPanel) el.layoutPanel.open = true;
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

function syncGridVisibleSelectsFromState() {
  const v = state.gridVisible ? "on" : "off";
  if (el.gridVisibleSelect) el.gridVisibleSelect.value = v;
  if (el.analysisGridVisibleSelect) el.analysisGridVisibleSelect.value = v;
}

function applyGridVisibleUserChange(value) {
  state.gridVisible = value !== "off";
  syncGridVisibleSelectsFromState();
  saveUIPrefsPartial({ gridVisible: state.gridVisible });
  drawGrid();
}

function tr(key, params) {
  return window.PosterGridI18n.t(state.locale, key, params);
}

function setLocale(next, opts = {}) {
  if (next !== "zh" && next !== "en") return;
  state.locale = next;
  if (!opts.skipPersist) localStorage.setItem("ui_locale", next);
  window.PosterGridI18n.applyPage(next);
  refreshDynamicLocale();
  updateLangButtons();
  // #region agent log
  fetch("http://127.0.0.1:7878/ingest/69092420-af50-4cb2-9a7c-3ba688b9df71", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "2598c1" },
    body: JSON.stringify({
      sessionId: "2598c1",
      location: "app.js:setLocale",
      message: "after locale switch snapshot",
      data: {
        locale: state.locale,
        statusPreview: el.statusText ? String(el.statusText.textContent).slice(0, 160) : "",
        statusHasCJK: el.statusText ? /[\u4e00-\u9fff]/.test(el.statusText.textContent) : false,
        templateOpt0: el.templateSelect && el.templateSelect.options[0] ? el.templateSelect.options[0].textContent : "",
        gridBankOpt0: el.gridBankSelect && el.gridBankSelect.options[0] ? el.gridBankSelect.options[0].textContent : "",
        layoutProjOpt0:
          el.layoutProjectSelect && el.layoutProjectSelect.options[0]
            ? el.layoutProjectSelect.options[0].textContent
            : "",
        searchCatOpt0:
          el.searchCategoryInput && el.searchCategoryInput.options[0]
            ? el.searchCategoryInput.options[0].textContent
            : "",
      },
      timestamp: Date.now(),
      hypothesisId: "H1-H4-snapshot",
    }),
  }).catch(() => {});
  // #endregion
}

function updateLangButtons() {
  if (!el.langZhBtn || !el.langEnBtn) return;
  const isZh = state.locale === "zh";
  el.langZhBtn.classList.toggle("is-active", isZh);
  el.langEnBtn.classList.toggle("is-active", !isZh);
  el.langZhBtn.setAttribute("aria-pressed", isZh ? "true" : "false");
  el.langEnBtn.setAttribute("aria-pressed", isZh ? "false" : "true");
}

function refreshDynamicLocale() {
  if (!window.PosterGridI18n) return;
  updateGridMeta();
  renderLayoutAnalysisMeta();
  renderLayerList();
  renderColorPalette();
  if (state.image) {
    renderGraphicsSemantics();
  } else if (el.graphicsEmpty) {
    el.graphicsEmpty.textContent = tr("graphicsEmpty");
    el.graphicsEmpty.hidden = false;
    if (el.graphicsContent) el.graphicsContent.hidden = true;
  }
  const q = el.semanticsSearchInput ? el.semanticsSearchInput.value : "";
  renderSemanticsList(q, lastAutoTags);
  renderAutoLayoutVariantSelect();
  renderTemplateSelect();
  renderGridBankSelect();
  renderLayoutProjectSelect();
  renderLibrary();
}

function getStageSize() {
  if (state.image) return { width: state.image.width, height: state.image.height, mode: "poster" };
  if (state.canvasDraft) return { width: state.canvasDraft.width, height: state.canvasDraft.height, mode: "blank" };
  return null;
}

function stageExists() {
  return Boolean(getStageSize());
}

function clearLayoutItems() {
  state.layoutItems = [];
  state.activeLayoutItemId = "";
  state.autoLayoutVariants = [];
  renderAutoLayoutVariantSelect();
  if (el.layoutOverlay) el.layoutOverlay.innerHTML = "";
  clearAlignmentGuides();
  hideTransformInfo();
  syncTextControlsFromModel(state.textDefaults);
  updateOpacityControlFromActive();
}

function sanitizeTextStyle(style = {}) {
  return {
    fontFamily: typeof style.fontFamily === "string" && style.fontFamily.trim()
      ? style.fontFamily
      : state.textDefaults.fontFamily,
    fontSize: clamp(Number(style.fontSize) || state.textDefaults.fontSize, 10, 160),
    fontWeight: clamp(Number(style.fontWeight) || state.textDefaults.fontWeight, 100, 900),
    color: typeof style.color === "string" && style.color.startsWith("#")
      ? style.color
      : state.textDefaults.color,
  };
}

function getActiveLayoutItem() {
  if (!state.activeLayoutItemId) return null;
  return state.layoutItems.find((item) => item.id === state.activeLayoutItemId) || null;
}

function ensureLayoutItemDefaults(item, idx = 0) {
  if (!item) return;
  if (typeof item.visible !== "boolean") item.visible = true;
  if (typeof item.locked !== "boolean") item.locked = false;
  if (typeof item.opacity !== "number") item.opacity = 1;
  if (item.type === "shape" && item.shapeKind === "polygon") {
    if (!Array.isArray(item.points) || item.points.length < 3) {
      item.points = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ];
    } else {
      item.points = item.points.map((p) => ({
        x: clamp(Number(p.x) || 0, 0, 1),
        y: clamp(Number(p.y) || 0, 0, 1),
      }));
    }
  }
  if (typeof item.name !== "string" || !item.name.trim()) {
    const base =
      item.type === "text"
        ? "文字"
        : item.type === "image"
          ? "图片"
          : item.type === "shape"
            ? "图形"
            : item.type === "textBlock"
              ? "文本占位"
              : "元素";
    item.name = `${base} ${idx + 1}`;
  }
}

function renderLayerList() {
  if (!el.layerList) return;
  el.layerList.innerHTML = "";
  if (!state.layoutItems.length) {
    el.layerList.innerHTML = `<p class="status">${tr("layerEmpty")}</p>`;
    return;
  }
  [...state.layoutItems].reverse().forEach((item, reversedIdx) => {
    const realIdx = state.layoutItems.length - 1 - reversedIdx;
    ensureLayoutItemDefaults(item, realIdx);
    const row = document.createElement("article");
    row.className = "layer-item";
    if (item.id === state.activeLayoutItemId) row.classList.add("active");
    row.dataset.id = item.id;
    const title = document.createElement("p");
    title.className = "layer-item-title";
    const hiddenTag = item.visible ? "" : tr("layerHidden");
    const lockTag = item.locked ? tr("layerLocked") : "";
    title.textContent = `${item.name}${hiddenTag}${lockTag}`;
    const tools = document.createElement("div");
    tools.className = "layer-item-tools";
    const visBtn = document.createElement("button");
    visBtn.type = "button";
    visBtn.dataset.action = "toggle-visible";
    visBtn.dataset.id = item.id;
    visBtn.textContent = item.visible ? tr("layerShow") : tr("layerHide");
    const lockBtn = document.createElement("button");
    lockBtn.type = "button";
    lockBtn.dataset.action = "toggle-lock";
    lockBtn.dataset.id = item.id;
    lockBtn.textContent = item.locked ? tr("layerUnlock") : tr("layerLock");
    tools.appendChild(visBtn);
    tools.appendChild(lockBtn);
    row.appendChild(title);
    row.appendChild(tools);
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      setActiveLayoutItem(item.id);
    });
    el.layerList.appendChild(row);
  });
}

function syncTextControlsFromModel(style) {
  if (el.textFontFamilySelect) el.textFontFamilySelect.value = style.fontFamily;
  if (el.textFontSizeInput) el.textFontSizeInput.value = String(style.fontSize);
  if (el.textFontWeightSelect) el.textFontWeightSelect.value = String(style.fontWeight);
  if (el.textColorInput) el.textColorInput.value = style.color;
}

function updateTextControlsByActiveItem() {
  const active = getActiveLayoutItem();
  if (!active || active.type !== "text") {
    syncTextControlsFromModel(state.textDefaults);
    return;
  }
  active.textStyle = sanitizeTextStyle(active.textStyle);
  syncTextControlsFromModel(active.textStyle);
}

function setActiveLayoutItem(id) {
  const nextId = id || "";
  const changed = state.activeLayoutItemId !== nextId;
  state.activeLayoutItemId = nextId;
  if (changed) renderLayoutItems();
  if (!state.activeLayoutItemId) {
    clearAlignmentGuides();
    hideTransformInfo();
  }
  updateTextControlsByActiveItem();
  updateOpacityControlFromActive();
  renderLayerList();
}

function clampLayoutItemInStage(item, width, height) {
  item.width = clamp(item.width, 24, Math.max(24, width));
  item.height = clamp(item.height, 24, Math.max(24, height));
  item.x = clamp(item.x, 0, Math.max(0, width - item.width));
  item.y = clamp(item.y, 0, Math.max(0, height - item.height));
}

function alignActiveLayoutToCanvas(edge) {
  const stage = getStageSize();
  const item = getActiveLayoutItem();
  if (!stage || !item || item.locked) {
    setStatus(tr("m_selectUnlock"));
    return;
  }
  pushLayoutUndo();
  ensureLayoutItemDefaults(item);
  const { width: W, height: H } = stage;
  if (edge === "left") item.x = 0;
  if (edge === "hcenter") item.x = (W - item.width) / 2;
  if (edge === "right") item.x = W - item.width;
  if (edge === "top") item.y = 0;
  if (edge === "vcenter") item.y = (H - item.height) / 2;
  if (edge === "bottom") item.y = H - item.height;
  clampLayoutItemInStage(item, W, H);
  renderLayoutItems();
  setStatus(tr("m_aligned"));
}

function updateOpacityControlFromActive() {
  if (!el.activeLayerOpacityInput) return;
  const active = getActiveLayoutItem();
  if (!active) {
    el.activeLayerOpacityInput.disabled = true;
    el.activeLayerOpacityInput.value = "100";
    return;
  }
  ensureLayoutItemDefaults(active);
  el.activeLayerOpacityInput.disabled = Boolean(active.locked);
  el.activeLayerOpacityInput.value = String(Math.round(clamp(active.opacity, 0, 1) * 100));
}

function applyActiveLayerOpacityFromInput() {
  if (!el.activeLayerOpacityInput) return;
  const active = getActiveLayoutItem();
  if (!active || active.locked) return;
  ensureLayoutItemDefaults(active);
  const pct = clamp(Number(el.activeLayerOpacityInput.value), 0, 100);
  active.opacity = pct / 100;
  renderLayoutItems();
}

function nudgeActiveLayoutItemByArrow(key, shiftKey, isRepeat) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) return false;
  const stage = getStageSize();
  const item = getActiveLayoutItem();
  if (!stage || !item || item.locked) return false;
  const step = shiftKey ? 10 : 1;
  let dx = 0;
  let dy = 0;
  if (key === "ArrowLeft") dx = -step;
  if (key === "ArrowRight") dx = step;
  if (key === "ArrowUp") dy = -step;
  if (key === "ArrowDown") dy = step;
  if (!isRepeat) pushLayoutUndo();
  ensureLayoutItemDefaults(item);
  item.x += dx;
  item.y += dy;
  clampLayoutItemInStage(item, stage.width, stage.height);
  renderLayoutItems();
  return true;
}

function getStageScale() {
  const stage = getStageSize();
  if (!stage) return 1;
  const displayWidth = parseFloat(el.posterCanvas.style.width || "0");
  if (!displayWidth || !Number.isFinite(displayWidth)) return 1;
  return displayWidth / Math.max(1, stage.width);
}

function clearAlignmentGuides() {
  if (!el.alignmentGuides) return;
  el.alignmentGuides.innerHTML = "";
}

function showAlignmentGuides(guides) {
  if (!el.alignmentGuides) return;
  el.alignmentGuides.innerHTML = "";
  const stage = getStageSize();
  if (!stage) return;
  const scale = getStageScale();
  const { xLine, yLine } = guides || {};
  if (Number.isFinite(xLine)) {
    const line = document.createElement("div");
    line.className = "alignment-guide-line vertical";
    line.style.left = `${xLine * scale}px`;
    el.alignmentGuides.appendChild(line);
  }
  if (Number.isFinite(yLine)) {
    const line = document.createElement("div");
    line.className = "alignment-guide-line horizontal";
    line.style.top = `${yLine * scale}px`;
    el.alignmentGuides.appendChild(line);
  }
}

function hideTransformInfo() {
  if (!el.transformInfo) return;
  el.transformInfo.hidden = true;
}

function ensureTransformInfoBadge() {
  if (!el.transformInfo) return null;
  let badge = el.transformInfo.querySelector(".transform-info-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "transform-info-badge";
    el.transformInfo.appendChild(badge);
  }
  return badge;
}

function showTransformInfo(item, label = "") {
  if (!el.transformInfo) return;
  const badge = ensureTransformInfoBadge();
  if (!badge) return;
  const scale = getStageScale();
  const x = (item.x + item.width / 2) * scale;
  const y = item.y * scale;
  const sizeText = `${Math.round(item.width)} × ${Math.round(item.height)} px`;
  badge.textContent = label ? `${label} · ${sizeText}` : sizeText;
  badge.style.left = `${x}px`;
  badge.style.top = `${y}px`;
  el.transformInfo.hidden = false;
}

function getGridGuideLines() {
  const stage = getStageSize();
  if (!stage || !state.grid) return { vertical: [], horizontal: [] };
  const g = state.grid;
  const innerW = Math.max(1, stage.width - g.marginLeft - g.marginRight);
  const innerH = Math.max(1, stage.height - g.marginTop - g.marginBottom);
  const colW = innerW / Math.max(1, g.cols);
  const rowH = innerH / Math.max(1, g.rows);
  const vertical = [];
  const horizontal = [];
  for (let c = 0; c <= g.cols; c++) vertical.push(g.marginLeft + c * colW);
  for (let r = 0; r <= g.rows; r++) horizontal.push(g.marginTop + r * rowH);
  return { vertical, horizontal };
}

function nearestLineIndex(value, lines) {
  let bestIdx = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < lines.length; i++) {
    const d = Math.abs(value - lines[i]);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function snapValueToLines(value, lines, threshold) {
  let best = value;
  let bestDist = threshold + 1;
  for (const line of lines) {
    const d = Math.abs(value - line);
    if (d < bestDist && d <= threshold) {
      bestDist = d;
      best = line;
    }
  }
  return best;
}

function applyGridSnapToItem(item) {
  if (!state.snapToGrid || !state.grid) return { xLine: null, yLine: null };
  const { vertical, horizontal } = getGridGuideLines();
  if (!vertical.length || !horizontal.length) return { xLine: null, yLine: null };
  const threshold = clamp(Number(state.snapThreshold) || 16, 2, 80);
  const left = item.x;
  const top = item.y;
  const right = item.x + item.width;
  const bottom = item.y + item.height;
  const centerX = item.x + item.width / 2;
  const centerY = item.y + item.height / 2;
  const snapLeft = snapValueToLines(left, vertical, threshold);
  const snapRight = snapValueToLines(right, vertical, threshold);
  const snapCenterX = snapValueToLines(centerX, vertical, threshold);
  const snapTop = snapValueToLines(top, horizontal, threshold);
  const snapBottom = snapValueToLines(bottom, horizontal, threshold);
  const snapCenterY = snapValueToLines(centerY, horizontal, threshold);
  const xCandidates = [
    { x: snapLeft, dist: Math.abs(snapLeft - left), line: snapLeft },
    { x: snapRight - item.width, dist: Math.abs(snapRight - right), line: snapRight },
    { x: snapCenterX - item.width / 2, dist: Math.abs(snapCenterX - centerX), line: snapCenterX },
  ];
  const yCandidates = [
    { y: snapTop, dist: Math.abs(snapTop - top), line: snapTop },
    { y: snapBottom - item.height, dist: Math.abs(snapBottom - bottom), line: snapBottom },
    { y: snapCenterY - item.height / 2, dist: Math.abs(snapCenterY - centerY), line: snapCenterY },
  ];
  xCandidates.sort((a, b) => a.dist - b.dist);
  yCandidates.sort((a, b) => a.dist - b.dist);
  item.x = xCandidates[0].x;
  item.y = yCandidates[0].y;
  const xLine = xCandidates[0].dist <= threshold ? xCandidates[0].line : null;
  const yLine = yCandidates[0].dist <= threshold ? yCandidates[0].line : null;
  return { xLine, yLine };
}

function applyGridSpanSnapToItem(item) {
  if (!state.snapSpan || !state.grid) return;
  const { vertical, horizontal } = getGridGuideLines();
  if (vertical.length < 2 || horizontal.length < 2) return;
  const minSpan = clamp(Number(state.minSpan) || 1, 1, 12);
  const startCol = nearestLineIndex(item.x, vertical);
  const rawEndCol = nearestLineIndex(item.x + item.width, vertical);
  const startRow = nearestLineIndex(item.y, horizontal);
  const rawEndRow = nearestLineIndex(item.y + item.height, horizontal);
  const endCol = clamp(Math.max(rawEndCol, startCol + minSpan), startCol + minSpan, vertical.length - 1);
  const endRow = clamp(Math.max(rawEndRow, startRow + minSpan), startRow + minSpan, horizontal.length - 1);
  item.x = vertical[startCol];
  item.y = horizontal[startRow];
  item.width = Math.max(24, vertical[endCol] - vertical[startCol]);
  item.height = Math.max(24, horizontal[endRow] - horizontal[startRow]);
}

function deleteActiveLayoutItem() {
  if (!state.activeLayoutItemId) {
    setStatus(tr("m_selectItem"));
    return;
  }
  pushLayoutUndo();
  state.layoutItems = state.layoutItems.filter((item) => item.id !== state.activeLayoutItemId);
  state.activeLayoutItemId = "";
  renderLayoutItems();
  setStatus(tr("m_deleted"));
}

function duplicateActiveLayoutItem() {
  const active = getActiveLayoutItem();
  if (!active) {
    setStatus(tr("m_selectItem"));
    return;
  }
  pushLayoutUndo();
  ensureLayoutItemDefaults(active);
  const copy = cloneLayoutItemDeep(active);
  copy.id = `${active.type}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  copy.x = active.x + 18;
  copy.y = active.y + 18;
  copy.name = `${active.name} 副本`;
  state.layoutItems.push(copy);
  setActiveLayoutItem(copy.id);
  renderLayoutItems();
  setStatus(tr("m_duplicated"));
}

function bringActiveLayoutItemForward() {
  if (!state.activeLayoutItemId) {
    setStatus(tr("m_selectItem"));
    return;
  }
  const idx = state.layoutItems.findIndex((it) => it.id === state.activeLayoutItemId);
  if (idx < 0 || idx === state.layoutItems.length - 1) return;
  pushLayoutUndo();
  const [item] = state.layoutItems.splice(idx, 1);
  state.layoutItems.splice(idx + 1, 0, item);
  renderLayoutItems();
}

function sendActiveLayoutItemBackward() {
  if (!state.activeLayoutItemId) {
    setStatus(tr("m_selectItem"));
    return;
  }
  const idx = state.layoutItems.findIndex((it) => it.id === state.activeLayoutItemId);
  if (idx <= 0) return;
  pushLayoutUndo();
  const [item] = state.layoutItems.splice(idx, 1);
  state.layoutItems.splice(idx - 1, 0, item);
  renderLayoutItems();
}

function bindLayoutItemDrag(node, item) {
  node.addEventListener("mousedown", (event) => {
    ensureLayoutItemDefaults(item);
    if (item.locked) return;
    if (event.button !== 0) return;
    if (event.target.closest(".layout-item-resize-handle")) return;
    if (event.target.closest(".layout-text-content")) return;
    event.preventDefault();
    setActiveLayoutItem(item.id);
    pushLayoutUndo();
    const scale = getStageScale();
    const startX = event.clientX;
    const startY = event.clientY;
    const baseX = item.x;
    const baseY = item.y;
    const move = (ev) => {
      const dx = (ev.clientX - startX) / Math.max(0.0001, scale);
      const dy = (ev.clientY - startY) / Math.max(0.0001, scale);
      item.x = baseX + dx;
      item.y = baseY + dy;
      let guides = { xLine: null, yLine: null };
      if (!ev.altKey) guides = applyGridSnapToItem(item);
      const stage = getStageSize();
      if (!stage) return;
      clampLayoutItemInStage(item, stage.width, stage.height);
      showAlignmentGuides(guides);
      showTransformInfo(item, "移动");
      renderLayoutItems();
    };
    const up = () => {
      const stage = getStageSize();
      if (stage) {
        applyGridSpanSnapToItem(item);
        clampLayoutItemInStage(item, stage.width, stage.height);
        renderLayoutItems();
      }
      clearAlignmentGuides();
      hideTransformInfo();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });
}

function bindLayoutItemResize(node, item, handle, dir) {
  handle.addEventListener("mousedown", (event) => {
    ensureLayoutItemDefaults(item);
    if (item.locked) return;
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    setActiveLayoutItem(item.id);
    pushLayoutUndo();
    const scale = getStageScale();
    const stage = getStageSize();
    if (!stage) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const base = {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    };
    const ratio = base.width / Math.max(1, base.height);
    const resizeMin = item.type === "text" ? 48 : 40;
    const move = (ev) => {
      const dx = (ev.clientX - startX) / Math.max(0.0001, scale);
      const dy = (ev.clientY - startY) / Math.max(0.0001, scale);
      let nx = base.x;
      let ny = base.y;
      let nw = base.width;
      let nh = base.height;
      if (dir.includes("e")) nw = base.width + dx;
      if (dir.includes("s")) nh = base.height + dy;
      if (dir.includes("w")) {
        nw = base.width - dx;
        nx = base.x + dx;
      }
      if (dir.includes("n")) {
        nh = base.height - dy;
        ny = base.y + dy;
      }
      nw = Math.max(resizeMin, nw);
      nh = Math.max(resizeMin, nh);
      if (item.type === "image") {
        if (Math.abs(dx) >= Math.abs(dy)) {
          nh = nw / Math.max(0.001, ratio);
        } else {
          nw = nh * ratio;
        }
        if (dir.includes("w")) nx = base.x + (base.width - nw);
        if (dir.includes("n")) ny = base.y + (base.height - nh);
      }
      item.x = nx;
      item.y = ny;
      item.width = nw;
      item.height = nh;
      clampLayoutItemInStage(item, stage.width, stage.height);
      let guides = { xLine: null, yLine: null };
      if (!ev.altKey) guides = applyGridSnapToItem(item);
      // Keep resized item strictly inside stage after snapping.
      clampLayoutItemInStage(item, stage.width, stage.height);
      showAlignmentGuides(guides);
      showTransformInfo(item, "缩放");
      renderLayoutItems();
    };
    const up = () => {
      const currentStage = getStageSize();
      if (currentStage) {
        applyGridSpanSnapToItem(item);
        clampLayoutItemInStage(item, currentStage.width, currentStage.height);
        renderLayoutItems();
      }
      clearAlignmentGuides();
      hideTransformInfo();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });
}

function renderLayoutItems() {
  if (!el.layoutOverlay) return;
  el.layoutOverlay.innerHTML = "";
  const stage = getStageSize();
  if (!stage) return;
  const scale = getStageScale();
  const overlay = el.layoutOverlay;
  state.layoutItems.forEach((item, idx) => {
    ensureLayoutItemDefaults(item, idx);
    if (!item.visible) return;
    clampLayoutItemInStage(item, stage.width, stage.height);
    const node = document.createElement("div");
    node.className = `layout-item layout-item--${item.type}`;
    if (item.type === "shape" && item.shapeKind) {
      node.classList.add(`layout-shape-${item.shapeKind}`);
      if (item.shapeKind === "polygon") {
        node.style.setProperty("--shape-points", polygonPointsToCss(item.points));
      }
    }
    node.dataset.id = item.id;
    node.style.left = `${item.x * scale}px`;
    node.style.top = `${item.y * scale}px`;
    node.style.width = `${item.width * scale}px`;
    node.style.height = `${item.height * scale}px`;
    node.style.zIndex = String(idx + 1);
    node.style.opacity = String(clamp(item.opacity, 0, 1));
    if (item.id === state.activeLayoutItemId) node.classList.add("active");
    node.addEventListener("mousedown", () => setActiveLayoutItem(item.id));
    if (item.type === "text") {
      item.textStyle = sanitizeTextStyle(item.textStyle);
      node.style.fontFamily = item.textStyle.fontFamily;
      node.style.fontSize = `${item.textStyle.fontSize * scale}px`;
      node.style.fontWeight = String(item.textStyle.fontWeight);
      node.style.color = item.textStyle.color;
      const textNode = document.createElement("div");
      textNode.className = "layout-text-content";
      textNode.setAttribute("contenteditable", "true");
      textNode.setAttribute("spellcheck", "false");
      textNode.textContent = item.text || tr("textDefault");
      textNode.addEventListener("input", () => {
        item.text = textNode.textContent || "";
      });
      textNode.addEventListener("keydown", (event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          if (!textNode.textContent?.trim()) {
            state.layoutItems = state.layoutItems.filter((it) => it.id !== item.id);
            state.activeLayoutItemId = "";
            renderLayoutItems();
          }
        }
      });
      node.appendChild(textNode);
    } else if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "layout-image";
      node.appendChild(img);
    } else if (item.type === "shape" || item.type === "textBlock") {
      const label = document.createElement("span");
      label.className = "layout-placeholder-label";
      label.textContent = item.name || (item.type === "shape" ? tr("phShape") : tr("phTextBlock"));
      if (item.type === "textBlock" && item.textStyle && typeof item.textStyle === "object") {
        const st = sanitizeTextStyle(item.textStyle);
        label.style.fontFamily = st.fontFamily;
        label.style.fontSize = `${clamp(Number(st.fontSize) || 14, 10, 56)}px`;
        label.style.fontWeight = String(st.fontWeight);
        label.style.color = st.color;
        label.style.lineHeight = "1.2";
        label.style.letterSpacing = "-0.02em";
      }
      node.appendChild(label);
    }
    if (item.id === state.activeLayoutItemId) {
      ["nw", "ne", "sw", "se"].forEach((dir) => {
        const handle = document.createElement("span");
        handle.className = "layout-item-resize-handle";
        handle.dataset.dir = dir;
        handle.setAttribute("contenteditable", "false");
        bindLayoutItemResize(node, item, handle, dir);
        node.appendChild(handle);
      });
    }
    bindLayoutItemDrag(node, item);
    overlay.appendChild(node);
  });
  renderLayerList();
  updateOpacityControlFromActive();
}

function readTextStyleFromControls() {
  const style = {
    fontFamily: el.textFontFamilySelect?.value || state.textDefaults.fontFamily,
    fontSize: Number(el.textFontSizeInput?.value) || state.textDefaults.fontSize,
    fontWeight: Number(el.textFontWeightSelect?.value) || state.textDefaults.fontWeight,
    color: el.textColorInput?.value || state.textDefaults.color,
  };
  return sanitizeTextStyle(style);
}

function applyTextStyleControls() {
  const style = readTextStyleFromControls();
  state.textDefaults = { ...style };
  syncTextControlsFromModel(style);
  saveUIPrefsPartial({ layoutText: { ...style } });
  const active = getActiveLayoutItem();
  if (!active || active.type !== "text") return;
  active.textStyle = { ...style };
  renderLayoutItems();
}

function drawShapePlaceholder(ctx, item) {
  ctx.fillStyle = "rgba(255, 99, 71, 0.18)";
  ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
  ctx.lineWidth = 1.2;
  const cx = item.x + item.width / 2;
  const cy = item.y + item.height / 2;
  if (item.shapeKind === "ellipse") {
    ctx.beginPath();
    ctx.ellipse(cx, cy, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (item.shapeKind === "diamond") {
    ctx.beginPath();
    ctx.moveTo(cx, item.y);
    ctx.lineTo(item.x + item.width, cy);
    ctx.lineTo(cx, item.y + item.height);
    ctx.lineTo(item.x, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (item.shapeKind === "triangle") {
    ctx.beginPath();
    ctx.moveTo(cx, item.y);
    ctx.lineTo(item.x + item.width, item.y + item.height);
    ctx.lineTo(item.x, item.y + item.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (item.shapeKind === "capsule") {
    const r = Math.min(item.height / 2, item.width / 2);
    ctx.beginPath();
    ctx.moveTo(item.x + r, item.y);
    ctx.arcTo(item.x + item.width, item.y, item.x + item.width, item.y + item.height, r);
    ctx.arcTo(item.x + item.width, item.y + item.height, item.x, item.y + item.height, r);
    ctx.arcTo(item.x, item.y + item.height, item.x, item.y, r);
    ctx.arcTo(item.x, item.y, item.x + item.width, item.y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (item.shapeKind === "polygon") {
    const pts = getAbsoluteShapePolygonPoints(item);
    if (pts.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      return;
    }
  }
  ctx.fillRect(item.x, item.y, item.width, item.height);
  ctx.strokeRect(item.x, item.y, item.width, item.height);
}

function drawTextBlockPlaceholder(ctx, item) {
  ctx.fillStyle = "rgba(59, 130, 246, 0.14)";
  ctx.strokeStyle = "rgba(30, 64, 175, 0.9)";
  ctx.lineWidth = 1.2;
  ctx.fillRect(item.x, item.y, item.width, item.height);
  ctx.strokeRect(item.x, item.y, item.width, item.height);
  const ts = item.textStyle && typeof item.textStyle === "object" ? sanitizeTextStyle(item.textStyle) : null;
  const fontSize = ts ? clamp(Number(ts.fontSize) || 16, 10, 96) : 14;
  const padX = Math.max(6, Math.min(14, fontSize * 0.35));
  const padY = Math.max(6, Math.min(16, fontSize * 0.4));
  const xStart = item.x + padX;
  const xEnd = item.x + item.width - padX;
  const lineW = Math.max(1, xEnd - xStart);
  const lineGap = clamp(Math.round(fontSize * 0.55), 7, 28);
  const yTop = item.y + padY + fontSize * 0.72;
  ctx.save();
  ctx.strokeStyle = ts ? ts.color || "rgba(37, 99, 235, 0.75)" : "rgba(37, 99, 235, 0.75)";
  ctx.lineWidth = Math.max(1.2, fontSize * 0.065);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(xStart, yTop);
  ctx.lineTo(xEnd, yTop);
  ctx.moveTo(xStart, yTop + lineGap);
  ctx.lineTo(xStart + lineW * 0.92, yTop + lineGap);
  ctx.moveTo(xStart, yTop + lineGap * 2);
  ctx.lineTo(xStart + lineW * 0.82, yTop + lineGap * 2);
  ctx.stroke();
  ctx.restore();
}

async function loadImageBySrc(src) {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片资源加载失败"));
    img.src = src;
  });
}

async function exportLayoutImage() {
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = stage.width;
  canvas.height = stage.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    setStatus(tr("m_exportCtxFail"));
    return;
  }
  if (state.image && state.posterVisible) {
    ctx.drawImage(state.image, 0, 0, stage.width, stage.height);
  } else {
    ctx.fillStyle = state.canvasDraft?.background || "#ffffff";
    ctx.fillRect(0, 0, stage.width, stage.height);
  }
  if (state.grid && state.style && state.gridVisible) {
    drawGridOnContext(ctx, stage.width, stage.height, state.grid, state.style);
  }
  for (const item of getItemsForExport()) {
    ensureLayoutItemDefaults(item);
    if (!item.visible) continue;
    if (item.type === "text") {
      const style = sanitizeTextStyle(item.textStyle);
      ctx.save();
      ctx.globalAlpha = clamp(item.opacity, 0, 1);
      ctx.fillStyle = style.color;
      ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
      ctx.textBaseline = "top";
      const lines = String(item.text || "").split("\n");
      lines.forEach((line, idx) => {
        const lineGap = style.fontSize * 1.25;
        ctx.fillText(line, item.x + 6, item.y + 6 + idx * lineGap);
      });
      ctx.restore();
      continue;
    }
    if (item.type === "image" && item.src) {
      try {
        const img = await loadImageBySrc(item.src);
        ctx.save();
        ctx.globalAlpha = clamp(item.opacity, 0, 1);
        ctx.drawImage(img, item.x, item.y, item.width, item.height);
        ctx.restore();
      } catch {
        // Ignore broken layout image blocks during export.
      }
    }
    if (item.type === "shape") {
      ctx.save();
      ctx.globalAlpha = clamp(item.opacity, 0, 1);
      drawShapePlaceholder(ctx, item);
      ctx.restore();
      continue;
    }
    if (item.type === "textBlock") {
      ctx.save();
      ctx.globalAlpha = clamp(item.opacity, 0, 1);
      drawTextBlockPlaceholder(ctx, item);
      ctx.restore();
      continue;
    }
  }
  const fileBase = (el.posterNameInput?.value || state.imageName || "layout-canvas")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .slice(0, 48) || "layout-canvas";
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${fileBase}.png`;
  link.click();
  setStatus(tr("m_exportLayoutOk"));
  showToast(tr("m_toastLayoutPng"));
}

function exportGridPng() {
  const stage = getStageSize();
  if (!stage || !state.grid || !state.style) {
    setStatus(tr("m_needGridExport"));
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = stage.width;
  canvas.height = stage.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    setStatus(tr("m_exportGridCtxFail"));
    return;
  }
  drawGridOnContext(ctx, stage.width, stage.height, state.grid, state.style);
  const fileBase = (el.posterNameInput?.value || state.imageName || "grid")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .slice(0, 48) || "grid";
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${fileBase}-grid.png`;
  link.click();
  setStatus(tr("m_exportGridOk"));
  showToast(tr("m_toastGridPng"));
}

async function exportLayoutAsPsd() {
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  let agpsd;
  try {
    agpsd = await import("https://cdn.jsdelivr.net/npm/ag-psd@26.3.1/+esm");
  } catch (error) {
    console.error(error);
    setStatus(tr("m_psdLoadFail"));
    return;
  }
  const { writePsd } = agpsd || {};
  if (typeof writePsd !== "function") {
    setStatus(tr("m_psdModuleFail"));
    return;
  }
  const children = [];
  const pushLayer = (name, drawFn, visible = true, opacity = 1) => {
    const canvas = document.createElement("canvas");
    canvas.width = stage.width;
    canvas.height = stage.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawFn(ctx);
    children.push({
      name,
      canvas,
      left: 0,
      top: 0,
      right: stage.width,
      bottom: stage.height,
      hidden: !visible,
      opacity: Math.round(clamp(opacity, 0, 1) * 255),
    });
  };
  pushLayer("背景", (ctx) => {
    if (state.image && state.posterVisible) {
      ctx.drawImage(state.image, 0, 0, stage.width, stage.height);
    } else {
      ctx.fillStyle = state.canvasDraft?.background || "#ffffff";
      ctx.fillRect(0, 0, stage.width, stage.height);
    }
  }, true, 1);
  if (state.grid && state.style && state.gridVisible) {
    pushLayer("网格", (ctx) => {
      drawGridOnContext(ctx, stage.width, stage.height, state.grid, state.style);
    }, true, 1);
  }
  for (const item of getItemsForExport()) {
    ensureLayoutItemDefaults(item);
    let loadedImg = null;
    if (item.type === "image" && item.src) {
      try {
        loadedImg = await loadImageBySrc(item.src);
      } catch {
        loadedImg = null;
      }
    }
    pushLayer(item.name || "图层", (ctx) => {
      ctx.globalAlpha = clamp(item.opacity, 0, 1);
      if (item.type === "text") {
        const style = sanitizeTextStyle(item.textStyle);
        ctx.fillStyle = style.color;
        ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
        ctx.textBaseline = "top";
        const lines = String(item.text || "").split("\n");
        const lineGap = style.fontSize * 1.25;
        lines.forEach((line, idx) => {
          ctx.fillText(line, item.x + 6, item.y + 6 + idx * lineGap);
        });
      } else if (item.type === "image" && loadedImg) {
        ctx.drawImage(loadedImg, item.x, item.y, item.width, item.height);
      } else if (item.type === "shape") {
        drawShapePlaceholder(ctx, item);
      } else if (item.type === "textBlock") {
        drawTextBlockPlaceholder(ctx, item);
      }
    }, item.visible, item.opacity);
  }
  const psd = {
    width: stage.width,
    height: stage.height,
    children,
  };
  let buffer;
  try {
    buffer = writePsd(psd);
  } catch (error) {
    console.error(error);
    setStatus(tr("m_psdEncodeFail"));
    return;
  }
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const fileBase = (el.posterNameInput?.value || state.imageName || "layout")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .slice(0, 48) || "layout";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileBase}.psd`;
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus(tr("m_psdOk"));
  showToast(tr("m_toastPsd"));
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildLayoutSvg() {
  const stage = getStageSize();
  if (!stage) return "";
  const pieces = [];
  pieces.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}">`,
  );
  if (state.image && state.posterVisible) {
    pieces.push(`<image href="${state.imageDataUrl}" x="0" y="0" width="${stage.width}" height="${stage.height}" />`);
  } else {
    const bg = state.canvasDraft?.background || "#ffffff";
    pieces.push(`<rect x="0" y="0" width="${stage.width}" height="${stage.height}" fill="${bg}" />`);
  }
  for (const item of getItemsForExport()) {
    ensureLayoutItemDefaults(item);
    if (!item.visible) continue;
    const opacity = clamp(item.opacity, 0, 1);
    if (item.type === "image" && item.src) {
      pieces.push(
        `<image href="${item.src}" x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" opacity="${opacity}" />`,
      );
      continue;
    }
    if (item.type === "text") {
      const style = sanitizeTextStyle(item.textStyle);
      const lines = String(item.text || "").split("\n");
      const lineGap = style.fontSize * 1.25;
      lines.forEach((line, idx) => {
        const y = item.y + 6 + idx * lineGap + style.fontSize;
        pieces.push(
          `<text x="${item.x + 6}" y="${y}" font-family="${escapeXml(style.fontFamily)}" font-size="${style.fontSize}" font-weight="${style.fontWeight}" fill="${style.color}" opacity="${opacity}">${escapeXml(line)}</text>`,
        );
      });
      continue;
    }
    if (item.type === "shape") {
      const fill = "rgba(255, 99, 71, 0.18)";
      const stroke = "rgba(239, 68, 68, 0.9)";
      if (item.shapeKind === "ellipse") {
        pieces.push(
          `<ellipse cx="${item.x + item.width / 2}" cy="${item.y + item.height / 2}" rx="${item.width / 2}" ry="${item.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
        );
      } else if (item.shapeKind === "diamond") {
        const p1 = `${item.x + item.width / 2},${item.y}`;
        const p2 = `${item.x + item.width},${item.y + item.height / 2}`;
        const p3 = `${item.x + item.width / 2},${item.y + item.height}`;
        const p4 = `${item.x},${item.y + item.height / 2}`;
        pieces.push(
          `<polygon points="${p1} ${p2} ${p3} ${p4}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
        );
      } else if (item.shapeKind === "triangle") {
        const p1 = `${item.x + item.width / 2},${item.y}`;
        const p2 = `${item.x + item.width},${item.y + item.height}`;
        const p3 = `${item.x},${item.y + item.height}`;
        pieces.push(
          `<polygon points="${p1} ${p2} ${p3}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
        );
      } else if (item.shapeKind === "capsule") {
        const rx = Math.min(item.width / 2, item.height / 2);
        pieces.push(
          `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
        );
      } else if (item.shapeKind === "polygon") {
        const pts = getAbsoluteShapePolygonPoints(item);
        if (pts.length >= 3) {
          const pointStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
          pieces.push(
            `<polygon points="${pointStr}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
          );
        } else {
          pieces.push(
            `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
          );
        }
      } else {
        pieces.push(
          `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="${opacity}" />`,
        );
      }
      continue;
    }
    if (item.type === "textBlock") {
      pieces.push(
        `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="rgba(59,130,246,0.14)" stroke="rgba(30,64,175,0.9)" stroke-width="1.2" opacity="${opacity}" />`,
      );
      const xStart = item.x + 7;
      const xEnd = item.x + item.width - 7;
      const lineW = Math.max(1, xEnd - xStart);
      const yTop = item.y + 9;
      pieces.push(`<line x1="${xStart}" y1="${yTop}" x2="${xEnd}" y2="${yTop}" stroke="rgba(37,99,235,0.7)" stroke-width="2" opacity="${opacity}" />`);
      pieces.push(`<line x1="${xStart}" y1="${yTop + 8}" x2="${xStart + lineW * 0.92}" y2="${yTop + 8}" stroke="rgba(37,99,235,0.55)" stroke-width="2" opacity="${opacity}" />`);
      pieces.push(`<line x1="${xStart}" y1="${yTop + 16}" x2="${xStart + lineW * 0.85}" y2="${yTop + 16}" stroke="rgba(37,99,235,0.4)" stroke-width="2" opacity="${opacity}" />`);
      continue;
    }
  }
  pieces.push("</svg>");
  return pieces.join("");
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function exportLayoutAsSvg() {
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  const svg = buildLayoutSvg();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const fileBase = (el.posterNameInput?.value || state.imageName || "layout")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .slice(0, 48) || "layout";
  downloadBlob(blob, `${fileBase}.svg`);
  setStatus(tr("m_svgOk"));
  showToast(tr("m_toastSvg"));
}

function buildIdmlRectPath(x, y, w, h) {
  return `
      <PathPointArray>
        <PathPoint Anchor="${x} ${y}" LeftDirection="${x} ${y}" RightDirection="${x} ${y}"/>
        <PathPoint Anchor="${x + w} ${y}" LeftDirection="${x + w} ${y}" RightDirection="${x + w} ${y}"/>
        <PathPoint Anchor="${x + w} ${y + h}" LeftDirection="${x + w} ${y + h}" RightDirection="${x + w} ${y + h}"/>
        <PathPoint Anchor="${x} ${y + h}" LeftDirection="${x} ${y + h}" RightDirection="${x} ${y + h}"/>
      </PathPointArray>`;
}

async function exportLayoutAsIdml() {
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  let JSZipCtor;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm");
    JSZipCtor = mod.default;
  } catch (error) {
    console.error(error);
    setStatus(tr("m_idmlLoadFail"));
    return;
  }
  const zip = new JSZipCtor();
  zip.file("mimetype", "application/vnd.adobe.indesign-idml-package", { compression: "STORE" });
  zip.folder("META-INF")?.file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="designmap.xml" media-type="application/vnd.adobe.indesign-idml-package+xml"/>
  </rootfiles>
</container>`,
  );
  const stories = [];
  const textFrames = [];
  let storyCount = 0;
  let frameCount = 0;
  for (const item of state.layoutItems) {
    ensureLayoutItemDefaults(item);
    if (!item.visible) continue;
    if (item.type !== "text") continue;
    storyCount += 1;
    frameCount += 1;
    const storyId = `uStory${storyCount}`;
    const frameId = `uTf${frameCount}`;
    const text = escapeXml(String(item.text || ""));
    const storyFile = `Stories/Story_${storyId}.xml`;
    zip.folder("Stories")?.file(
      `Story_${storyId}.xml`,
      `<?xml version="1.0" encoding="UTF-8"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="17.0">
  <Story Self="${storyId}">
    <Content>${text}</Content>
  </Story>
</idPkg:Story>`,
    );
    stories.push(storyFile);
    textFrames.push(`
    <TextFrame Self="${frameId}" ParentStory="${storyId}" ContentType="TextType">
      <Properties>
        <PathGeometry>
          <GeometryPath PathOpen="false">
${buildIdmlRectPath(item.x, item.y, item.width, item.height)}
          </GeometryPath>
        </PathGeometry>
      </Properties>
    </TextFrame>`);
  }
  zip.folder("Spreads")?.file(
    "Spread_u1.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<idPkg:Spread xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="17.0">
  <Spread Self="u1" PageCount="1">
    <Page Self="uPage1" Name="1">
      <Properties>
        <GeometricBounds>0 0 ${stage.height} ${stage.width}</GeometricBounds>
      </Properties>
    </Page>
${textFrames.join("\n")}
  </Spread>
</idPkg:Spread>`,
  );
  const designMapRefs = [
    `<idPkg:Spread src="Spreads/Spread_u1.xml"/>`,
    ...stories.map((src) => `<idPkg:Story src="${src}"/>`),
  ].join("\n  ");
  zip.file(
    "designmap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<?aid style="50" type="document" readerVersion="6.0" featureSet="257"?>
<Document xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="17.0" Self="d">
  ${designMapRefs}
</Document>`,
  );
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const fileBase = (el.posterNameInput?.value || state.imageName || "layout")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .slice(0, 48) || "layout";
  downloadBlob(blob, `${fileBase}.idml`);
  setStatus(tr("m_idmlOk"));
  showToast(tr("m_toastIdml"));
}

function loadUIPrefs() {
  try {
    return JSON.parse(localStorage.getItem(UI_PREFS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUIPrefsPartial(partial) {
  const cur = loadUIPrefs();
  Object.assign(cur, partial);
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(cur));
  } catch (error) {
    console.error("saveUIPrefsPartial failed:", error);
  }
}

function saveStylePrefsFromState() {
  if (!state.style) return;
  saveUIPrefsPartial({
    style: {
      color: state.style.color,
      alpha: state.style.alpha,
      dash: state.style.dash,
      gap: state.style.gap,
      lineWidth: state.style.lineWidth,
    },
  });
}

const saveStylePrefsDebounced = debounce(saveStylePrefsFromState, 450);

const saveFormDraftDebounced = debounce(() => {
  if (!el.posterNameInput || !el.posterTagsInput) return;
  sessionStorage.setItem(
    FORM_DRAFT_KEY,
    JSON.stringify({
      name: el.posterNameInput.value,
      tags: el.posterTagsInput.value,
    }),
  );
}, 350);

let toastTimer = null;
function showToast(message, duration = 2200) {
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

function setStatus(text) {
  // #region agent log
  if (state.locale === "en" && /[\u4e00-\u9fff]/.test(String(text))) {
    fetch("http://127.0.0.1:7878/ingest/69092420-af50-4cb2-9a7c-3ba688b9df71", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "2598c1" },
      body: JSON.stringify({
        sessionId: "2598c1",
        location: "app.js:setStatus",
        message: "Chinese status while locale en",
        data: { preview: String(text).slice(0, 200) },
        timestamp: Date.now(),
        hypothesisId: "H3-hardcoded-setStatus",
      }),
    }).catch(() => {});
  }
  // #endregion
  el.statusText.textContent = text;
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((sum, n) => sum + n, 0) / arr.length;
}

function deviation(arr, meanValue = average(arr)) {
  if (!arr.length) return 0;
  const variance = arr.reduce((sum, n) => {
    const d = n - meanValue;
    return sum + d * d;
  }, 0) / arr.length;
  return Math.sqrt(variance);
}

function smoothSignal(values, size = 11) {
  const half = Math.floor(size / 2);
  const out = new Array(values.length);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = i - half; j <= i + half; j++) {
      if (j < 0 || j >= values.length) continue;
      sum += values[j];
      count += 1;
    }
    out[i] = count ? sum / count : values[i];
  }
  return out;
}

function findPeaks(values, threshold, minDistance) {
  const peaks = [];
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] < threshold) continue;
    if (values[i] >= values[i - 1] && values[i] >= values[i + 1]) peaks.push(i);
  }
  if (!peaks.length) return [];

  const filtered = [peaks[0]];
  for (let i = 1; i < peaks.length; i++) {
    const prev = filtered[filtered.length - 1];
    if (peaks[i] - prev >= minDistance) {
      filtered.push(peaks[i]);
    } else if (values[peaks[i]] > values[prev]) {
      filtered[filtered.length - 1] = peaks[i];
    }
  }
  return filtered;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function estimateAxis(peaks, axisLength, fallbackCount) {
  if (peaks.length < 3) {
    const m = Math.round(axisLength * 0.08);
    return {
      marginStart: m,
      marginEnd: m,
      count: fallbackCount,
      module: (axisLength - 2 * m) / fallbackCount,
      confidence: 0.25,
    };
  }

  const gaps = [];
  for (let i = 1; i < peaks.length; i++) gaps.push(peaks[i] - peaks[i - 1]);
  const module = Math.max(1, median(gaps));
  const marginStart = clamp(peaks[0], 8, axisLength * 0.45);
  const marginEnd = clamp(axisLength - peaks[peaks.length - 1], 8, axisLength * 0.45);
  const count = clamp(Math.round((axisLength - marginStart - marginEnd) / module), 2, 36);
  const confidence = clamp(0.26 + peaks.length * 0.045, 0.28, 0.96);
  return { marginStart, marginEnd, count, module, confidence };
}

function estimateAxisByPeriod(signal, axisLength, fallbackCount) {
  const mean = average(signal);
  const normalized = signal.map((v) => v - mean);
  const energy = normalized.reduce((sum, v) => sum + v * v, 0) || 1;
  const minLag = Math.max(3, Math.floor(axisLength / 72));
  const maxLag = Math.min(320, Math.floor(axisLength / 2.2));

  let bestLag = 0;
  let bestCorr = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < normalized.length - lag; i++) {
      corr += normalized[i] * normalized[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  if (!bestLag) return estimateAxis([], axisLength, fallbackCount);

  let bestPhase = 0;
  let bestPhaseScore = -Infinity;
  for (let phase = 0; phase < bestLag; phase++) {
    let score = 0;
    for (let x = phase; x < axisLength; x += bestLag) score += signal[x] || 0;
    if (score > bestPhaseScore) {
      bestPhaseScore = score;
      bestPhase = phase;
    }
  }

  const lines = [];
  let first = bestPhase;
  while (first - bestLag >= 0) first -= bestLag;
  for (let x = first; x < axisLength; x += bestLag) {
    if (x >= 0 && x < axisLength) lines.push(x);
  }

  if (lines.length < 3) return estimateAxis([], axisLength, fallbackCount);

  const marginStart = clamp(lines[0], 8, axisLength * 0.45);
  const marginEnd = clamp(axisLength - lines[lines.length - 1], 8, axisLength * 0.45);
  const count = clamp(lines.length - 1, 2, 36);
  const confidence = clamp((bestCorr / energy) * 4, 0.2, 0.9);
  return {
    marginStart,
    marginEnd,
    count,
    module: bestLag,
    confidence,
  };
}

function axisModelScore(model, axisLength) {
  const content = axisLength - model.marginStart - model.marginEnd;
  if (content <= 0) return -1;

  let score = model.confidence || 0;
  const contentRatio = content / axisLength;
  if (contentRatio < 0.26 || contentRatio > 0.96) score -= 0.22;
  if (model.count < 2 || model.count > 36) score -= 0.18;
  if (model.module < axisLength / 140 || model.module > axisLength / 1.9) score -= 0.2;
  return score;
}

function pickAxisModel(signal, peaksModel, axisLength, fallbackCount) {
  const periodModel = estimateAxisByPeriod(signal, axisLength, fallbackCount);
  const peakScore = axisModelScore(peaksModel, axisLength);
  const periodScore = axisModelScore(periodModel, axisLength);
  if (periodScore > peakScore + 0.03) return periodModel;
  return peaksModel;
}

function otsuThreshold(gray) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < gray.length; i++) {
    const v = clamp(Math.round(gray[i]), 0, 255);
    hist[v] += 1;
  }
  const total = gray.length;
  let sumAll = 0;
  for (let i = 0; i < 256; i++) sumAll += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let bestVar = -1;
  let threshold = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > bestVar) {
      bestVar = between;
      threshold = t;
    }
  }
  return threshold;
}

function buildBinaryMask(gray, width, height, threshold, invert = false) {
  const mask = new Uint8Array(width * height);
  let count = 0;
  for (let i = 0; i < gray.length; i++) {
    const hit = invert ? gray[i] > threshold : gray[i] < threshold;
    if (hit) {
      mask[i] = 1;
      count += 1;
    }
  }
  return { mask, count };
}

function boundingBoxFromMask(mask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let count = 0;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      if (!mask[row + x]) continue;
      count += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (count === 0) return null;
  return { minX, minY, maxX, maxY, count };
}

function detectFigureGroundFrame(gray, width, height) {
  const threshold = otsuThreshold(gray);
  const direct = buildBinaryMask(gray, width, height, threshold, false);
  const inverted = buildBinaryMask(gray, width, height, threshold, true);
  const total = width * height;
  const pickDirect =
    Math.abs(direct.count / total - 0.5) <= Math.abs(inverted.count / total - 0.5);
  const selected = pickDirect ? direct : inverted;
  const bbox = boundingBoxFromMask(selected.mask, width, height);
  if (!bbox) {
    return {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      confidence: 0.1,
      source: "figure-ground-fallback",
    };
  }

  const boxW = bbox.maxX - bbox.minX + 1;
  const boxH = bbox.maxY - bbox.minY + 1;
  const boxAreaRatio = (boxW * boxH) / total;
  if (boxAreaRatio < 0.12 || boxAreaRatio > 0.98) {
    return {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      confidence: 0.18,
      source: "figure-ground-weak",
    };
  }

  const marginLeft = clamp(bbox.minX, 0, width * 0.45);
  const marginRight = clamp(width - 1 - bbox.maxX, 0, width * 0.45);
  const marginTop = clamp(bbox.minY, 0, height * 0.45);
  const marginBottom = clamp(height - 1 - bbox.maxY, 0, height * 0.45);
  const compactness = bbox.count / Math.max(1, boxW * boxH);
  const confidence = clamp(0.2 + compactness * 0.5 + (1 - Math.abs(0.5 - boxAreaRatio)), 0.22, 0.88);
  return {
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    confidence,
    source: "figure-ground",
  };
}

function createDefaultGrid(width, height) {
  const marginX = Math.round(width * 0.08);
  const marginY = Math.round(height * 0.08);
  const cols = 12;
  const rows = 12;
  return {
    cols,
    rows,
    angle: 0,
    marginLeft: marginX,
    marginRight: marginX,
    marginTop: marginY,
    marginBottom: marginY,
    moduleX: (width - marginX * 2) / cols,
    moduleY: (height - marginY * 2) / rows,
    confidence: 0.4,
    source: "default",
  };
}

/**
 * 将当前列/行下的网格区贴合整张海报：在画布内做「列:行」比例的最大内接矩形，
 * 使单元格为正方形（moduleX === moduleY），并与画幅长宽比例一致、四边留白对称。
 */
function fitGridProportionsToPoster(grid, width, height) {
  if (!grid || width <= 0 || height <= 0) return grid;
  const cols = clamp(Math.round(grid.cols), 2, 36);
  const rows = clamp(Math.round(grid.rows), 2, 36);
  const R = cols / rows;
  const innerIfFullH = R * height;
  let ml;
  let mr;
  let mt;
  let mb;
  if (innerIfFullH <= width) {
    const innerW = innerIfFullH;
    const innerH = height;
    const side = (width - innerW) / 2;
    ml = side;
    mr = width - innerW - side;
    mt = 0;
    mb = 0;
  } else {
    const innerW = width;
    const innerH = width / R;
    const side = (height - innerH) / 2;
    ml = 0;
    mr = 0;
    mt = side;
    mb = height - innerH - side;
  }
  ml = clamp(Math.round(ml), 0, width - 1);
  mr = clamp(Math.round(mr), 0, width - 1);
  mt = clamp(Math.round(mt), 0, height - 1);
  mb = clamp(Math.round(mb), 0, height - 1);
  const innerW = width - ml - mr;
  const innerH = height - mt - mb;
  if (innerW < cols || innerH < rows) {
    return { ...grid, cols, rows };
  }
  const moduleX = innerW / cols;
  const moduleY = innerH / rows;
  return {
    ...grid,
    cols,
    rows,
    marginLeft: ml,
    marginRight: mr,
    marginTop: mt,
    marginBottom: mb,
    moduleX,
    moduleY,
    fitMode: "poster-inscribed",
  };
}

function createDefaultStyle() {
  const p = loadUIPrefs().style;
  return {
    color: typeof p?.color === "string" ? p.color : "#2ec5ff",
    alpha: typeof p?.alpha === "number" ? clamp(p.alpha, 0.1, 1) : 0.8,
    dash: typeof p?.dash === "number" ? clamp(p.dash, 2, 30) : 8,
    gap: typeof p?.gap === "number" ? clamp(p.gap, 2, 30) : 6,
    lineWidth: typeof p?.lineWidth === "number" ? clamp(p.lineWidth, 0.5, 6) : 1.5,
  };
}

function updateSaveButtonState() {
  if (!el.savePosterBtn) return;
  el.savePosterBtn.disabled = !(state.image && state.grid);
}

function updateConfirmButtonState() {
  if (!el.confirmGridBtn) return;
  el.confirmGridBtn.disabled = !(stageExists() && state.grid);
}

function markGridUnconfirmed() {
  state.gridConfirmed = false;
  state.confirmedGrid = null;
  updateSaveButtonState();
}

function hexToRgba(hex, alpha) {
  const v = hex.replace("#", "");
  const s = v.length === 3 ? v.split("").map((n) => n + n).join("") : v;
  const num = Number.parseInt(s, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToCmykPercent(r, g, b) {
  const rp = r / 255;
  const gp = g / 255;
  const bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  if (k >= 1 - 1e-9) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const inv = 1 / (1 - k);
  const c = ((1 - rp - k) * inv) * 100;
  const m = ((1 - gp - k) * inv) * 100;
  const y = ((1 - bp - k) * inv) * 100;
  return {
    c: clamp(c, 0, 100),
    m: clamp(m, 0, 100),
    y: clamp(y, 0, 100),
    k: clamp(k * 100, 0, 100),
  };
}

function colorDistanceSq(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function kMeansRgb(pixels, k, iterations = 12) {
  if (!pixels.length) return [];
  const centroids = [];
  const used = new Set();
  let guard = 0;
  while (centroids.length < k && centroids.length < pixels.length && guard < pixels.length * 4) {
    guard += 1;
    const idx = Math.floor(Math.random() * pixels.length);
    if (used.has(idx)) continue;
    used.add(idx);
    centroids.push(pixels[idx].slice());
  }
  if (!centroids.length) return [];
  const assignments = new Uint16Array(pixels.length);
  for (let it = 0; it < iterations; it++) {
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const d = colorDistanceSq(pixels[i], centroids[j]);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }
    const sums = centroids.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3] += 1;
    }
    for (let j = 0; j < centroids.length; j++) {
      const n = sums[j][3];
      if (n > 0) {
        centroids[j][0] = sums[j][0] / n;
        centroids[j][1] = sums[j][1] / n;
        centroids[j][2] = sums[j][2] / n;
      }
    }
    if (!changed && it > 2) break;
  }
  const counts = new Array(centroids.length).fill(0);
  for (let i = 0; i < pixels.length; i++) {
    counts[assignments[i]] += 1;
  }
  const out = centroids.map((rgb, i) => ({
    r: Math.round(clamp(rgb[0], 0, 255)),
    g: Math.round(clamp(rgb[1], 0, 255)),
    b: Math.round(clamp(rgb[2], 0, 255)),
    weight: counts[i] / pixels.length,
  }));
  /* 按聚类像素占比降序，与海报中颜色面积比例一致（采样近似全图） */
  out.sort((a, b) => b.weight - a.weight);
  return out;
}

const PALETTE_MAX_COLORS = 14;

function extractPaletteFromImage(image, k = PALETTE_MAX_COLORS) {
  const maxSide = 420;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const w = Math.max(8, Math.round(image.width * scale));
  const h = Math.max(8, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const pixels = [];
  const target = 4500;
  const step = Math.max(1, Math.floor((w * h) / target));
  for (let i = 0; i < data.length; i += 4 * step) {
    const a = data[i + 3];
    if (a < 8) continue;
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  if (pixels.length < 8) return [];
  const kClamped = clamp(Math.round(k), 1, PALETTE_MAX_COLORS);
  const clusters = Math.min(kClamped, pixels.length);
  return kMeansRgb(pixels, clusters);
}

function formatCmykLine(cmyk) {
  const fmt = (n) => {
    const t = n.toFixed(1);
    return t.endsWith(".0") ? t.slice(0, -2) : t;
  };
  return `CMYK ${fmt(cmyk.c)}% / ${fmt(cmyk.m)}% / ${fmt(cmyk.y)}% / ${fmt(cmyk.k)}%`;
}

function renderColorPalette() {
  if (!el.colorPaletteEmpty || !el.colorPaletteGrid) return;
  if (!state.image) {
    el.colorPaletteEmpty.textContent = tr("colorEmpty");
    el.colorPaletteEmpty.hidden = false;
    el.colorPaletteGrid.hidden = true;
    el.colorPaletteGrid.innerHTML = "";
    return;
  }
  const palette = extractPaletteFromImage(state.image, PALETTE_MAX_COLORS);
  if (!palette.length) {
    el.colorPaletteEmpty.textContent = tr("m_colorPaletteFail");
    el.colorPaletteEmpty.hidden = false;
    el.colorPaletteGrid.hidden = true;
    return;
  }
  el.colorPaletteEmpty.hidden = true;
  el.colorPaletteGrid.hidden = false;
  el.colorPaletteGrid.innerHTML = "";
  palette.forEach((entry) => {
    const { r, g, b, weight } = entry;
    const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
    const cmyk = rgbToCmykPercent(r, g, b);
    const card = document.createElement("article");
    card.className = "color-swatch-card";
    card.dataset.hex = hex.toUpperCase();
    card.title = tr("m_copyHex");
    card.innerHTML = `
      <div class="swatch" style="background:${hex}"></div>
      <div class="swatch-meta">
        <strong>${hex.toUpperCase()}</strong>
        <code>RGB(${r}, ${g}, ${b})<br/>${formatCmykLine(cmyk)}<br/>占比约 ${(weight * 100).toFixed(1)}%</code>
      </div>
    `;
    el.colorPaletteGrid.appendChild(card);
  });
}

function clearColorPalette() {
  if (!el.colorPaletteEmpty || !el.colorPaletteGrid) return;
  el.colorPaletteEmpty.textContent = tr("colorEmpty");
  el.colorPaletteEmpty.hidden = false;
  el.colorPaletteGrid.hidden = true;
  el.colorPaletteGrid.innerHTML = "";
  clearGraphicsSemantics();
}

/** 寓意词条库：关键词 + 简要寓意，供检索与自动关联 */
const SEMANTICS_DB = [
  { keyword: "留白", meaning: "大面积未铺满区域可突出主体、减轻压迫，常显克制与高级感。", hints: ["简约", "呼吸", "主体"] },
  { keyword: "对称", meaning: "左右或上下呼应易传达稳定、庄重与秩序感。", hints: ["平衡", "秩序", "正式"] },
  { keyword: "非对称", meaning: "刻意打破对称可制造动感、张力或视觉趣味。", hints: ["动感", "张力", "重心"] },
  { keyword: "横线", meaning: "横向延展常与稳定、地平线、并列信息相关联。", hints: ["稳定", "开阔", "横版"] },
  { keyword: "竖线", meaning: "纵向线条易联想上升、挺拔、时间或层级递进。", hints: ["上升", "叙事", "竖版"] },
  { keyword: "视觉重心", meaning: "视线停留的优先区域，决定信息层级与情绪落点。", hints: ["主体", "层级", "焦点"] },
  { keyword: "对比", meaning: "明暗或色彩对比强时，可读性与冲击力通常更高。", hints: ["层次", "细节", "醒目"] },
  { keyword: "简约", meaning: "元素少而精时，信息更聚焦，品牌感常更干净。", hints: ["留白", "大块面", "现代"] },
  { keyword: "层次", meaning: "前后景与灰阶变化丰富时，空间感与可读性往往更好。", hints: ["细节", "纵深", "丰富"] },
  { keyword: "暖色", meaning: "红橙黄系易传递热情、食欲、节庆或亲和力。", hints: ["节庆", "亲和", "温度"] },
  { keyword: "冷色", meaning: "蓝绿紫系易显理性、科技、清凉或距离感。", hints: ["科技", "冷静", "专业"] },
  { keyword: "横版", meaning: "宽幅画幅适合横向叙事、多栏信息与场景铺陈。", hints: ["场景", "并列", "开阔"] },
  { keyword: "竖版", meaning: "窄长画幅利于纵向引导、人物全身与移动端阅读。", hints: ["人物", "层级", "手机"] },
  { keyword: "圆形", meaning: "圆形或弧线常象征完整、聚焦、包容或徽章感。", hints: ["聚焦", "团圆", "徽章"] },
  { keyword: "三角", meaning: "三角形结构易形成指向、稳定或警示的视觉暗示。", hints: ["指向", "稳定", "警示"] },
  { keyword: "动感", meaning: "斜线、错位与强弱对比可强化速度与能量感。", hints: ["斜线", "张力", "体育"] },
  { keyword: "稳定", meaning: "水平与均衡构图常传达可靠、安全与长期价值。", hints: ["横线", "对称", "金融"] },
  { keyword: "品牌色", meaning: "主色高度统一时，识别度与记忆点往往更强。", hints: ["主色", "统一", "识别"] },
  { keyword: "渐变", meaning: "柔和过渡可表现光影、空间或情绪变化（识别为色彩层次时）。", hints: ["光影", "空间", "柔和"] },
  { keyword: "文字主导", meaning: "标题字显著时，信息传达直接，适合促销与公告类海报。", hints: ["标题", "促销", "公告"] },
  { keyword: "图形主导", meaning: "插画或符号突出时，情绪与象征更强，适合品牌与活动主视觉。", hints: ["插画", "符号", "主视觉"] },
  { keyword: "高饱和", meaning: "色彩鲜艳易抓眼，适合引流与节庆，但长时间观看易疲劳。", hints: ["醒目", "节庆", "引流"] },
  { keyword: "低饱和", meaning: "灰调或莫兰迪系常显克制、文艺与高端质感。", hints: ["文艺", "高端", "克制"] },
  { keyword: "居中", meaning: "主体居中时，仪式感与对称美较强，适合官宣与主标题。", hints: ["对称", "仪式", "主标题"] },
  { keyword: "黄金分割", meaning: "主体偏离几何中心时，常更符合自然视线习惯与动感。", hints: ["三分法", "动感", "摄影"] },
];

function analyzeGraphicsFeatures(image) {
  const maxSide = 256;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const w = Math.max(16, Math.round(image.width * scale));
  const h = Math.max(16, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const gray = new Float32Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  let hGradSum = 0;
  let vGradSum = 0;
  let cx = 0;
  let cy = 0;
  let cW = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const gx = gray[idx + 1] - gray[idx - 1];
      const gy = gray[idx + w] - gray[idx - w];
      const mag = Math.hypot(gx, gy);
      hGradSum += Math.abs(gx) * mag;
      vGradSum += Math.abs(gy) * mag;
      cx += x * mag;
      cy += y * mag;
      cW += mag;
    }
  }
  const hRatio = hGradSum / (hGradSum + vGradSum + 1e-6);
  let edgeLean = "横纵线条能量较均衡，结构感相对中性。";
  if (hRatio > 0.58) edgeLean = "横向结构能量较强，易显稳定、开阔或并列关系。";
  else if (hRatio < 0.42) edgeLean = "纵向结构能量较强，易有上升、挺拔或层级递进感。";

  const centerX = w / 2;
  const centerY = h / 2;
  const focusX = cW > 1e-6 ? cx / cW : centerX;
  const focusY = cW > 1e-6 ? cy / cW : centerY;
  const dx = (focusX - centerX) / (w / 2);
  const dy = (focusY - centerY) / (h / 2);
  let gravity = "边缘对比能量的重心接近画面几何中心。";
  if (Math.abs(dx) > 0.12 || Math.abs(dy) > 0.12) {
    const parts = [];
    if (dy < -0.1) parts.push("偏上");
    if (dy > 0.1) parts.push("偏下");
    if (dx < -0.1) parts.push("偏左");
    if (dx > 0.1) parts.push("偏右");
    gravity = `强对比能量的重心${parts.join("、")}，主体或视觉焦点可能偏向该区域。`;
  }

  const margin = Math.round(Math.min(w, h) * 0.15);
  let sum = 0;
  let sum2 = 0;
  let n = 0;
  for (let y = margin; y < h - margin; y++) {
    for (let x = margin; x < w - margin; x++) {
      const g = gray[y * w + x];
      sum += g;
      sum2 += g * g;
      n += 1;
    }
  }
  const mean = sum / Math.max(1, n);
  const std = Math.sqrt(Math.max(0, sum2 / Math.max(1, n) - mean * mean));
  let texture = "画面中部明暗层次适中。";
  if (std < 35) texture = "中部区域明暗变化较平缓，大块面或留白可能较明显。";
  else if (std > 65) texture = "中部区域明暗层次丰富，细节与对比可能较多。";

  const ar = image.width / image.height;
  let canvasShape = "画幅接近方形，构图易均衡、向心。";
  if (ar > 1.35) canvasShape = "横向画幅，适合横向叙事、场景展开或多栏信息。";
  else if (ar < 0.75) canvasShape = "竖向画幅，适合人物、层级引导或移动端阅读。";

  const tags = [];
  if (hRatio > 0.55) tags.push("横线", "稳定");
  if (hRatio < 0.45) tags.push("竖线", "上升");
  if (std < 38) tags.push("留白", "简约");
  if (std > 62) tags.push("层次", "对比");
  if (Math.abs(dx) > 0.12 || Math.abs(dy) > 0.12) tags.push("非对称", "视觉重心");
  if (ar > 1.3) tags.push("横版");
  if (ar < 0.78) tags.push("竖版");

  const gravityOff = Math.max(Math.abs(dx), Math.abs(dy));

  return {
    lines: [canvasShape, edgeLean, gravity, texture],
    tags: [...new Set(tags)],
    metrics: { hRatio, grayStd: std, ar, gravityOff },
  };
}

function paletteColorMood(palette) {
  if (!palette.length) {
    return { label: "冷暖较平衡", warmScore: 0.5, coolScore: 0.5 };
  }
  let warm = 0;
  let cool = 0;
  for (const p of palette) {
    const { r, g, b, weight } = p;
    const t = (r - b) * weight;
    if (t > 6) warm += weight;
    else if (t < -6) cool += weight;
  }
  if (warm + cool < 1e-6) {
    return { label: "冷暖较平衡", warmScore: 0.5, coolScore: 0.5 };
  }
  const denom = warm + cool + 1e-9;
  const wr = warm / denom;
  const cr = cool / denom;
  if (wr > 0.55) return { label: "主色倾向偏暖", warmScore: wr, coolScore: cr };
  if (cr > 0.55) return { label: "主色倾向偏冷", warmScore: wr, coolScore: cr };
  return { label: "冷暖分布较均衡", warmScore: wr, coolScore: cr };
}

function rgbSaturation255(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const mx = Math.max(rn, gn, bn);
  const mn = Math.min(rn, gn, bn);
  const d = mx - mn;
  return mx < 1e-6 ? 0 : d / mx;
}

function averagePaletteSaturation(palette) {
  if (!palette.length) return 0.35;
  let s = 0;
  for (const p of palette) {
    s += rgbSaturation255(p.r, p.g, p.b) * p.weight;
  }
  return s;
}

/**
 * 根据主色冷暖、饱和度与构图指标，给出若干氛围形容词（启发式）。
 */
function inferAtmosphereAdjectives(palette, mood, metrics) {
  const sat = averagePaletteSaturation(palette);
  const wr = mood.warmScore ?? 0.5;
  const cr = mood.coolScore ?? 0.5;
  const { grayStd, hRatio, gravityOff } = metrics;

  const scored = [];

  const push = (label, score) => {
    if (score > 0.28) scored.push({ label, score });
  };

  push("活泼", wr > 0.52 && sat > 0.3 && grayStd > 46 ? 0.35 + sat * 0.45 + wr * 0.2 : 0);
  push("静谧", (sat < 0.27 && grayStd < 44) || (cr > 0.54 && sat < 0.33) ? 0.55 + (1 - sat) * 0.2 : 0);
  push("热烈", wr > 0.55 && sat > 0.36 ? 0.45 + sat * 0.4 : 0);
  push("克制", sat < 0.29 && grayStd < 47 ? 0.5 + (0.3 - sat) : 0);
  push("温馨", wr > 0.52 && sat >= 0.18 && sat < 0.42 ? 0.42 : 0);
  push("理性", cr > 0.52 && sat < 0.42 && grayStd > 48 ? 0.4 + cr * 0.15 : 0);
  push("动感", gravityOff > 0.12 || (grayStd > 58 && hRatio > 0.38 && hRatio < 0.62) ? 0.38 + gravityOff * 2 : 0);
  push("沉稳", hRatio > 0.51 && sat < 0.48 && Math.abs(wr - cr) < 0.18 ? 0.4 : 0);
  push("清新", cr > 0.5 && sat > 0.2 && sat < 0.46 ? 0.38 : 0);
  push("明快", wr > 0.5 && sat > 0.33 && grayStd > 50 ? 0.36 + sat * 0.3 : 0);
  push("柔和", sat < 0.38 && sat > 0.15 && Math.abs(wr - cr) < 0.25 ? 0.35 : 0);
  push("冷峻", cr > 0.56 && grayStd > 54 && sat < 0.45 ? 0.4 : 0);

  scored.sort((a, b) => b.score - a.score);
  const uniq = [];
  const seen = new Set();
  for (const { label, score } of scored) {
    if (seen.has(label)) continue;
    if (score < 0.32) continue;
    seen.add(label);
    uniq.push(label);
    if (uniq.length >= 5) break;
  }

  if (!uniq.length) {
    if (wr > 0.56) uniq.push("偏暖调");
    else if (cr > 0.56) uniq.push("偏冷调");
    else uniq.push("中性");
  }

  return {
    adjectives: uniq,
    note: "由主色冷暖、饱和度与画面明暗层次等综合估算，仅供参考。",
  };
}

function buildGraphicsInterpretation(features, mood, palette) {
  const parts = [];
  parts.push(`从能量分布看，${features.lines[1].replace(/。$/, "")}；${features.lines[2].replace(/。$/, "")}。`);
  parts.push(`${features.lines[3]} ${mood.label}，可与品牌调性或活动气质结合理解。`);
  if (palette.length) {
    const top = palette[0];
    const hex = `#${[top.r, top.g, top.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
    parts.push(`占比最高的主色为 ${hex.toUpperCase()}（约 ${(top.weight * 100).toFixed(1)}%），往往在版面中承担「品牌色」或视觉锚点。`);
  }
  return parts.join("\n\n");
}

function renderSemanticsList(query, autoTags) {
  if (!el.semanticsList) return;
  const q = (query || "").trim().toLowerCase();
  const tagLc = (autoTags || []).map((t) => String(t).toLowerCase());
  let rows = SEMANTICS_DB.map((item, index) => ({ item, index }));
  if (q) {
    rows = rows.filter(({ item }) => {
      const blob = `${item.keyword}${item.meaning}${item.hints.join("")}`.toLowerCase();
      return blob.includes(q);
    });
  }
  rows.sort((a, b) => {
    const score = (it) =>
      it.hints.filter((h) => tagLc.includes(h.toLowerCase())).length;
    return score(b.item) - score(a.item);
  });
  el.semanticsList.innerHTML = "";
  if (!rows.length) {
    el.semanticsList.innerHTML = `<p class="status">${tr("m_semanticsNoMatch")}</p>`;
    return;
  }
  rows.forEach(({ item }) => {
    const hintMatch = item.hints.some((h) => tagLc.includes(h.toLowerCase()));
    const article = document.createElement("article");
    article.className = `semantics-item${hintMatch ? " semantics-item--match" : ""}`;
    const strong = document.createElement("strong");
    strong.textContent = item.keyword;
    const p = document.createElement("p");
    p.textContent = item.meaning;
    article.appendChild(strong);
    article.appendChild(p);
    el.semanticsList.appendChild(article);
  });
}

let lastAutoTags = [];

function renderGraphicsSemantics() {
  if (!el.graphicsEmpty || !el.graphicsContent || !state.image) return;
  const palette = extractPaletteFromImage(state.image, PALETTE_MAX_COLORS);
  const features = analyzeGraphicsFeatures(state.image);
  const mood = palette.length
    ? paletteColorMood(palette)
    : { label: "主色样本不足，冷暖未估", warmScore: 0.5, coolScore: 0.5 };
  let moodLine = `主色情绪：${mood.label}`;
  if (palette.length) {
    moodLine += `（基于前 ${Math.min(8, palette.length)} 种主色加权估计）。`;
  } else {
    moodLine += "。";
  }
  features.lines.unshift(moodLine);

  if (el.graphicsFeatureList) {
    el.graphicsFeatureList.innerHTML = "";
    features.lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      el.graphicsFeatureList.appendChild(li);
    });
  }
  const metrics = features.metrics || {
    hRatio: 0.5,
    grayStd: 50,
    ar: 1,
    gravityOff: 0,
  };
  const atmosphere = inferAtmosphereAdjectives(palette, mood, metrics);
  if (el.graphicsAtmosphere) {
    el.graphicsAtmosphere.innerHTML = "";
    const lead = document.createElement("p");
    lead.style.margin = "0 0 8px";
    lead.style.fontWeight = "500";
    lead.textContent = tr("m_atmosphereLead");
    const tagRow = document.createElement("div");
    tagRow.className = "atmosphere-tags";
    atmosphere.adjectives.forEach((adj) => {
      const sp = document.createElement("span");
      sp.className = "atmosphere-tag";
      sp.textContent = adj;
      tagRow.appendChild(sp);
    });
    const note = document.createElement("p");
    note.className = "panel-note";
    note.style.marginTop = "10px";
    note.style.fontWeight = "400";
    note.textContent = atmosphere.note;
    el.graphicsAtmosphere.appendChild(lead);
    el.graphicsAtmosphere.appendChild(tagRow);
    el.graphicsAtmosphere.appendChild(note);
  }

  if (el.graphicsInterpretation) {
    el.graphicsInterpretation.textContent = palette.length
      ? buildGraphicsInterpretation(features, mood, palette)
      : `${features.lines.slice(1).join(" ")}\n\n主色聚类不足，综合解读仅含构图线索；请换更大或更清晰的海报图以启用色彩寓意。`;
  }

  const moodTags = mood.label.includes("暖") ? ["暖色"] : mood.label.includes("冷") ? ["冷色"] : [];
  lastAutoTags = [...features.tags, ...moodTags, ...atmosphere.adjectives];

  const q = el.semanticsSearchInput ? el.semanticsSearchInput.value : "";
  renderSemanticsList(q, lastAutoTags);

  el.graphicsEmpty.hidden = true;
  el.graphicsContent.hidden = false;
}

function clearGraphicsSemantics() {
  if (!el.graphicsEmpty || !el.graphicsContent) return;
  el.graphicsEmpty.textContent = tr("graphicsEmpty");
  el.graphicsEmpty.hidden = false;
  el.graphicsContent.hidden = true;
  if (el.graphicsFeatureList) el.graphicsFeatureList.innerHTML = "";
  if (el.graphicsAtmosphere) el.graphicsAtmosphere.innerHTML = "";
  if (el.graphicsInterpretation) el.graphicsInterpretation.textContent = "";
  if (el.semanticsList) el.semanticsList.innerHTML = "";
  if (el.semanticsSearchInput) el.semanticsSearchInput.value = "";
  lastAutoTags = [];
}

function classifyByGrid(grid, width, height) {
  const ratio = width / Math.max(1, height);
  const orientation = ratio > 1.05 ? "横版" : ratio < 0.95 ? "竖版" : "方形";
  let density = "中密度";
  const densityValue = grid.cols * grid.rows;
  if (densityValue <= 72) density = "低密度";
  if (densityValue >= 160) density = "高密度";
  return `${orientation}-${grid.cols}列-${grid.rows}行-${density}`;
}

function clearLayoutAnalysis() {
  state.layoutAnalysis = null;
  if (el.layoutAnalysisMeta) {
    el.layoutAnalysisMeta.textContent = tr("layoutMetaEmpty");
  }
}

function renderLayoutAnalysisMeta() {
  if (!el.layoutAnalysisMeta) return;
  const analysis = state.layoutAnalysis;
  if (!analysis || !Array.isArray(analysis.items) || !analysis.items.length) {
    el.layoutAnalysisMeta.textContent = tr("layoutMetaEmpty");
    return;
  }
  const textCount = analysis.items.filter((item) => item.type === "textBlock").length;
  const imageCount = analysis.items.filter((item) => item.type === "shape").length;
  el.layoutAnalysisMeta.textContent = [
    tr("lm_source", { src: analysis.source || "auto" }),
    tr("lm_textRegions", { n: textCount }),
    tr("lm_imageRegions", { n: imageCount }),
    tr("lm_blocks", { n: analysis.blockCount || 0 }),
    tr("lm_contours", { n: analysis.contourCount || 0 }),
    tr("lm_updated", { time: new Date(analysis.updatedAt || Date.now()).toLocaleString() }),
    tr("lm_note"),
  ].join("\n");
}

function drawLayoutAnalysisOverlay(ctx) {
  if (!state.analysisOverlayVisible) return;
  const analysis = state.layoutAnalysis;
  if (!analysis || !Array.isArray(analysis.items) || !analysis.items.length) return;
  const hasEditableAnalysisLayer = state.layoutItems.some((item) => item && item.fromAnalysis === true);
  if (hasEditableAnalysisLayer) return;
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 1.2;
  ctx.font = "11px sans-serif";
  ctx.textBaseline = "top";
  analysis.items.forEach((item) => {
    const isText = item.type === "textBlock";
    const fill = isText ? "rgba(59,130,246,0.1)" : "rgba(239,68,68,0.1)";
    const stroke = isText ? "rgba(37,99,235,0.85)" : "rgba(220,38,38,0.85)";
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    if (item.type === "shape" && item.shapeKind === "polygon") {
      const pts = getAbsoluteShapePolygonPoints(item);
      if (pts.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(item.x, item.y, item.width, item.height);
        ctx.strokeRect(item.x, item.y, item.width, item.height);
      }
    } else {
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(item.x, item.y, item.width, item.height);
    }
    const label = item.name || (isText ? "文本区" : "图片区");
    const tagW = Math.max(32, label.length * 8 + 8);
    const tagH = 16;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(item.x, Math.max(0, item.y - tagH), tagW, tagH);
    ctx.strokeRect(item.x, Math.max(0, item.y - tagH), tagW, tagH);
    ctx.fillStyle = stroke;
    ctx.fillText(label, item.x + 4, Math.max(0, item.y - tagH + 2));
  });
  ctx.restore();
}

function simplifyRowEdgePoints(points, maxPoints = 42) {
  if (!Array.isArray(points) || points.length <= maxPoints) return points || [];
  const step = Math.max(1, Math.ceil(points.length / maxPoints));
  const out = [];
  for (let i = 0; i < points.length; i += step) out.push(points[i]);
  if (out[out.length - 1] !== points[points.length - 1]) out.push(points[points.length - 1]);
  return out;
}

function extractVisualContourRegions(image, options = {}) {
  const maxSide = clamp(Number(options.maxSide) || 560, 220, 900);
  const maxRegions = clamp(Number(options.maxRegions) || 3, 1, 6);
  const scale = Math.min(1, maxSide / Math.max(1, image.width, image.height));
  const w = Math.max(80, Math.round(image.width * scale));
  const h = Math.max(80, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const mask = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = (maxC - minC) / Math.max(1, maxC);
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const vivid = sat > 0.34 && gray < 240;
    const dark = gray < 145;
    mask[p] = vivid || dark ? 1 : 0;
  }
  const filtered = new Uint8Array(mask.length);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (!mask[idx]) continue;
      let n = 0;
      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          if (mask[(y + yy) * w + (x + xx)]) n += 1;
        }
      }
      if (n >= 4) filtered[idx] = 1;
    }
  }
  const minArea = Math.max(120, Math.round(w * h * 0.01));
  const visited = new Uint8Array(filtered.length);
  const components = [];
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (!filtered[start] || visited[start]) continue;
      const queue = [start];
      visited[start] = 1;
      let qIndex = 0;
      let area = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      const rowMin = new Map();
      const rowMax = new Map();
      while (qIndex < queue.length) {
        const idx = queue[qIndex++];
        const cy = Math.floor(idx / w);
        const cx = idx - cy * w;
        area += 1;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        if (!rowMin.has(cy) || cx < rowMin.get(cy)) rowMin.set(cy, cx);
        if (!rowMax.has(cy) || cx > rowMax.get(cy)) rowMax.set(cy, cx);
        for (let i = 0; i < dirs.length; i++) {
          const nx = cx + dirs[i][0];
          const ny = cy + dirs[i][1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const nIdx = ny * w + nx;
          if (!filtered[nIdx] || visited[nIdx]) continue;
          visited[nIdx] = 1;
          queue.push(nIdx);
        }
      }
      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      const fillRatio = area / Math.max(1, bw * bh);
      if (area < minArea || bw < 18 || bh < 18 || fillRatio < 0.22) continue;
      const ys = Array.from(rowMin.keys()).sort((a, b) => a - b);
      const leftEdge = ys.map((yy) => ({ x: rowMin.get(yy), y: yy }));
      const rightEdge = ys.map((yy) => ({ x: rowMax.get(yy), y: yy })).reverse();
      const edgePoints = simplifyRowEdgePoints(leftEdge, 32).concat(simplifyRowEdgePoints(rightEdge, 32));
      if (edgePoints.length < 6) continue;
      const sx = image.width / w;
      const sy = image.height / h;
      const xAbs = minX * sx;
      const yAbs = minY * sy;
      const widthAbs = Math.max(1, bw * sx);
      const heightAbs = Math.max(1, bh * sy);
      const points = edgePoints.map((p) => ({
        x: clamp(((p.x * sx) - xAbs) / widthAbs, 0, 1),
        y: clamp(((p.y * sy) - yAbs) / heightAbs, 0, 1),
      }));
      components.push({
        area,
        score: area * fillRatio,
        x: xAbs,
        y: yAbs,
        width: widthAbs,
        height: heightAbs,
        points,
      });
    }
  }
  components.sort((a, b) => b.score - a.score);
  return components.slice(0, maxRegions);
}

function analyzePosterLayoutZones(options = {}) {
  const { silent = false } = options;
  const stage = getStageSize();
  if (!stage || !state.image || !state.grid) {
    if (!silent) setStatus(tr("m_analyzeNeedPoster"));
    return null;
  }
  const blocks = extractAutoLayoutByGridEnergy(state.image, state.grid);
  const roleItems = blocks.length
    ? buildRoleItemsFromBlocks(stage, state.grid, blocks, state.image)
    : buildAutoLayoutFallback(stage, state.grid);
  const contourRegions = extractVisualContourRegions(state.image, { maxRegions: 3 });
  const textItems = (roleItems || []).filter((item) => item.type === "textBlock");
  const contourShapeItems = contourRegions.map((region, idx) => ({
    id: makeLayoutId("analysis-sh"),
    type: "shape",
    name: idx === 0 ? "主视觉轮廓" : `辅助轮廓 ${idx}`,
    shapeKind: "polygon",
    visible: true,
    locked: false,
    opacity: 1,
    x: region.x,
    y: region.y,
    width: region.width,
    height: region.height,
    points: region.points,
  }));
  const fallbackShapes = (roleItems || []).filter((item) => item.type === "shape");
  const items = [...(contourShapeItems.length ? contourShapeItems : fallbackShapes), ...textItems]
    .map((item) => ({
      ...item,
      id: makeLayoutId(item.type === "shape" ? "analysis-sh" : "analysis-tb"),
      visible: true,
      locked: false,
      opacity: 1,
    }));
  state.layoutAnalysis = {
    items,
    blockCount: blocks.length,
    contourCount: contourShapeItems.length,
    source: contourShapeItems.length
      ? "海报能量分区+轮廓提取"
      : blocks.length
        ? "能量分区+纹理角色+阅读顺序"
        : "网格回退模板",
    updatedAt: new Date().toISOString(),
  };
  renderLayoutAnalysisMeta();
  refreshStage();
  if (!silent) {
    const textCount = items.filter((item) => item.type === "textBlock").length;
    const imageCount = items.filter((item) => item.type === "shape").length;
    const contourCount = items.filter((item) => item.type === "shape" && item.shapeKind === "polygon").length;
    setStatus(tr("m_analyzeProgress", { textCount, imageCount, contourCount }));
    applyLayoutAnalysisToComposer();
    showToast(tr("m_toastAnalyzeDone"));
  }
  return state.layoutAnalysis;
}

function applyLayoutAnalysisToComposer() {
  const stage = getStageSize();
  if (!stage || !state.grid) {
    setStatus(tr("m_needCanvasGrid"));
    return;
  }
  if (!state.layoutAnalysis || !Array.isArray(state.layoutAnalysis.items) || !state.layoutAnalysis.items.length) {
    analyzePosterLayoutZones({ silent: true });
  }
  if (!state.layoutAnalysis || !state.layoutAnalysis.items.length) {
    setStatus(tr("m_analyzeRetry"));
    return;
  }
  pushLayoutUndo();
  state.layoutItems = cloneVariantItemsWithNewIds(state.layoutAnalysis.items).map((item) => ({
    ...item,
    fromAnalysis: true,
  }));
  state.activeLayoutItemId = state.layoutItems[0]?.id || "";
  state.analysisOverlayVisible = false;
  if (el.analysisOverlaySelect) el.analysisOverlaySelect.value = "off";
  switchToLayoutEditingPanel();
  renderLayoutItems();
  drawGrid();
  setStatus(tr("m_layoutEditMode"));
  showToast(tr("m_toastImportLayout"));
}

function updateGridMeta() {
  if (!state.grid) {
    el.gridMeta.textContent = tr("gridMetaEmpty");
    return;
  }
  const g = state.grid;
  const stage = getStageSize();
  const iw = stage ? stage.width : 0;
  const ih = stage ? stage.height : 0;
  const mod = (g.moduleX + g.moduleY) / 2;
  const fitLine =
    g.fitMode === "poster-inscribed"
      ? tr("gm_fitInscribed", { cols: g.cols, rows: g.rows, mod: mod.toFixed(2) })
      : tr("gm_fitNot");
  const tc = state.layoutAnalysis?.items?.length
    ? state.layoutAnalysis.items.filter((item) => item.type === "textBlock").length
    : 0;
  const ic = state.layoutAnalysis?.items?.length
    ? state.layoutAnalysis.items.filter((item) => item.type === "shape").length
    : 0;
  el.gridMeta.textContent = [
    tr("gm_scope", { w: iw, h: ih }),
    fitLine,
    tr("gm_source", { src: g.source || "unknown" }),
    tr("gm_confidence", { pct: (g.confidence * 100).toFixed(1) }),
    tr("gm_colsRows", { cols: g.cols, rows: g.rows }),
    tr("gm_margins", {
      ml: Math.round(g.marginLeft),
      mr: Math.round(g.marginRight),
      mt: Math.round(g.marginTop),
      mb: Math.round(g.marginBottom),
    }),
    tr("gm_module", { mx: g.moduleX.toFixed(2), my: g.moduleY.toFixed(2) }),
    tr("gm_angle", { ang: g.angle.toFixed(2) }),
    state.layoutAnalysis?.items?.length ? tr("gm_zonesDone", { tc, ic }) : tr("gm_zonesNone"),
  ].join("\n");
}

function syncInputsFromGridAndStyle() {
  if (!state.grid || !state.style) return;
  el.colsInput.value = state.grid.cols;
  el.rowsInput.value = state.grid.rows;
  el.marginLeftInput.value = Math.round(state.grid.marginLeft);
  el.marginRightInput.value = Math.round(state.grid.marginRight);
  el.marginTopInput.value = Math.round(state.grid.marginTop);
  el.marginBottomInput.value = Math.round(state.grid.marginBottom);
  el.angleInput.value = state.grid.angle;
  el.gridColorInput.value = state.style.color;
  el.gridAlphaInput.value = state.style.alpha;
  el.dashInput.value = state.style.dash;
  el.gapInput.value = state.style.gap;
  el.lineWidthInput.value = state.style.lineWidth;
}

function readGridAndStyleFromInputs() {
  const stage = getStageSize();
  if (!state.grid || !state.style || !stage) return;
  state.grid.cols = clamp(Number(el.colsInput.value) || 12, 2, 36);
  state.grid.rows = clamp(Number(el.rowsInput.value) || 12, 2, 36);
  state.grid.marginLeft = clamp(Number(el.marginLeftInput.value) || 0, 0, stage.width - 1);
  state.grid.marginRight = clamp(Number(el.marginRightInput.value) || 0, 0, stage.width - 1);
  state.grid.marginTop = clamp(Number(el.marginTopInput.value) || 0, 0, stage.height - 1);
  state.grid.marginBottom = clamp(Number(el.marginBottomInput.value) || 0, 0, stage.height - 1);
  state.grid.angle = clamp(Number(el.angleInput.value) || 0, -30, 30);
  state.grid.moduleX = (stage.width - state.grid.marginLeft - state.grid.marginRight) / state.grid.cols;
  state.grid.moduleY = (stage.height - state.grid.marginTop - state.grid.marginBottom) / state.grid.rows;

  state.style.color = el.gridColorInput.value;
  state.style.alpha = clamp(Number(el.gridAlphaInput.value) || 0.8, 0.1, 1);
  state.style.dash = clamp(Number(el.dashInput.value) || 8, 2, 30);
  state.style.gap = clamp(Number(el.gapInput.value) || 6, 2, 30);
  state.style.lineWidth = clamp(Number(el.lineWidthInput.value) || 1.5, 0.5, 6);
}

function drawPoster() {
  const stage = getStageSize();
  if (!stage) return;
  el.posterCanvas.width = stage.width;
  el.posterCanvas.height = stage.height;
  el.gridCanvas.width = stage.width;
  el.gridCanvas.height = stage.height;
  posterCtx.clearRect(0, 0, stage.width, stage.height);
  if (state.image && state.posterVisible) {
    posterCtx.drawImage(state.image, 0, 0);
    return;
  }
  const bg = state.canvasDraft?.background || "#ffffff";
  posterCtx.fillStyle = bg;
  posterCtx.fillRect(0, 0, stage.width, stage.height);
}

function drawGrid() {
  if (!stageExists() || !state.grid || !state.style) return;
  const w = el.gridCanvas.width;
  const h = el.gridCanvas.height;
  gridCtx.clearRect(0, 0, w, h);
  if (state.gridVisible) {
    drawGridOnContext(gridCtx, w, h, state.grid, state.style);
  }
  drawLayoutAnalysisOverlay(gridCtx);
}

function drawGridOnContext(ctx, w, h, g, style) {
  const innerW = Math.max(1, w - g.marginLeft - g.marginRight);
  const innerH = Math.max(1, h - g.marginTop - g.marginBottom);
  const colW = innerW / g.cols;
  const rowH = innerH / g.rows;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((g.angle * Math.PI) / 180);
  ctx.translate(-w / 2, -h / 2);
  ctx.strokeStyle = hexToRgba(style.color, style.alpha);
  ctx.lineWidth = style.lineWidth;
  ctx.setLineDash([style.dash, style.gap]);

  for (let c = 0; c <= g.cols; c++) {
    const x = g.marginLeft + c * colW;
    ctx.beginPath();
    ctx.moveTo(x, g.marginTop);
    ctx.lineTo(x, h - g.marginBottom);
    ctx.stroke();
  }
  for (let r = 0; r <= g.rows; r++) {
    const y = g.marginTop + r * rowH;
    ctx.beginPath();
    ctx.moveTo(g.marginLeft, y);
    ctx.lineTo(w - g.marginRight, y);
    ctx.stroke();
  }
  ctx.restore();
}

function refreshStage() {
  if (!stageExists()) {
    posterCtx.clearRect(0, 0, el.posterCanvas.width, el.posterCanvas.height);
    gridCtx.clearRect(0, 0, el.gridCanvas.width, el.gridCanvas.height);
    el.posterCanvas.style.width = "0px";
    el.posterCanvas.style.height = "0px";
    el.gridCanvas.style.width = "0px";
    el.gridCanvas.style.height = "0px";
    if (el.layoutOverlay) {
      el.layoutOverlay.style.width = "0px";
      el.layoutOverlay.style.height = "0px";
      el.layoutOverlay.innerHTML = "";
    }
    if (el.alignmentGuides) {
      el.alignmentGuides.style.width = "0px";
      el.alignmentGuides.style.height = "0px";
      el.alignmentGuides.innerHTML = "";
    }
    if (el.transformInfo) {
      el.transformInfo.style.width = "0px";
      el.transformInfo.style.height = "0px";
    }
    hideTransformInfo();
    return;
  }
  drawPoster();
  drawGrid();
  fitCanvasToStage();
  renderLayoutItems();
  updateGridMeta();
}

function fitCanvasToStage() {
  const stage = getStageSize();
  if (!stage || !el.dropZone) return;
  const style = getComputedStyle(el.dropZone);
  const padX = parseFloat(style.paddingLeft || "0") + parseFloat(style.paddingRight || "0");
  const padY = parseFloat(style.paddingTop || "0") + parseFloat(style.paddingBottom || "0");
  const maxW = Math.max(1, el.dropZone.clientWidth - padX);
  const maxH = Math.max(1, el.dropZone.clientHeight - padY);

  const imageW = stage.width;
  const imageH = stage.height;
  if (!imageW || !imageH) return;

  const fitScale = Math.min(maxW / imageW, maxH / imageH);
  const zoomMode = el.zoomSelect ? el.zoomSelect.value : "fit";
  const zoomFactor = zoomMode === "fit" ? 1 : clamp(Number(zoomMode) || 1, 0.5, 2);
  const scale = fitScale * zoomFactor;
  const drawW = Math.max(1, Math.floor(imageW * scale));
  const drawH = Math.max(1, Math.floor(imageH * scale));
  const widthPx = `${drawW}px`;
  const heightPx = `${drawH}px`;
  el.posterCanvas.style.width = widthPx;
  el.posterCanvas.style.height = heightPx;
  el.gridCanvas.style.width = widthPx;
  el.gridCanvas.style.height = heightPx;
  if (el.layoutOverlay) {
    el.layoutOverlay.style.width = widthPx;
    el.layoutOverlay.style.height = heightPx;
  }
  if (el.alignmentGuides) {
    el.alignmentGuides.style.width = widthPx;
    el.alignmentGuides.style.height = heightPx;
  }
  if (el.transformInfo) {
    el.transformInfo.style.width = widthPx;
    el.transformInfo.style.height = heightPx;
  }

  if (el.dropZone) {
    const shouldScroll = zoomMode !== "fit" && zoomFactor > 1.0001;
    el.dropZone.classList.toggle("zoomed", shouldScroll);
  }
}

function detectGridFromImage(image) {
  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const w = Math.max(64, Math.round(image.width * scale));
  const h = Math.max(64, Math.round(image.height * scale));

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
  tempCtx.drawImage(image, 0, 0, w, h);
  const pixels = tempCtx.getImageData(0, 0, w, h).data;

  const gray = new Float32Array(w * h);
  for (let i = 0; i < pixels.length; i += 4) {
    gray[i / 4] = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
  }
  const figureGround = detectFigureGroundFrame(gray, w, h);

  const vertical = new Array(w).fill(0);
  const horizontal = new Array(h).fill(0);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const gx =
        -gray[idx - 1 - w] +
        gray[idx + 1 - w] +
        -2 * gray[idx - 1] +
        2 * gray[idx + 1] +
        -gray[idx - 1 + w] +
        gray[idx + 1 + w];
      const gy =
        -gray[idx - w - 1] +
        -2 * gray[idx - w] +
        -gray[idx - w + 1] +
        gray[idx + w - 1] +
        2 * gray[idx + w] +
        gray[idx + w + 1];
      const magnitude = Math.hypot(gx, gy);
      vertical[x] += magnitude;
      horizontal[y] += magnitude;
    }
  }

  const smoothWin = 9;
  const vSmooth = smoothSignal(vertical, smoothWin);
  const hSmooth = smoothSignal(horizontal, smoothWin);
  const vDev = deviation(vSmooth);
  const hDev = deviation(hSmooth);
  const vThreshold = average(vSmooth) + vDev * 0.48;
  const hThreshold = average(hSmooth) + hDev * 0.48;
  const minPeakDistV = Math.max(3, Math.round(w / 52));
  const minPeakDistH = Math.max(3, Math.round(h / 52));
  let vPeaks = findPeaks(vSmooth, vThreshold, minPeakDistV);
  let hPeaks = findPeaks(hSmooth, hThreshold, minPeakDistH);
  if (vPeaks.length < 5) {
    const lo = average(vSmooth) + vDev * 0.3;
    vPeaks = findPeaks(vSmooth, Math.min(vThreshold, lo), Math.max(2, Math.round(w / 64)));
  }
  if (hPeaks.length < 5) {
    const lo = average(hSmooth) + hDev * 0.3;
    hPeaks = findPeaks(hSmooth, Math.min(hThreshold, lo), Math.max(2, Math.round(h / 64)));
  }
  const vxPeak = estimateAxis(vPeaks, w, 12);
  const hyPeak = estimateAxis(hPeaks, h, 12);
  const vx = pickAxisModel(vSmooth, vxPeak, w, 12);
  const hy = pickAxisModel(hSmooth, hyPeak, h, 12);

  const sx = image.width / w;
  const sy = image.height / h;
  const fgLeft = clamp(figureGround.marginLeft * sx, 0, image.width * 0.45);
  const fgRight = clamp(figureGround.marginRight * sx, 0, image.width * 0.45);
  const fgTop = clamp(figureGround.marginTop * sy, 0, image.height * 0.45);
  const fgBottom = clamp(figureGround.marginBottom * sy, 0, image.height * 0.45);
  const blendAlpha = clamp((figureGround.confidence || 0) * 0.62, 0.12, 0.62);
  const marginLeft = clamp(blendNumber(vx.marginStart * sx, fgLeft, blendAlpha), 0, image.width * 0.45);
  const marginRight = clamp(blendNumber(vx.marginEnd * sx, fgRight, blendAlpha), 0, image.width * 0.45);
  const marginTop = clamp(blendNumber(hy.marginStart * sy, fgTop, blendAlpha), 0, image.height * 0.45);
  const marginBottom = clamp(blendNumber(hy.marginEnd * sy, fgBottom, blendAlpha), 0, image.height * 0.45);
  const cols = clamp(vx.count, 2, 36);
  const rows = clamp(hy.count, 2, 36);
  const moduleX = Math.max(1, (image.width - marginLeft - marginRight) / cols);
  const moduleY = Math.max(1, (image.height - marginTop - marginBottom) / rows);

  const contentRatioX = (image.width - marginLeft - marginRight) / image.width;
  const contentRatioY = (image.height - marginTop - marginBottom) / image.height;
  const confidencePenalty = (contentRatioX < 0.28 || contentRatioY < 0.28) ? 0.1 : 0;
  const confidence = clamp((vx.confidence + hy.confidence) / 2 - confidencePenalty + (figureGround.confidence || 0) * 0.08, 0.2, 0.96);

  // Fallback when detection is unstable（阈值略放宽，更多保留弱纹理下的自动结果）.
  if (confidence < 0.22 || moduleX <= 1 || moduleY <= 1) {
    return {
      ...createDefaultGrid(image.width, image.height),
      source: "auto-detect-fallback",
      confidence: 0.28,
    };
  }

  return {
    cols,
    rows,
    angle: 0,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    moduleX,
    moduleY,
    confidence,
    source: `auto-detect+${figureGround.source}`,
  };
}

function blendNumber(a, b, alpha) {
  return a * (1 - alpha) + b * alpha;
}

function refineWithLearnedTemplates(detectedGrid, image) {
  if (!state.templates.length) return detectedGrid;
  const aspect = image.width / Math.max(1, image.height);
  const detectedNorm = normalizeGridForTemplate(detectedGrid, image.width, image.height);

  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  state.templates.forEach((template) => {
    const t = template.grid;
    const aspectDiff = Math.abs((template.aspect || 1) - aspect);
    const colsDiff = Math.abs((t.cols || 12) - detectedNorm.cols) / 12;
    const rowsDiff = Math.abs((t.rows || 12) - detectedNorm.rows) / 12;
    const marginDiff =
      Math.abs((t.marginLeftRatio || 0) - detectedNorm.marginLeftRatio) +
      Math.abs((t.marginRightRatio || 0) - detectedNorm.marginRightRatio) +
      Math.abs((t.marginTopRatio || 0) - detectedNorm.marginTopRatio) +
      Math.abs((t.marginBottomRatio || 0) - detectedNorm.marginBottomRatio);
    const score = aspectDiff * 2.2 + colsDiff + rowsDiff + marginDiff;
    if (score < bestScore) {
      bestScore = score;
      best = template;
    }
  });

  if (!best) return detectedGrid;
  const templateGrid = denormalizeTemplateGrid(best.grid, image.width, image.height);

  // Low-confidence detection relies more on learned template priors.
  const confidence = detectedGrid.confidence || 0.3;
  const alpha = clamp((0.68 - confidence) / 0.6, 0, 0.75);
  if (alpha <= 0.02) return detectedGrid;

  const cols = clamp(Math.round(blendNumber(detectedGrid.cols, templateGrid.cols, alpha)), 2, 36);
  const rows = clamp(Math.round(blendNumber(detectedGrid.rows, templateGrid.rows, alpha)), 2, 36);
  const marginLeft = blendNumber(detectedGrid.marginLeft, templateGrid.marginLeft, alpha);
  const marginRight = blendNumber(detectedGrid.marginRight, templateGrid.marginRight, alpha);
  const marginTop = blendNumber(detectedGrid.marginTop, templateGrid.marginTop, alpha);
  const marginBottom = blendNumber(detectedGrid.marginBottom, templateGrid.marginBottom, alpha);
  return {
    cols,
    rows,
    angle: blendNumber(detectedGrid.angle || 0, templateGrid.angle || 0, alpha),
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    moduleX: Math.max(1, (image.width - marginLeft - marginRight) / cols),
    moduleY: Math.max(1, (image.height - marginTop - marginBottom) / rows),
    confidence: clamp(confidence + alpha * 0.16, 0.2, 0.95),
    source: `auto-detect+template(${best.name})`,
  };
}

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isStorageQuotaError(error) {
  if (!error) return false;
  const name = String(error.name || "");
  const msg = String(error.message || "");
  return name === "QuotaExceededError" || /quota|exceed/i.test(msg);
}

function safeStorageSet(key, value, fallbackMessage = "保存失败，请稍后重试。", recoverOnQuota) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (isStorageQuotaError(error) && typeof recoverOnQuota === "function") {
      const recovered = recoverOnQuota();
      if (recovered) {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          console.error(retryError);
        }
      }
    }
    console.error(error);
    const text = isStorageQuotaError(error)
      ? "保存失败：浏览器本地存储空间已满，请删除部分海报或排版项目后重试。"
      : fallbackMessage;
    setStatus(text);
    showToast("保存失败");
    return false;
  }
}

function reclaimStorageForLibrary() {
  if (!Array.isArray(state.library) || state.library.length <= 1) return false;
  let removed = 0;
  while (state.library.length > 1) {
    state.library.pop();
    removed += 1;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.library));
      updateCategoryOptions();
      renderLibrary();
      setStatus(`存储空间不足：已自动清理 ${removed} 条较早海报记录后完成保存。`);
      showToast("已自动清理旧海报记录");
      return true;
    } catch (error) {
      if (!isStorageQuotaError(error)) break;
    }
  }
  return false;
}

function reclaimStorageForLayoutProjects() {
  if (!Array.isArray(state.layoutProjects) || state.layoutProjects.length <= 1) return false;
  let removed = 0;
  while (state.layoutProjects.length > 1) {
    state.layoutProjects.pop();
    removed += 1;
    try {
      localStorage.setItem(LAYOUT_PROJECT_STORAGE_KEY, JSON.stringify(state.layoutProjects));
      renderLayoutProjectSelect();
      setStatus(`存储空间不足：已自动清理 ${removed} 个较早排版项目后完成保存。`);
      showToast("已自动清理旧排版项目");
      return true;
    } catch (error) {
      if (!isStorageQuotaError(error)) break;
    }
  }
  return false;
}

function normalizeGridSignature(grid, width, height) {
  const round = (n, d = 4) => Number(n.toFixed(d));
  return {
    cols: clamp(Math.round(grid.cols || 12), 2, 36),
    rows: clamp(Math.round(grid.rows || 12), 2, 36),
    angle: round(grid.angle || 0, 2),
    marginLeftRatio: round((grid.marginLeft || 0) / Math.max(1, width), 4),
    marginRightRatio: round((grid.marginRight || 0) / Math.max(1, width), 4),
    marginTopRatio: round((grid.marginTop || 0) / Math.max(1, height), 4),
    marginBottomRatio: round((grid.marginBottom || 0) / Math.max(1, height), 4),
  };
}

function signatureKey(signature) {
  return [
    signature.cols,
    signature.rows,
    signature.angle,
    signature.marginLeftRatio,
    signature.marginRightRatio,
    signature.marginTopRatio,
    signature.marginBottomRatio,
  ].join("|");
}

function normalizeGridForTemplate(grid, width, height) {
  return {
    cols: grid.cols,
    rows: grid.rows,
    angle: grid.angle || 0,
    marginLeftRatio: grid.marginLeft / Math.max(1, width),
    marginRightRatio: grid.marginRight / Math.max(1, width),
    marginTopRatio: grid.marginTop / Math.max(1, height),
    marginBottomRatio: grid.marginBottom / Math.max(1, height),
    moduleXRatio: grid.moduleX / Math.max(1, width),
    moduleYRatio: grid.moduleY / Math.max(1, height),
  };
}

function denormalizeTemplateGrid(templateGrid, width, height) {
  const cols = clamp(Math.round(templateGrid.cols || 12), 2, 36);
  const rows = clamp(Math.round(templateGrid.rows || 12), 2, 36);
  const marginLeft = clamp((templateGrid.marginLeftRatio || 0.08) * width, 0, width * 0.45);
  const marginRight = clamp((templateGrid.marginRightRatio || 0.08) * width, 0, width * 0.45);
  const marginTop = clamp((templateGrid.marginTopRatio || 0.08) * height, 0, height * 0.45);
  const marginBottom = clamp((templateGrid.marginBottomRatio || 0.08) * height, 0, height * 0.45);
  return {
    cols,
    rows,
    angle: templateGrid.angle || 0,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    moduleX: Math.max(1, (width - marginLeft - marginRight) / cols),
    moduleY: Math.max(1, (height - marginTop - marginBottom) / rows),
    source: "template",
    confidence: 0.55,
  };
}

function loadLibrary() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveLibrary() {
  return safeStorageSet(
    STORAGE_KEY,
    JSON.stringify(state.library),
    "海报库保存失败，请稍后重试。",
    reclaimStorageForLibrary,
  );
}

function loadTemplates() {
  const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveTemplates() {
  return safeStorageSet(TEMPLATE_STORAGE_KEY, JSON.stringify(state.templates), "模板保存失败，请稍后重试。");
}

function loadGridBank() {
  const raw = localStorage.getItem(GRID_BANK_STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveGridBank() {
  return safeStorageSet(GRID_BANK_STORAGE_KEY, JSON.stringify(state.gridBank), "网格库保存失败，请稍后重试。");
}

function upsertGridBank(grid, width, height, sampleName = "") {
  const signature = normalizeGridSignature(grid, width, height);
  const key = signatureKey(signature);
  const now = new Date().toISOString();
  const found = state.gridBank.find((item) => item.key === key);
  if (found) {
    found.usageCount = (found.usageCount || 1) + 1;
    found.lastUsedAt = now;
    if (sampleName) found.lastSampleName = sampleName;
    const ok = saveGridBank();
    if (!ok) {
      found.usageCount = Math.max(1, found.usageCount - 1);
      return { added: false, usageCount: found.usageCount, total: state.gridBank.length, ok: false };
    }
    return { added: false, usageCount: found.usageCount, total: state.gridBank.length, ok: true };
  }
  state.gridBank.unshift({
    id: `grid-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    key,
    signature,
    usageCount: 1,
    createdAt: now,
    lastUsedAt: now,
    lastSampleName: sampleName,
  });
  const ok = saveGridBank();
  if (!ok) {
    state.gridBank.shift();
    return { added: true, usageCount: 1, total: state.gridBank.length, ok: false };
  }
  return { added: true, usageCount: 1, total: state.gridBank.length, ok: true };
}

function renderGridBankSelect() {
  if (!el.gridBankSelect) return;
  const prev = el.gridBankSelect.value;
  el.gridBankSelect.innerHTML = "";
  if (!state.gridBank.length) {
    el.gridBankSelect.innerHTML = '<option value="">暂无已存网格</option>';
    return;
  }
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "请选择网格";
  el.gridBankSelect.appendChild(placeholder);
  state.gridBank.forEach((entry) => {
    const sig = entry.signature || {};
    const option = document.createElement("option");
    option.value = entry.id;
    const use = entry.usageCount || 1;
    option.textContent = `${sig.cols || 12}x${sig.rows || 12} · 使用${use}次`;
    el.gridBankSelect.appendChild(option);
  });
  el.gridBankSelect.value = state.gridBank.some((item) => item.id === prev) ? prev : "";
}

function loadLayoutProjects() {
  const raw = localStorage.getItem(LAYOUT_PROJECT_STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveLayoutProjects() {
  return safeStorageSet(
    LAYOUT_PROJECT_STORAGE_KEY,
    JSON.stringify(state.layoutProjects),
    "排版项目保存失败，请稍后重试。",
    reclaimStorageForLayoutProjects,
  );
}

function renderLayoutProjectSelect() {
  if (!el.layoutProjectSelect) return;
  const prev = el.layoutProjectSelect.value;
  el.layoutProjectSelect.innerHTML = "";
  if (!state.layoutProjects.length) {
    el.layoutProjectSelect.innerHTML = '<option value="">暂无排版项目</option>';
    renderLayoutProjectList();
    return;
  }
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "请选择排版项目";
  el.layoutProjectSelect.appendChild(placeholder);
  state.layoutProjects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name || `排版 ${new Date(project.updatedAt || project.createdAt || Date.now()).toLocaleString()}`;
    el.layoutProjectSelect.appendChild(option);
  });
  el.layoutProjectSelect.value = state.layoutProjects.some((item) => item.id === prev) ? prev : "";
  renderLayoutProjectList();
}

function renderLayoutProjectList() {
  if (!el.layoutProjectList) return;
  el.layoutProjectList.innerHTML = "";
  if (!state.layoutProjects.length) return;
  state.layoutProjects.slice(0, 40).forEach((project) => {
    const row = document.createElement("article");
    row.className = "layout-project-item";
    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = project.name || "未命名排版";
    const stage = project.stage || {};
    const sizeText = `${stage.width || "-"}×${stage.height || "-"}`;
    const meta = document.createElement("span");
    meta.textContent = `${stage.mode === "poster" ? "海报" : "空白"} · ${sizeText}`;
    left.appendChild(title);
    left.appendChild(meta);
    const actions = document.createElement("div");
    actions.className = "layout-project-actions";
    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.textContent = "载入";
    loadBtn.dataset.action = "load";
    loadBtn.dataset.id = project.id;
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "删除";
    delBtn.dataset.action = "delete";
    delBtn.dataset.id = project.id;
    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);
    row.appendChild(left);
    row.appendChild(actions);
    el.layoutProjectList.appendChild(row);
  });
}

function snapshotLayoutProject(name) {
  const stage = getStageSize();
  if (!stage || !state.grid) return null;
  return {
    id: `layout-prj-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: state.image
      ? {
          mode: "poster",
          width: state.image.width,
          height: state.image.height,
          imageDataUrl: state.imageDataUrl,
          imageName: state.imageName,
        }
      : {
          mode: "blank",
          width: stage.width,
          height: stage.height,
          background: state.canvasDraft?.background || "#ffffff",
        },
    grid: { ...state.grid },
    style: { ...(state.style || createDefaultStyle()) },
    layoutItems: cloneLayoutItemsDeep(state.layoutItems),
    layoutAnalysis: cloneLayoutAnalysisDeep(state.layoutAnalysis),
    snap: {
      enabled: Boolean(state.snapToGrid),
      threshold: clamp(Number(state.snapThreshold) || 16, 2, 80),
      span: Boolean(state.snapSpan),
      minSpan: clamp(Number(state.minSpan) || 1, 1, 12),
    },
    gridVisible: state.gridVisible !== false,
    posterVisible: state.posterVisible !== false,
    analysisOverlayVisible: state.analysisOverlayVisible !== false,
    textDefaults: { ...state.textDefaults },
  };
}

function saveCurrentLayoutProject() {
  const stage = getStageSize();
  if (!stage || !state.grid) {
    setStatus("请先创建画布并配置网格后再保存排版。");
    return;
  }
  const name =
    (el.layoutProjectNameInput?.value || "").trim() ||
    `排版 ${new Date().toLocaleString()}`;
  const selectedId = el.layoutProjectSelect?.value || "";
  const existing = selectedId ? state.layoutProjects.find((item) => item.id === selectedId) : null;
  if (existing) {
    const snap = snapshotLayoutProject(name);
    if (!snap) return;
    existing.name = name;
    existing.updatedAt = snap.updatedAt;
    existing.stage = snap.stage;
    existing.grid = snap.grid;
    existing.style = snap.style;
    existing.layoutItems = snap.layoutItems;
    existing.layoutAnalysis = snap.layoutAnalysis;
    existing.snap = snap.snap;
    existing.gridVisible = snap.gridVisible;
    existing.posterVisible = snap.posterVisible;
    existing.analysisOverlayVisible = snap.analysisOverlayVisible;
    existing.textDefaults = snap.textDefaults;
    const ok = saveLayoutProjects();
    if (!ok) return;
    renderLayoutProjectSelect();
    if (el.layoutProjectSelect) el.layoutProjectSelect.value = existing.id;
    setStatus(`已更新排版项目：${name}`);
    showToast("排版项目已更新");
    return;
  }
  const project = snapshotLayoutProject(name);
  if (!project) return;
  state.layoutProjects.unshift(project);
  const ok = saveLayoutProjects();
  if (!ok) {
    state.layoutProjects.shift();
    return;
  }
  renderLayoutProjectSelect();
  if (el.layoutProjectSelect) el.layoutProjectSelect.value = project.id;
  if (el.layoutProjectNameInput) el.layoutProjectNameInput.value = name;
  setStatus(`已保存排版项目：${name}`);
  showToast("排版项目已保存");
}

async function loadLayoutProjectById(id) {
  const project = state.layoutProjects.find((item) => item.id === id);
  if (!project) {
    setStatus("未找到该排版项目。");
    return;
  }
  const stage = project.stage || {};
  if (stage.mode === "poster" && stage.imageDataUrl) {
    const image = await dataUrlToImage(stage.imageDataUrl);
    state.image = image;
    state.imageDataUrl = stage.imageDataUrl;
    state.imageName = stage.imageName || "";
    state.canvasDraft = null;
    if (el.detectBtn) el.detectBtn.disabled = false;
  } else {
    state.image = null;
    state.imageDataUrl = "";
    state.imageName = "";
    state.canvasDraft = {
      width: clamp(Number(stage.width) || 1080, 320, 4000),
      height: clamp(Number(stage.height) || 1350, 320, 4000),
      background: stage.background || "#ffffff",
    };
    if (el.canvasWidthInput) el.canvasWidthInput.value = String(state.canvasDraft.width);
    if (el.canvasHeightInput) el.canvasHeightInput.value = String(state.canvasDraft.height);
    if (el.canvasBgInput) el.canvasBgInput.value = state.canvasDraft.background;
    if (el.detectBtn) el.detectBtn.disabled = true;
    clearColorPalette();
  }
  state.grid = project.grid ? { ...project.grid } : null;
  state.style = project.style ? { ...project.style } : createDefaultStyle();
  state.layoutItems = cloneLayoutItemsDeep(project.layoutItems);
  state.layoutAnalysis = cloneLayoutAnalysisDeep(project.layoutAnalysis);
  if (!state.layoutItems.length && state.layoutAnalysis?.items?.length) {
    state.layoutItems = cloneVariantItemsWithNewIds(state.layoutAnalysis.items).map((item) => ({
      ...item,
      fromAnalysis: true,
    }));
  }
  state.gridVisible = project.gridVisible !== false;
  state.posterVisible = project.posterVisible !== false;
  state.analysisOverlayVisible = project.analysisOverlayVisible !== false;
  state.snapToGrid = project.snap?.enabled !== false;
  state.snapThreshold = clamp(Number(project.snap?.threshold) || 16, 2, 80);
  state.snapSpan = project.snap?.span !== false;
  state.minSpan = clamp(Number(project.snap?.minSpan) || 1, 1, 12);
  if (project.textDefaults) {
    state.textDefaults = sanitizeTextStyle(project.textDefaults);
  }
  if (el.snapToGridSelect) el.snapToGridSelect.value = state.snapToGrid ? "on" : "off";
  syncGridVisibleSelectsFromState();
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = state.posterVisible ? "on" : "off";
  if (el.analysisOverlaySelect) el.analysisOverlaySelect.value = state.analysisOverlayVisible ? "on" : "off";
  if (el.snapThresholdInput) el.snapThresholdInput.value = String(state.snapThreshold);
  if (el.snapSpanSelect) el.snapSpanSelect.value = state.snapSpan ? "on" : "off";
  if (el.minSpanInput) el.minSpanInput.value = String(state.minSpan);
  syncTextControlsFromModel(state.textDefaults);
  renderLayoutAnalysisMeta();
  state.gridConfirmed = false;
  state.confirmedGrid = null;
  updateConfirmButtonState();
  updateSaveButtonState();
  syncInputsFromGridAndStyle();
  refreshStage();
  resetLayoutHistory();
  setStatus(`已载入排版项目：${project.name}`);
  showToast("排版项目已载入");
}

function deleteSelectedLayoutProject() {
  const id = el.layoutProjectSelect?.value;
  if (!id) {
    setStatus("请先选择一个排版项目。");
    return;
  }
  const target = state.layoutProjects.find((item) => item.id === id);
  const prev = [...state.layoutProjects];
  state.layoutProjects = state.layoutProjects.filter((item) => item.id !== id);
  const ok = saveLayoutProjects();
  if (!ok) {
    state.layoutProjects = prev;
    return;
  }
  renderLayoutProjectSelect();
  if (el.layoutProjectNameInput) el.layoutProjectNameInput.value = "";
  setStatus(`已删除排版项目：${target ? target.name : id}`);
}

function ensureStyleReady() {
  if (state.style) return;
  state.style = createDefaultStyle();
}

function createBlankCanvas() {
  const width = clamp(Number(el.canvasWidthInput?.value) || 1080, 320, 4000);
  const height = clamp(Number(el.canvasHeightInput?.value) || 1350, 320, 4000);
  const background = typeof el.canvasBgInput?.value === "string" ? el.canvasBgInput.value : "#ffffff";
  state.image = null;
  state.imageDataUrl = "";
  state.imageName = "";
  state.posterVisible = true;
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = "on";
  state.canvasDraft = { width, height, background };
  state.grid = createDefaultGrid(width, height);
  ensureStyleReady();
  markGridUnconfirmed();
  updateConfirmButtonState();
  updateSaveButtonState();
  if (el.detectBtn) el.detectBtn.disabled = true;
  syncInputsFromGridAndStyle();
  clearColorPalette();
  clearLayoutAnalysis();
  clearLayoutItems();
  refreshStage();
  resetLayoutHistory();
  setStatus(`已创建空白画布 ${width}×${height}。可从网格库应用网格并排版。`);
}

function buildGridFromSignature(signature, width, height) {
  const cols = clamp(Math.round(signature.cols || 12), 2, 36);
  const rows = clamp(Math.round(signature.rows || 12), 2, 36);
  const marginLeft = clamp((signature.marginLeftRatio || 0) * width, 0, width - 1);
  const marginRight = clamp((signature.marginRightRatio || 0) * width, 0, width - 1);
  const marginTop = clamp((signature.marginTopRatio || 0) * height, 0, height - 1);
  const marginBottom = clamp((signature.marginBottomRatio || 0) * height, 0, height - 1);
  return {
    cols,
    rows,
    angle: clamp(signature.angle || 0, -30, 30),
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    moduleX: Math.max(1, (width - marginLeft - marginRight) / cols),
    moduleY: Math.max(1, (height - marginTop - marginBottom) / rows),
    confidence: 0.82,
    source: "grid-bank",
  };
}

function applySelectedGridBankToStage() {
  const id = el.gridBankSelect?.value;
  if (!id) {
    setStatus("请先选择一个网格库网格。");
    return;
  }
  const entry = state.gridBank.find((item) => item.id === id);
  if (!entry) {
    setStatus("未找到该网格，请重试。");
    return;
  }
  if (!stageExists()) {
    createBlankCanvas();
  }
  const stage = getStageSize();
  if (!stage) return;
  ensureStyleReady();
  state.grid = buildGridFromSignature(entry.signature || {}, stage.width, stage.height);
  markGridUnconfirmed();
  updateConfirmButtonState();
  syncInputsFromGridAndStyle();
  refreshStage();
  setStatus("已应用网格库网格到当前画布。");
}

function addTextLayoutItem() {
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  pushLayoutUndo();
  const item = {
    id: `layout-t-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    type: "text",
    name: `文字 ${state.layoutItems.length + 1}`,
    visible: true,
    locked: false,
    opacity: 1,
    text: "双击编辑文字",
    textStyle: { ...state.textDefaults },
    x: stage.width * 0.12,
    y: stage.height * 0.12,
    width: Math.max(160, stage.width * 0.24),
    height: 56,
  };
  state.layoutItems.push(item);
  setActiveLayoutItem(item.id);
  renderLayoutItems();
  setStatus("已添加文字块，可直接拖拽与双击编辑。");
}

async function addImageLayoutItemFromFile(file) {
  if (!file || !isSupportedImageFile(file)) {
    setStatus(tr("m_onlyJpgPng"));
    return;
  }
  const stage = getStageSize();
  if (!stage) {
    setStatus(tr("m_needCanvas"));
    return;
  }
  pushLayoutUndo();
  const rawSrc = await fileToDataUrl(file);
  const image = await dataUrlToImage(rawSrc);
  const src = await compressImageDataUrlForStorage(rawSrc, {
    maxSide: STORAGE_LAYOUT_IMAGE_MAX_SIDE,
    quality: STORAGE_JPEG_QUALITY,
  });
  // 让导入图片尽量在画布内「最大化」展示，同时保留少量边距
  const borderRatio = 0.08;
  const maxW = stage.width * (1 - borderRatio * 2);
  const maxH = stage.height * (1 - borderRatio * 2);
  const ratio = image.width / Math.max(1, image.height);
  let width = maxW;
  let height = width / Math.max(0.01, ratio);
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }
  const item = {
    id: `layout-i-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    type: "image",
    name: `图片 ${state.layoutItems.length + 1}`,
    visible: true,
    locked: false,
    opacity: 1,
    src,
    // 居中放置
    x: (stage.width - Math.max(80, width)) / 2,
    y: (stage.height - Math.max(80, height)) / 2,
    width: Math.max(80, width),
    height: Math.max(80, height),
  };
  state.layoutItems.push(item);
  setActiveLayoutItem(item.id);
  renderLayoutItems();
  setStatus("已添加图片块，可拖拽调整位置。");
}

function buildAutoLayoutFallback(stage, grid) {
  const innerW = Math.max(1, stage.width - grid.marginLeft - grid.marginRight);
  const innerH = Math.max(1, stage.height - grid.marginTop - grid.marginBottom);
  const colW = innerW / Math.max(1, grid.cols);
  const rowH = innerH / Math.max(1, grid.rows);
  const visualMain = {
    id: makeLayoutId("layout-sh"),
    type: "shape",
    name: "主视觉",
    shapeKind: "ellipse",
    visible: true,
    locked: false,
    opacity: 1,
    x: grid.marginLeft + colW * 1,
    y: grid.marginTop + rowH * 2,
    width: colW * Math.max(4, Math.round(grid.cols * 0.58)),
    height: rowH * Math.max(4, Math.round(grid.rows * 0.5)),
  };
  const visualSub = {
    id: makeLayoutId("layout-sh"),
    type: "shape",
    name: "辅助视觉",
    shapeKind: "capsule",
    visible: true,
    locked: false,
    opacity: 1,
    x: grid.marginLeft + colW * Math.max(1, Math.round(grid.cols * 0.64)),
    y: grid.marginTop + rowH * Math.max(1, Math.round(grid.rows * 0.12)),
    width: colW * Math.max(2, Math.round(grid.cols * 0.28)),
    height: rowH * Math.max(2, Math.round(grid.rows * 0.15)),
  };
  const titleW = colW * Math.max(4, Math.round(grid.cols * 0.64));
  const titleH = rowH * 1.2;
  const title = {
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "标题占位",
    visible: true,
    locked: false,
    opacity: 1,
    x: grid.marginLeft + colW,
    y: grid.marginTop + rowH * Math.max(1, Math.round(grid.rows * 0.74)),
    width: titleW,
    height: titleH,
    textStyle: suggestTextStyleForTextBlock("标题占位", titleW, titleH),
  };
  const subW = colW * Math.max(3, Math.round(grid.cols * 0.46));
  const subH = rowH * 1.05;
  const subtitle = {
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "副标题占位",
    visible: true,
    locked: false,
    opacity: 1,
    x: title.x,
    y: title.y + rowH * 1.35,
    width: subW,
    height: subH,
    textStyle: suggestTextStyleForTextBlock("副标题占位", subW, subH),
  };
  const bodyW = colW * Math.max(5, Math.round(grid.cols * 0.72));
  const bodyH = rowH * Math.max(2, Math.round(grid.rows * 0.16));
  const body = {
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "正文占位",
    visible: true,
    locked: false,
    opacity: 1,
    x: title.x,
    y: subtitle.y + rowH * 1.25,
    width: bodyW,
    height: bodyH,
    textStyle: suggestTextStyleForTextBlock("正文占位", bodyW, bodyH),
  };
  return [visualMain, visualSub, title, subtitle, body];
}
function gridBlockToStageRect(block, g, stageW, stageH) {
  const innerW = Math.max(1, stageW - g.marginLeft - g.marginRight);
  const innerH = Math.max(1, stageH - g.marginTop - g.marginBottom);
  const colW = innerW / Math.max(1, g.cols);
  const rowH = innerH / Math.max(1, g.rows);
  return {
    x: g.marginLeft + block.minC * colW,
    y: g.marginTop + block.minR * rowH,
    width: Math.max(24, (block.maxC - block.minC + 1) * colW),
    height: Math.max(24, (block.maxR - block.minR + 1) * rowH),
  };
}

function sampleRegionVisualMetrics(image, rect) {
  if (!image || !rect || !image.width || !image.height) {
    return { variance: 0, edgeDensity: 0, meanLuma: 128 };
  }
  const ix = clamp(Math.floor(rect.x), 0, Math.max(0, image.width - 1));
  const iy = clamp(Math.floor(rect.y), 0, Math.max(0, image.height - 1));
  const iw = clamp(Math.floor(rect.width), 1, image.width - ix);
  const ih = clamp(Math.floor(rect.height), 1, image.height - iy);
  const maxD = 112;
  const scale = Math.min(1, maxD / Math.max(iw, ih));
  const sw = Math.max(8, Math.round(iw * scale));
  const sh = Math.max(8, Math.round(ih * scale));
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { variance: 0, edgeDensity: 0, meanLuma: 128 };
  try {
    ctx.drawImage(image, ix, iy, iw, ih, 0, 0, sw, sh);
  } catch {
    return { variance: 0, edgeDensity: 0, meanLuma: 128 };
  }
  const { data } = ctx.getImageData(0, 0, sw, sh);
  const gray = new Float32Array(sw * sh);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  let sum = 0;
  let sum2 = 0;
  let edges = 0;
  let n = 0;
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = y * sw + x;
      const g0 = gray[idx];
      sum += g0;
      sum2 += g0 * g0;
      n += 1;
      if (x + 1 < sw && y + 1 < sh) {
        const gx = gray[idx + 1] - g0;
        const gy = gray[idx + sw] - g0;
        edges += Math.hypot(gx, gy);
      }
    }
  }
  const mean = sum / Math.max(1, n);
  const variance = Math.max(0, sum2 / Math.max(1, n) - mean * mean);
  const edgeDensity = edges / Math.max(1, (sw - 1) * (sh - 1) * 255);
  return { variance, edgeDensity, meanLuma: mean };
}

function classifyLayoutBlockByGeometryAndTexture(block, metrics) {
  const aspect = block.w / Math.max(0.01, block.h);
  const invAspect = block.h / Math.max(0.01, block.w);
  let textScore = 0;
  let visualScore = 0;
  if (aspect >= 2.2) textScore += 2.4;
  if (block.h <= 2) textScore += 1.85;
  if (block.cells <= 5 && aspect > 1.32) textScore += 1.25;
  if (block.w >= 5 && block.h <= 3) textScore += 1.15;
  if (block.w >= 7 && block.h <= 4 && aspect >= 1.55) textScore += 0.85;
  if (invAspect >= 2 && block.h >= 3) textScore += 1.05;
  if (block.cells >= 15) visualScore += 1.55;
  if (block.w >= 3 && block.h >= 3 && aspect >= 0.72 && aspect <= 1.48) visualScore += 1.65;
  if (block.cells >= 8 && aspect < 1.5) visualScore += 0.75;

  const { variance, edgeDensity } = metrics;
  if (variance > 920) visualScore += 1.4;
  else if (variance < 190) textScore += 0.5;
  if (edgeDensity > 0.135 && variance > 360) visualScore += 1.15;
  if (edgeDensity > 0.082 && variance < 340) textScore += 0.95;
  if (edgeDensity < 0.048 && variance < 150) textScore += 0.6;
  return textScore >= visualScore ? "textBlock" : "shape";
}

function classifyLayoutBlockRoleLegacy(block) {
  const aspect = block.w / Math.max(1, block.h);
  return block.h <= 2 || aspect >= 2.15 || (block.cells <= 5 && aspect > 1.45) ? "textBlock" : "shape";
}

function suggestTextStyleForTextBlock(name, widthPx, heightPx) {
  const fontFamily = state.textDefaults.fontFamily;
  const color = state.textDefaults.color;
  const short = Math.min(widthPx, heightPx);
  const long = Math.max(widthPx, heightPx);
  let fontSize = clamp(Math.round(long * 0.068), 12, 44);
  let fontWeight = 500;
  if (name.includes("标题")) {
    fontSize = clamp(Math.round(short * 0.27), 20, 96);
    fontWeight = 700;
  } else if (name.includes("副标题")) {
    fontSize = clamp(Math.round(short * 0.19), 15, 64);
    fontWeight = 600;
  } else if (name.includes("正文") || name.includes("说明")) {
    fontSize = clamp(Math.round(heightPx / 4.25), 12, 40);
    fontWeight = 400;
  }
  return {
    fontFamily,
    fontSize,
    fontWeight,
    color,
  };
}

function insetTextBlockRect(rect, stageW, stageH) {
  const ir = Math.min(rect.width, rect.height);
  const pad = clamp(ir * 0.048, 4, Math.min(rect.width, rect.height) * 0.2);
  const nx = rect.x + pad;
  const ny = rect.y + pad * 0.88;
  const nw = Math.max(24, rect.width - 2 * pad);
  const nh = Math.max(18, rect.height - 2 * pad * 0.88);
  const out = { x: nx, y: ny, width: nw, height: nh };
  out.x = clamp(out.x, 0, Math.max(0, stageW - out.width));
  out.y = clamp(out.y, 0, Math.max(0, stageH - out.height));
  return out;
}

function separateOverlappingTextFromMainVisual(items, stageW, stageH) {
  const shapes = items.filter((it) => it && it.type === "shape");
  const texts = items.filter((it) => it && it.type === "textBlock");
  if (!shapes.length || !texts.length) return;
  shapes.sort((a, b) => b.width * b.height - a.width * a.height);
  const main = shapes[0];
  const gap = Math.max(10, Math.round(Math.min(stageW, stageH) * 0.018));
  texts.forEach((t) => {
    const iw = Math.max(0, Math.min(t.x + t.width, main.x + main.width) - Math.max(t.x, main.x));
    const ih = Math.max(0, Math.min(t.y + t.height, main.y + main.height) - Math.max(t.y, main.y));
    const inter = iw * ih;
    const ta = t.width * t.height;
    if (inter / Math.max(1, ta) < 0.26) return;
    const belowY = main.y + main.height + gap;
    if (belowY + t.height <= stageH - 6) {
      t.y = belowY;
    } else {
      const rightX = main.x + main.width + gap;
      if (rightX + t.width <= stageW - 6) t.x = rightX;
      else t.y = clamp(main.y - t.height - gap, 0, stageH - t.height);
    }
    clampLayoutItemInStage(t, stageW, stageH);
  });
}

function extractAutoLayoutByGridEnergy(image, grid) {
  const cols = clamp(Math.round(grid.cols || 12), 2, 36);
  const rows = clamp(Math.round(grid.rows || 12), 2, 36);
  const sampleW = clamp(cols * 14, 120, 680);
  const sampleH = clamp(rows * 14, 120, 680);
  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(image, 0, 0, sampleW, sampleH);
  const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
  const gray = new Float32Array(sampleW * sampleH);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  const cellScores = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const cellW = sampleW / cols;
  const cellH = sampleH / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(c * cellW);
      const y0 = Math.floor(r * cellH);
      const x1 = Math.max(x0 + 1, Math.floor((c + 1) * cellW));
      const y1 = Math.max(y0 + 1, Math.floor((r + 1) * cellH));
      let sum = 0;
      let sum2 = 0;
      let edges = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = y * sampleW + x;
          const g = gray[idx];
          sum += g;
          sum2 += g * g;
          count += 1;
          if (x + 1 < sampleW && y + 1 < sampleH) {
            const gx = gray[idx + 1] - g;
            const gy = gray[idx + sampleW] - g;
            edges += Math.hypot(gx, gy);
          }
        }
      }
      const mean = sum / Math.max(1, count);
      const variance = Math.max(0, sum2 / Math.max(1, count) - mean * mean);
      const edgeNorm = edges / Math.max(1, count * 255);
      cellScores[r][c] = Math.sqrt(variance) * 0.72 + edgeNorm * 85;
    }
  }
  const flat = cellScores.flat();
  const avg = average(flat);
  const std = deviation(flat, avg);
  const threshold = avg + std * 0.3;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const blocks = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c] || cellScores[r][c] < threshold) continue;
      const queue = [[r, c]];
      visited[r][c] = true;
      let minR = r;
      let maxR = r;
      let minC = c;
      let maxC = c;
      let cells = 0;
      let scoreSum = 0;
      while (queue.length) {
        const [cr, cc] = queue.shift();
        cells += 1;
        scoreSum += cellScores[cr][cc];
        if (cr < minR) minR = cr;
        if (cr > maxR) maxR = cr;
        if (cc < minC) minC = cc;
        if (cc > maxC) maxC = cc;
        dirs.forEach(([dr, dc]) => {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
          if (visited[nr][nc]) return;
          if (cellScores[nr][nc] < threshold) return;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        });
      }
      const w = maxC - minC + 1;
      const h = maxR - minR + 1;
      if (cells < 2) continue;
      blocks.push({ minR, maxR, minC, maxC, w, h, cells, score: scoreSum / cells });
    }
  }
  blocks.sort((a, b) => b.score * b.cells - a.score * a.cells);
  return blocks.slice(0, 10);
}

function makeLayoutId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function renderAutoLayoutVariantSelect() {
  if (!el.autoLayoutVariantSelect) return;
  const prev = el.autoLayoutVariantSelect.value;
  el.autoLayoutVariantSelect.innerHTML = "";
  if (!state.autoLayoutVariants.length) {
    el.autoLayoutVariantSelect.innerHTML = '<option value="">尚未生成方案</option>';
    renderAutoLayoutVariantCards("");
    return;
  }
  state.autoLayoutVariants.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = `${v.name} · ${v.desc || "自动生成"}`;
    el.autoLayoutVariantSelect.appendChild(opt);
  });
  const hasPrev = state.autoLayoutVariants.some((v) => v.id === prev);
  const activeId = hasPrev ? prev : state.autoLayoutVariants[0].id;
  el.autoLayoutVariantSelect.value = activeId;
  renderAutoLayoutVariantCards(activeId);
}

function renderAutoLayoutVariantCards(activeId = "") {
  if (!el.autoLayoutVariantCards) return;
  el.autoLayoutVariantCards.innerHTML = "";
  if (!state.autoLayoutVariants.length) return;
  state.autoLayoutVariants.forEach((variant) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "variant-card";
    if (variant.id === activeId) card.classList.add("is-active");
    card.dataset.variantId = variant.id;

    const title = document.createElement("div");
    title.className = "variant-card-title";
    title.textContent = variant.name;
    card.appendChild(title);

    const desc = document.createElement("div");
    desc.className = "variant-card-desc";
    desc.textContent = variant.desc || "自动生成";
    card.appendChild(desc);

    const checks = Array.isArray(variant.checks) ? variant.checks.slice(0, 2) : [];
    const checksNode = document.createElement("div");
    checksNode.className = "variant-card-checks";
    checksNode.textContent = checks.length ? checks.join(" · ") : "已生成方案";
    card.appendChild(checksNode);

    card.addEventListener("click", () => {
      applyAutoLayoutVariantById(variant.id);
    });

    el.autoLayoutVariantCards.appendChild(card);
  });
}

function cloneVariantItemsWithNewIds(items) {
  return (items || []).map((item) => ({
    ...item,
    id: makeLayoutId(item.type === "textBlock" ? "layout-tb" : item.type === "shape" ? "layout-sh" : "layout"),
  }));
}

function applyAutoLayoutVariantById(id) {
  const variant = state.autoLayoutVariants.find((v) => v.id === id);
  if (!variant) {
    setStatus("请先生成自动排版方案。");
    return;
  }
  pushLayoutUndo();
  const items = cloneVariantItemsWithNewIds(variant.items);
  state.layoutItems = items;
  state.activeLayoutItemId = items[0]?.id || "";
  renderLayoutItems();
  if (el.autoLayoutVariantSelect && el.autoLayoutVariantSelect.value !== variant.id) {
    el.autoLayoutVariantSelect.value = variant.id;
  }
  renderAutoLayoutVariantCards(variant.id);
  setStatus(`已应用 ${variant.name}（${variant.desc || "AI方案"}）。`);
  showToast(`已切换到 ${variant.name}`);
}

function buildRoleItemsFromBlocks(stage, g, blocks, image) {
  const innerW = Math.max(1, stage.width - g.marginLeft - g.marginRight);
  const innerH = Math.max(1, stage.height - g.marginTop - g.marginBottom);
  const colW = innerW / Math.max(1, g.cols);
  const rowH = innerH / Math.max(1, g.rows);
  const toRect = (b) => ({
    x: g.marginLeft + b.minC * colW,
    y: g.marginTop + b.minR * rowH,
    width: Math.max(24, (b.maxC - b.minC + 1) * colW),
    height: Math.max(24, (b.maxR - b.minR + 1) * rowH),
  });
  const hasImage = Boolean(image && image.width && image.height);
  const textBlocks = [];
  const visualBlocks = [];
  blocks.forEach((b) => {
    let role;
    if (hasImage) {
      const r = gridBlockToStageRect(b, g, stage.width, stage.height);
      const metrics = sampleRegionVisualMetrics(image, r);
      role = classifyLayoutBlockByGeometryAndTexture(b, metrics);
    } else {
      role = classifyLayoutBlockRoleLegacy(b);
    }
    if (role === "textBlock") textBlocks.push(b);
    else visualBlocks.push(b);
  });
  visualBlocks.sort((a, b) => b.cells * b.score - a.cells * a.score);
  textBlocks.sort((a, b) => {
    const ra = a.minR + a.h * 0.5;
    const rb = b.minR + b.h * 0.5;
    if (Math.abs(ra - rb) > 1.05) return ra - rb;
    return a.minC + a.w * 0.5 - (b.minC + b.w * 0.5);
  });
  const items = [];
  const defaultItems = buildAutoLayoutFallback(stage, g);
  const defaultMain = defaultItems.find((item) => item.name.includes("主视觉"));
  const defaultSub = defaultItems.find((item) => item.name.includes("辅助视觉"));
  const defaultTitle = defaultItems.find((item) => item.name.includes("标题"));
  const defaultSubtitle = defaultItems.find((item) => item.name.includes("副标题"));
  const defaultBody = defaultItems.find((item) => item.name.includes("正文"));
  if (visualBlocks[0]) {
    const rect = toRect(visualBlocks[0]);
    items.push({
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "主视觉",
      shapeKind: rect.height > rect.width * 1.25 ? "ellipse" : rect.width > rect.height * 1.8 ? "capsule" : "diamond",
      visible: true,
      locked: false,
      opacity: 1,
      ...rect,
    });
  } else if (defaultMain) {
    items.push({ ...defaultMain, id: makeLayoutId("layout-sh") });
  }
  if (visualBlocks[1]) {
    const rect = toRect(visualBlocks[1]);
    items.push({
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "辅助视觉",
      shapeKind: rect.width > rect.height * 1.4 ? "capsule" : "triangle",
      visible: true,
      locked: false,
      opacity: 1,
      ...rect,
    });
  } else if (defaultSub) {
    items.push({ ...defaultSub, id: makeLayoutId("layout-sh") });
  }
  const textNames = ["标题占位", "副标题占位", "正文占位", "说明占位"];
  textBlocks.slice(0, 4).forEach((b, i) => {
    const name = textNames[i] || `文本区 ${i + 1}`;
    const raw = toRect(b);
    const inset = insetTextBlockRect(raw, stage.width, stage.height);
    items.push({
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name,
      visible: true,
      locked: false,
      opacity: 1,
      textStyle: suggestTextStyleForTextBlock(name, inset.width, inset.height),
      ...inset,
    });
  });
  if (!items.some((item) => item.name.includes("标题")) && defaultTitle) {
    items.push({ ...defaultTitle, id: makeLayoutId("layout-tb") });
  }
  if (!items.some((item) => item.name.includes("副标题")) && defaultSubtitle) {
    items.push({ ...defaultSubtitle, id: makeLayoutId("layout-tb") });
  }
  if (!items.some((item) => item.name.includes("正文")) && defaultBody) {
    items.push({ ...defaultBody, id: makeLayoutId("layout-tb") });
  }
  separateOverlappingTextFromMainVisual(items, stage.width, stage.height);
  return items;
}

function buildRectByCells(g, col, row, colSpan, rowSpan) {
  const innerW = Math.max(1, (g._stageW || 1) - g.marginLeft - g.marginRight);
  const innerH = Math.max(1, (g._stageH || 1) - g.marginTop - g.marginBottom);
  const colW = innerW / Math.max(1, g.cols);
  const rowH = innerH / Math.max(1, g.rows);
  return {
    x: g.marginLeft + col * colW,
    y: g.marginTop + row * rowH,
    width: Math.max(24, colSpan * colW),
    height: Math.max(24, rowSpan * rowH),
  };
}

function computeAutoLayoutChecks(items, stageW, stageH) {
  const checks = [];
  if (!Array.isArray(items) || !items.length) return checks;

  // 基础重叠检查（粗略）
  let overlapPairs = 0;
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    if (!a) continue;
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j];
      if (!b) continue;
      const ix = Math.max(a.x, b.x);
      const iy = Math.max(a.y, b.y);
      const ax2 = a.x + a.width;
      const ay2 = a.y + a.height;
      const bx2 = b.x + b.width;
      const by2 = b.y + b.height;
      const iw = Math.max(0, Math.min(ax2, bx2) - ix);
      const ih = Math.max(0, Math.min(ay2, by2) - iy);
      if (!iw || !ih) continue;
      const inter = iw * ih;
      const areaMin = Math.max(1, Math.min(a.width * a.height, b.width * b.height));
      if (inter / areaMin > 0.18) {
        overlapPairs += 1;
      }
    }
  }
  if (overlapPairs > 0) {
    checks.push(`存在 ${overlapPairs} 处版面元素重叠，建议微调。`);
  } else {
    checks.push("版面元素无明显重叠。");
  }

  // 主视觉位置检查：是否落在画面中部 1/3～2/3 区域
  const main = items.find((it) => it.type === "shape" && typeof it.name === "string" && it.name.includes("主视觉"));
  if (main && stageW > 0 && stageH > 0) {
    const cx = main.x + main.width / 2;
    const cy = main.y + main.height / 2;
    const nx = cx / stageW;
    const ny = cy / stageH;
    if (nx < 0.18 || nx > 0.82 || ny < 0.18 || ny > 0.82) {
      checks.push("主视觉偏离画面视觉重心，可考虑移动至中央偏上的区域。");
    } else {
      checks.push("主视觉落在画面视觉重心附近。");
    }
  }

  return checks;
}

function createAutoLayoutVariants(stage, grid, roleItems) {
  const g = { ...grid, _stageW: stage.width, _stageH: stage.height };
  const cols = clamp(Math.round(g.cols || 12), 4, 36);
  const rows = clamp(Math.round(g.rows || 12), 4, 36);
  const baseRoleItems = roleItems.length ? roleItems : buildAutoLayoutFallback(stage, grid);
  const findRole = (nameLike, fallbackBuilder) => {
    const fromBase = baseRoleItems.find((i) => i.name.includes(nameLike));
    if (fromBase) return { ...fromBase };
    return fallbackBuilder ? fallbackBuilder() : null;
  };
  const mainVisual = findRole("主视觉", () => ({
    id: makeLayoutId("layout-sh"),
    type: "shape",
    name: "主视觉",
    shapeKind: "ellipse",
    visible: true,
    locked: false,
    opacity: 1,
    ...buildRectByCells(g, 1, 2, Math.max(4, Math.round(cols * 0.58)), Math.max(4, Math.round(rows * 0.5))),
  }));
  const subVisual = findRole("辅助视觉", () => ({
    id: makeLayoutId("layout-sh"),
    type: "shape",
    name: "辅助视觉",
    shapeKind: "capsule",
    visible: true,
    locked: false,
    opacity: 1,
    ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.68)), Math.max(1, Math.round(rows * 0.16)), Math.max(2, Math.round(cols * 0.24)), Math.max(2, Math.round(rows * 0.14))),
  }));
  const title = findRole("标题", () => ({
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "标题占位",
    visible: true,
    locked: false,
    opacity: 1,
    ...buildRectByCells(g, 1, Math.max(1, Math.round(rows * 0.72)), Math.max(4, Math.round(cols * 0.64)), 1),
  }));
  const subtitle = findRole("副标题", () => ({
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "副标题占位",
    visible: true,
    locked: false,
    opacity: 1,
    ...buildRectByCells(g, 1, Math.max(2, Math.round(rows * 0.82)), Math.max(3, Math.round(cols * 0.48)), 1),
  }));
  const body = findRole("正文", () => ({
    id: makeLayoutId("layout-tb"),
    type: "textBlock",
    name: "正文占位",
    visible: true,
    locked: false,
    opacity: 1,
    ...buildRectByCells(g, 1, Math.max(3, Math.round(rows * 0.88)), Math.max(5, Math.round(cols * 0.74)), Math.max(1, Math.round(rows * 0.12))),
  }));
  const baseTextItems = [title, subtitle, body]
    .filter(Boolean)
    .map((item, idx) => ({ ...item, id: makeLayoutId("layout-tb"), name: ["标题占位", "副标题占位", "正文占位"][idx] }));

  const variantAItems = cloneVariantItemsWithNewIds(baseRoleItems);

  const variantBItems = [
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "主视觉",
      shapeKind: mainVisual?.shapeKind || "ellipse",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, 1, 1, Math.max(4, Math.round(cols * 0.54)), Math.max(4, Math.round(rows * 0.7))),
    },
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "辅助视觉",
      shapeKind: "triangle",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.56)), Math.max(2, Math.round(rows * 0.6)), Math.max(2, Math.round(cols * 0.34)), Math.max(2, Math.round(rows * 0.26))),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.6)), 1, Math.max(3, Math.round(cols * 0.34)), 1),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "副标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.6)), 3, Math.max(3, Math.round(cols * 0.3)), 1),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "正文占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.6)), 5, Math.max(3, Math.round(cols * 0.34)), Math.max(2, Math.round(rows * 0.24))),
    },
  ];

  const variantCItems = [
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, 1, 1, Math.max(4, Math.round(cols * 0.66)), 1),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "副标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, 1, 3, Math.max(3, Math.round(cols * 0.52)), 1),
    },
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "主视觉",
      shapeKind: "diamond",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.16)), Math.max(2, Math.round(rows * 0.3)), Math.max(4, Math.round(cols * 0.68)), Math.max(3, Math.round(rows * 0.44))),
    },
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "辅助视觉",
      shapeKind: "capsule",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.7)), Math.max(1, Math.round(rows * 0.2)), Math.max(2, Math.round(cols * 0.22)), Math.max(2, Math.round(rows * 0.12))),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "正文占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.12)), Math.max(2, Math.round(rows * 0.82)), Math.max(5, Math.round(cols * 0.76)), Math.max(1, Math.round(rows * 0.14))),
    },
  ];

  const variantDItems = [
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "主视觉",
      shapeKind: "ellipse",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.28)), Math.max(2, Math.round(rows * 0.2)), Math.max(4, Math.round(cols * 0.48)), Math.max(4, Math.round(rows * 0.48))),
    },
    {
      id: makeLayoutId("layout-sh"),
      type: "shape",
      name: "辅助视觉",
      shapeKind: subVisual?.shapeKind || "triangle",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, 1, Math.max(2, Math.round(rows * 0.56)), Math.max(2, Math.round(cols * 0.24)), Math.max(2, Math.round(rows * 0.26))),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.18)), Math.max(1, Math.round(rows * 0.08)), Math.max(5, Math.round(cols * 0.66)), 1),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "副标题占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.18)), Math.max(2, Math.round(rows * 0.16)), Math.max(4, Math.round(cols * 0.52)), 1),
    },
    {
      id: makeLayoutId("layout-tb"),
      type: "textBlock",
      name: "正文占位",
      visible: true,
      locked: false,
      opacity: 1,
      ...buildRectByCells(g, Math.max(1, Math.round(cols * 0.56)), Math.max(2, Math.round(rows * 0.62)), Math.max(3, Math.round(cols * 0.34)), Math.max(2, Math.round(rows * 0.24))),
    },
  ];

  if (!variantAItems.some((item) => item.type === "textBlock")) {
    variantAItems.push(...baseTextItems);
  }
  const buildVariant = (id, name, desc, items) => ({
    id,
    name,
    desc,
    items,
    checks: computeAutoLayoutChecks(items, stage.width, stage.height),
  });
  return [
    buildVariant("variant-a", "方案 A", "原图结构映射（增强）", variantAItems),
    buildVariant("variant-b", "方案 B", "左图右文（强对比）", variantBItems),
    buildVariant("variant-c", "方案 C", "上文下图（叙事型）", variantCItems),
    buildVariant("variant-d", "方案 D", "中心视觉（杂志型）", variantDItems),
  ];
}

function autoLayoutPlaceholdersFromAnalysis() {
  const stage = getStageSize();
  if (!stage || !state.grid) {
    setStatus("请先上传海报或创建画布并生成网格。");
    return;
  }
  let roleItems = [];
  if (state.layoutAnalysis?.items?.length) {
    roleItems = state.layoutAnalysis.items.map((item) => ({ ...item }));
  } else if (state.image) {
    const blocks = extractAutoLayoutByGridEnergy(state.image, state.grid);
    roleItems = blocks.length ? buildRoleItemsFromBlocks(stage, state.grid, blocks, state.image) : [];
  }
  state.autoLayoutVariants = createAutoLayoutVariants(stage, state.grid, roleItems);
  renderAutoLayoutVariantSelect();
  if (!state.autoLayoutVariants.length) {
    setStatus("未能生成自动排版方案，请调整网格后重试。");
    return;
  }
  const firstId = state.autoLayoutVariants[0].id;
  if (el.autoLayoutVariantSelect) el.autoLayoutVariantSelect.value = firstId;
  applyAutoLayoutVariantById(firstId);
  showToast("AI自动排版已生成多方案");
}

function updateTemplateButtons() {
  const hasImageAndGrid = Boolean(state.image && state.grid);
  el.learnTemplateBtn.disabled = !hasImageAndGrid;
  const hasTemplate = Boolean(el.templateSelect.value);
  el.applyTemplateBtn.disabled = !hasTemplate || !state.image;
  el.deleteTemplateBtn.disabled = !hasTemplate;
}

function renderTemplateSelect() {
  const previous = el.templateSelect.value;
  el.templateSelect.innerHTML = "";
  if (!state.templates.length) {
    el.templateSelect.innerHTML = '<option value="">暂无模板</option>';
    updateTemplateButtons();
    return;
  }
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "请选择模板";
  el.templateSelect.appendChild(placeholder);
  state.templates.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    el.templateSelect.appendChild(option);
  });
  el.templateSelect.value = state.templates.some((item) => item.id === previous) ? previous : "";
  updateTemplateButtons();
  // #region agent log
  fetch("http://127.0.0.1:7878/ingest/69092420-af50-4cb2-9a7c-3ba688b9df71", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "2598c1" },
    body: JSON.stringify({
      sessionId: "2598c1",
      location: "app.js:renderTemplateSelect",
      message: "template select rebuilt",
      data: {
        locale: state.locale,
        opt0: el.templateSelect.options[0] ? el.templateSelect.options[0].textContent : "",
        hasCJK: el.templateSelect.options[0]
          ? /[\u4e00-\u9fff]/.test(el.templateSelect.options[0].textContent)
          : false,
      },
      timestamp: Date.now(),
      hypothesisId: "H2-dynamic-selects",
    }),
  }).catch(() => {});
  // #endregion
}

function updateCategoryOptions() {
  const categories = Array.from(new Set(state.library.map((item) => item.category))).sort();
  const previous = el.searchCategoryInput.value;
  el.searchCategoryInput.innerHTML = '<option value="">全部</option>';
  categories.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    el.searchCategoryInput.appendChild(opt);
  });
  el.searchCategoryInput.value = categories.includes(previous) ? previous : "";
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "library-item";
  card.dataset.id = item.id;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `载入海报：${item.name}`);

  const thumb = document.createElement("img");
  thumb.src = item.imageDataUrl;
  thumb.alt = item.name;
  const title = document.createElement("h3");
  title.textContent = item.name;
  const meta = document.createElement("p");
  meta.className = "library-meta";
  meta.appendChild(document.createTextNode(`分类：${item.category}`));
  meta.appendChild(document.createElement("br"));
  meta.appendChild(document.createTextNode(`网格：${item.grid.cols} x ${item.grid.rows}`));
  meta.appendChild(document.createElement("br"));
  meta.appendChild(
    document.createTextNode(`标签：${(item.tags || []).join(" / ") || "-"}`),
  );

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const loadBtn = document.createElement("button");
  loadBtn.type = "button";
  loadBtn.dataset.action = "load";
  loadBtn.dataset.id = item.id;
  loadBtn.textContent = "载入";
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.dataset.action = "delete";
  delBtn.dataset.id = item.id;
  delBtn.textContent = "删除";
  actions.appendChild(loadBtn);
  actions.appendChild(delBtn);

  card.appendChild(thumb);
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(actions);
  return card;
}

function renderLibrary(list = state.library) {
  el.libraryList.innerHTML = "";
  if (!list.length) {
    el.libraryList.innerHTML = '<p class="status">暂无海报，请先识别并保存。</p>';
    return;
  }
  list.forEach((item) => {
    el.libraryList.appendChild(createCard(item));
  });
}

function searchLibrary() {
  const cols = Number(el.searchColsInput.value) || 0;
  const rows = Number(el.searchRowsInput.value) || 0;
  const category = el.searchCategoryInput.value.trim();
  const text = el.searchTextInput.value.trim().toLowerCase();

  const filtered = state.library.filter((item) => {
    if (cols > 0 && Math.abs(item.grid.cols - cols) > 2) return false;
    if (rows > 0 && Math.abs(item.grid.rows - rows) > 2) return false;
    if (category && item.category !== category) return false;
    if (text) {
      const hitName = item.name.toLowerCase().includes(text);
      const hitTags = (item.tags || []).join(",").toLowerCase().includes(text);
      if (!hitName && !hitTags) return false;
    }
    return true;
  });
  renderLibrary(filtered);
  setStatus(`检索到 ${filtered.length} 张海报。`);
}

function resetSearch() {
  el.searchColsInput.value = "0";
  el.searchRowsInput.value = "0";
  el.searchCategoryInput.value = "";
  el.searchTextInput.value = "";
  renderLibrary();
  setStatus("已重置筛选。");
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isSupportedImageFile(file) {
  if (!file) return false;
  if (/image\/(png|jpeg)/.test(file.type)) return true;
  const name = (file.name || "").toLowerCase();
  return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
}

async function dataUrlToImage(dataUrl) {
  return await new Promise((resolve, reject) => {
    const img = new Image();

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    img.onload = async () => {
      try {
        // Some browsers/image encodings may fail decode(); onload is enough for rendering.
        if (typeof img.decode === "function") {
          try {
            await img.decode();
          } catch {
            // Fallback to onload-resolved image.
          }
        }
        cleanup();
        resolve(img);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error("图片解码失败，请尝试重新导出为标准 JPG/PNG。"));
    };

    img.src = dataUrl;
  });
}

async function compressImageDataUrlForStorage(
  dataUrl,
  { maxSide = STORAGE_POSTER_MAX_SIDE, quality = STORAGE_JPEG_QUALITY } = {},
) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) return dataUrl;
  const image = await dataUrlToImage(dataUrl);
  const longSide = Math.max(image.width, image.height);
  const scale = Math.min(1, maxSide / Math.max(1, longSide));
  const targetW = Math.max(16, Math.round(image.width * scale));
  const targetH = Math.max(16, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, targetW, targetH);
  const jpeg = canvas.toDataURL("image/jpeg", quality);
  if (jpeg.length < dataUrl.length) return jpeg;
  if (scale < 0.995) {
    const pngScaled = canvas.toDataURL("image/png");
    if (pngScaled.length < dataUrl.length) return pngScaled;
  }
  return dataUrl;
}

async function loadPosterFile(file) {
  if (!file) return;
  if (!isSupportedImageFile(file)) {
    setStatus(tr("m_onlyJpgPng"));
    return;
  }
  const rawDataUrl = await fileToDataUrl(file);
  const image = await dataUrlToImage(rawDataUrl);
  const dataUrl = await compressImageDataUrlForStorage(rawDataUrl, {
    maxSide: STORAGE_POSTER_MAX_SIDE,
    quality: STORAGE_JPEG_QUALITY,
  });
  state.image = image;
  state.imageDataUrl = dataUrl;
  state.imageName = file.name;
  state.posterVisible = true;
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = "on";
  state.canvasDraft = null;
  state.style = createDefaultStyle();
  clearLayoutAnalysis();
  markGridUnconfirmed();
  updateConfirmButtonState();
  clearLayoutItems();
  el.detectBtn.disabled = false;
  updateTemplateButtons();
  runGridDetection({ manual: false });
  renderColorPalette();
  renderGraphicsSemantics();
  resetLayoutHistory();
}

function clearPoster() {
  state.image = null;
  state.imageDataUrl = "";
  state.imageName = "";
  state.posterVisible = true;
  state.canvasDraft = null;
  state.grid = null;
  state.gridConfirmed = false;
  state.confirmedGrid = null;
  state.style = null;
  el.posterCanvas.width = 0;
  el.posterCanvas.height = 0;
  el.gridCanvas.width = 0;
  el.gridCanvas.height = 0;
  el.detectBtn.disabled = true;
  el.savePosterBtn.disabled = true;
  el.posterInput.value = "";
  el.gridMeta.textContent = tr("gridMetaEmpty");
  sessionStorage.removeItem(FORM_DRAFT_KEY);
  if (el.posterNameInput) el.posterNameInput.value = "";
  if (el.posterTagsInput) el.posterTagsInput.value = "";
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = "on";
  clearColorPalette();
  clearLayoutAnalysis();
  clearLayoutItems();
  updateConfirmButtonState();
  updateSaveButtonState();
  updateTemplateButtons();
  resetLayoutHistory();
  setStatus(tr("m_cleared"));
}

function runGridDetection(options = {}) {
  const manual = Boolean(options.manual);
  if (!state.image) {
    setStatus(tr("m_needPosterForDetect"));
    return;
  }
  const detected = detectGridFromImage(state.image);
  state.grid = refineWithLearnedTemplates(detected, state.image);
  state.grid = fitGridProportionsToPoster(state.grid, state.image.width, state.image.height);
  markGridUnconfirmed();
  updateConfirmButtonState();
  syncInputsFromGridAndStyle();
  refreshStage();
  analyzePosterLayoutZones({ silent: true });
  updateGridMeta();
  const conf = (state.grid.confidence * 100).toFixed(1);
  const label = manual ? "网格识别完成" : "已自动识别网格";
  setStatus(`${label}：${state.grid.cols} × ${state.grid.rows}（置信度 ${conf}%，已与画布比例贴合）。请确认网格后再保存。`);
}

function detectGrid() {
  runGridDetection({ manual: true });
}

function applyGridStyle() {
  if (!stageExists() || !state.grid || !state.style) return;
  readGridAndStyleFromInputs();
  markGridUnconfirmed();
  updateConfirmButtonState();
  refreshStage();
  setStatus("网格样式已更新，请重新确认网格。");
}

function applyPosterProportionFit() {
  const stage = getStageSize();
  if (!stage || !state.grid || !state.style) {
    setStatus("请先准备画布并确保已有网格。");
    return;
  }
  readGridAndStyleFromInputs();
  state.grid = fitGridProportionsToPoster(state.grid, stage.width, stage.height);
  markGridUnconfirmed();
  updateConfirmButtonState();
  syncInputsFromGridAndStyle();
  refreshStage();
  setStatus("已按画布比例贴合，请确认网格后再保存。");
}

function confirmCurrentGrid() {
  if (!stageExists() || !state.grid) {
    setStatus("请先创建画布或上传海报并完成网格。");
    return;
  }
  readGridAndStyleFromInputs();
  state.confirmedGrid = { ...state.grid };
  state.gridConfirmed = true;
  updateSaveButtonState();
  setStatus("当前网格已确认，可保存图片并入库网格。");
  showToast("网格已确认");
}

async function saveCurrentPoster() {
  if (!state.image || !state.grid || !state.style) {
    setStatus("没有可保存的海报。");
    return;
  }
  if (!state.gridConfirmed || !state.confirmedGrid) {
    setStatus("请先点击「确认当前网格」，再执行保存。");
    return;
  }
  const name = el.posterNameInput.value.trim() || state.imageName || `poster-${Date.now()}`;
  const tags = el.posterTagsInput.value.split(",").map((t) => t.trim()).filter(Boolean);
  const savedGrid = { ...state.confirmedGrid };
  if (state.imageDataUrl) {
    try {
      state.imageDataUrl = await compressImageDataUrlForStorage(state.imageDataUrl, {
        maxSide: STORAGE_POSTER_MAX_SIDE,
        quality: STORAGE_JPEG_QUALITY,
      });
    } catch (error) {
      console.error("poster compression before save failed:", error);
    }
  }
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name,
    tags,
    width: state.image.width,
    height: state.image.height,
    imageDataUrl: state.imageDataUrl,
    grid: savedGrid,
    style: { ...state.style },
    posterVisible: state.posterVisible !== false,
    layoutAnalysis: cloneLayoutAnalysisDeep(state.layoutAnalysis),
    category: classifyByGrid(savedGrid, state.image.width, state.image.height),
    createdAt: new Date().toISOString(),
  };
  state.library.unshift(item);
  const libraryOk = saveLibrary();
  if (!libraryOk) {
    state.library.shift();
    return;
  }
  const gridStoreResult = upsertGridBank(savedGrid, state.image.width, state.image.height, name);
  if (!gridStoreResult.ok) return;
  renderGridBankSelect();
  updateCategoryOptions();
  renderLibrary();
  sessionStorage.removeItem(FORM_DRAFT_KEY);
  setStatus(`已保存海报并入库网格（网格库共 ${gridStoreResult.total} 条）。`);
  showToast(gridStoreResult.added ? "已保存海报并新增网格" : "已保存海报，网格已累计");
}

function learnCurrentTemplate() {
  if (!state.image || !state.grid) {
    setStatus("请先上传并识别海报网格。");
    return;
  }
  const name = el.templateNameInput.value.trim() || `模板 ${new Date().toLocaleString()}`;
  const template = {
    id: `tpl-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    name,
    aspect: state.image.width / Math.max(1, state.image.height),
    grid: normalizeGridForTemplate(state.grid, state.image.width, state.image.height),
    createdAt: new Date().toISOString(),
  };
  state.templates.unshift(template);
  const ok = saveTemplates();
  if (!ok) {
    state.templates.shift();
    return;
  }
  renderTemplateSelect();
  el.templateSelect.value = template.id;
  updateTemplateButtons();
  setStatus(`已学习模板：${name}`);
}

function applySelectedTemplateToCurrentImage() {
  if (!state.image) {
    setStatus("请先上传海报。");
    return;
  }
  const id = el.templateSelect.value;
  const template = state.templates.find((item) => item.id === id);
  if (!template) {
    setStatus("请先选择一个模板。");
    return;
  }
  state.grid = denormalizeTemplateGrid(template.grid, state.image.width, state.image.height);
  state.grid = fitGridProportionsToPoster(state.grid, state.image.width, state.image.height);
  markGridUnconfirmed();
  updateConfirmButtonState();
  syncInputsFromGridAndStyle();
  refreshStage();
  setStatus(`已应用模板：${template.name}（请确认网格后再保存）。`);
}

function deleteSelectedTemplate() {
  const id = el.templateSelect.value;
  if (!id) return;
  const target = state.templates.find((item) => item.id === id);
  const prev = [...state.templates];
  state.templates = state.templates.filter((item) => item.id !== id);
  const ok = saveTemplates();
  if (!ok) {
    state.templates = prev;
    return;
  }
  renderTemplateSelect();
  updateTemplateButtons();
  setStatus(`已删除模板：${target ? target.name : id}`);
}

async function loadPosterFromLibrary(id) {
  const item = state.library.find((entry) => entry.id === id);
  if (!item) return;
  const image = await dataUrlToImage(item.imageDataUrl);
  state.image = image;
  state.imageDataUrl = item.imageDataUrl;
  state.imageName = item.name;
  state.canvasDraft = null;
  state.grid = { ...item.grid };
  state.style = { ...item.style };
  state.posterVisible = item.posterVisible !== false;
  state.layoutAnalysis = cloneLayoutAnalysisDeep(item.layoutAnalysis);
  if (!state.layoutAnalysis) {
    clearLayoutAnalysis();
  } else {
    renderLayoutAnalysisMeta();
  }
  state.confirmedGrid = { ...item.grid };
  state.gridConfirmed = true;
  el.posterNameInput.value = item.name;
  el.posterTagsInput.value = (item.tags || []).join(",");
  clearLayoutItems();
  if (state.layoutAnalysis?.items?.length) {
    state.layoutItems = cloneVariantItemsWithNewIds(state.layoutAnalysis.items).map((item) => ({
      ...item,
      fromAnalysis: true,
    }));
    state.activeLayoutItemId = state.layoutItems[0]?.id || "";
    state.analysisOverlayVisible = false;
    if (el.analysisOverlaySelect) el.analysisOverlaySelect.value = "off";
  }
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = state.posterVisible ? "on" : "off";
  syncInputsFromGridAndStyle();
  refreshStage();
  if (!state.layoutAnalysis) analyzePosterLayoutZones({ silent: true });
  updateGridMeta();
  renderColorPalette();
  renderGraphicsSemantics();
  el.detectBtn.disabled = false;
  updateConfirmButtonState();
  updateSaveButtonState();
  updateTemplateButtons();
  resetLayoutHistory();
  setStatus(`已载入海报：${item.name}`);
}

function deletePosterFromLibrary(id) {
  const prev = [...state.library];
  state.library = state.library.filter((item) => item.id !== id);
  const ok = saveLibrary();
  if (!ok) {
    state.library = prev;
    return;
  }
  updateCategoryOptions();
  renderLibrary();
  setStatus(tr("m_deletePosterOk"));
}

function bindEvents() {
  if (el.langZhBtn) el.langZhBtn.addEventListener("click", () => setLocale("zh"));
  if (el.langEnBtn) el.langEnBtn.addEventListener("click", () => setLocale("en"));

  el.posterInput.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    try {
      await loadPosterFile(file);
    } catch (error) {
      console.error(error);
      setStatus(tr("m_loadFail", { msg: error.message }));
    }
  });

  el.detectBtn.addEventListener("click", () => {
    try {
      detectGrid();
    } catch (error) {
      console.error(error);
      setStatus(tr("m_detectFail", { msg: error.message }));
    }
  });
  el.clearBtn.addEventListener("click", clearPoster);
  el.applyGridBtn.addEventListener("click", applyGridStyle);
  if (el.fitPosterGridBtn) {
    el.fitPosterGridBtn.addEventListener("click", applyPosterProportionFit);
  }
  if (el.confirmGridBtn) {
    el.confirmGridBtn.addEventListener("click", confirmCurrentGrid);
  }
  if (el.analyzeLayoutZonesBtn) {
    el.analyzeLayoutZonesBtn.addEventListener("click", () => analyzePosterLayoutZones({ silent: false }));
  }
  if (el.analysisOverlaySelect) {
    el.analysisOverlaySelect.addEventListener("change", () => {
      state.analysisOverlayVisible = el.analysisOverlaySelect.value !== "off";
      drawGrid();
    });
  }
  if (el.createCanvasBtn) {
    el.createCanvasBtn.addEventListener("click", createBlankCanvas);
  }
  if (el.canvasBgInput) {
    el.canvasBgInput.addEventListener("input", () => {
      if (!state.canvasDraft) return;
      state.canvasDraft.background = el.canvasBgInput.value || "#ffffff";
      refreshStage();
    });
  }
  if (el.applyBankGridBtn) {
    el.applyBankGridBtn.addEventListener("click", applySelectedGridBankToStage);
  }
  if (el.editAnalyzedGridBtn) {
    el.editAnalyzedGridBtn.addEventListener("click", () => {
      openGridEditorPanel();
      setStatus(tr("m_editGridExpanded"));
    });
  }
  if (el.bringForwardBtn) {
    el.bringForwardBtn.addEventListener("click", bringActiveLayoutItemForward);
  }
  if (el.sendBackwardBtn) {
    el.sendBackwardBtn.addEventListener("click", sendActiveLayoutItemBackward);
  }
  if (el.deleteActiveItemBtn) {
    el.deleteActiveItemBtn.addEventListener("click", deleteActiveLayoutItem);
  }
  if (el.duplicateActiveItemBtn) {
    el.duplicateActiveItemBtn.addEventListener("click", duplicateActiveLayoutItem);
  }
  if (el.exportPsdBtn) {
    el.exportPsdBtn.addEventListener("click", async () => {
      try {
        await exportLayoutAsPsd();
      } catch (error) {
        console.error(error);
        setStatus(tr("m_psdExportErr", { msg: error.message }));
      }
    });
  }
  if (el.exportSvgBtn) {
    el.exportSvgBtn.addEventListener("click", async () => {
      try {
        await exportLayoutAsSvg();
      } catch (error) {
        console.error(error);
        setStatus(tr("m_svgExportErr", { msg: error.message }));
      }
    });
  }
  if (el.exportIdmlBtn) {
    el.exportIdmlBtn.addEventListener("click", async () => {
      try {
        await exportLayoutAsIdml();
      } catch (error) {
        console.error(error);
        setStatus(tr("m_idmlExportErr", { msg: error.message }));
      }
    });
  }
  if (el.gridVisibleSelect) {
    el.gridVisibleSelect.addEventListener("change", () => applyGridVisibleUserChange(el.gridVisibleSelect.value));
  }
  if (el.analysisGridVisibleSelect) {
    el.analysisGridVisibleSelect.addEventListener("change", () =>
      applyGridVisibleUserChange(el.analysisGridVisibleSelect.value),
    );
  }
  if (el.posterVisibleSelect) {
    el.posterVisibleSelect.addEventListener("change", () => {
      state.posterVisible = el.posterVisibleSelect.value !== "off";
      saveUIPrefsPartial({ posterVisible: state.posterVisible });
      refreshStage();
    });
  }
  if (el.snapToGridSelect) {
    el.snapToGridSelect.addEventListener("change", () => {
      state.snapToGrid = el.snapToGridSelect.value !== "off";
      saveUIPrefsPartial({
        layoutSnap: {
          enabled: state.snapToGrid,
          threshold: state.snapThreshold,
          span: state.snapSpan,
          minSpan: state.minSpan,
        },
      });
    });
  }
  if (el.snapThresholdInput) {
    el.snapThresholdInput.addEventListener("input", () => {
      state.snapThreshold = clamp(Number(el.snapThresholdInput.value) || 16, 2, 80);
      el.snapThresholdInput.value = String(state.snapThreshold);
      saveUIPrefsPartial({
        layoutSnap: {
          enabled: state.snapToGrid,
          threshold: state.snapThreshold,
          span: state.snapSpan,
          minSpan: state.minSpan,
        },
      });
    });
  }
  if (el.snapSpanSelect) {
    el.snapSpanSelect.addEventListener("change", () => {
      state.snapSpan = el.snapSpanSelect.value !== "off";
      saveUIPrefsPartial({
        layoutSnap: {
          enabled: state.snapToGrid,
          threshold: state.snapThreshold,
          span: state.snapSpan,
          minSpan: state.minSpan,
        },
      });
    });
  }
  if (el.minSpanInput) {
    el.minSpanInput.addEventListener("input", () => {
      state.minSpan = clamp(Number(el.minSpanInput.value) || 1, 1, 12);
      el.minSpanInput.value = String(state.minSpan);
      saveUIPrefsPartial({
        layoutSnap: {
          enabled: state.snapToGrid,
          threshold: state.snapThreshold,
          span: state.snapSpan,
          minSpan: state.minSpan,
        },
      });
    });
  }
  if (el.addTextBlockBtn) {
    el.addTextBlockBtn.addEventListener("click", addTextLayoutItem);
  }
  if (el.autoLayoutBtn) {
    el.autoLayoutBtn.addEventListener("click", autoLayoutPlaceholdersFromAnalysis);
  }
  if (el.autoLayoutVariantSelect) {
    el.autoLayoutVariantSelect.addEventListener("change", () => {
      const id = el.autoLayoutVariantSelect.value || "";
      applyAutoLayoutVariantById(id);
    });
  }
  [el.textFontFamilySelect, el.textFontSizeInput, el.textFontWeightSelect, el.textColorInput].forEach((node) => {
    if (!node) return;
    const evt = node.tagName === "SELECT" ? "change" : "input";
    node.addEventListener(evt, applyTextStyleControls);
  });
  if (el.addImageBlockBtn && el.layoutImageInput) {
    el.addImageBlockBtn.addEventListener("click", () => el.layoutImageInput.click());
    el.layoutImageInput.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        await addImageLayoutItemFromFile(file);
      } catch (error) {
        console.error(error);
        setStatus(`图片块添加失败：${error.message}`);
      } finally {
        el.layoutImageInput.value = "";
      }
    });
  }
  if (el.clearLayoutBtn) {
    el.clearLayoutBtn.addEventListener("click", () => {
      pushLayoutUndo();
      clearLayoutItems();
      setStatus("已清空排版元素。");
    });
  }
  if (el.undoLayoutBtn) {
    el.undoLayoutBtn.addEventListener("click", () => undoLayout());
  }
  if (el.redoLayoutBtn) {
    el.redoLayoutBtn.addEventListener("click", () => redoLayout());
  }
  if (el.activeLayerOpacityInput) {
    el.activeLayerOpacityInput.addEventListener("pointerdown", () => {
      const active = getActiveLayoutItem();
      if (!active || active.locked) return;
      pushLayoutUndo();
    });
    el.activeLayerOpacityInput.addEventListener("input", applyActiveLayerOpacityFromInput);
  }
  if (el.layoutPanel) {
    el.layoutPanel.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-align-layout]");
      if (!btn || !el.layoutPanel.contains(btn)) return;
      const edge = btn.getAttribute("data-align-layout");
      if (edge) alignActiveLayoutToCanvas(edge);
    });
  }
  if (el.exportLayoutBtn) {
    el.exportLayoutBtn.addEventListener("click", async () => {
      try {
        await exportLayoutImage();
      } catch (error) {
        console.error(error);
        setStatus(`导出失败：${error.message}`);
      }
    });
  }
  if (el.exportGridPngBtn) {
    el.exportGridPngBtn.addEventListener("click", exportGridPng);
  }
  if (el.saveLayoutProjectBtn) {
    el.saveLayoutProjectBtn.addEventListener("click", saveCurrentLayoutProject);
  }
  if (el.loadLayoutProjectBtn && el.layoutProjectSelect) {
    el.loadLayoutProjectBtn.addEventListener("click", async () => {
      const id = el.layoutProjectSelect.value;
      if (!id) {
        setStatus("请先选择一个排版项目。");
        return;
      }
      try {
        await loadLayoutProjectById(id);
      } catch (error) {
        console.error(error);
        setStatus(`载入排版失败：${error.message}`);
      }
    });
    el.layoutProjectSelect.addEventListener("change", () => {
      const id = el.layoutProjectSelect.value;
      const selected = state.layoutProjects.find((item) => item.id === id);
      if (selected && el.layoutProjectNameInput) el.layoutProjectNameInput.value = selected.name || "";
    });
  }
  if (el.deleteLayoutProjectBtn) {
    el.deleteLayoutProjectBtn.addEventListener("click", deleteSelectedLayoutProject);
  }
  if (el.layoutProjectList) {
    el.layoutProjectList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (!id || !action) return;
      if (action === "delete") {
        const target = state.layoutProjects.find((item) => item.id === id);
        const prev = [...state.layoutProjects];
        state.layoutProjects = state.layoutProjects.filter((item) => item.id !== id);
        const ok = saveLayoutProjects();
        if (!ok) {
          state.layoutProjects = prev;
          return;
        }
        renderLayoutProjectSelect();
        setStatus(`已删除排版项目：${target ? target.name : id}`);
        return;
      }
      if (action === "load") {
        try {
          await loadLayoutProjectById(id);
          if (el.layoutProjectSelect) el.layoutProjectSelect.value = id;
        } catch (error) {
          console.error(error);
          setStatus(`载入排版失败：${error.message}`);
        }
      }
    });
  }
  if (el.layerList) {
    el.layerList.addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (!id || !action) return;
      const item = state.layoutItems.find((it) => it.id === id);
      if (!item) return;
      ensureLayoutItemDefaults(item);
      if (action === "toggle-visible") {
        pushLayoutUndo();
        item.visible = !item.visible;
      } else if (action === "toggle-lock") {
        pushLayoutUndo();
        item.locked = !item.locked;
      }
      renderLayoutItems();
    });
  }
  el.learnTemplateBtn.addEventListener("click", learnCurrentTemplate);
  el.applyTemplateBtn.addEventListener("click", applySelectedTemplateToCurrentImage);
  el.deleteTemplateBtn.addEventListener("click", deleteSelectedTemplate);
  el.templateSelect.addEventListener("change", updateTemplateButtons);
  el.savePosterBtn.addEventListener("click", saveCurrentPoster);
  el.searchBtn.addEventListener("click", searchLibrary);
  el.resetSearchBtn.addEventListener("click", resetSearch);

  const semanticsSearchDebounced = debounce(() => {
    renderSemanticsList(el.semanticsSearchInput ? el.semanticsSearchInput.value : "", lastAutoTags);
  }, 200);
  if (el.semanticsSearchInput) {
    el.semanticsSearchInput.addEventListener("input", semanticsSearchDebounced);
  }

  el.libraryList.addEventListener("click", async (event) => {
    const btn = event.target.closest("button");
    if (btn) {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (!id || !action) return;
      if (action === "load") await loadPosterFromLibrary(id);
      if (action === "delete") deletePosterFromLibrary(id);
      return;
    }
    const card = event.target.closest(".library-item");
    if (card && card.dataset.id) {
      await loadPosterFromLibrary(card.dataset.id);
    }
  });

  el.libraryList.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    if (event.target.closest("button")) return;
    const card = event.target.closest(".library-item");
    if (!card || !card.dataset.id) return;
    event.preventDefault();
    await loadPosterFromLibrary(card.dataset.id);
  });

  const geometryLiveInputs = [
    el.colsInput,
    el.rowsInput,
    el.marginLeftInput,
    el.marginRightInput,
    el.marginTopInput,
    el.marginBottomInput,
    el.angleInput,
  ];
  geometryLiveInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!stageExists() || !state.grid || !state.style) return;
      delete state.grid.fitMode;
      readGridAndStyleFromInputs();
      markGridUnconfirmed();
      drawGrid();
      updateGridMeta();
    });
  });
  const styleLiveInputs = [
    el.gridColorInput,
    el.gridAlphaInput,
    el.dashInput,
    el.gapInput,
    el.lineWidthInput,
  ];
  styleLiveInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!stageExists() || !state.grid || !state.style) return;
      readGridAndStyleFromInputs();
      markGridUnconfirmed();
      drawGrid();
      updateGridMeta();
      saveStylePrefsDebounced();
    });
  });

  if (el.dropZone) {
    ["dragenter", "dragover"].forEach((name) => {
      el.dropZone.addEventListener(name, (event) => {
        event.preventDefault();
        el.dropZone.classList.add("drag-over");
      });
    });
    ["dragleave", "drop"].forEach((name) => {
      el.dropZone.addEventListener(name, (event) => {
        event.preventDefault();
        el.dropZone.classList.remove("drag-over");
      });
    });
    el.dropZone.addEventListener("drop", async (event) => {
      const files = event.dataTransfer && event.dataTransfer.files;
      if (!files || !files.length) return;
      const file = files[0];
      try {
        await loadPosterFile(file);
      } catch (error) {
        console.error(error);
        setStatus(tr("m_loadFail", { msg: error.message }));
      }
    });
    el.dropZone.addEventListener("click", (event) => {
      if (event.target === el.layoutOverlay || event.target === el.dropZone) {
        setActiveLayoutItem("");
      }
    });
  }

  if (el.zoomSelect) {
    el.zoomSelect.addEventListener("change", () => {
      saveUIPrefsPartial({ zoom: el.zoomSelect.value });
      if (stageExists()) {
        fitCanvasToStage();
        renderLayoutItems();
      }
    });
  }

  if (el.posterNameInput) {
    el.posterNameInput.addEventListener("input", saveFormDraftDebounced);
  }
  if (el.posterTagsInput) {
    el.posterTagsInput.addEventListener("input", saveFormDraftDebounced);
  }

  if (el.colorPaletteGrid) {
    el.colorPaletteGrid.addEventListener("click", async (event) => {
      const card = event.target.closest(".color-swatch-card");
      if (!card || !card.dataset.hex) return;
      const hex = card.dataset.hex;
      try {
        await navigator.clipboard.writeText(hex);
        showToast(tr("m_copyHexOk", { hex }));
      } catch {
        showToast(tr("m_clipboardDenied"));
      }
    });
  }

  document.addEventListener("paste", async (event) => {
    const items = event.clipboardData && event.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (!item.type.startsWith("image/")) continue;
      event.preventDefault();
      const file = item.getAsFile();
      if (!file || !isSupportedImageFile(file)) {
        setStatus(tr("m_clipboardUnsupported"));
        return;
      }
      try {
        await loadPosterFile(file);
        showToast(tr("m_toastClipboard"));
      } catch (error) {
        console.error(error);
        setStatus(tr("m_loadFail", { msg: error.message }));
      }
      break;
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      if (isTypingContext()) return;
      event.preventDefault();
      if (event.shiftKey) redoLayout();
      else undoLayout();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
      if (isTypingContext()) return;
      event.preventDefault();
      redoLayout();
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      if (isTypingContext()) return;
      if (nudgeActiveLayoutItemByArrow(event.key, event.shiftKey, event.repeat)) {
        event.preventDefault();
      }
      return;
    }
    if ((event.key === "Delete" || event.key === "Backspace") && !isTypingContext() && state.activeLayoutItemId) {
      event.preventDefault();
      deleteActiveLayoutItem();
      return;
    }
    if (event.key === "Escape" && !isTypingContext()) {
      if (stageExists()) {
        clearPoster();
        showToast(tr("m_toastCleared"));
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") {
      if (isTypingContext()) return;
      event.preventDefault();
      if (el.posterInput) el.posterInput.click();
    }
  });

  [el.searchTextInput, el.searchColsInput, el.searchRowsInput].forEach((inp) => {
    if (!inp) return;
    inp.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchLibrary();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (stageExists()) {
      fitCanvasToStage();
      renderLayoutItems();
    }
  });
}

function boot() {
  state.locale = localStorage.getItem("ui_locale") === "en" ? "en" : "zh";
  state.library = loadLibrary();
  state.templates = loadTemplates();
  state.gridBank = loadGridBank();
  state.layoutProjects = loadLayoutProjects();
  const prefs = loadUIPrefs();
  if (prefs.zoom && el.zoomSelect) {
    el.zoomSelect.value = prefs.zoom;
  }
  if (prefs.layoutSnap) {
    state.snapToGrid = prefs.layoutSnap.enabled !== false;
    state.snapThreshold = clamp(Number(prefs.layoutSnap.threshold) || 16, 2, 80);
    state.snapSpan = prefs.layoutSnap.span !== false;
    state.minSpan = clamp(Number(prefs.layoutSnap.minSpan) || 1, 1, 12);
  }
  if (prefs.layoutText) {
    state.textDefaults = sanitizeTextStyle(prefs.layoutText);
  }
  if (typeof prefs.gridVisible === "boolean") {
    state.gridVisible = prefs.gridVisible;
  }
  if (typeof prefs.posterVisible === "boolean") {
    state.posterVisible = prefs.posterVisible;
  }
  state.analysisOverlayVisible = true;
  syncGridVisibleSelectsFromState();
  if (el.posterVisibleSelect) el.posterVisibleSelect.value = state.posterVisible ? "on" : "off";
  if (el.analysisOverlaySelect) el.analysisOverlaySelect.value = state.analysisOverlayVisible ? "on" : "off";
  if (el.snapToGridSelect) el.snapToGridSelect.value = state.snapToGrid ? "on" : "off";
  if (el.snapThresholdInput) el.snapThresholdInput.value = String(state.snapThreshold);
  if (el.snapSpanSelect) el.snapSpanSelect.value = state.snapSpan ? "on" : "off";
  if (el.minSpanInput) el.minSpanInput.value = String(state.minSpan);
  syncTextControlsFromModel(state.textDefaults);
  const draft = safeParse(sessionStorage.getItem(FORM_DRAFT_KEY) || "{}", {});
  if (draft.name != null && el.posterNameInput) el.posterNameInput.value = String(draft.name);
  if (draft.tags != null && el.posterTagsInput) el.posterTagsInput.value = String(draft.tags);
  updateCategoryOptions();
  renderLibrary();
  renderTemplateSelect();
  renderGridBankSelect();
  renderLayoutProjectSelect();
  renderLayerList();
  updateOpacityControlFromActive();
  renderAutoLayoutVariantSelect();
  renderLayoutAnalysisMeta();
  el.detectBtn.disabled = true;
  updateConfirmButtonState();
  updateSaveButtonState();
  el.gridMeta.textContent = tr("gridMetaEmpty");
  bindEvents();
  if (window.PosterGridI18n) {
    window.PosterGridI18n.applyPage(state.locale);
    refreshDynamicLocale();
    updateLangButtons();
  }
  updateTemplateButtons();
}

boot();
