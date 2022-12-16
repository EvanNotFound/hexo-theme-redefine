/* global REDEFINE */

function initTocToggle() {
  REDEFINE.utils.TocToggle = {

    toggleBar: document.querySelector('.page-aside-toggle'),
    postPageContainerDom: document.querySelector('.post-page-container'),
    toggleBarIcon: document.querySelector('.page-aside-toggle i'),
    articleContentContainerDom: document.querySelector('.article-content-container'),
    mainContentDom: document.querySelector('.main-content'),

    isOpenPageAside: false,

    initToggleBarButton() {
      this.toggleBar && this.toggleBar.addEventListener('click', () => {
        this.isOpenPageAside = !this.isOpenPageAside;
        REDEFINE.styleStatus.isOpenPageAside = this.isOpenPageAside;
        REDEFINE.setStyleStatus();
        this.changePageLayoutWhenOpenToggle(this.isOpenPageAside);
      });
    },

    changePageLayoutWhenOpenToggle(isOpen) {
      this.toggleBarIcon && (this.toggleBarIcon.className = isOpen ? 'fas fa-indent' : 'fas fa-outdent');
      this.postPageContainerDom.className = isOpen ? 'post-page-container show-toc' : 'post-page-container';
      this.mainContentDom.className = isOpen ? 'main-content has-toc' : 'main-content';
    },

    pageAsideHandleOfTOC(isOpen) {
      this.toggleBar.style.display = 'flex';
      this.isOpenPageAside = isOpen;
      this.changePageLayoutWhenOpenToggle(isOpen);
    }
  }
  REDEFINE.utils.TocToggle.initToggleBarButton();
}

if (REDEFINE.theme_config.pjax.enable === true && REDEFINE.utils) {
  initTocToggle();
} else {
  window.addEventListener('DOMContentLoaded', initTocToggle);
}
