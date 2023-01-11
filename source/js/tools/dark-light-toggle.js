/* global REDEFINE */

REDEFINE.initModeToggle = () => {

  REDEFINE.utils.modeToggle = {

    modeToggleButton_dom: document.querySelector('.tool-dark-light-toggle'),
    iconDom: document.querySelector('.tool-dark-light-toggle i'),

    enableLightMode() {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      this.iconDom.className = 'fas fa-moon';
      REDEFINE.styleStatus.isDark = false;
      REDEFINE.setStyleStatus();
    },

    enableDarkMode() {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      this.iconDom.className = 'fas fa-sun';
      REDEFINE.styleStatus.isDark = true;
      REDEFINE.setStyleStatus();
    },

    isDarkPrefersColorScheme() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    },

    initModeStatus() {
      const styleStatus = REDEFINE.getStyleStatus();

      if (styleStatus) {
        styleStatus.isDark ? this.enableDarkMode() : this.enableLightMode();
      } else {
        this.isDarkPrefersColorScheme().matches ? this.enableDarkMode() : this.enableLightMode();
      }
    },

    initModeToggleButton() {
      this.modeToggleButton_dom.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        isDark ? this.enableLightMode() : this.enableDarkMode();
      });
    },

    initModeAutoTrigger() {
      const isDarkMode = this.isDarkPrefersColorScheme();
      isDarkMode.addEventListener('change', e => {
        e.matches ? this.enableDarkMode() : this.enableLightMode();
      });
    }
  }

  REDEFINE.utils.modeToggle.initModeStatus();
  REDEFINE.utils.modeToggle.initModeToggleButton();
  REDEFINE.utils.modeToggle.initModeAutoTrigger();
};
