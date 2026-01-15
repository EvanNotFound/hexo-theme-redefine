let navItems = [];
let sections = [];
let didInitScroll = false;

const throttle = (func, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) {
      return;
    }
    func(...args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
};

const setActiveNavItem = () => {
  if (!navItems.length || !sections.length) {
    return;
  }

  const fromTop = window.scrollY + 100;
  let currentSection = null;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      currentSection = section;
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("bg-second-background-color");
    if (
      currentSection &&
      item.getAttribute("data-category") === currentSection.getAttribute("id")
    ) {
      item.classList.add("bg-second-background-color");
    }
  });
};

const registerScrollHandler = (signal) => {
  if (didInitScroll || !signal) {
    return;
  }

  didInitScroll = true;
  window.addEventListener("scroll", throttle(setActiveNavItem, 100), { signal });
};

export default function initBookmarkNav({ signal } = {}) {
  navItems = Array.from(document.querySelectorAll(".bookmark-nav-item"));
  sections = Array.from(document.querySelectorAll("section[id]"));

  if (!navItems.length || !sections.length) {
    return;
  }

  registerScrollHandler(signal);
  setActiveNavItem();
}
