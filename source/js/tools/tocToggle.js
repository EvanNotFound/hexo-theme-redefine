import { updateStyleStatus } from "../state/styleStatus.js";

let didInit = false;

const getTocElements = () => ({
  toggleBar: document.querySelector(".page-aside-toggle"),
  postPageContainerDom: document.querySelector(".post-page-container"),
  toggleBarIcon: document.querySelector(".page-aside-toggle i"),
  mainContentDom: document.querySelector(".main-content"),
});

const toggleClassName = (element, className, condition) => {
  if (element) {
    element.classList.toggle(className, condition);
  }
};

const applyTocState = (elements, isOpen) => {
  toggleClassName(elements.toggleBarIcon, "fas", isOpen);
  toggleClassName(elements.toggleBarIcon, "fa-indent", isOpen);
  toggleClassName(elements.toggleBarIcon, "fa-outdent", !isOpen);
  toggleClassName(elements.postPageContainerDom, "show-toc", isOpen);
  toggleClassName(elements.mainContentDom, "has-toc", isOpen);
};

const showToggle = (elements) => {
  if (elements.toggleBar) {
    elements.toggleBar.style.display = "flex";
  }
};

const hideToggle = (elements) => {
  if (elements.toggleBar) {
    elements.toggleBar.style.display = "none";
  }
};

const handleToggleClick = (event) => {
  const toggle = event.target.closest(".page-aside-toggle");
  if (!toggle) {
    return;
  }

  const elements = getTocElements();
  if (!elements.postPageContainerDom || !elements.mainContentDom) {
    return;
  }

  const isOpen = !elements.postPageContainerDom.classList.contains("show-toc");
  updateStyleStatus({
    isOpenPageAside: isOpen,
  });
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
      if (!elements.postPageContainerDom || !elements.mainContentDom) {
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
