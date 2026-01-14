import {
  getStyleStatus,
  styleStatus,
  updateStyleStatus,
} from "../state/styleStatus.js";

const mermaidSelector = ".mermaid";
let autoTriggerBound = false;

const ensureOriginalData = () => {
  document.querySelectorAll(mermaidSelector).forEach((element) => {
    if (!element.getAttribute("data-original-code")) {
      element.setAttribute("data-original-code", element.innerHTML);
    }
  });
};

const resetProcessed = () => {
  document.querySelectorAll(mermaidSelector).forEach((element) => {
    const originalCode = element.getAttribute("data-original-code");
    if (originalCode !== null) {
      element.removeAttribute("data-processed");
      element.innerHTML = originalCode;
    }
  });
};

export const ModeToggle = {
  modeToggleButton_dom: null,
  iconDom: null,
  mermaidLightTheme: null,
  mermaidDarkTheme: null,

  mermaidInit(theme) {
    if (!window.mermaid) {
      return;
    }

    ensureOriginalData();
    resetProcessed();
    mermaid.initialize({ theme });
    mermaid.init({ theme }, document.querySelectorAll(mermaidSelector));
  },

  enableLightMode() {
    document.body.classList.remove("dark-mode");
    document.documentElement.classList.remove("dark");
    document.body.classList.add("light-mode");
    document.documentElement.classList.add("light");
    if (this.iconDom) {
      this.iconDom.className = "fa-regular fa-moon";
    }
    updateStyleStatus({ isDark: false });
    this.mermaidInit(this.mermaidLightTheme);
    this.setGiscusTheme();
  },

  enableDarkMode() {
    document.body.classList.remove("light-mode");
    document.documentElement.classList.remove("light");
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark");
    if (this.iconDom) {
      this.iconDom.className = "fa-regular fa-brightness";
    }
    updateStyleStatus({ isDark: true });
    this.mermaidInit(this.mermaidDarkTheme);
    this.setGiscusTheme();
  },

  async setGiscusTheme(theme) {
    if (!document.querySelector("#giscus-container")) {
      return;
    }

    let giscusFrame = document.querySelector("iframe.giscus-frame");
    while (!giscusFrame) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      giscusFrame = document.querySelector("iframe.giscus-frame");
    }

    while (giscusFrame.classList.contains("giscus-frame--loading")) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    theme ??= styleStatus.isDark ? "dark" : "light";
    giscusFrame.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme,
          },
        },
      },
      "https://giscus.app",
    );
  },

  isDarkPrefersColorScheme() {
    return (
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
    );
  },

  initModeStatus() {
    const storedStatus = getStyleStatus();

    if (storedStatus) {
      storedStatus.isDark ? this.enableDarkMode() : this.enableLightMode();
    } else {
      this.isDarkPrefersColorScheme().matches
        ? this.enableDarkMode()
        : this.enableLightMode();
    }
  },

  initModeToggleButton(signal) {
    if (!this.modeToggleButton_dom) {
      return;
    }

    const handler = () => {
      const isDark = document.body.classList.contains("dark-mode");
      isDark ? this.enableLightMode() : this.enableDarkMode();
    };

    if (signal) {
      this.modeToggleButton_dom.addEventListener("click", handler, { signal });
    } else {
      this.modeToggleButton_dom.addEventListener("click", handler);
    }
  },

  initModeAutoTrigger(appSignal) {
    const isDarkMode = this.isDarkPrefersColorScheme();
    if (!isDarkMode || autoTriggerBound) {
      return;
    }

    autoTriggerBound = true;
    const handler = (event) => {
      event.matches ? this.enableDarkMode() : this.enableLightMode();
    };

    if (appSignal) {
      isDarkMode.addEventListener("change", handler, { signal: appSignal });
    } else {
      isDarkMode.addEventListener("change", handler);
    }
  },

  init({ signal, appSignal } = {}) {
    this.modeToggleButton_dom = document.querySelector(
      ".tool-dark-light-toggle",
    );
    this.iconDom = document.querySelector(".tool-dark-light-toggle i");

    const mermaidThemeConfig =
      theme.plugins?.mermaid?.theme || theme.mermaid?.style || {};
    this.mermaidLightTheme = mermaidThemeConfig.light || "default";
    this.mermaidDarkTheme = mermaidThemeConfig.dark || "dark";

    this.initModeStatus();
    this.initModeToggleButton(signal);
    this.initModeAutoTrigger(appSignal);

    ensureOriginalData();
  },
};

export default function initModeToggle(options = {}) {
  ModeToggle.init(options);
}
