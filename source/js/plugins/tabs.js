let didInit = false;

const handleTabClick = (event) => {
  const link = event.target.closest(".tabs .nav-tabs a");
  if (!link) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const parentTab = link.closest(".tabs");
  if (!parentTab) {
    return;
  }

  parentTab.querySelector(".nav-tabs .active")?.classList.remove("active");
  link.parentElement?.classList.add("active");
  parentTab.querySelector(".tab-content .active")?.classList.remove("active");
  parentTab.querySelector(link.className)?.classList.add("active");
};

export default function initTabs({ signal } = {}) {
  if (didInit) {
    return;
  }

  didInit = true;
  if (signal) {
    document.addEventListener("click", handleTabClick, { signal });
  } else {
    document.addEventListener("click", handleTabClick);
  }
}
