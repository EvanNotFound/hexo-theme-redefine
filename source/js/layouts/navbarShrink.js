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
  document.body.dataset.navbarSize = shouldShrink ? "compact" : "full";
};

const handleSubmenuToggle = (event) => {
  const toggle = event.target.closest("[data-navbar-submenu]");
  if (!toggle) {
    return false;
  }

  const target = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!target) {
    return true;
  }

  const submenuItems = target.children;
  const isVisible = !target.hidden;
  toggle.setAttribute("aria-expanded", String(!isVisible));

  if (typeof anime === "undefined") {
    target.hidden = isVisible;
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
        target.hidden = true;
      },
    });
  } else {
    target.hidden = false;
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

const setDrawerState = (isOpen) => {
  const toggle = document.getElementById("navbar-toggle");
  const drawer = document.getElementById("navbar-drawer");
  const mask = document.getElementById("navbar-mask");

  toggle?.setAttribute("aria-expanded", String(isOpen));
  if (drawer) {
    drawer.dataset.state = isOpen ? "open" : "closed";
    drawer.setAttribute("aria-hidden", String(!isOpen));
  }
  if (mask) {
    mask.dataset.state = isOpen ? "open" : "closed";
    mask.setAttribute("aria-hidden", String(!isOpen));
    mask.tabIndex = isOpen ? 0 : -1;
  }
  document.body.dataset.navbarDrawer = isOpen ? "open" : "closed";
};

const handleDrawerToggle = (event) => {
  const toggleTarget = event.target.closest("#navbar-toggle, #navbar-mask");
  if (!toggleTarget) {
    return false;
  }

  const isOpen =
    document.getElementById("navbar-toggle")?.getAttribute("aria-expanded") ===
    "true";
  setDrawerState(!isOpen);
  return true;
};

const handleDrawerClose = (event) => {
  if (!event.target.closest("[data-navbar-close]")) {
    return false;
  }

  setDrawerState(false);
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
    this.navbarDom = document.getElementById("navbar");
    if (!this.navbarDom) {
      return;
    }

    navbarState.navbarHeight = this.navbarDom.getBoundingClientRect().height;
    setDrawerState(false);
    handleScroll();
  },

  setNavigating(isNavigating) {
    navbarState.isNavigating = isNavigating;
    if (isNavigating) {
      document.body.dataset.navbarSize = "full";
      setDrawerState(false);
    }
  },
};
