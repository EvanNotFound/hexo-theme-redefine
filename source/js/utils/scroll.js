const calculatePercentage = (scrollTop, scrollHeight, clientHeight) => {
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
};

const updateScrollProgressBar = (ctx, percent) => {
  if (ctx?.isHasScrollProgressBar && ctx.scrollProgressBar_dom) {
    const progressPercent = percent.toFixed(3);
    const visibility = percent === 0 ? "hidden" : "visible";

    ctx.scrollProgressBar_dom.style.visibility = visibility;
    ctx.scrollProgressBar_dom.style.width = `${progressPercent}%`;
  }
};

const updateScrollPercent = (ctx, percent) => {
  if (ctx?.isHasScrollPercent && ctx.backToTopButton_dom) {
    const percentDom = ctx.backToTopButton_dom.querySelector(".percent");
    if (!percentDom) {
      return;
    }
    const showButton = percent !== 0 && percent !== undefined;

    ctx.backToTopButton_dom.classList.toggle("show", showButton);
    percentDom.innerHTML = percent.toFixed(0);
  }
};

const updatePageTopVisibility = (ctx, scrollTop, clientHeight) => {
  if (!ctx?.pageTop_dom) {
    return;
  }

  if (theme.navbar.auto_hide) {
    const prevScrollValue = ctx.prevScrollValue;
    const hidePageTop =
      prevScrollValue > clientHeight && scrollTop > prevScrollValue;

    ctx.pageTop_dom.classList.toggle("hide", hidePageTop);
  } else {
    ctx.pageTop_dom.classList.remove("hide");
  }
};

export const updateScrollStyle = (ctx) => {
  if (!ctx) {
    return;
  }

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight || document.documentElement.clientHeight;
  const percent = calculatePercentage(scrollTop, scrollHeight, clientHeight);

  updateScrollProgressBar(ctx, percent);
  updateScrollPercent(ctx, percent);
  updatePageTopVisibility(ctx, scrollTop, clientHeight);

  ctx.prevScrollValue = scrollTop;
};

export const updateHomeBannerBlur = (ctx) => {
  if (!ctx?.homeBannerBackground_dom) {
    return;
  }

  if (theme.home_banner.style === "fixed" && location.pathname === config.root) {
    const scrollY = window.scrollY || window.pageYOffset;
    const blurValue = scrollY >= ctx.triggerViewHeight ? 15 : 0;

    try {
      requestAnimationFrame(() => {
        ctx.homeBannerBackground_dom.style.filter = `blur(${blurValue}px)`;
        ctx.homeBannerBackground_dom.style.webkitFilter = `blur(${blurValue}px)`;
      });
    } catch (error) {
      console.error("Error updating banner blur:", error);
    }
  }
};
