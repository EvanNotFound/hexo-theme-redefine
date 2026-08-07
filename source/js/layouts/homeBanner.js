const setQrState = (item, isOpen) => {
  const trigger = item.querySelector("[data-qr-trigger]");
  const popup = trigger
    ? document.getElementById(trigger.getAttribute("aria-controls"))
    : null;

  item.dataset.state = isOpen ? "open" : "closed";
  trigger?.setAttribute("aria-expanded", String(isOpen));
  popup?.setAttribute("aria-hidden", String(!isOpen));
};

export default function initHomeBanner({ signal } = {}) {
  const scrollButton = document.getElementById("scroll-to-main");
  const scrollHandler = () => {
    document.getElementById("page-shell")?.scrollIntoView({ behavior: "smooth" });
  };

  if (scrollButton) {
    signal
      ? scrollButton.addEventListener("click", scrollHandler, { signal })
      : scrollButton.addEventListener("click", scrollHandler);
  }

  const qrItems = document.querySelectorAll("[data-qr]");
  if (!qrItems.length) {
    return;
  }

  let activeItem = null;
  const closeActiveItem = () => {
    if (activeItem) {
      setQrState(activeItem, false);
      activeItem = null;
    }
  };

  qrItems.forEach((item) => {
    const trigger = item.querySelector("[data-qr-trigger]");
    if (!trigger) {
      return;
    }

    const handleClick = (event) => {
      event.preventDefault();
      const shouldOpen = item.dataset.state !== "open";
      closeActiveItem();
      if (shouldOpen) {
        setQrState(item, true);
        activeItem = item;
      }
    };

    signal
      ? trigger.addEventListener("click", handleClick, { signal })
      : trigger.addEventListener("click", handleClick);
  });

  const handleDocumentClick = (event) => {
    if (!event.target.closest("[data-qr]")) {
      closeActiveItem();
    }
  };

  signal
    ? document.addEventListener("click", handleDocumentClick, { signal })
    : document.addEventListener("click", handleDocumentClick);
}
