/* global REDEFINE */

window.addEventListener('DOMContentLoaded', () => {

  REDEFINE.themeInfo = {
    theme: `Redefine v${REDEFINE.theme_config.version}`,
    author: 'EvanNotFound',
    repository: 'https://github.com/EvanNotFound/hexo-theme-redefine'
  }

  REDEFINE.localStorageKey = 'REDEFINE-THEME-STATUS';

  REDEFINE.styleStatus = {
    isExpandPageWidth: false,
    isDark: false,
    fontSizeLevel: 0,
    isOpenPageAside: true
  }

  // print theme base info
  REDEFINE.printThemeInfo = () => {
    console.log(`\n %c ${REDEFINE.themeInfo.theme} %c ${REDEFINE.themeInfo.repository} \n`, `color: #fadfa3; background: #333; padding: 5px 0;`, `background: #fadfa3; padding: 5px 0;`);
  }

  // set styleStatus to localStorage
  REDEFINE.setStyleStatus = () => {
    localStorage.setItem(REDEFINE.localStorageKey, JSON.stringify(REDEFINE.styleStatus));
  }

  // get styleStatus from localStorage
  REDEFINE.getStyleStatus = () => {
    let temp = localStorage.getItem(REDEFINE.localStorageKey);
    if (temp) {
      temp = JSON.parse(temp);
      for (let key in REDEFINE.styleStatus) {
        REDEFINE.styleStatus[key] = temp[key];
      }
      return temp;
    } else {
      return null;
    }
  }

  REDEFINE.refresh = () => {
    REDEFINE.initUtils();
    REDEFINE.initHeaderShrink();
    REDEFINE.initModeToggle();
    REDEFINE.initBack2Top();

    if (REDEFINE.theme_config.local_search.enable === true) {
      REDEFINE.initLocalSearch();
    }

    if (REDEFINE.theme_config.code_copy.enable === true) {
      REDEFINE.initCodeCopy();
    }

    if (REDEFINE.theme_config.lazyload.enable === true) {
      REDEFINE.initLazyLoad();
    }
  }

  REDEFINE.printThemeInfo();
  REDEFINE.refresh();
});
