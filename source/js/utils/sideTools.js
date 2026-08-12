let toolsMenuOpen = theme.global.side_tools?.auto_expand === true;

export const updateAutoHideTools = () => {
  const y = window.scrollY;
  const height = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const tools = document.getElementById("side-tools");
  const aplayer = document.getElementById("aplayer");

  if (!tools) {
    return;
  }

  const isScrollable = height > windowHeight;
  const shouldHide =
    (y <= 100 && location.pathname === config.root) ||
    (isScrollable && y + windowHeight >= height - 20);
  const state = shouldHide ? "hidden" : "visible";

  if (tools.dataset.state !== state) {
    tools.dataset.state = state;
    tools.setAttribute("aria-hidden", String(shouldHide));
    tools.inert = shouldHide;
  }
  if (aplayer && aplayer.classList.contains("hide") !== shouldHide) {
    aplayer.classList.toggle("hide", shouldHide);
  }
};

export const initToolsListToggle = (ctx, signal) => {
  if (!ctx?.toolsList || !ctx?.toggleButton) {
    return;
  }

  const applyState = () => {
    ctx.toolsList.dataset.state = toolsMenuOpen ? "open" : "closed";
    ctx.toolsList.setAttribute("aria-hidden", String(!toolsMenuOpen));
    ctx.toggleButton.setAttribute("aria-expanded", String(toolsMenuOpen));
  };

  applyState();

  const handler = () => {
    toolsMenuOpen = !toolsMenuOpen;
    applyState();
  };

  if (signal) {
    ctx.toggleButton.addEventListener("click", handler, { signal });
  } else {
    ctx.toggleButton.addEventListener("click", handler);
  }
};

export const initGoComment = (signal) => {
  const goCommentDom = document.getElementById("comment-jump");
  if (!goCommentDom) {
    return;
  }

  const handler = () => {
    const target = document.getElementById("comments");
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
