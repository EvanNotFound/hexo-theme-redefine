import { updateScrollStyle, updateHomeBannerBlur } from "./utils/scroll.js";
import {
  initFontSizeAdjust,
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
    html_root_dom: document.querySelector("html"),
    pageTop_dom: document.querySelector(".main-content-header"),
    homeBanner_dom: document.querySelector(".home-banner-container"),
    homeBannerBackground_dom: document.querySelector(".home-banner-background"),
    scrollProgressBar_dom: document.querySelector(".scroll-progress-bar"),
    backToTopButton_dom: document.querySelector(".tool-scroll-to-top"),
    toolsList: document.querySelector(".hidden-tools-list"),
    toggleButton: document.querySelector(".toggle-tools-list"),
    fontAdjPlus_dom: document.querySelector(".tool-font-adjust-plus"),
    fontAdMinus_dom: document.querySelector(".tool-font-adjust-minus"),

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
  initFontSizeAdjust(context, signal);
  initGoComment(signal);

  initPageHeightHandle(context);
  initHomeBannerHeight(context);
  relativeTimeInHome();
};
