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

const buildExifCards = (tags) => {
  if (!tags) {
    return [];
  }

  const cards = [];
  const make = formatExifValue(tags.Make);
  const model = formatExifValue(tags.Model);
  const camera = [make, model].filter(Boolean).join(" ");
  if (camera) {
    cards.push({ label: "Camera", value: camera });
  }

  const lens = formatExifValue(tags.LensModel);
  if (lens) {
    cards.push({ label: "Lens", value: lens });
  }

  const dateTaken =
    formatExifValue(tags.DateTimeOriginal) || formatExifValue(tags.DateTime);
  if (dateTaken) {
    cards.push({ label: "Date Taken", value: dateTaken });
  }

  const focalLength = formatExifValue(tags.FocalLength);
  if (focalLength) {
    cards.push({ label: "Focal Length", value: focalLength });
  }

  const aperture = formatExifValue(tags.FNumber);
  if (aperture) {
    cards.push({ label: "Aperture", value: aperture });
  }

  const shutter = formatExifValue(tags.ExposureTime);
  if (shutter) {
    cards.push({ label: "Shutter", value: shutter });
  }

  const iso = formatExifValue(tags.ISO);
  if (iso) {
    cards.push({ label: "ISO", value: iso });
  }

  return cards;
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

const createExifCard = (label, value) => {
  const template = exifControls.cardTemplate;
  const templateCard = template?.content?.firstElementChild;
  if (templateCard) {
    const card = templateCard.cloneNode(true);
    const labelDom = card.querySelector(".image-viewer-exif-label");
    const valueDom = card.querySelector(".image-viewer-exif-value");
    if (labelDom) {
      labelDom.textContent = label;
    }
    if (valueDom) {
      valueDom.textContent = value;
    }
    return card;
  }

  const fallback = document.createElement("div");
  fallback.className =
    "rounded-lg border border-border-color bg-background-color-transparent-80 px-3 py-2 shadow-redefine-flat";
  const labelDom = document.createElement("div");
  labelDom.className =
    "image-viewer-exif-label text-[0.65rem] uppercase tracking-wide text-third-text-color";
  labelDom.textContent = label;
  const valueDom = document.createElement("div");
  valueDom.className = "image-viewer-exif-value text-sm text-first-text-color";
  valueDom.textContent = value;
  fallback.appendChild(labelDom);
  fallback.appendChild(valueDom);
  return fallback;
};

const renderExifCards = (cards) => {
  if (!exifControls.cardsContainer) {
    return;
  }

  clearExifCards();
  const normalized = Array.isArray(cards)
    ? cards
        .map((card) => {
          if (!card || typeof card !== "object") {
            return null;
          }
          const label = String(card.label || "").trim();
          const value = String(card.value || "").trim();
          if (!label || !value) {
            return null;
          }
          return { label, value };
        })
        .filter(Boolean)
    : [];

  const finalCards = normalized.length
    ? normalized
    : [{ label: "EXIF", value: "No EXIF available" }];

  const fragment = document.createDocumentFragment();
  finalCards.forEach((card) => {
    fragment.appendChild(createExifCard(card.label, card.value));
  });
  exifControls.cardsContainer.appendChild(fragment);
};

const bumpExifRequestId = () => {
  exifControls.requestId = (exifControls.requestId || 0) + 1;
  return exifControls.requestId;
};

const renderExifMessage = (message) => {
  renderExifCards([{ label: "EXIF", value: message }]);
};

const loadExifForImage = async (img) => {
  const requestId = bumpExifRequestId();
  renderExifMessage("Loading...");

  const ExifReader = window.ExifReader;
  if (!ExifReader || typeof ExifReader.load !== "function") {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage("EXIF library not loaded");
    return;
  }

  const url = resolveExifImageUrl(img);
  if (!url) {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage("Image source unavailable");
    return;
  }

  try {
    const tags = await ExifReader.load(url);
    if (exifControls.requestId !== requestId) {
      return;
    }
    const cards = buildExifCards(tags);
    if (cards.length === 0) {
      renderExifMessage("No EXIF available");
      return;
    }
    renderExifCards(cards);
  } catch (error) {
    if (exifControls.requestId !== requestId) {
      return;
    }
    renderExifMessage("EXIF unavailable (blocked by CORS or missing metadata)");
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
    viewerState.targetImg.style.cursor = "grabbing";
    viewerState.userZoomed = true;
  };

  let rafId = null;

  const dragHandle = (event) => {
    if (!viewerState.isMouseDown) {
      return;
    }

    if (viewerState.scale <= viewerState.fitScale + 0.01) {
      return;
    }

    const nextX = event.clientX;
    const nextY = event.clientY;

    if (rafId !== null) {
      viewerState.lastMouseX = nextX;
      viewerState.lastMouseY = nextY;
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      const deltaX = nextX - viewerState.lastMouseX;
      const deltaY = nextY - viewerState.lastMouseY;
      viewerState.translateX += deltaX;
      viewerState.translateY += deltaY;
      viewerState.lastMouseX = nextX;
      viewerState.lastMouseY = nextY;
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
    viewerState.dragged = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
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
    if (event.target !== maskDom) {
      return;
    }

    if (!viewerState.dragged) {
      closeViewer();
    }
    viewerState.dragged = false;
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
      renderExifMessage("EXIF unavailable");
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
