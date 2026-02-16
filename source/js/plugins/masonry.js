const initializedContainers = new WeakSet();

const getRoot = () => {
  if (typeof window === "undefined") {
    return "/";
  }
  const root = window.config?.root || "/";
  return root.endsWith("/") ? root : `${root}/`;
};

const getBlankPlaceholderSrc = () =>
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const getBaseWidth = () => {
  const screenWidth = window.innerWidth;
  return screenWidth >= 768 ? 255 : 150;
};

const throttleFrame = (callback) => {
  let rafId = null;
  return () => {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      callback();
    });
  };
};

const ensureImageLoaded = (img) => {
  if (!img || !img.hasAttribute("lazyload")) {
    return;
  }

  const dataSrc = img.getAttribute("data-src");
  if (dataSrc) {
    img.src = dataSrc;
  }

  img.removeAttribute("lazyload");
  delete img.dataset.redefineLazyloadObserved;
};

export default function initMasonry({ signal } = {}) {
  const masonryContainer = document.querySelector("#masonry-container");
  if (!masonryContainer) {
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

  const loadmoreDom = document.querySelector("#masonry-loadmore");
  const sentinelDom = document.querySelector("#masonry-sentinel");
  const dataUrl =
    masonryContainer.dataset.masonryDataUrl || `${getRoot()}masonry/data.json`;
  const batchSizeConfig = Number.parseInt(
    window.theme?.page_templates?.masonry?.batch_size,
    10,
  );
  const initialBatchConfig = Number.parseInt(
    window.theme?.page_templates?.masonry?.initial_batch_size,
    10,
  );

  if (!Number.isFinite(batchSizeConfig)) {
    console.warn("[redefine] page_templates.masonry.batch_size is missing.");
  }
  if (!Number.isFinite(initialBatchConfig)) {
    console.warn(
      "[redefine] page_templates.masonry.initial_batch_size is missing.",
    );
  }

  if (!dataUrl) {
    console.warn("Masonry data url is missing.");
    return;
  }

  const masonry = new MiniMasonry({
    baseWidth: getBaseWidth(),
    container: masonryContainer,
    gutterX: 10,
    gutterY: 10,
    surroundingGutter: false,
  });

  const scheduleLayout = throttleFrame(() => {
    masonry.layout();
  });

  let items = [];
  let cursor = 0;
  let isLoading = false;
  const initialBatch = Number.isFinite(initialBatchConfig)
    ? Math.max(1, initialBatchConfig)
    : 24;
  const batchSize = Number.isFinite(batchSizeConfig)
    ? Math.max(1, batchSizeConfig)
    : 12;

  const supportsIntersection = typeof IntersectionObserver !== "undefined";
  const imageObserver = supportsIntersection
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const img = entry.target;
            imageObserver.unobserve(img);
            ensureImageLoaded(img);
          });
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.1,
        },
      )
    : null;

  const renderItem = (item) => {
    const masonryItem = document.createElement("div");
    masonryItem.className = "masonry-item";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const width = Number.parseInt(item.width, 10);
    const height = Number.parseInt(item.height, 10);
    const hasStableSize =
      Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
    if (hasStableSize) {
      imageContainer.classList.add("has-ratio");
      imageContainer.style.setProperty(
        "--masonry-aspect-ratio",
        `${width} / ${height}`,
      );
    }

    const img = document.createElement("img");
    img.className = "masonry-img is-loading";
    img.alt = item.title || "";
    if (hasStableSize) {
      img.width = width;
      img.height = height;
    }
    img.decoding = "async";
    img.loading = "lazy";
    img.setAttribute("lazyload", "");
    img.setAttribute("data-src", item.image);
    img.src = getBlankPlaceholderSrc();

    img.dataset.exif = item?.exif ? "true" : "false";

    const handleImageLoaded = () => {
      if (img.hasAttribute("lazyload")) {
        return;
      }
      img.classList.remove("is-loading");
      if (!hasStableSize) {
        scheduleLayout();
      }
    };

    if (signal) {
      img.addEventListener("load", handleImageLoaded, { signal });
      img.addEventListener("error", handleImageLoaded, { signal });
    } else {
      img.addEventListener("load", handleImageLoaded);
      img.addEventListener("error", handleImageLoaded);
    }

    if (imageObserver) {
      imageObserver.observe(img);
    } else {
      ensureImageLoaded(img);
    }

    imageContainer.appendChild(img);

    if (item.title) {
      const titleDom = document.createElement("div");
      titleDom.className = "image-title";
      titleDom.textContent = item.title;
      imageContainer.appendChild(titleDom);
    }

    if (item.description) {
      const descriptionDom = document.createElement("div");
      descriptionDom.className = "image-description";
      descriptionDom.textContent = item.description;
      imageContainer.appendChild(descriptionDom);
    }

    masonryItem.appendChild(imageContainer);
    return masonryItem;
  };

  const toggleLoading = (show) => {
    if (!loadmoreDom) {
      return;
    }
    loadmoreDom.classList.toggle("is-hidden", !show);
  };

  const appendBatch = (count) => {
    if (signal?.aborted || !masonryContainer.isConnected) {
      return false;
    }

    const batch = items.slice(cursor, cursor + count);
    if (batch.length === 0) {
      return false;
    }

    const fragment = document.createDocumentFragment();
    batch.forEach((item) => {
      fragment.appendChild(renderItem(item));
    });

    masonryContainer.appendChild(fragment);
    cursor += batch.length;
    scheduleLayout();
    return cursor < items.length;
  };

  const loadNextBatch = () => {
    if (isLoading) {
      return;
    }

    if (signal?.aborted || !masonryContainer.isConnected) {
      return;
    }

    isLoading = true;
    toggleLoading(true);

    const hasMore = appendBatch(batchSize);
    isLoading = false;

    toggleLoading(false);
    if (!hasMore && sentinelDom && sentinelObserver) {
      sentinelObserver.disconnect();
      sentinelDom.remove();
    }
  };

  const sentinelObserver =
    sentinelDom && supportsIntersection
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              loadNextBatch();
            }
          },
          {
            rootMargin: "200px 0px",
            threshold: 0.1,
          },
        )
      : null;

  const handleResize = () => {
    masonry.conf.baseWidth = getBaseWidth();
    scheduleLayout();
  };

  const removeMinHScreen = () => {
    masonryContainer.classList.remove("min-h-screen!");
  };

  if (signal) {
    window.addEventListener("resize", handleResize, { signal });
    signal.addEventListener("abort", () => {
      imageObserver?.disconnect();
      sentinelObserver?.disconnect();
    });
  } else {
    window.addEventListener("resize", handleResize);
  }

  const init = async () => {
    try {
      const response = await fetch(dataUrl, signal ? { signal } : undefined);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      items = await response.json();
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") {
        return;
      }
      console.error("Failed to load masonry data:", error);
      if (sentinelDom) {
        sentinelDom.remove();
      }
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      if (sentinelDom) {
        sentinelDom.remove();
      }
      return;
    }

    if (signal?.aborted || !masonryContainer.isConnected) {
      return;
    }

    appendBatch(initialBatch);
    removeMinHScreen();

    if (cursor < items.length) {
      if (sentinelDom && sentinelObserver) {
        sentinelObserver.observe(sentinelDom);
      } else {
        while (cursor < items.length) {
          appendBatch(batchSize);
        }
      }
    } else if (sentinelDom) {
      sentinelDom.remove();
    }

  };

  init();
}
