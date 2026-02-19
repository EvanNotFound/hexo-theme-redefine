let didInit = false;

const handleTabClick = (event) => {
  const button = event.target.closest(".tabs [role='tablist'] button[role='tab'][data-tab]");
  if (!button) return;

  event.stopPropagation();

  const parentTab = button.closest(".tabs");
  if (!parentTab) return;

  const targetId = button.dataset.tab;
  if (!targetId) return;

  const tablist = button.closest("[role='tablist']");
  if (tablist) {
    tablist.querySelectorAll("button[role='tab']").forEach((tab) => {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("data-state", "inactive");
      tab.setAttribute("tabindex", "-1");
    });
  }

  button.setAttribute("aria-selected", "true");
  button.setAttribute("data-state", "active");
  button.setAttribute("tabindex", "0");

  parentTab.querySelectorAll(".tab-content .tab-pane").forEach((pane) => {
    pane.setAttribute("data-state", "inactive");
    pane.hidden = true;
  });

  const targetPane = parentTab.querySelector(`.tab-content #${targetId}`);
  if (!targetPane) return;

  targetPane.setAttribute("data-state", "active");
  targetPane.hidden = false;
};

export default function initTabs({ signal } = {}) {
  if (didInit) return;
  didInit = true;

  if (signal) {
    document.addEventListener("click", handleTabClick, { signal });
  } else {
    document.addEventListener("click", handleTabClick);
  }
}
