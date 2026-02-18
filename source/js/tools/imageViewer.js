const viewerState = {
  isBigImage: false,
  scale: 1,
  fitScale: 1,
  userZoomed: false,
  isMouseDown: false,
  dragged: false,
  currentImgIndex: 0,
  lastMouseX: 0,
  lastMouseY: 0,
  translateX: 0,
  translateY: 0,
  maskDom: null,
  targetImg: null,
};

const imageSelector =
  ".markdown-body img, .masonry-item img, #shuoshuo-content img";

const viewerControls = {
  prevButton: null,
  nextButton: null,
  closeButton: null,
};

const exifControls = {
  toggleButton: null,
  panel: null,
  cardsContainer: null,
  closeButton: null,
  cardTemplate: null,
  requestId: 0,
};

const getI18nValue = (path) => {
  if (!path) {
    return null;
  }
  const segments = String(path).split(".").filter(Boolean);
  let current = window.i18n;
  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return null;
    }
    current = current[segment];
  }
  return current ?? null;
};

const t = (path, fallback = "") => {
  const value = getI18nValue(path);
  if (typeof value === "string") {
    return value;
  }
  if (value != null) {
    return String(value);
  }
  return fallback;
};

let imageNodes = [];
let didInitKeys = false;

const applyTransform = () => {
  if (!viewerState.targetImg) {
    return;
  }

  viewerState.targetImg.style.transform = `translate(${viewerState.translateX}px, ${viewerState.translateY}px) scale(${viewerState.scale})`;
};

const getFrameRect = () => {
  if (!viewerState.maskDom) {
    return null;
  }

  const frame = viewerState.maskDom.querySelector(".image-viewer-frame");
  if (frame) {
    return frame.getBoundingClientRect();
  }

  return viewerState.maskDom.getBoundingClientRect();
};

const fitToViewport = (options = {}) => {
  if (!viewerState.targetImg) {
    return;
  }

  const rect = getFrameRect();
  if (!rect) {
    return;
  }

  const marginFactor = options.marginFactor ?? 0.98;

  viewerState.scale = 1;
  viewerState.translateX = 0;
  viewerState.translateY = 0;
  applyTransform();

  const imageRect = viewerState.targetImg.getBoundingClientRect();
  if (!imageRect.width || !imageRect.height) {
    return;
  }

  const heightLimit = window.innerHeight * marginFactor;
  const widthLimit = window.innerWidth;
  const scaleForHeight = heightLimit / imageRect.height;
  const scaleForWidth = widthLimit / imageRect.width;
  const fitScale = Math.min(1, scaleForHeight, scaleForWidth);

  viewerState.fitScale = fitScale;
  viewerState.scale = fitScale;
  viewerState.translateX = 0;
  viewerState.translateY = 0;
  viewerState.userZoomed = false;
  applyTransform();
};

const resetTransform = () => {
  fitToViewport();
};

const showHandle = (isShow) => {
  if (!viewerState.maskDom) {
    return;
  }

  document.body.style.overflow = isShow ? "hidden" : "auto";
  viewerState.maskDom.classList.toggle("active", isShow);
};

const closeViewer = () => {
  if (!viewerState.isBigImage) {
    return;
  }

  viewerState.isBigImage = false;
  showHandle(false);
  resetTransform();
  viewerState.userZoomed = false;
  resetExifUI();
};

const updateImageNodes = () => {
  imageNodes = Array.from(document.querySelectorAll(imageSelector));
};

const canGoPrev = () => viewerState.currentImgIndex > 0;
const canGoNext = () =>
  viewerState.currentImgIndex < Math.max(imageNodes.length - 1, 0);

const updateNavButtons = () => {
  if (!viewerControls.prevButton || !viewerControls.nextButton) {
    return;
  }

  viewerControls.prevButton.classList.toggle("is-disabled", !canGoPrev());
  viewerControls.nextButton.classList.toggle("is-disabled", !canGoNext());
};

const hasExifFlag = (img) => img?.dataset?.exif === "true";

const resolveExifImageUrl = (img) => {
  if (!img) {
    return null;
  }

  const dataSrc = img.getAttribute("data-src");
  const src = dataSrc || img.currentSrc || img.src;
  if (!src) {
    return null;
  }

  try {
    return new URL(src, window.location.href).toString();
  } catch (error) {
    return src;
  }
};

const formatExifValue = (tag) => {
  if (!tag) {
    return null;
  }

  if (typeof tag === "object") {
    if (tag.description != null) {
      return String(tag.description).trim();
    }
    if (tag.value != null) {
      if (Array.isArray(tag.value)) {
        return tag.value.map((item) => String(item)).join(", ").trim();
      }
      return String(tag.value).trim();
    }
  }

  if (typeof tag === "string") {
    return tag.trim();
  }

  return String(tag).trim();
};

const getExifValueByKeys = (tags, keys = []) => {
  if (!tags || !Array.isArray(keys)) {
    return null;
  }
  for (const key of keys) {
    const value = formatExifValue(tags[key]);
    if (value) {
      return value;
    }
  }
  return null;
};

const parseRational = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (value && typeof value === "object") {
    const numerator = value.numerator ?? value.num;
    const denominator = value.denominator ?? value.den;
    if (
      Number.isFinite(numerator) &&
      Number.isFinite(denominator) &&
      denominator !== 0
    ) {
      return numerator / denominator;
    }
    if (Number.isFinite(value.value)) {
      return value.value;
    }
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const resolveTagRawValue = (tag) => {
  if (!tag) {
    return null;
  }
  if (typeof tag === "object" && "value" in tag) {
    return tag.value;
  }
  return tag;
};

const formatGpsCoordinate = (tags, valueKey, refKey) => {
  if (!tags) {
    return null;
  }
  const rawTag = tags[valueKey];
  if (!rawTag) {
    return null;
  }
  const rawValue = resolveTagRawValue(rawTag);
  const ref = formatExifValue(tags[refKey]);
  let decimal = null;

  if (Array.isArray(rawValue)) {
    const parts = rawValue.map(parseRational).filter((part) => part != null);
    if (parts.length >= 3) {
      const [deg, min, sec] = parts;
      decimal = deg + min / 60 + sec / 3600;
    }
  } else {
    decimal = parseRational(rawValue);
  }

  if (decimal == null) {
    const fallback = formatExifValue(rawTag);
    if (!fallback) {
      return null;
    }
    if (ref && !fallback.includes(ref)) {
      return `${fallback} ${ref}`;
    }
    return fallback;
  }

  const normalizedRef = ref ? String(ref).trim().toUpperCase() : "";
  const displayValue = Math.abs(decimal).toFixed(4);
  if (normalizedRef) {
    return `${displayValue} ${normalizedRef}`;
  }
  return decimal.toFixed(4);
};

const buildExifGroups = (tags) => {
  if (!tags) {
    return [];
  }

  const groups = [];
  const pushGroup = (title, icon, items) => {
    const normalizedItems = (items || []).filter(Boolean);
    if (normalizedItems.length === 0) {
      return;
    }
    groups.push({ title, icon, items: normalizedItems });
  };

  const make = getExifValueByKeys(tags, ["Make"]);
  const model = getExifValueByKeys(tags, ["Model"]);
  const dateTaken = getExifValueByKeys(tags, ["DateTimeOriginal", "DateTime"]);
  pushGroup(t("exif.cards.camera", "Camera"), "fa-solid fa-camera", [
    make && { label: t("exif.fields.make", "Brand"), value: make },
    model && { label: t("exif.fields.model", "Model"), value: model },
    dateTaken && {
      label: t("exif.fields.date_taken", "Date taken"),
      value: dateTaken,
    },
  ]);

  const lensModel = getExifValueByKeys(tags, [
    "LensModel",
    "Lens",
    "LensSpecification",
  ]);
  const focalLength = getExifValueByKeys(tags, [
    "FocalLength",
    "FocalLengthIn35mmFilm",
  ]);
  const focusMode = getExifValueByKeys(tags, [
    "FocusMode",
    "AFMode",
    "AFAreaMode",
    "FocusingMode",
    "AutoFocus",
    "FocusMethod",
  ]);
  pushGroup(t("exif.cards.lens", "Lens"), "fa-solid fa-eye", [
    lensModel && { label: t("exif.fields.lens_model", "Lens"), value: lensModel },
    focalLength && {
      label: t("exif.fields.focal_length", "Focal length"),
      value: focalLength,
    },
    focusMode && {
      label: t("exif.fields.focus_mode", "Focus mode"),
      value: focusMode,
    },
  ]);

  const shutter = getExifValueByKeys(tags, ["ExposureTime"]);
  const aperture = getExifValueByKeys(tags, ["FNumber"]);
  const iso = getExifValueByKeys(tags, ["ISO", "PhotographicSensitivity"]);
  const exposureProgram = getExifValueByKeys(tags, ["ExposureProgram"]);
  const exposureCompensation = getExifValueByKeys(tags, ["ExposureBiasValue"]);
  const meteringMode = getExifValueByKeys(tags, ["MeteringMode"]);
  pushGroup(t("exif.cards.exposure", "Exposure"), "fa-solid fa-sun", [
    shutter && { label: t("exif.fields.shutter", "Shutter"), value: shutter },
    aperture && { label: t("exif.fields.aperture", "Aperture"), value: aperture },
    iso && { label: t("exif.fields.iso", "ISO"), value: iso },
    exposureProgram && {
      label: t("exif.fields.exposure_program", "Exposure program"),
      value: exposureProgram,
    },
    exposureCompensation && {
      label: t("exif.fields.exposure_compensation", "Exposure compensation"),
      value: exposureCompensation,
    },
    meteringMode && {
      label: t("exif.fields.metering_mode", "Metering mode"),
      value: meteringMode,
    },
  ]);

  const flash = getExifValueByKeys(tags, ["Flash"]);
  const whiteBalance = getExifValueByKeys(tags, ["WhiteBalance"]);
  const latitude = formatGpsCoordinate(tags, "GPSLatitude", "GPSLatitudeRef");
  const longitude = formatGpsCoordinate(tags, "GPSLongitude", "GPSLongitudeRef");
  const altitude = getExifValueByKeys(tags, ["GPSAltitude"]);
  pushGroup(t("exif.cards.other", "Other"), "fa-solid fa-gear", [
    flash && { label: t("exif.fields.flash", "Flash"), value: flash },
    whiteBalance && {
      label: t("exif.fields.white_balance", "White balance"),
      value: whiteBalance,
    },
    latitude && { label: t("exif.fields.latitude", "Latitude"), value: latitude },
    longitude && {
      label: t("exif.fields.longitude", "Longitude"),
      value: longitude,
    },
    altitude && { label: t("exif.fields.altitude", "Altitude"), value: altitude },
  ]);

  return groups;
};

const setExifPanelOpen = (isOpen) => {
  if (!exifControls.panel || !exifControls.toggleButton) {
    return;
  }

  exifControls.panel.classList.toggle("hidden", !isOpen);
  exifControls.panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
  exifControls.toggleButton.setAttribute(
    "aria-expanded",
    isOpen ? "true" : "false",
  );
};

const clearExifCards = () => {
  if (!exifControls.cardsContainer) {
    return;
  }
  exifControls.cardsContainer.innerHTML = "";
};

const createExifItem = (label, value) => {
  const row = document.createElement("div");
  row.className = "image-viewer-exif-item flex items-start justify-between gap-2";
  const labelDom = document.createElement("div");
  labelDom.className =
    "image-viewer-exif-item-label text-[0.65rem] uppercase tracking-wide shrink-0 text-third-text-color";
  labelDom.textContent = label;
  const valueDom = document.createElement("div");
  valueDom.className =
    "image-viewer-exif-item-value text-[0.65rem] text-first-text-color text-right";
  valueDom.textContent = value;
  row.appendChild(labelDom);
  row.appendChild(valueDom);
  return row;
};

const createExifCard = (group) => {
  const template = exifControls.cardTemplate;
  const templateCard = template?.content?.firstElementChild;
  let card = templateCard ? templateCard.cloneNode(true) : null;
  if (!card) {
    card = document.createElement("div");
    card.className =
      "rounded-lg border border-border-color bg-background-color-transparent-80 px-3 py-2 shadow-redefine-flat";
    const header = document.createElement("div");
    header.className = "image-viewer-exif-card-header flex items-center gap-2 mb-1";
    const iconDom = document.createElement("i");
    iconDom.className =
      "image-viewer-exif-card-icon fa-solid fa-circle-info text-xs text-third-text-color";
    const titleDom = document.createElement("div");
    titleDom.className =
      "image-viewer-exif-card-title text-xs font-semibold text-first-text-color";
    header.appendChild(iconDom);
    header.appendChild(titleDom);
    const itemsDom = document.createElement("div");
    itemsDom.className = "image-viewer-exif-card-items flex flex-col gap-1";
    card.appendChild(header);
    card.appendChild(itemsDom);
  }

  const titleDom = card.querySelector(".image-viewer-exif-card-title");
  const iconDom = card.querySelector(".image-viewer-exif-card-icon");
  let itemsDom = card.querySelector(".image-viewer-exif-card-items");
  if (!itemsDom) {
    itemsDom = document.createElement("div");
    itemsDom.className = "image-viewer-exif-card-items flex flex-col gap-1";
    card.appendChild(itemsDom);
  }

  if (titleDom) {
    titleDom.textContent = group.title;
  }
  if (iconDom) {
    const iconClass = group.icon || "fa-solid fa-circle-info";
    iconDom.className =
      `image-viewer-exif-card-icon ${iconClass} text-xs text-third-text-color`;
  }

  itemsDom.innerHTML = "";
  group.items.forEach((item) => {
    itemsDom.appendChild(createExifItem(item.label, item.value));
  });
  return card;
};

const renderExifGroups = (groups) => {
  if (!exifControls.cardsContainer) {
    return;
  }

  clearExifCards();
  const normalized = Array.isArray(groups)
    ? groups
        .map((group) => {
          if (!group || typeof group !== "object") {
            return null;
          }
          const title = String(group.title || "").trim();
          const icon = String(group.icon || "").trim();
          const items = Array.isArray(group.items)
            ? group.items
                .map((item) => {
                  if (!item || typeof item !== "object") {
                    return null;
                  }
                  const label = String(item.label || "").trim();
                  const value = String(item.value ?? "").trim();
                  if (!label || !value) {
                    return null;
                  }
                  return { label, value };
                })
                .filter(Boolean)
            : [];
          if (!title || items.length === 0) {
            return null;
          }
          return { title, icon, items };
        })
        .filter(Boolean)
    : [];

  const fallbackTitle = t("exif.title", "EXIF");
  const fallbackGroups = normalized.length
    ? normalized
    : [
        {
          title: fallbackTitle,
          icon: "fa-solid fa-circle-info",
          items: [
            {
              label: fallbackTitle,
              value: t("exif.status.no_exif", "No EXIF available"),
            },
          ],
        },
      ];

  const fragment = document.createDocumentFragment();
  fallbackGroups.forEach((group) => {
    fragment.appendChild(createExifCard(group));
  });
  exifControls.cardsContainer.appendChild(fragment);
};

const bumpExifRequestId = () => {
  exifControls.requestId = (exifControls.requestId || 0) + 1;
  return exifControls.requestId;
};

const renderExifMessage = (message) => {
  const title = t("exif.title", "EXIF");
  renderExifGroups([
    {
      title,
      icon: "fa-solid fa-circle-info",
      items: [{ label: title, value: message }],
    },
  ]);
};

const loadExifForImage = async (img) => {
  const requestId = bumpExifRequestId();
  renderExifMessage(t("exif.status.loading", "Loading..."));

  const ExifReader = window.ExifReader;
  if (!ExifReader || typeof ExifReader.load !== "function") {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage(
      t("exif.status.library_missing", "EXIF library not loaded"),
    );
    return;
  }

  const url = resolveExifImageUrl(img);
  if (!url) {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage(
      t("exif.status.image_source_missing", "Image source unavailable"),
    );
    return;
  }

  try {
    const tags = await ExifReader.load(url);
    if (exifControls.requestId !== requestId) {
      return;
    }
    const groups = buildExifGroups(tags);
    if (groups.length === 0) {
      renderExifMessage(t("exif.status.no_exif", "No EXIF available"));
      return;
    }
    renderExifGroups(groups);
  } catch (error) {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage(
      t(
        "exif.status.unavailable",
        "EXIF unavailable (blocked by CORS or missing metadata)",
      ),
    );
  }
};

const updateExifUI = (img) => {
  const hasExif = hasExifFlag(img);
  bumpExifRequestId();

  if (exifControls.toggleButton) {
    exifControls.toggleButton.classList.toggle("hidden", !hasExif);
    exifControls.toggleButton.disabled = !hasExif;
  }

  setExifPanelOpen(false);
  clearExifCards();
};

const resetExifUI = () => {
  bumpExifRequestId();
  if (exifControls.toggleButton) {
    exifControls.toggleButton.classList.add("hidden");
    exifControls.toggleButton.setAttribute("aria-expanded", "false");
  }
  setExifPanelOpen(false);
  clearExifCards();
};

const updateViewerImage = (index) => {
  const currentImg = imageNodes[index];
  if (!currentImg || !viewerState.targetImg) {
    return;
  }

  viewerState.currentImgIndex = index;

  let newSrc = currentImg.src;
  if (currentImg.hasAttribute("lazyload")) {
    newSrc = currentImg.getAttribute("data-src") || newSrc;
    if (newSrc) {
      currentImg.src = newSrc;
    }
    currentImg.removeAttribute("lazyload");
  }

  if (newSrc) {
    viewerState.targetImg.src = newSrc;
  }
  viewerState.targetImg.alt = currentImg.alt || "";

  const handleImageLoad = () => {
    viewerState.targetImg?.removeEventListener("load", handleImageLoad);
    fitToViewport();
  };

  if (viewerState.targetImg.complete) {
    fitToViewport();
  } else {
    viewerState.targetImg.addEventListener("load", handleImageLoad, {
      once: true,
    });
  }
  updateNavButtons();
  updateExifUI(currentImg);
};


const goPrev = () => {
  if (!viewerState.isBigImage || !canGoPrev()) {
    return;
  }

  updateViewerImage(viewerState.currentImgIndex - 1);
};

const goNext = () => {
  if (!viewerState.isBigImage || !canGoNext()) {
    return;
  }

  updateViewerImage(viewerState.currentImgIndex + 1);
};

const handleArrowKeys = (event) => {
  if (!viewerState.isBigImage) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeViewer();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    goPrev();
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    goNext();
  }
};

const registerGlobalHandlers = (signal) => {
  if (didInitKeys) {
    return;
  }

  didInitKeys = true;
  if (signal) {
    document.addEventListener("keydown", handleArrowKeys, { signal });
  } else {
    document.addEventListener("keydown", handleArrowKeys);
  }
};

export default function initImageViewer({ signal, appSignal } = {}) {
  const maskDom = document.querySelector(".image-viewer-container");
  if (!maskDom) {
    console.warn(
      "Image viewer container not found. Exiting imageViewer function.",
    );
    return;
  }

  const targetImg = maskDom.querySelector("img");
  if (!targetImg) {
    console.warn(
      "Target image not found in image viewer container. Exiting imageViewer function.",
    );
    return;
  }

  viewerState.maskDom = maskDom;
  viewerState.targetImg = targetImg;
  viewerState.dragged = false;

  viewerControls.prevButton = maskDom.querySelector(".image-viewer-prev");
  viewerControls.nextButton = maskDom.querySelector(".image-viewer-next");
  viewerControls.closeButton = maskDom.querySelector(".image-viewer-close");

  exifControls.toggleButton = maskDom.querySelector(".image-viewer-exif-toggle");
  exifControls.panel = maskDom.querySelector(".image-viewer-exif-panel");
  exifControls.cardsContainer = maskDom.querySelector(
    ".image-viewer-exif-cards",
  );
  exifControls.closeButton = maskDom.querySelector(
    ".image-viewer-exif-close",
  );
  exifControls.cardTemplate = maskDom.querySelector(
    ".image-viewer-exif-card-template",
  );

  updateImageNodes();
  registerGlobalHandlers(appSignal);
  updateNavButtons();
  resetExifUI();

  const zoomHandle = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    if (!viewerState.targetImg) {
      return;
    }

    const rect = viewerState.targetImg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const dx = offsetX - rect.width / 2;
    const dy = offsetY - rect.height / 2;
    const oldScale = viewerState.scale;
    const minScale = Math.max(0.2, viewerState.fitScale * 0.8);
    const maxScale = Math.min(8, viewerState.fitScale * 4);

    viewerState.scale += event.deltaY * -0.001;
    viewerState.scale = Math.min(Math.max(minScale, viewerState.scale), maxScale);
    viewerState.userZoomed = Math.abs(viewerState.scale - viewerState.fitScale) > 0.01;

    if (oldScale < viewerState.scale) {
      viewerState.translateX -= dx * (viewerState.scale - oldScale);
      viewerState.translateY -= dy * (viewerState.scale - oldScale);
    } else {
      viewerState.translateX = 0;
      viewerState.translateY = 0;
    }

    applyTransform();
  };

  const dragStartHandle = (event) => {
    if (viewerState.scale <= viewerState.fitScale + 0.01) {
      return;
    }

    event.preventDefault();
    viewerState.isMouseDown = true;
    viewerState.lastMouseX = event.clientX;
    viewerState.lastMouseY = event.clientY;
    pendingX = event.clientX;
    pendingY = event.clientY;
    viewerState.targetImg.style.cursor = "grabbing";
    viewerState.userZoomed = true;
  };

  let rafId = null;
  let pendingX = null;
  let pendingY = null;

  const dragHandle = (event) => {
    if (!viewerState.isMouseDown) {
      return;
    }

    if (viewerState.scale <= viewerState.fitScale + 0.01) {
      return;
    }

    pendingX = event.clientX;
    pendingY = event.clientY;

    if (rafId !== null) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      if (pendingX == null || pendingY == null) {
        rafId = null;
        return;
      }
      const deltaX = pendingX - viewerState.lastMouseX;
      const deltaY = pendingY - viewerState.lastMouseY;
      viewerState.translateX += deltaX;
      viewerState.translateY += deltaY;
      viewerState.lastMouseX = pendingX;
      viewerState.lastMouseY = pendingY;
      applyTransform();
      viewerState.dragged = true;
      rafId = null;
    });
  };

  const dragEndHandle = (event) => {
    if (viewerState.isMouseDown) {
      event.stopPropagation();
    }
    viewerState.isMouseDown = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingX = null;
    pendingY = null;
    if (viewerState.dragged) {
      window.setTimeout(() => {
        viewerState.dragged = false;
      }, 0);
    }
    viewerState.targetImg.style.cursor = "grab";
  };

  const handleImageClick = (event) => {
    const img = event.target.closest(imageSelector);
    if (!img || img.closest(".image-viewer-container")) {
      return;
    }

    updateImageNodes();
    const index = imageNodes.indexOf(img);
    viewerState.isBigImage = true;
    viewerState.dragged = false;
    viewerState.userZoomed = false;
    showHandle(true);
    updateViewerImage(index === -1 ? 0 : index);
  };

  const handleMaskClick = (event) => {
    if (viewerState.dragged) {
      return;
    }

    const target = event.target;
    if (
      target.closest(
        ".image-viewer-prev, .image-viewer-next, .image-viewer-close, .image-viewer-exif-panel, .image-viewer-exif-toggle",
      )
    ) {
      return;
    }

    if (target.closest(".image-viewer-frame img")) {
      return;
    }

    const frame = maskDom.querySelector(".image-viewer-frame");
    if (target === maskDom || (frame && target === frame)) {
      closeViewer();
    }
  };

  const handlePrevClick = (event) => {
    event.stopPropagation();
    goPrev();
  };

  const handleNextClick = (event) => {
    event.stopPropagation();
    goNext();
  };

  const handleCloseClick = (event) => {
    event.stopPropagation();
    closeViewer();
  };

  const handleExifToggle = (event) => {
    event.stopPropagation();
    if (!exifControls.panel) {
      return;
    }
    const isOpen = !exifControls.panel.classList.contains("hidden");
    if (isOpen) {
      setExifPanelOpen(false);
      return;
    }

    setExifPanelOpen(true);
    const currentImg = imageNodes[viewerState.currentImgIndex];
    if (!hasExifFlag(currentImg)) {
      renderExifMessage(t("exif.status.flag_unavailable", "EXIF unavailable"));
      return;
    }
    loadExifForImage(currentImg);
  };

  const handleExifClose = (event) => {
    event.stopPropagation();
    setExifPanelOpen(false);
  };

  const handleResize = () => {
    if (!viewerState.isBigImage || viewerState.userZoomed) {
      return;
    }
    fitToViewport();
  };

  if (signal) {
    targetImg.addEventListener("wheel", zoomHandle, {
      passive: false,
      signal,
    });
    targetImg.addEventListener("mousedown", dragStartHandle, {
      passive: false,
      signal,
    });
    targetImg.addEventListener("mousemove", dragHandle, {
      passive: false,
      signal,
    });
    targetImg.addEventListener("mouseup", dragEndHandle, {
      passive: false,
      signal,
    });
    targetImg.addEventListener("mouseleave", dragEndHandle, {
      passive: false,
      signal,
    });
    maskDom.addEventListener("click", handleMaskClick, { signal });
    window.addEventListener("resize", handleResize, { signal });
    document.addEventListener("click", handleImageClick, { signal });
    viewerControls.prevButton?.addEventListener("click", handlePrevClick, {
      signal,
    });
    viewerControls.nextButton?.addEventListener("click", handleNextClick, {
      signal,
    });
    viewerControls.closeButton?.addEventListener("click", handleCloseClick, {
      signal,
    });
    exifControls.toggleButton?.addEventListener("click", handleExifToggle, {
      signal,
    });
    exifControls.closeButton?.addEventListener("click", handleExifClose, {
      signal,
    });
  } else {
    targetImg.addEventListener("wheel", zoomHandle, { passive: false });
    targetImg.addEventListener("mousedown", dragStartHandle, { passive: false });
    targetImg.addEventListener("mousemove", dragHandle, { passive: false });
    targetImg.addEventListener("mouseup", dragEndHandle, { passive: false });
    targetImg.addEventListener("mouseleave", dragEndHandle, { passive: false });
    maskDom.addEventListener("click", handleMaskClick);
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleImageClick);
    viewerControls.prevButton?.addEventListener("click", handlePrevClick);
    viewerControls.nextButton?.addEventListener("click", handleNextClick);
    viewerControls.closeButton?.addEventListener("click", handleCloseClick);
    exifControls.toggleButton?.addEventListener("click", handleExifToggle);
    exifControls.closeButton?.addEventListener("click", handleExifClose);
  }

}
