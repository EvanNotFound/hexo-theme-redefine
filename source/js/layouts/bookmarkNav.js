let navItems = [];
let sections = [];
let didInitScroll = false;

const throttle = (func, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    func(...args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
};

const setActiveNavItem = () => {
  if (!navItems.length || !sections.length) return;

  const fromTop = window.scrollY + 100;
  let currentSection = sections[0];
  sections.forEach((section) => {
    if (
      fromTop >= section.offsetTop &&
      fromTop < section.offsetTop + section.offsetHeight
    ) {
      currentSection = section;
    }
  });

  navItems.forEach((item) => {
    if (item.getAttribute("aria-controls") === currentSection?.id) {
      item.setAttribute("aria-current", "location");
    } else {
      item.removeAttribute("aria-current");
    }
  });
};

const registerScrollHandler = (signal) => {
  if (didInitScroll || !signal) return;
  didInitScroll = true;
  window.addEventListener("scroll", throttle(setActiveNavItem, 100), { signal });
};

export default function initBookmarkNav({ signal } = {}) {
  navItems = Array.from(document.querySelectorAll("[data-bookmark-nav]"));
  sections = navItems
    .map((item) => document.getElementById(item.getAttribute("aria-controls")))
    .filter(Boolean);

  if (!navItems.length || !sections.length) return;
  registerScrollHandler(signal);
  setActiveNavItem();
}
