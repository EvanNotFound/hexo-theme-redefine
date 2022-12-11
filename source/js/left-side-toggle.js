/* global REDEFINE */

function initLeftSideToggle() {
  REDEFINE.utils.leftSideToggle = {

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
      //this.articleContentContainerDom.style.width = isOpen ? '$content-max-width * 1.2 - $toc-container-width !important' : '$content-max-width - $toc-container-width !important';
      //this.pageTopDom.style.paddingLeft = isOpen ? pageAsideWidth :'0';
      //this.rightAsideDom.style.right = isOpen ? '5%' : `-${pageAsideWidth}`;
    },

    pageAsideHandleOfTOC(isOpen) {
      this.toggleBar.style.display = 'flex';
      this.isOpenPageAside = isOpen;
      this.changePageLayoutWhenOpenToggle(isOpen);
    }
  }
  REDEFINE.utils.leftSideToggle.initToggleBarButton();
}

if (REDEFINE.theme_config.pjax.enable === true && REDEFINE.utils) {
  initLeftSideToggle();
} else {
  window.addEventListener('DOMContentLoaded', initLeftSideToggle);
}
