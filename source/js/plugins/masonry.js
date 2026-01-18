const initializedContainers = new WeakSet();

export default function initMasonry({ signal } = {}) {
  const loadingPlaceholder = document.querySelector(".loading-placeholder");
  const masonryContainer = document.querySelector("#masonry-container");
  if (!loadingPlaceholder || !masonryContainer) {
    return;
  }

  if (initializedContainers.has(masonryContainer)) {
    return;
  }
  initializedContainers.add(masonryContainer);

  if (typeof MiniMasonry === "undefined") {
    console.error("MiniMasonry is not available.");
    return;
  }

  loadingPlaceholder.style.display = "block";
  masonryContainer.style.display = "none";

  const images = document.querySelectorAll(
    "#masonry-container .masonry-item img",
  );
  let loadedCount = 0;

  const initializeMasonryLayout = () => {
    loadingPlaceholder.style.opacity = 0;
    setTimeout(() => {
      loadingPlaceholder.style.display = "none";
      masonryContainer.style.display = "block";
      const screenWidth = window.innerWidth;
      const baseWidth = screenWidth >= 768 ? 255 : 150;
      const masonry = new MiniMasonry({
        baseWidth,
        container: masonryContainer,
        gutterX: 10,
        gutterY: 10,
        surroundingGutter: false,
      });
      masonry.layout();
      masonryContainer.style.opacity = 1;
    }, 100);
  };

  const onImageLoad = () => {
    loadedCount += 1;
    if (loadedCount === images.length) {
      initializeMasonryLayout();
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      onImageLoad();
      return;
    }
    if (signal) {
      img.addEventListener("load", onImageLoad, { signal });
    } else {
      img.addEventListener("load", onImageLoad);
    }
  });

  if (loadedCount === images.length) {
    initializeMasonryLayout();
  }
}
