let didInit = false;

const activateTab = (tab) => {
  const tabs = tab.closest("[data-tabs]");
  const tablist = tab.closest('[role="tablist"]');
  const panelId = tab.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!tabs || !tablist || !panel || !tabs.contains(panel)) return;

  tablist.querySelectorAll('[role="tab"]').forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  tabs.querySelectorAll('[role="tabpanel"]').forEach((item) => {
    item.hidden = item !== panel;
  });
};

const getTabs = (tab) =>
  Array.from(tab.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]') || []);

const handleTabClick = (event) => {
  const tab = event.target.closest('[data-tabs] [role="tab"][aria-controls]');
  if (!tab) return;
  event.stopPropagation();
  activateTab(tab);
};

const handleTabKeydown = (event) => {
  const tab = event.target.closest('[data-tabs] [role="tab"][aria-controls]');
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }

  const tabs = getTabs(tab);
  const index = tabs.indexOf(tab);
  if (index === -1) return;

  event.preventDefault();
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? tabs.length - 1
      : event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
  tabs[nextIndex].focus();
  activateTab(tabs[nextIndex]);
};

export default function initTabs({ signal } = {}) {
  if (didInit) return;
  didInit = true;
  if (signal) {
    document.addEventListener("click", handleTabClick, { signal });
    document.addEventListener("keydown", handleTabKeydown, { signal });
  } else {
    document.addEventListener("click", handleTabClick);
    document.addEventListener("keydown", handleTabKeydown);
  }
}
