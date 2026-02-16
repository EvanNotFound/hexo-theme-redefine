/* main function */
import initBookmarkNav from "./layouts/bookmarkNav.js";
import initCategoryList from "./layouts/categoryList.js";
import initEssays from "./layouts/essays.js";
import initHomeBanner from "./layouts/homeBanner.js";
import initLazyLoad from "./layouts/lazyload.js";
import { initTOC } from "./layouts/toc.js";
import { navbarShrink } from "./layouts/navbarShrink.js";
import initMasonry from "./plugins/masonry.js";
import initMermaid from "./plugins/mermaid.js";
import initPangu from "./plugins/pangu.js";
import initTabs from "./plugins/tabs.js";
import initTyped from "./plugins/typed.js";
import initCopyCode from "./tools/codeBlock.js";
import initExpirationDate from "./tools/expirationDate.js";
import initModeToggle from "./tools/lightDarkSwitch.js";
import {
  initLocalSearchGlobals,
  initLocalSearchPage,
} from "./tools/localSearch.js";
import initFooterRuntime from "./tools/runtime.js";
import initScrollTopBottom from "./tools/scrollTopBottom.js";
import initImageViewer from "./tools/imageViewer.js";
import { initTocToggle } from "./tools/tocToggle.js";
import { initUtilsGlobals, initUtilsPage } from "./utils.js";
import {
  onBeforeContentReplace,
  onPageView,
  onReady,
  onVisitStart,
} from "./app/lifecycle.js";
import { abortPageScope, createPageScope, getAppSignal } from "./app/pageScope.js";
import {
  getStyleStatus,
  setStyleStatus,
  styleStatus,
} from "./state/styleStatus.js";

const safeRun = (label, callback) => {
  try {
    callback();
  } catch (error) {
    console.error(`[redefine] ${label} failed:`, error);
  }
};

const pageRefreshEvent = "redefine:page:refresh";
let globalsInitialized = false;
let didInitRefreshEvent = false;

const initGlobalsOnce = () => {
  if (globalsInitialized) {
    return;
  }

  globalsInitialized = true;
  const appSignal = getAppSignal();

  safeRun("utils:globals", () => {
    initUtilsGlobals({ signal: appSignal });
  });
  safeRun("navbar:globals", () => {
    navbarShrink.initGlobals({ signal: appSignal });
  });
  safeRun("tocToggle:globals", () => {
    initTocToggle({ signal: appSignal });
  });
  safeRun("scrollTopBottom:globals", () => {
    initScrollTopBottom({ signal: appSignal });
  });
  safeRun("tabs:globals", () => {
    initTabs({ signal: appSignal });
  });
  safeRun("categoryList:globals", () => {
    initCategoryList({ signal: appSignal });
  });
  safeRun("localSearch:globals", () => {
    initLocalSearchGlobals({ signal: appSignal });
  });

  if (!didInitRefreshEvent) {
    didInitRefreshEvent = true;
    window.addEventListener(pageRefreshEvent, () => {
      initPage();
    });
  }
};

const initPage = () => {
  const pageSignal = createPageScope();
  const appSignal = getAppSignal();

  safeRun("utils:page", () => {
    initUtilsPage({ signal: pageSignal });
  });
  safeRun("homeBanner", () => {
    initHomeBanner({ signal: pageSignal });
  });
  safeRun("expirationDate", () => {
    initExpirationDate();
  });
  safeRun("modeToggle", () => {
    initModeToggle({ signal: pageSignal, appSignal });
  });
  safeRun("imageViewer", () => {
    initImageViewer({ signal: pageSignal, appSignal });
  });

  navbarShrink.setNavigating(false);
  navbarShrink.refresh();

  safeRun("footerRuntime", () => {
    if (theme.footer?.runtime) {
      initFooterRuntime();
    }
  });

  safeRun("toc", () => {
    if (theme.articles?.toc?.enable) {
      initTOC({ signal: appSignal });
    }
  });

  safeRun("tabs", () => {
    if (theme.articles?.toc?.enable) {
      initTabs({ signal: appSignal });
    }
  });

  safeRun("essays", () => {
    if (typeof moment !== "undefined") {
      initEssays();
    }
  });

  safeRun("pangu", () => {
    if (theme.articles?.pangu_js) {
      initPangu();
    }
  });

  safeRun("mermaid", () => {
    if (theme.plugins?.mermaid?.enable) {
      initMermaid();
    }
  });

  safeRun("masonry", () => {
    initMasonry({ signal: pageSignal });
  });

  safeRun("typed", () => {
    const subtitleConfig = theme.home_banner?.subtitle || {};
    const subtitleText = subtitleConfig.text;
    const subtitleEntries = Array.isArray(subtitleText)
      ? subtitleText
      : subtitleText
        ? [subtitleText]
        : [];
    const shouldInitTyped =
      subtitleEntries.length !== 0 ||
      (subtitleConfig.hitokoto && subtitleConfig.hitokoto.enable);

    if (shouldInitTyped && location.pathname === config.root) {
      initTyped("subtitle");
    }
  });

  safeRun("localSearch", () => {
    if (theme.navbar?.search?.enable === true) {
      initLocalSearchPage();
    }
  });

  safeRun("copyCode", () => {
    if (theme.articles?.code_block?.copy === true) {
      initCopyCode();
    }
  });

  safeRun("lazyload", () => {
    if (theme.articles?.lazyload === true) {
      initLazyLoad();
    }
  });

  safeRun("bookmarkNav", () => {
    if (theme.bookmarks && theme.bookmarks.length !== 0) {
      initBookmarkNav({ signal: appSignal });
    }
  });

  safeRun("categoryList", () => {
    initCategoryList();
  });
};

const teardownPage = () => {
  abortPageScope();
};

export const main = {
  themeInfo: {
    theme: `Redefine v${theme.version}`,
    author: "EvanNotFound",
    repository: "https://github.com/EvanNotFound/hexo-theme-redefine",
  },
  styleStatus,
  getStyleStatus,
  setStyleStatus,
  printThemeInfo: () => {
    console.log(`
  +======================================================================================+
  |                                                                                      |
  |    _____ _   _ _____ __  __ _____   ____  _____ ____  _____ _____ ___ _   _ _____    |
  |   |_   _| | | | ____|  \\/  | ____| |  _ \\| ____|  _ \\| ____|  ___|_ _| \\ | | ____|   |
  |     | | | |_| |  _| | |\\/| |  _|   | |_) |  _| | | | |  _| | |_   | ||  \\| |  _|     |
  |     | | |  _  | |___| |  | | |___  |  _ <| |___| |_| | |___|  _|  | || |\\  | |___    |
  |     |_| |_| |_|_____|_|  |_|_____| |_| \\_\\_____|____/|_____|_|   |___|_| \\_|_____|   |
  |                                                                                      |
  |                  https://github.com/EvanNotFound/hexo-theme-redefine                 |
  +======================================================================================+
                  `,
    ); // console log message
  },
  refresh: () => {
    initPage();
  },
};

export function initMain() {
  main.printThemeInfo();
}

onReady(() => {
  initMain();
  initGlobalsOnce();
});

onPageView(() => {
  initPage();
});

onBeforeContentReplace(() => {
  teardownPage();
});

onVisitStart(() => {
  navbarShrink.setNavigating(true);
});
