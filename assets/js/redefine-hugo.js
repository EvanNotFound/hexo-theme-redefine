(function () {
  const themeKey = "REDEFINE-THEME-STATUS";
  const root = document.documentElement;

  function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    try {
      const raw = localStorage.getItem(themeKey);
      const stored = raw ? JSON.parse(raw) : {};
      const next = stored && typeof stored === "object" ? { ...stored, isDark } : { isDark };
      localStorage.setItem(themeKey, JSON.stringify(next));
    } catch (e) {}
  }

  function updatePercent() {
    const percent = document.querySelector(".right-bottom-tools .percent");
    if (!percent) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    percent.textContent = `${value}%`;
  }

  document.addEventListener("click", (event) => {
    const drawerToggle = event.target.closest(".navbar-bar");
    if (drawerToggle) document.body.classList.toggle("navbar-drawer-show");

    if (event.target.closest(".window-mask")) document.body.classList.remove("navbar-drawer-show");

    const toolsToggle = event.target.closest(".toggle-tools-list");
    if (toolsToggle) document.body.classList.toggle("side-tools-open");

    if (event.target.closest(".tool-dark-light-toggle")) setTheme(!root.classList.contains("dark"));
    if (event.target.closest(".tool-scroll-to-top")) window.scrollTo({ top: 0, behavior: "smooth" });
    if (event.target.closest(".tool-scroll-to-bottom")) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    if (event.target.closest(".scroll-down")) {
      const target = document.querySelector(".main-content-container");
      window.scrollTo({ top: target ? target.offsetTop : window.innerHeight, behavior: "smooth" });
    }

    const img = event.target.closest(".markdown-body img");
    if (img) {
      const viewer = document.querySelector(".image-viewer-container");
      if (viewer) {
        viewer.hidden = false;
        viewer.querySelector("img").src = img.currentSrc || img.src;
      }
    }
    if (event.target.closest(".image-viewer-close") || event.target.classList.contains("image-viewer-container")) {
      const viewer = document.querySelector(".image-viewer-container");
      if (viewer) viewer.hidden = true;
    }
  });

  function tickRuntime() {
    const runtime = document.querySelector(".runtime[data-start]");
    if (!runtime) return;
    const start = new Date(runtime.dataset.start).getTime();
    if (Number.isNaN(start)) return;
    const seconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value);
    };
    set("runtime_days", days);
    set("runtime_hours", hours);
    set("runtime_minutes", minutes);
    set("runtime_seconds", secs);
  }

  window.addEventListener("scroll", updatePercent, { passive: true });
  updatePercent();
  tickRuntime();
  setInterval(tickRuntime, 1000);
})();
