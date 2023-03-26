Global.initBackToTop = () => {

  Global.utils = {

    ...Global.utils,

    backToBottomButton_dom: document.querySelector('.tool-scroll-to-bottom'),

    backtotop() {
      document.body.scrollIntoView({
        behavior: "smooth"
      });
    },

    backToBottom() {
      document.querySelector(".main-content-footer").scrollIntoView({
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

  Global.utils.initBackToTop();
  Global.utils.initBackToBottom();

}
