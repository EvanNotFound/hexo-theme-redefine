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
    console.log(`      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine`);
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
    REDEFINE.initMenuShrink();
    REDEFINE.initModeToggle();
    REDEFINE.initBackToTop();

    if (REDEFINE.theme_config.local_search.enable === true) {
      REDEFINE.initLocalSearch();
    }

    if (REDEFINE.theme_config.code_block.copy === true) {
      REDEFINE.initCopyCode();
    }

    if (REDEFINE.theme_config.lazyload.enable === true) {
      REDEFINE.initLazyLoad();
    }
  }

  REDEFINE.printThemeInfo();
  REDEFINE.refresh();
});
