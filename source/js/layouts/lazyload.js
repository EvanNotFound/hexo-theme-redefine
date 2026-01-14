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
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc) {
        img.src = dataSrc;
      }

      img.removeAttribute("lazyload");
      delete img.dataset.redefineLazyloadObserved;
      observer.unobserve(img);
    });
  }, options);
};

export default function initLazyLoad() {
  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll("img[lazyload]").forEach((img) => {
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc) {
        img.src = dataSrc;
      }
      img.removeAttribute("lazyload");
    });
    return;
  }

  ensureObserver();

  if (!lazyloadObserver) {
    return;
  }

  document.querySelectorAll("img[lazyload]").forEach((img) => {
    if (img.dataset.redefineLazyloadObserved) {
      return;
    }

    img.dataset.redefineLazyloadObserved = "true";
    lazyloadObserver.observe(img);
  });
}
