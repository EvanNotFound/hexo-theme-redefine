const viewerState = {
  isBigImage: false,
  scale: 1,
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

let imageNodes = [];
let globalHandlersBound = false;

const applyTransform = () => {
  if (!viewerState.targetImg) {
    return;
  }

  viewerState.targetImg.style.transform = `translate(${viewerState.translateX}px, ${viewerState.translateY}px) scale(${viewerState.scale})`;
};

const resetTransform = () => {
  viewerState.scale = 1;
  viewerState.translateX = 0;
  viewerState.translateY = 0;
  applyTransform();
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
};

const handleArrowKeys = (event) => {
  if (!viewerState.isBigImage) {
    return;
  }

  if (event.key === "Escape") {
    closeViewer();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    viewerState.currentImgIndex =
      (viewerState.currentImgIndex - 1 + imageNodes.length) %
      imageNodes.length;
  } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    viewerState.currentImgIndex =
      (viewerState.currentImgIndex + 1) % imageNodes.length;
  } else {
    return;
  }

  const currentImg = imageNodes[viewerState.currentImgIndex];
  if (!currentImg || !viewerState.targetImg) {
    return;
  }

  let newSrc = currentImg.src;
  if (currentImg.hasAttribute("lazyload")) {
    newSrc = currentImg.getAttribute("data-src");
    currentImg.src = newSrc;
    currentImg.removeAttribute("lazyload");
  }

  viewerState.targetImg.src = newSrc;
};

const updateImageNodes = () => {
  imageNodes = Array.from(document.querySelectorAll(imageSelector));
};

const registerGlobalHandlers = (signal) => {
  if (globalHandlersBound) {
    return;
  }

  globalHandlersBound = true;
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

  updateImageNodes();
  registerGlobalHandlers(appSignal);

  const zoomHandle = (event) => {
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

    viewerState.scale += event.deltaY * -0.001;
    viewerState.scale = Math.min(Math.max(0.8, viewerState.scale), 4);

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
    event.preventDefault();
    viewerState.isMouseDown = true;
    viewerState.lastMouseX = event.clientX;
    viewerState.lastMouseY = event.clientY;
    viewerState.targetImg.style.cursor = "grabbing";
  };

  let lastTime = 0;
  const throttle = 100;

  const dragHandle = (event) => {
    if (!viewerState.isMouseDown) {
      return;
    }

    const currentTime = new Date().getTime();
    if (currentTime - lastTime < throttle) {
      return;
    }
    lastTime = currentTime;

    const deltaX = event.clientX - viewerState.lastMouseX;
    const deltaY = event.clientY - viewerState.lastMouseY;
    viewerState.translateX += deltaX;
    viewerState.translateY += deltaY;
    viewerState.lastMouseX = event.clientX;
    viewerState.lastMouseY = event.clientY;
    applyTransform();
    viewerState.dragged = true;
  };

  const dragEndHandle = (event) => {
    if (viewerState.isMouseDown) {
      event.stopPropagation();
    }
    viewerState.isMouseDown = false;
    viewerState.targetImg.style.cursor = "grab";
  };

  const handleImageClick = (event) => {
    const img = event.target.closest(imageSelector);
    if (!img || img.closest(".image-viewer-container")) {
      return;
    }

    updateImageNodes();
    const index = imageNodes.indexOf(img);
    viewerState.currentImgIndex = index === -1 ? 0 : index;
    viewerState.isBigImage = true;
    showHandle(true);

    let newSrc = img.src;
    if (img.hasAttribute("lazyload")) {
      newSrc = img.getAttribute("data-src");
      img.src = newSrc;
      img.removeAttribute("lazyload");
    }

    viewerState.targetImg.src = newSrc;
  };

  const handleMaskClick = () => {
    if (!viewerState.dragged) {
      closeViewer();
    }
    viewerState.dragged = false;
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
    document.addEventListener("click", handleImageClick, { signal });
  } else {
    targetImg.addEventListener("wheel", zoomHandle, { passive: false });
    targetImg.addEventListener("mousedown", dragStartHandle, { passive: false });
    targetImg.addEventListener("mousemove", dragHandle, { passive: false });
    targetImg.addEventListener("mouseup", dragEndHandle, { passive: false });
    targetImg.addEventListener("mouseleave", dragEndHandle, { passive: false });
    maskDom.addEventListener("click", handleMaskClick);
    document.addEventListener("click", handleImageClick);
  }
}
