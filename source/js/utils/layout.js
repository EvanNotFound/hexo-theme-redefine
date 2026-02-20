const getElementHeight = (selectors) => {
  const dom = document.querySelector(selectors);
  return dom ? dom.getBoundingClientRect().height : 0;
};

export const initHomeBannerHeight = (ctx) => {
  if (!ctx?.homeBanner_dom) {
    return;
  }

  ctx.homeBanner_dom.style.height = `${ctx.innerHeight}px`;
};

export const initPageHeightHandle = (ctx) => {
  if (ctx?.homeBanner_dom) {
    return;
  }

  const temp_h1 = getElementHeight(".main-content-header");
  const temp_h2 = getElementHeight(".main-content-body");
  const temp_h3 = getElementHeight(".main-content-footer");
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
};

const setHowLongAgoLanguage = (value, template) => {
  return template.replace(/%s/g, value);
};

const getHowLongAgo = (timestamp) => {
  const l = lang_ago;

  const __Y = Math.floor(timestamp / (60 * 60 * 24 * 30) / 12);
  const __M = Math.floor(timestamp / (60 * 60 * 24 * 30));
  const __W = Math.floor(timestamp / (60 * 60 * 24) / 7);
  const __d = Math.floor(timestamp / (60 * 60 * 24));
  const __h = Math.floor((timestamp / (60 * 60)) % 24);
  const __m = Math.floor((timestamp / 60) % 60);
  const __s = Math.floor(timestamp % 60);

  if (__Y > 0) {
    return setHowLongAgoLanguage(__Y, l.year);
  } else if (__M > 0) {
    return setHowLongAgoLanguage(__M, l.month);
  } else if (__W > 0) {
    return setHowLongAgoLanguage(__W, l.week);
  } else if (__d > 0) {
    return setHowLongAgoLanguage(__d, l.day);
  } else if (__h > 0) {
    return setHowLongAgoLanguage(__h, l.hour);
  } else if (__m > 0) {
    return setHowLongAgoLanguage(__m, l.minute);
  } else if (__s > 0) {
    return setHowLongAgoLanguage(__s, l.second);
  }

  return "";
};

export const relativeTimeInHome = () => {
  const post = document.querySelectorAll(
    ".home-article-meta-info .home-article-date",
  );
  const df = theme.home.article_date_format;
  if (df === "relative") {
    post &&
      post.forEach((v) => {
        const nowDate = Date.now();
        const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
        v.innerHTML = getHowLongAgo(
          Math.floor((nowDate - postDate) / 1000),
        );
      });
  } else if (df === "auto") {
    post &&
      post.forEach((v) => {
        const nowDate = Date.now();
        const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
        const finalDays = Math.floor(
          (nowDate - postDate) / (60 * 60 * 24 * 1000),
        );
        if (finalDays < 7) {
          v.innerHTML = getHowLongAgo(
            Math.floor((nowDate - postDate) / 1000),
          );
        }
      });
  }
};
