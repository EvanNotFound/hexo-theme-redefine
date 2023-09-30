import { main } from "../main.js";

// Exported object to replace Global
export const ModeToggle = {
  modeToggleButton_dom: null,
  iconDom: null,
  mermaidLightTheme: null,
  mermaidDarkTheme: null,

  enableLightMode() {
    document.body.classList.remove("dark-mode");
    document.documentElement.classList.remove("dark");
    document.body.classList.add("light-mode");
    document.documentElement.classList.add("light");
    this.iconDom.className = "fa-regular fa-moon";
    main.styleStatus.isDark = false;
    main.setStyleStatus();
    this.mermaidLightInit();
    this.setGiscusTheme();
  },

  enableDarkMode() {
    document.body.classList.remove("light-mode");
    document.documentElement.classList.remove("light");
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark");
    this.iconDom.className = "fa-regular fa-brightness";
    main.styleStatus.isDark = true;
    main.setStyleStatus();
    this.mermaidDarkInit();
    this.setGiscusTheme();
  },

  mermaidLightInit() {
    if (window.mermaid) {
      mermaid.initialize({
        theme: this.mermaidLightTheme,
      });
    }
  },

  mermaidDarkInit() {
    if (window.mermaid) {
      mermaid.initialize({
        theme: this.mermaidDarkTheme,
      });
    }
  },

  async setGiscusTheme(theme) {
    if (document.querySelector("#giscus-container")) {
      let giscusFrame = document.querySelector("iframe.giscus-frame");
      while (!giscusFrame) {
        await new Promise((r) => setTimeout(r, 1000));
        giscusFrame = document.querySelector("iframe.giscus-frame");
      }
      while (giscusFrame.classList.contains("giscus-frame--loading"))
        await new Promise((r) => setTimeout(r, 1000));
      theme ??= main.styleStatus.isDark ? "dark" : "light";
      giscusFrame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: theme,
            },
          },
        },
        "https://giscus.app",
      );
    }
  },

  isDarkPrefersColorScheme() {
    return (
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
    );
  },

  initModeStatus() {
    const styleStatus = main.getStyleStatus();

    if (styleStatus) {
      styleStatus.isDark ? this.enableDarkMode() : this.enableLightMode();
    } else {
      this.isDarkPrefersColorScheme().matches
        ? this.enableDarkMode()
        : this.enableLightMode();
    }
  },

  initModeToggleButton() {
    this.modeToggleButton_dom.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      isDark ? this.enableLightMode() : this.enableDarkMode();
    });
  },

  initModeAutoTrigger() {
    const isDarkMode = this.isDarkPrefersColorScheme();
    isDarkMode.addEventListener("change", (e) => {
      e.matches ? this.enableDarkMode() : this.enableLightMode();
    });
  },

  init() {
    this.modeToggleButton_dom = document.querySelector(
      ".tool-dark-light-toggle",
    );
    this.iconDom = document.querySelector(".tool-dark-light-toggle i");
    this.mermaidLightTheme =
      typeof Global.theme_config.mermaid !== "undefined" &&
      typeof Global.theme_config.mermaid.style !== "undefined" &&
      typeof Global.theme_config.mermaid.style.light !== "undefined"
        ? Global.theme_config.mermaid.style.light
        : "default";
    this.mermaidDarkTheme =
      typeof Global.theme_config.mermaid !== "undefined" &&
      typeof Global.theme_config.mermaid.style !== "undefined" &&
      typeof Global.theme_config.mermaid.style.dark !== "undefined"
        ? Global.theme_config.mermaid.style.dark
        : "dark";

    this.initModeStatus();
    this.initModeToggleButton();
    this.initModeAutoTrigger();
  },
};

// Exported function
export default function initModeToggle() {
  ModeToggle.init();
}
