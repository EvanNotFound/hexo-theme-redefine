import { updateScrollStyle, updateHomeBannerBlur } from "./utils/scroll.js";
import {
  initGoComment,
  initToolsListToggle,
  updateAutoHideTools,
} from "./utils/sideTools.js";
import {
  initHomeBannerHeight,
  initPageHeightHandle,
  relativeTimeInHome,
} from "./utils/layout.js";

let activeUtils = null;
let didInitScroll = false;

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const handleScroll = () => {
  if (!activeUtils) {
    return;
  }

  activeUtils.updateScrollStyle();
  activeUtils.updateAutoHideTools();
};

const handleHomeBannerBlur = () => {
  if (!activeUtils) {
    return;
  }

  activeUtils.updateHomeBannerBlur();
};

const registerScrollHandlers = (signal) => {
  if (didInitScroll || !signal) {
    return;
  }

  didInitScroll = true;
  window.addEventListener("scroll", handleScroll, { signal });
  window.addEventListener("scroll", debounce(handleHomeBannerBlur, 20), {
    signal,
  });
};

export const initUtilsGlobals = ({ signal } = {}) => {
  registerScrollHandlers(signal);
};

export const initUtilsPage = ({ signal } = {}) => {
  const context = {
    pageTop_dom: document.getElementById("page-header"),
    homeBanner_dom: document.getElementById("home-banner"),
    homeBannerBackground_dom: document.getElementById("home-banner-background"),
    scrollProgressBar_dom: document.getElementById("reading-progress"),
    backToTopButton_dom: document.getElementById("scroll-top"),
    toolsList: document.getElementById("side-tools-menu"),
    toggleButton: document.getElementById("side-tools-toggle"),

    innerHeight: window.innerHeight,
    prevScrollValue: 0,
    triggerViewHeight: 0.5 * window.innerHeight,

    isHasScrollProgressBar: theme.global.scroll_progress.bar === true,
    isHasScrollPercent: theme.global.scroll_progress.percentage === true,
  };

  activeUtils = {
    updateScrollStyle: () => updateScrollStyle(context),
    updateAutoHideTools,
    updateHomeBannerBlur: () => updateHomeBannerBlur(context),
  };

  updateAutoHideTools();

  initToolsListToggle(context, signal);
  initGoComment(signal);

  initPageHeightHandle(context);
  initHomeBannerHeight(context);
  relativeTimeInHome();
};
