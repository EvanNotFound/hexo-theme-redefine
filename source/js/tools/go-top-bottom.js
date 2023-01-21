REDEFINE.initBackToTop = () => {

  REDEFINE.utils = {

    ...REDEFINE.utils,

    backToBottomButton_dom: document.querySelector('.tool-scroll-to-bottom'),

    backtotop() {
      document.body.scrollIntoView({
        behavior: "smooth"
      });
    },

    backToBottom() {
      document.querySelector(".page-main-content-bottom").scrollIntoView({
        behavior: "smooth"
      });
    },

    initBackToTop() {
      this.backToTopButton_dom.addEventListener('click', () => {
        this.backtotop();
      });
    },

    initBackToBottom() {
      this.backToBottomButton_dom.addEventListener('click', () => {
        this.backToBottom();
      });
    },
  }

  REDEFINE.utils.initBackToTop();
  REDEFINE.utils.initBackToBottom();

}
