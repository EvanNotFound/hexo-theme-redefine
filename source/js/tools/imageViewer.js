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

  updateImageNodes();
  registerGlobalHandlers(appSignal);
  updateNavButtons();

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
  }

}
