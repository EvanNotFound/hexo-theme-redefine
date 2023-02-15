/* global REDEFINE */

REDEFINE.initUtils = () => {
  REDEFINE.utils = {
    html_root_dom: document.querySelector("html"),
    pageContainer_dom: document.querySelector(".page-container"),
    pageTop_dom: document.querySelector(".page-main-content-top"),
    firstScreen_dom: document.querySelector(".first-screen-container"),
    scrollProgressBar_dom: document.querySelector(".scroll-progress-bar"),
    pjaxProgressBar_dom: document.querySelector(".pjax-progress-bar"),
    pjaxProgressIcon_dom: document.querySelector(".pjax-progress-icon"),
    backToTopButton_dom: document.querySelector(".tool-scroll-to-top"),

    innerHeight: window.innerHeight,
    pjaxProgressBarTimer: null,
    prevScrollValue: 0,
    fontSizeLevel: 0,

    isHasScrollProgressBar:
      REDEFINE.theme_config.style.scroll.progress_bar.enable === true,
    isHasScrollPercent:
      REDEFINE.theme_config.style.scroll.percent.enable === true,

    // Scroll Style Handle
    styleHandleWhenScroll() {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      const scrollHeight =
        document.body.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const percent = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      );

      if (this.isHasScrollProgressBar) {
        const ProgressPercent = (
          (scrollTop / (scrollHeight - clientHeight)) *
          100
        ).toFixed(3);
        this.scrollProgressBar_dom.style.visibility =
          percent === 0 ? "hidden" : "visible";
        this.scrollProgressBar_dom.style.width = `${ProgressPercent}%`;
      }

      if (this.isHasScrollPercent) {
        const percent_dom = this.backToTopButton_dom.querySelector(".percent");
        if (percent === 0 || percent === undefined) {
          this.backToTopButton_dom.classList.remove("show");
        } else {
          this.backToTopButton_dom.classList.add("show");
          percent_dom.innerHTML = percent.toFixed(0);
        }
      }

      // hide menu handle
      if (scrollTop > this.prevScrollValue && scrollTop > this.innerHeight) {
        this.pageTop_dom.classList.remove("hide");
      } else {
        this.pageTop_dom.classList.remove("hide");
      }
      this.prevScrollValue = scrollTop;
    },

    // register window scroll event
    registerWindowScroll() {
      window.addEventListener("scroll", () => {
        // style handle when scroll
        if (this.isHasScrollPercent || this.isHasScrollProgressBar) {
          this.styleHandleWhenScroll();
        }

        // TOC scroll handle
        if (
          REDEFINE.theme_config.toc.enable &&
          REDEFINE.utils.hasOwnProperty("updateActiveTOCLink")
        ) {
          REDEFINE.utils.updateActiveTOCLink();
        }

        // menu shrink
        REDEFINE.utils.menuShrink.menuShrink();

        // auto hide tools
        var y = window.pageYOffset;
        var height = document.body.scrollHeight;
        var windowHeight = window.innerHeight;
        var toolList = document.getElementsByClassName('right-bottom-side-tools');
        
        for (var i = 0; i < toolList.length; i++) {
          var tools = toolList[i];
          if (y <= 0) {
            if (location.pathname !== '/') {
              //console.log(location.pathname)
            } else {
              tools.classList.add('hide');
            }
          } else if (y + windowHeight >= height - 20) {
            tools.classList.add('hide');
          } else {
            tools.classList.remove('hide');
          }
        }
      });
    },

    // toggle show tools list
    toggleShowToolsList() {
      document
        .querySelector(".tool-toggle-show")
        .addEventListener("click", () => {
          document
            .querySelector(".unfolded-tools-list")
            .classList.toggle("show");
        });
    },

    // global font adjust
    globalFontAdjust() {
      const fontSize = document.defaultView.getComputedStyle(
        document.body
      ).fontSize;
      const fs = parseFloat(fontSize);

      const initFontSize = () => {
        const styleStatus = REDEFINE.getStyleStatus();
        if (styleStatus) {
          this.fontSizeLevel = styleStatus.fontSizeLevel;
          setFontSize(this.fontSizeLevel);
        }
      };

      const setFontSize = (fontSizeLevel) => {
        this.html_root_dom.style.fontSize = `${
          fs * (1 + fontSizeLevel * 0.05)
        }px`;
        REDEFINE.styleStatus.fontSizeLevel = fontSizeLevel;
        REDEFINE.setStyleStatus();
      };

      initFontSize();

      document
        .querySelector(".tool-font-adjust-plus")
        .addEventListener("click", () => {
          if (this.fontSizeLevel === 5) return;
          this.fontSizeLevel++;
          setFontSize(this.fontSizeLevel);
        });

      document
        .querySelector(".tool-font-adjust-minus")
        .addEventListener("click", () => {
          if (this.fontSizeLevel <= 0) return;
          this.fontSizeLevel--;
          setFontSize(this.fontSizeLevel);
        });
    },

    // toggle content area width
    contentAreaWidthAdjust() {
      const toolExpandDom = document.querySelector(".tool-expand-width");
      const menuContentDom = document.querySelector(".menu-content");
      const mainContentDom = document.querySelector(".main-content");
      const iconDom = toolExpandDom.querySelector("i");

      const defaultMaxWidth =
        REDEFINE.theme_config.style.content_max_width || "1000px";
      const expandMaxWidth = "90%";
      let menuMaxWidth = defaultMaxWidth;

      let isExpand = false;

      if (
        REDEFINE.theme_config.style.first_screen.enable === true &&
        window.location.pathname === "/"
      ) {
        menuMaxWidth = parseInt(defaultMaxWidth) * 1.2 + "px";
      }

      const setPageWidth = (isExpand) => {
        REDEFINE.styleStatus.isExpandPageWidth = isExpand;
        REDEFINE.setStyleStatus();
        if (isExpand) {
          iconDom.classList.remove("fa-expand");
          iconDom.classList.add("fa-compress");
          menuContentDom.style.maxWidth = expandMaxWidth;
          mainContentDom.style.maxWidth = expandMaxWidth;
        } else {
          iconDom.classList.remove("fa-compress");
          iconDom.classList.add("fa-expand");
          menuContentDom.style.maxWidth = menuMaxWidth;
          mainContentDom.style.maxWidth = defaultMaxWidth;
        }
      };

      const initPageWidth = () => {
        const styleStatus = REDEFINE.getStyleStatus();
        if (styleStatus) {
          isExpand = styleStatus.isExpandPageWidth;
          setPageWidth(isExpand);
        }
      };

      initPageWidth();

      toolExpandDom.addEventListener("click", () => {
        isExpand = !isExpand;
        setPageWidth(isExpand);
      });
    },

    // go comment anchor
    goComment() {
      this.goComment_dom = document.querySelector(".go-comment");
      if (this.goComment_dom) {
        this.goComment_dom.addEventListener("click", () => {
          document.querySelector("#comment-anchor").scrollIntoView({
            behavior: "smooth",
          });
        });
      }
    },

    // get dom element height
    getElementHeight(selectors) {
      const dom = document.querySelector(selectors);
      return dom ? dom.getBoundingClientRect().height : 0;
    },

    // init first screen height
    initFirstScreenHeight() {
      this.firstScreen_dom &&
        (this.firstScreen_dom.style.height = this.innerHeight + "px");
    },

    // init page height handle
    initPageHeightHandle() {
      if (this.firstScreen_dom) return;
      const temp_h1 = this.getElementHeight(".page-main-content-top");
      const temp_h2 = this.getElementHeight(".page-main-content-middle");
      const temp_h3 = this.getElementHeight(".page-main-content-bottom");
      const allDomHeight = temp_h1 + temp_h2 + temp_h3;
      const innerHeight = window.innerHeight;
      const pb_dom = document.querySelector(".page-main-content-bottom");
      if (allDomHeight < innerHeight) {
        const marginTopValue = Math.floor(innerHeight - allDomHeight);
        if (marginTopValue > 0) {
          pb_dom.style.marginTop = `${marginTopValue - 2}px`;
        }
      }
    },

    // big image viewer
    imageViewer() {
      let isBigImage = false;

      const showHandle = (maskDom, isShow) => {
        document.body.style.overflow = isShow ? "hidden" : "auto";
        if (isShow) {
          maskDom.classList.add("active");
        } else {
          maskDom.classList.remove("active");
        }
      };

      const imageViewerDom = document.querySelector(".image-viewer-container");
      const targetImg = document.querySelector(".image-viewer-container img");
      imageViewerDom &&
        imageViewerDom.addEventListener("click", () => {
          isBigImage = false;
          showHandle(imageViewerDom, isBigImage);
        });

      const imgDoms = document.querySelectorAll(".markdown-body img");

      if (imgDoms.length) {
        imgDoms.forEach((img) => {
          img.addEventListener("click", () => {
            isBigImage = true;
            showHandle(imageViewerDom, isBigImage);
            targetImg.setAttribute("src", img.getAttribute("src"));
          });
        });
      } else {
        this.pageContainer_dom.removeChild(imageViewerDom);
      }
    },

    // set how long ago language
    setHowLongAgoLanguage(p1, p2) {
      return p2.replace(/%s/g, p1);
    },
    

    getHowLongAgo(timestamp) {
      const l = REDEFINE.language_ago;

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
        ".home-article-meta-info .home-article-date"
      );
      const df = REDEFINE.theme_config.home_article.date_format;
      if (df === "relative") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000)
            );
          });
      } else if (df === "auto") {
        post &&
        post.forEach((v) => {
          const nowDate = Date.now();
          const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
          const finalDays = Math.floor(
            (nowDate - postDate) / (60 * 60 * 24 * 1000)
          );
          if (finalDays < 7) {
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000)
            );
          }
        });
      }
    },

    // loading progress bar start
    pjaxProgressBarStart() {
      this.pjaxProgressBarTimer && clearInterval(this.pjaxProgressBarTimer);
      if (this.isHasScrollProgressBar) {
        this.scrollProgressBar_dom.classList.add("hide");
      }

      this.pjaxProgressBar_dom.style.width = "0";
      this.pjaxProgressIcon_dom.classList.add("show");

      let width = 1;
      const maxWidth = 99;

      this.pjaxProgressBar_dom.classList.add("show");
      this.pjaxProgressBar_dom.style.width = width + "%";

      this.pjaxProgressBarTimer = setInterval(() => {
        width += 5;
        if (width > maxWidth) width = maxWidth;
        this.pjaxProgressBar_dom.style.width = width + "%";
      }, 100);
    },

    // loading progress bar end
    pjaxProgressBarEnd() {
      this.pjaxProgressBarTimer && clearInterval(this.pjaxProgressBarTimer);
      this.pjaxProgressBar_dom.style.width = "100%";

      const temp_1 = setTimeout(() => {
        this.pjaxProgressBar_dom.classList.remove("show");
        this.pjaxProgressIcon_dom.classList.remove("show");

        if (this.isHasScrollProgressBar) {
          this.scrollProgressBar_dom.classList.remove("hide");
        }

        const temp_2 = setTimeout(() => {
          this.pjaxProgressBar_dom.style.width = "0";
          clearTimeout(temp_1), clearTimeout(temp_2);
        }, 200);
      }, 200);
    },



    /*
    calculateMaterialColors(hex) {
      // Convert hex to RGB
      hex = hex.replace(/#/g, "");
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map(function (hex) {
            return hex + hex;
          })
          .join("");
      }
      var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(
        hex
      );
      if (!result) {
        return null;
      }
      var r = parseInt(result[1], 16);
      var g = parseInt(result[2], 16);
      var b = parseInt(result[3], 16);
      (r /= 255), (g /= 255), (b /= 255);
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h,
        s,
        l = (max + min) / 2;
      if (max == min) {
        h = s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      s = s * 100;
      s = Math.round(s);
      l = l * 100;
      l = Math.round(l);
      h = Math.round(360 * h);

      // Compute primary, secondary, and tertiary colors
      const primaryColor = `hsl(${h}, ${s}%, ${l}%)`;
      const secondaryColor = `hsl(${h}, ${s - 15}%, ${l - 15}%)`;
      const tertiaryColor = `hsl(${h}, ${s - 25}%, ${l - 25}%)`;
      document.documentElement.style.setProperty('--primary-color-temp', primaryColor);
      document.documentElement.style.setProperty('--secondary-color-temp', secondaryColor);
      document.documentElement.style.setProperty('--tertiary-color-temp', tertiaryColor);
    },*/
  };

  // init scroll
  REDEFINE.utils.registerWindowScroll();

  // toggle show tools list
  REDEFINE.utils.toggleShowToolsList();

  // global font adjust
  REDEFINE.utils.globalFontAdjust();

  // adjust content area width
  REDEFINE.utils.contentAreaWidthAdjust();

  // go comment
  REDEFINE.utils.goComment();

  // init page height handle
  REDEFINE.utils.initPageHeightHandle();

  // init first screen height
  REDEFINE.utils.initFirstScreenHeight();

  // big image viewer handle
  REDEFINE.utils.imageViewer();

  // set how long ago in home article block
  REDEFINE.utils.relativeTimeInHome();

  // calculate material colors
  //REDEFINE.utils.calculateMaterialColors(REDEFINE.theme_config.style.primary_color);
};
