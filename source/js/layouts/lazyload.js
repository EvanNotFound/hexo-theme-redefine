let lazyloadObserver = null;

const ensureObserver = () => {
  if (lazyloadObserver) {
    return;
  }

  if (typeof IntersectionObserver === "undefined") {
    return;
  }

  const options = {
    rootMargin: "0px",
    threshold: 0.1,
  };

  lazyloadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const img = entry.target;
      const dataSrc = img.dataset.lazySrc;
      if (dataSrc) {
        img.src = dataSrc;
      }

      img.dataset.lazyState = "loaded";
      delete img.dataset.redefineLazyloadObserved;
      observer.unobserve(img);
    });
  }, options);
};

export default function initLazyLoad() {
  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll('img[data-lazy-state="pending"]').forEach((img) => {
      const dataSrc = img.dataset.lazySrc;
      if (dataSrc) {
        img.src = dataSrc;
      }
      img.dataset.lazyState = "loaded";
    });
    return;
  }

  ensureObserver();

  if (!lazyloadObserver) {
    return;
  }

  document.querySelectorAll('img[data-lazy-state="pending"]').forEach((img) => {
    if (img.dataset.redefineLazyloadObserved) {
      return;
    }

    img.dataset.redefineLazyloadObserved = "true";
    lazyloadObserver.observe(img);
  });
}
