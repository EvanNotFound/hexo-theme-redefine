import { styleStatus } from "../state/styleStatus.js";

const mermaidSelector = ".mermaid";

const ensureOriginalCode = () => {
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

const getMermaidTheme = () => {
  const mermaidConfig = theme.plugins?.mermaid || {};
  const themeConfig = mermaidConfig.theme || {};
  const lightTheme = themeConfig.light || "default";
  const darkTheme = themeConfig.dark || "dark";

  return styleStatus.isDark ? darkTheme : lightTheme;
};

export default function initMermaid() {
  if (!theme.plugins?.mermaid?.enable || !window.mermaid) {
    return;
  }

  ensureOriginalCode();
  resetProcessed();

  const mermaidTheme = getMermaidTheme();
  mermaid.initialize({ theme: mermaidTheme });
  mermaid.init({ theme: mermaidTheme }, document.querySelectorAll(mermaidSelector));
}
