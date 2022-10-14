REDEFINE.initHeaderShrink = () => {
  REDEFINE.utils.headerShrink = {
    headerDom: document.querySelector('.header-wrapper'),
    leftAsideDom: document.querySelector('.page-aside'),
    isHeaderShrink: false,

    init() {
      this.headerHeight = this.headerDom.getBoundingClientRect().height;
    },

    headerShrink() {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      if (!this.isHeaderShrink && scrollTop > this.headerHeight) {
        this.isHeaderShrink = true;
        document.body.classList.add('header-shrink');
        this.leftAsideDom.style.top = '80px';
        
      } else if (this.isHeaderShrink && scrollTop <= this.headerHeight) {
        this.isHeaderShrink = false;
        document.body.classList.remove('header-shrink');
        this.leftAsideDom.style.top = '105px';
      }

    },

    toggleHeaderDrawerShow() {
      const domList = [document.querySelector('.window-mask'), document.querySelector('.menu-bar')];

      if (REDEFINE.theme_config.pjax.enable === true) {
        domList.push(...document.querySelectorAll('.header-drawer .drawer-menu-list .drawer-menu-item'));
      }

      domList.forEach(v => {
        v.addEventListener('click', () => {
          document.body.classList.toggle('header-drawer-show');
        });
      });
    }
  }
  REDEFINE.utils.headerShrink.init();
  REDEFINE.utils.headerShrink.headerShrink();
  REDEFINE.utils.headerShrink.toggleHeaderDrawerShow();
}
