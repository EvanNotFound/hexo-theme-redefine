REDEFINE.initMenuShrink = () => {
  REDEFINE.utils.menuShrink = {
    headerDom: document.querySelector('.menu-wrapper'),
    leftAsideDom: document.querySelector('.page-aside'),
    isMenuShrink: false,

    init() {
      this.headerHeight = this.headerDom.getBoundingClientRect().height;
    },

    menuShrink() {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      if (!this.isMenuShrink && scrollTop > this.headerHeight) {
        this.isMenuShrink = true;
        document.body.classList.add('menu-shrink');
        
      } else if (this.isMenuShrink && scrollTop <= this.headerHeight) {
        this.isMenuShrink = false;
        document.body.classList.remove('menu-shrink');
      }

    },

    toggleMenuDrawerShow() {
      const domList = [document.querySelector('.window-mask'), document.querySelector('.menu-bar')];

      if (REDEFINE.theme_config.pjax.enable === true) {
        domList.push(...document.querySelectorAll('.menu-drawer .drawer-menu-list .drawer-menu-item'));
      }

      domList.forEach(v => {
        v.addEventListener('click', () => {
          document.body.classList.toggle('menu-drawer-show');
        });
      });
    }
  }
  REDEFINE.utils.menuShrink.init();
  REDEFINE.utils.menuShrink.menuShrink();
  REDEFINE.utils.menuShrink.toggleMenuDrawerShow();
}
