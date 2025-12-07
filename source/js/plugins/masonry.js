export function initMasonry() {
  var loadingPlaceholder = document.querySelector(".loading-placeholder");
  var masonryContainer = document.querySelector("#masonry-container");
  if (!loadingPlaceholder || !masonryContainer) return;

  loadingPlaceholder.style.display = "block";
  masonryContainer.style.display = "none";

  var images = document.querySelectorAll(
    "#masonry-container .masonry-item img",
  );
  var loadedCount = 0;

  function onImageLoad() {
    loadedCount++;
    if (loadedCount === images.length) {
      initializeMasonryLayout();
    }
  }

  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    if (img.complete) {
      onImageLoad();
    } else {
      img.addEventListener("load", onImageLoad);
    }
  }

  if (loadedCount === images.length) {
    initializeMasonryLayout();
  }
  function initializeMasonryLayout() {
    loadingPlaceholder.style.opacity = 0;
    setTimeout(() => {
      loadingPlaceholder.style.display = "none";
      masonryContainer.style.display = "block";
      var screenWidth = window.innerWidth;
      var baseWidth;
      if (screenWidth >= 768) {
        baseWidth = 255;
      } else {
        baseWidth = 150;
      }
      var masonry = new MiniMasonry({
        baseWidth: baseWidth,
        container: masonryContainer,
        gutterX: 10,
        gutterY: 10,
        surroundingGutter: false,
      });
      masonry.layout();
      masonryContainer.style.opacity = 1;
    }, 100);
  }
}

export default function initMasonryPlugin() {
  // 检查是否存在masonry容器
  if (document.querySelector("#masonry-container")) {
    initMasonry();
  }
}

// 直接初始化masonry，不依赖main.refresh
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Masonry] DOMContentLoaded: Initializing');
    initMasonryPlugin();
  });
} else {
  console.log('[Masonry] Document already loaded: Initializing');
  initMasonryPlugin();
}

// 支持页面导航时重新初始化
try {
  swup.hooks.on("page:view", () => {
    console.log('[Masonry] SWUP page:view: Initializing');
    if (document.querySelector("#masonry-container")) {
      initMasonry();
    }
  });
} catch (e) {}

