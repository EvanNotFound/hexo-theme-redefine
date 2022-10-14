/* global REDEFINE */

function initLeftSideToggle() {
  REDEFINE.utils.leftSideToggle = {

    toggleBar: document.querySelector('.page-aside-toggle'),
    pageTopDom: document.querySelector('.page-main-content-top'),
    containerDom: document.querySelector('.page-container'),
    leftAsideDom: document.querySelector('.page-aside'),
    toggleBarIcon: document.querySelector('.page-aside-toggle i'),

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
      this.toggleBarIcon && (this.toggleBarIcon.className = isOpen ? 'fas fa-outdent' : 'fas fa-indent');
      const pageAsideWidth = REDEFINE.theme_config.style.left_side_width || '260px';
      this.containerDom.style.paddingLeft = isOpen ? "210px" : '0';
      //this.pageTopDom.style.paddingLeft = isOpen ? pageAsideWidth : '0';
      this.leftAsideDom.style.left = isOpen ? '2.9%' : `-${pageAsideWidth}`;
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
