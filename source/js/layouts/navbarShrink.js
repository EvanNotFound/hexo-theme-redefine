const navbarState = {
  isNavigating: false,
  navbarHeight: 0,
};

let didInit = false;
const drawerOpenClass = "navbar-drawer-show";

const setDrawerOpen = (isOpen) => {
  document.body.classList.toggle(drawerOpenClass, isOpen);
  document.querySelectorAll(".navbar-bar").forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });
};

const toggleDrawer = () => {
  setDrawerOpen(!document.body.classList.contains(drawerOpenClass));
};

const closeDrawer = () => {
  setDrawerOpen(false);
};

const bindDrawerTrigger = (element) => {
  if (!element || element.dataset.redefineNavbarDrawerBound) {
    return;
  }

  element.dataset.redefineNavbarDrawerBound = "true";
  element.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleDrawer();
  });
};

const bindDrawerClose = (element) => {
  if (!element || element.dataset.redefineNavbarDrawerCloseBound) {
    return;
  }

  element.dataset.redefineNavbarDrawerCloseBound = "true";
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDrawer();
  });
};

const handleScroll = () => {
  if (navbarState.isNavigating) {
    return;
  }

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const shouldShrink = scrollTop > navbarState.navbarHeight;
  document.body.classList.toggle("navbar-shrink", shouldShrink);
};

const handleSubmenuToggle = (event) => {
  const toggle = event.target.closest("[navbar-data-toggle]");
  if (!toggle) {
    return false;
  }

  const target = document.querySelector(
    `[data-target="${toggle.getAttribute("navbar-data-toggle")}"]`,
  );
  if (!target) {
    return true;
  }

  const submenuItems = target.children;
  const icon = toggle.querySelector(".fa-chevron-right");
  const isVisible = !target.classList.contains("hidden");

  if (icon) {
    icon.classList.toggle("icon-rotated", !isVisible);
  }

  if (typeof anime === "undefined") {
    target.classList.toggle("hidden", isVisible);
    return true;
  }

  if (isVisible) {
    anime({
      targets: submenuItems,
      opacity: 0,
      translateY: -10,
      duration: 300,
      easing: "easeInQuart",
      delay: anime.stagger(80, { start: 20, direction: "reverse" }),
      complete: function () {
        target.classList.add("hidden");
      },
    });
  } else {
    target.classList.remove("hidden");
    anime({
      targets: submenuItems,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 300,
      easing: "easeOutQuart",
      delay: anime.stagger(80, { start: 20 }),
    });
  }

  return true;
};

const handleDrawerClose = (event) => {
  const logoTitleDom = event.target.closest(
    ".navbar-container .navbar-content .logo-title",
  );
  if (!logoTitleDom) {
    return false;
  }

  closeDrawer();
  return true;
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
};

const registerGlobalHandlers = (signal) => {
  if (didInit) {
    return;
  }

  didInit = true;
  if (signal) {
    window.addEventListener("scroll", handleScroll, { signal });
    document.addEventListener("keydown", handleKeydown, { signal });
    document.addEventListener(
      "click",
      (event) => {
        if (handleSubmenuToggle(event)) {
          return;
        }
        if (handleDrawerClose(event)) {
          return;
        }
      },
      { signal },
    );
  } else {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", (event) => {
      if (handleSubmenuToggle(event)) {
        return;
      }
      if (handleDrawerClose(event)) {
        return;
      }
    });
  }
};

export const navbarShrink = {
  navbarDom: null,

  initGlobals({ signal } = {}) {
    if (signal) {
      registerGlobalHandlers(signal);
      return;
    }

    registerGlobalHandlers();
  },

  refresh() {
    this.navbarDom = document.querySelector(".navbar-container");
    if (!this.navbarDom) {
      return;
    }

    bindDrawerTrigger(this.navbarDom.querySelector(".navbar-bar"));
    bindDrawerClose(this.navbarDom.querySelector(".window-mask"));
    this.navbarDom
      .querySelectorAll(
        ".navbar-drawer .drawer-navbar-list .drawer-navbar-item > a, .navbar-drawer .tag-count-item",
      )
      .forEach(bindDrawerClose);

    navbarState.navbarHeight = this.navbarDom.getBoundingClientRect().height;
    handleScroll();
  },

  setNavigating(isNavigating) {
    navbarState.isNavigating = isNavigating;
    if (isNavigating) {
      document.body.classList.remove("navbar-shrink");
      closeDrawer();
    }
  },
};
