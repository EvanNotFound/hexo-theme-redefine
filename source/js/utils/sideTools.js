import { getStyleStatus, updateStyleStatus } from "../state/styleStatus.js";

export const updateAutoHideTools = () => {
  const y = window.scrollY;
  const height = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const toolList = document.getElementsByClassName("right-side-tools-container");
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
};

export const initToolsListToggle = (ctx, signal) => {
  if (!ctx?.toolsList || !ctx?.toggleButton) {
    return;
  }

  if (theme.global.side_tools && theme.global.side_tools.auto_expand) {
    ctx.toolsList.classList.add("show");
  }

  const handler = () => {
    ctx.toolsList.classList.toggle("show");
  };

  if (signal) {
    ctx.toggleButton.addEventListener("click", handler, { signal });
  } else {
    ctx.toggleButton.addEventListener("click", handler);
  }
};

export const initFontSizeAdjust = (ctx, signal) => {
  const htmlRoot = ctx?.html_root_dom;
  const fontAdjustPlus = ctx?.fontAdjPlus_dom;
  const fontAdjustMinus = ctx?.fontAdMinus_dom;

  if (!htmlRoot || !fontAdjustPlus || !fontAdjustMinus) {
    return;
  }

  const fontSize = document.defaultView.getComputedStyle(document.body).fontSize;
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
};

export const initGoComment = (signal) => {
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
};
