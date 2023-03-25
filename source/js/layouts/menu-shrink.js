const menuShrink = {
  menuDom: document.querySelector('.menu-wrapper'),
  leftAsideDom: document.querySelector('.page-aside'),
  isMenuShrink: false,
  menuHeight: 0,

  init() {
    this.menuHeight = this.menuDom.getBoundingClientRect().height;
    this.menuShrink();
    this.toggleMenuDrawerShow();
    window.addEventListener('scroll', () => {
      this.menuShrink();
    });
  },

  menuShrink() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (!this.isMenuShrink && scrollTop > this.menuHeight) {
      this.isMenuShrink = true;
      document.body.classList.add('menu-shrink');
        
    } else if (this.isMenuShrink && scrollTop <= this.menuHeight) {
      this.isMenuShrink = false;
      document.body.classList.remove('menu-shrink');
    }
  },

  toggleMenuDrawerShow() {
    const domList = [document.querySelector('.window-mask'), document.querySelector('.menu-bar')];

    if (document.querySelector('.menu-drawer')) {
      domList.push(...document.querySelectorAll('.menu-drawer .drawer-menu-list .drawer-menu-item'));
    }

    domList.forEach(v => {
      v.addEventListener('click', () => {
        document.body.classList.toggle('menu-drawer-show');
      });
    });
  }
};

menuShrink.init();