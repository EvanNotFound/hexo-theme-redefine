const navbarState = {
  isNavigating: false,
  navbarHeight: 0,
};

let didInit = false;

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

  document.body.classList.remove("navbar-drawer-show");
  return true;
};

const handleDrawerToggle = (event) => {
  const toggleTarget = event.target.closest(
    ".window-mask, .navbar-bar, .navbar-drawer .drawer-navbar-list .drawer-navbar-item, .navbar-drawer .tag-count-item",
  );
  if (!toggleTarget) {
    return false;
  }

  document.body.classList.toggle("navbar-drawer-show");
  return true;
};

const registerGlobalHandlers = (signal) => {
  if (didInit) {
    return;
  }

  didInit = true;
  if (signal) {
    window.addEventListener("scroll", handleScroll, { signal });
    document.addEventListener(
      "click",
      (event) => {
        if (handleSubmenuToggle(event)) {
          return;
        }
        if (handleDrawerClose(event)) {
          return;
        }
        handleDrawerToggle(event);
      },
      { signal },
    );
  } else {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", (event) => {
      if (handleSubmenuToggle(event)) {
        return;
      }
      if (handleDrawerClose(event)) {
        return;
      }
      handleDrawerToggle(event);
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

    navbarState.navbarHeight = this.navbarDom.getBoundingClientRect().height;
    handleScroll();
  },

  setNavigating(isNavigating) {
    navbarState.isNavigating = isNavigating;
    if (isNavigating) {
      document.body.classList.remove("navbar-shrink");
    }
  },
};
