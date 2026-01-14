import { getStyleStatus, updateStyleStatus } from "./state/styleStatus.js";

let activeUtils = null;
let scrollHandlersBound = false;

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
  if (scrollHandlersBound || !signal) {
    return;
  }

  scrollHandlersBound = true;
  window.addEventListener("scroll", handleScroll, { signal });
  window.addEventListener("scroll", debounce(handleHomeBannerBlur, 20), {
    signal,
  });
};

export const initUtilsGlobals = ({ signal } = {}) => {
  registerScrollHandlers(signal);
};

export const initUtilsPage = ({ signal } = {}) => {
  const utils = {
    html_root_dom: document.querySelector("html"),
    pageContainer_dom: document.querySelector(".page-container"),
    pageTop_dom: document.querySelector(".main-content-header"),
    homeBanner_dom: document.querySelector(".home-banner-container"),
    homeBannerBackground_dom: document.querySelector(".home-banner-background"),
    scrollProgressBar_dom: document.querySelector(".scroll-progress-bar"),
    pjaxProgressBar_dom: document.querySelector(".pjax-progress-bar"),
    backToTopButton_dom: document.querySelector(".tool-scroll-to-top"),
    toolsList: document.querySelector(".hidden-tools-list"),
    toggleButton: document.querySelector(".toggle-tools-list"),

    innerHeight: window.innerHeight,
    pjaxProgressBarTimer: null,
    prevScrollValue: 0,
    fontSizeLevel: 0,
    triggerViewHeight: 0.5 * window.innerHeight,

    isHasScrollProgressBar: theme.global.scroll_progress.bar === true,
    isHasScrollPercent: theme.global.scroll_progress.percentage === true,

    // Scroll Style
    updateScrollStyle() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const percent = this.calculatePercentage(
        scrollTop,
        scrollHeight,
        clientHeight,
      );

      this.updateScrollProgressBar(percent);
      this.updateScrollPercent(percent);
      this.updatePageTopVisibility(scrollTop, clientHeight);

      this.prevScrollValue = scrollTop;
    },

    updateScrollProgressBar(percent) {
      if (this.isHasScrollProgressBar && this.scrollProgressBar_dom) {
        const progressPercent = percent.toFixed(3);
        const visibility = percent === 0 ? "hidden" : "visible";

        this.scrollProgressBar_dom.style.visibility = visibility;
        this.scrollProgressBar_dom.style.width = `${progressPercent}%`;
      }
    },

    updateScrollPercent(percent) {
      if (this.isHasScrollPercent && this.backToTopButton_dom) {
        const percentDom = this.backToTopButton_dom.querySelector(".percent");
        if (!percentDom) {
          return;
        }
        const showButton = percent !== 0 && percent !== undefined;

        this.backToTopButton_dom.classList.toggle("show", showButton);
        percentDom.innerHTML = percent.toFixed(0);
      }
    },

    updatePageTopVisibility(scrollTop, clientHeight) {
      if (!this.pageTop_dom) {
        return;
      }

      if (theme.navbar.auto_hide) {
        const prevScrollValue = this.prevScrollValue;
        const hidePageTop =
          prevScrollValue > clientHeight && scrollTop > prevScrollValue;

        this.pageTop_dom.classList.toggle("hide", hidePageTop);
      } else {
        this.pageTop_dom.classList.remove("hide");
      }
    },

    calculatePercentage(scrollTop, scrollHeight, clientHeight) {
      let percentageValue = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100,
      );
      if (
        isNaN(percentageValue) ||
        percentageValue < 0 ||
        !isFinite(percentageValue)
      ) {
        percentageValue = 0;
      } else if (percentageValue > 100) {
        percentageValue = 100;
      }
      return percentageValue;
    },

    updateHomeBannerBlur() {
      if (!this.homeBannerBackground_dom) return;

      if (
        theme.home_banner.style === "fixed" &&
        location.pathname === config.root
      ) {
        const scrollY = window.scrollY || window.pageYOffset;
        const blurValue = scrollY >= this.triggerViewHeight ? 15 : 0;

        try {
          requestAnimationFrame(() => {
            this.homeBannerBackground_dom.style.filter = `blur(${blurValue}px)`;
            this.homeBannerBackground_dom.style.webkitFilter = `blur(${blurValue}px)`;
          });
        } catch (e) {
          console.error("Error updating banner blur:", e);
        }
      }
    },

    updateAutoHideTools() {
      const y = window.scrollY;
      const height = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      const toolList = document.getElementsByClassName(
        "right-side-tools-container",
      );
      const aplayer = document.getElementById("aplayer");

      for (let i = 0; i < toolList.length; i++) {
        const tools = toolList[i];
        if (y <= 100) {
          if (location.pathname === config.root) {
            tools.classList.add("hide");
            if (aplayer !== null) {
              aplayer.classList.add("hide");
            }
          }
        } else if (y + windowHeight >= height - 20) {
          tools.classList.add("hide");
          if (aplayer !== null) {
            aplayer.classList.add("hide");
          }
        } else {
          tools.classList.remove("hide");
          if (aplayer !== null) {
            aplayer.classList.remove("hide");
          }
        }
      }
    },

    toggleToolsList(signal) {
      if (!this.toolsList || !this.toggleButton) {
        return;
      }

      if (theme.global.side_tools && theme.global.side_tools.auto_expand) {
        this.toolsList.classList.add("show");
      }

      if (signal) {
        this.toggleButton.addEventListener(
          "click",
          () => {
            this.toolsList.classList.toggle("show");
          },
          { signal },
        );
      } else {
        this.toggleButton.addEventListener("click", () => {
          this.toolsList.classList.toggle("show");
        });
      }
    },

    fontAdjPlus_dom: document.querySelector(".tool-font-adjust-plus"),
    fontAdMinus_dom: document.querySelector(".tool-font-adjust-minus"),
    globalFontSizeAdjust(signal) {
      const htmlRoot = this.html_root_dom;
      const fontAdjustPlus = this.fontAdjPlus_dom;
      const fontAdjustMinus = this.fontAdMinus_dom;

      if (!htmlRoot || !fontAdjustPlus || !fontAdjustMinus) {
        return;
      }

      const fontSize = document.defaultView.getComputedStyle(
        document.body,
      ).fontSize;
      const baseFontSize = parseFloat(fontSize);

      let fontSizeLevel = 0;
      const storedStatus = getStyleStatus();
      if (storedStatus) {
        fontSizeLevel = storedStatus.fontSizeLevel;
        setFontSize(fontSizeLevel);
      }

      function setFontSize(level) {
        const fontSize = baseFontSize * (1 + level * 0.05);
        htmlRoot.style.fontSize = `${fontSize}px`;
        updateStyleStatus({ fontSizeLevel: level });
      }

      function increaseFontSize() {
        fontSizeLevel = Math.min(fontSizeLevel + 1, 5);
        setFontSize(fontSizeLevel);
      }

      function decreaseFontSize() {
        fontSizeLevel = Math.max(fontSizeLevel - 1, 0);
        setFontSize(fontSizeLevel);
      }

      if (signal) {
        fontAdjustPlus.addEventListener("click", increaseFontSize, { signal });
        fontAdjustMinus.addEventListener("click", decreaseFontSize, { signal });
      } else {
        fontAdjustPlus.addEventListener("click", increaseFontSize);
        fontAdjustMinus.addEventListener("click", decreaseFontSize);
      }
    },
    // go comment anchor
    goComment(signal) {
      const goCommentDom = document.querySelector(".go-comment");
      if (!goCommentDom) {
        return;
      }

      const handler = () => {
        const target = document.querySelector("#comment-anchor");
        if (target) {
          const offset = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: offset,
            behavior: "smooth",
          });
        }
      };

      if (signal) {
        goCommentDom.addEventListener("click", handler, { signal });
      } else {
        goCommentDom.addEventListener("click", handler);
      }
    },

    // get dom element height
    getElementHeight(selectors) {
      const dom = document.querySelector(selectors);
      return dom ? dom.getBoundingClientRect().height : 0;
    },

    // init first screen height
    inithomeBannerHeight() {
      this.homeBanner_dom &&
        (this.homeBanner_dom.style.height = this.innerHeight + "px");
    },

    // init page height handle
    initPageHeightHandle() {
      if (this.homeBanner_dom) return;
      const temp_h1 = this.getElementHeight(".main-content-header");
      const temp_h2 = this.getElementHeight(".main-content-body");
      const temp_h3 = this.getElementHeight(".main-content-footer");
      const allDomHeight = temp_h1 + temp_h2 + temp_h3;
      const innerHeight = window.innerHeight;
      const pb_dom = document.querySelector(".main-content-footer");
      if (!pb_dom) {
        return;
      }
      if (allDomHeight < innerHeight) {
        const marginTopValue = Math.floor(innerHeight - allDomHeight);
        if (marginTopValue > 0) {
          pb_dom.style.marginTop = `${marginTopValue - 2}px`;
        }
      }
    },

    // set how long ago language
    setHowLongAgoLanguage(p1, p2) {
      return p2.replace(/%s/g, p1);
    },

    getHowLongAgo(timestamp) {
      const l = lang_ago;

      const __Y = Math.floor(timestamp / (60 * 60 * 24 * 30) / 12);
      const __M = Math.floor(timestamp / (60 * 60 * 24 * 30));
      const __W = Math.floor(timestamp / (60 * 60 * 24) / 7);
      const __d = Math.floor(timestamp / (60 * 60 * 24));
      const __h = Math.floor((timestamp / (60 * 60)) % 24);
      const __m = Math.floor((timestamp / 60) % 60);
      const __s = Math.floor(timestamp % 60);

      if (__Y > 0) {
        return this.setHowLongAgoLanguage(__Y, l.year);
      } else if (__M > 0) {
        return this.setHowLongAgoLanguage(__M, l.month);
      } else if (__W > 0) {
        return this.setHowLongAgoLanguage(__W, l.week);
      } else if (__d > 0) {
        return this.setHowLongAgoLanguage(__d, l.day);
      } else if (__h > 0) {
        return this.setHowLongAgoLanguage(__h, l.hour);
      } else if (__m > 0) {
        return this.setHowLongAgoLanguage(__m, l.minute);
      } else if (__s > 0) {
        return this.setHowLongAgoLanguage(__s, l.second);
      }
    },

    relativeTimeInHome() {
      const post = document.querySelectorAll(
        ".home-article-meta-info .home-article-date",
      );
      const df = theme.home.article_date_format;
      if (df === "relative") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(
              v.dataset.date.split(" GMT")[0],
            ).getTime();
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000),
            );
          });
      } else if (df === "auto") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(
              v.dataset.date.split(" GMT")[0],
            ).getTime();
            const finalDays = Math.floor(
              (nowDate - postDate) / (60 * 60 * 24 * 1000),
            );
            if (finalDays < 7) {
              v.innerHTML = this.getHowLongAgo(
                Math.floor((nowDate - postDate) / 1000),
              );
            }
          });
      }
    },
  };

  activeUtils = utils;

  utils.updateAutoHideTools();

  utils.toggleToolsList(signal);
  utils.globalFontSizeAdjust(signal);
  utils.goComment(signal);

  utils.initPageHeightHandle();
  utils.inithomeBannerHeight();
  utils.relativeTimeInHome();
};
