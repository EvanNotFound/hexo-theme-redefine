/* global KEEP */

function initLeftSideToggle() {
  KEEP.utils.leftSideToggle = {

    toggleBar: document.querySelector('.page-aside-toggle'),
    pageTopDom: document.querySelector('.page-main-content-top'),
    containerDom: document.querySelector('.page-container'),
    leftAsideDom: document.querySelector('.page-aside'),
    toggleBarIcon: document.querySelector('.page-aside-toggle i'),

    isOpenPageAside: false,

    initToggleBarButton() {
      this.toggleBar && this.toggleBar.addEventListener('click', () => {
        this.isOpenPageAside = !this.isOpenPageAside;
        KEEP.styleStatus.isOpenPageAside = this.isOpenPageAside;
        KEEP.setStyleStatus();
        this.changePageLayoutWhenOpenToggle(this.isOpenPageAside);
      });
    },

    changePageLayoutWhenOpenToggle(isOpen) {
      this.toggleBarIcon && (this.toggleBarIcon.className = isOpen ? 'fas fa-outdent' : 'fas fa-indent');
      const pageAsideWidth = KEEP.theme_config.style.left_side_width || '260px';
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
  KEEP.utils.leftSideToggle.initToggleBarButton();
}

if (KEEP.theme_config.pjax.enable === true && KEEP.utils) {
  initLeftSideToggle();
} else {
  window.addEventListener('DOMContentLoaded', initLeftSideToggle);
}
