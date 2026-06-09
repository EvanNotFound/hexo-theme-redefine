import { initTocToggle } from "../tools/tocToggle.js";
import { getStyleStatus } from "../state/styleStatus.js";

let tocState = null;
let didInitScroll = false;

const registerScrollHandler = (signal) => {
  if (didInitScroll) {
    return;
  }

  didInitScroll = true;
  const options = signal ? { signal } : undefined;
  window.addEventListener(
    "scroll",
    () => {
      tocState?.updateActiveTOCLink();
    },
    options,
  );
};

export function initTOC({ signal } = {}) {
  registerScrollHandler(signal);

  const tocContainer = document.querySelector(".toc-content-container");
  if (!tocContainer) {
    tocState = null;
    return null;
  }

  const navItems = tocContainer.querySelectorAll(".post-toc li");
  const tocToggle = initTocToggle();

  if (navItems.length === 0) {
    tocToggle.hideToggle();
    tocContainer.remove();
    document.querySelectorAll(".toc-marker").forEach((elem) => {
      elem.remove();
    });
    tocState = null;
    return null;
  }

  const navLinks = tocContainer.querySelectorAll(".post-toc li a.nav-link");

  const utils = {
    navItems,
    navLinks,

    updateActiveTOCLink() {
      if (!Array.isArray(utils.sections)) return;
      let index = utils.sections.findIndex((element) => {
        return element && element.getBoundingClientRect().top - 100 > 0;
      });
      if (index === -1) {
        index = utils.sections.length - 1;
      } else if (index > 0) {
        index--;
      }
      this.activateTOCLink(index);
    },

    registerTOCScroll() {
      utils.sections = [...utils.navLinks].map((element) => {
        const href = element.getAttribute("href") || "";
        try {
          const id = decodeURI(href).replace("#", "");
          return document.getElementById(id);
        } catch (error) {
          console.warn("Invalid TOC link URI:", href, error);
          return null;
        }
      });
    },

    activateTOCLink(index) {
      const target = utils.navLinks[index];
      if (!target || target.classList.contains("active-current")) return;
      tocContainer.querySelectorAll(".active").forEach((elem) => {
        elem.classList.remove("active", "active-current");
      });
      target.classList.add("active", "active-current");

      const tocTop = tocContainer.getBoundingClientRect().top;
      const scrollTopOffset =
        tocContainer.offsetHeight > window.innerHeight
          ? (tocContainer.offsetHeight - window.innerHeight) / 2
          : 0;
      const targetTop = target.getBoundingClientRect().top - tocTop;
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      );
      const distanceToCenter =
        targetTop -
        viewportHeight / 2 +
        target.offsetHeight / 2 -
        scrollTopOffset;
      const scrollTop = tocContainer.scrollTop + distanceToCenter;

      tocContainer.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    },

    showTOCAside() {
      const openHandle = () => {
        const styleStatus = getStyleStatus();
        const key = "isOpenPageAside";
        if (styleStatus && styleStatus.hasOwnProperty(key)) {
          tocToggle.pageAsideHandleOfTOC(styleStatus[key]);
        } else {
          tocToggle.pageAsideHandleOfTOC(true);
        }
      };

      const initOpenKey = "init_open";

      const tocConfig = window.theme?.articles?.toc;
      if (tocConfig && Object.prototype.hasOwnProperty.call(tocConfig, initOpenKey)) {
        tocConfig[initOpenKey]
          ? openHandle()
          : tocToggle.pageAsideHandleOfTOC(false);
      } else {
        openHandle();
      }
    },
  };

  utils.showTOCAside();
  utils.registerTOCScroll();
  utils.updateActiveTOCLink();

  tocState = utils;
  return utils;
}
