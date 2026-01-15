let didInit = false;

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const backToBottom = () => {
  const docHeight = document.body.scrollHeight;
  window.scrollTo({
    top: docHeight,
    behavior: "smooth",
  });
};

const handleClick = (event) => {
  const topButton = event.target.closest(".tool-scroll-to-top");
  if (topButton) {
    backToTop();
    return;
  }

  const bottomButton = event.target.closest(".tool-scroll-to-bottom");
  if (bottomButton) {
    backToBottom();
  }
};

const initScrollTopBottom = ({ signal } = {}) => {
  if (didInit) {
    return;
  }

  didInit = true;
  if (signal) {
    document.addEventListener("click", handleClick, { signal });
  } else {
    document.addEventListener("click", handleClick);
  }
};

export default initScrollTopBottom;
