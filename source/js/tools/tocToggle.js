import { updateStyleStatus } from "../state/styleStatus.js";

let didInit = false;

const getTocElements = () => {
  const toggle = document.getElementById("toc-toggle");
  return {
    toggle,
    layout: document.getElementById("article-layout"),
    icon: toggle?.querySelector("i"),
    mainContent: document.getElementById("main-content"),
  };
};

const applyTocState = (elements, isOpen) => {
  if (elements.icon) {
    elements.icon.classList.toggle("fas", isOpen);
    elements.icon.classList.toggle("fa-indent", isOpen);
    elements.icon.classList.toggle("fa-outdent", !isOpen);
  }
  if (elements.layout) {
    elements.layout.dataset.tocState = isOpen ? "open" : "closed";
  }
  if (elements.mainContent) {
    elements.mainContent.dataset.tocState = isOpen ? "open" : "closed";
  }
  elements.toggle?.setAttribute("aria-expanded", String(isOpen));
};

const showToggle = (elements) => {
  if (elements.toggle) {
    elements.toggle.hidden = false;
  }
};

const hideToggle = (elements) => {
  if (elements.toggle) {
    elements.toggle.hidden = true;
  }
};

const handleToggleClick = (event) => {
  if (!event.target.closest("#toc-toggle")) {
    return;
  }

  const elements = getTocElements();
  if (!elements.layout || !elements.mainContent) {
    return;
  }

  const isOpen = elements.layout.dataset.tocState !== "open";
  updateStyleStatus({ isOpenPageAside: isOpen });
  showToggle(elements);
  applyTocState(elements, isOpen);
};

export function initTocToggle({ signal } = {}) {
  if (!didInit && signal) {
    didInit = true;
    document.addEventListener("click", handleToggleClick, { signal });
  }

  const elements = getTocElements();
  return {
    pageAsideHandleOfTOC(isOpen) {
      if (!elements.layout || !elements.mainContent) {
        hideToggle(elements);
        return;
      }
      showToggle(elements);
      applyTocState(elements, isOpen);
    },
    hideToggle() {
      hideToggle(elements);
    },
  };
}
