export const updateAutoHideTools = () => {
  const y = window.scrollY;
  const height = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const tools = document.getElementById("side-tools");
  const aplayer = document.getElementById("aplayer");

  if (!tools) {
    return;
  }

  const shouldHide =
    (y <= 100 && location.pathname === config.root) ||
    y + windowHeight >= height - 20;
  tools.dataset.state = shouldHide ? "hidden" : "visible";
  aplayer?.classList.toggle("hide", shouldHide);
};

export const initToolsListToggle = (ctx, signal) => {
  if (!ctx?.toolsList || !ctx?.toggleButton) {
    return;
  }

  if (theme.global.side_tools && theme.global.side_tools.auto_expand) {
    ctx.toolsList.dataset.state = "open";
    ctx.toggleButton.setAttribute("aria-expanded", "true");
  }

  const handler = () => {
    const isOpen = ctx.toolsList.dataset.state === "open";
    ctx.toolsList.dataset.state = isOpen ? "closed" : "open";
    ctx.toggleButton.setAttribute("aria-expanded", String(!isOpen));
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
