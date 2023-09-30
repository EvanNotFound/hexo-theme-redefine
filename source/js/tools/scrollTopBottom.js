const initScrollTopBottom = () => {
  const backToTopButton_dom = document.querySelector(".tool-scroll-to-top");
  const backToBottomButton_dom = document.querySelector(
    ".tool-scroll-to-bottom",
  );

  const backToTop = () => {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  };

  const backToBottom = () => {
    document.querySelector("footer.footer").scrollIntoView({
      behavior: "smooth",
    });
  };

  const initBackToTop = () => {
    backToTopButton_dom.addEventListener("click", backToTop);
  };

  const initBackToBottom = () => {
    backToBottomButton_dom.addEventListener("click", backToBottom);
  };

  initBackToTop();
  initBackToBottom();
};

export default initScrollTopBottom;
