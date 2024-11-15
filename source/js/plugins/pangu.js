function initPanguJS() {
  // Add space between Chinese and English
  pangu.spacingElementByClassName("article-content-container");
  pangu.spacingElementByClassName("page-template-container");

  pangu.autoSpacingPage();
}

document.addEventListener("DOMContentLoaded", initPanguJS);

try {
  swup.hooks.on("page:view", initPanguJS);
} catch (e) {}
