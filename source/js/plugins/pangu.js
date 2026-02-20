export default function initPangu() {
  if (typeof pangu === "undefined") {
    return;
  }

  // Add space between Chinese and English
  pangu.spacingElementByClassName("markdown-body");
  pangu.autoSpacingPage();
}
