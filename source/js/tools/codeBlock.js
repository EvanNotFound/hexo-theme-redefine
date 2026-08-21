const wrapElement = (element, wrapper) => {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

// --- Wrap Toggle feature start ---

let didInstallWrapToggleHooks = false;

const debounce = (fn, waitMs) => {
  let timer = null;
  return (...args) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, waitMs);
  };
};

const isOverflowing = (container) => {
  const figure = container?.querySelector("figure.highlight");
  if (!figure) return false;
  return figure.scrollWidth > figure.clientWidth + 1;
};

const clearGutterInlineStyles = (container) => {
  const lines = container.querySelectorAll(
    "figure.highlight .gutter pre .line[data-gutter-synced=\"1\"]",
  );
  lines.forEach((line) => {
    line.style.minHeight = "";
    delete line.dataset.gutterSynced;
  });
};

const syncGutterHeights = (container) => {
  const enabled = container.classList.contains("code-wrap-enabled");
  if (!enabled) {
    clearGutterInlineStyles(container);
    return;
  }

  const codeLines = container.querySelectorAll(
    "figure.highlight .code pre .line",
  );
  const gutterLines = container.querySelectorAll(
    "figure.highlight .gutter pre .line",
  );

  if (codeLines.length > 0 && gutterLines.length === codeLines.length) {
    // Use the visual row height: delta between consecutive line tops.
    // offsetHeight on inline `.line` spans returns the font intrinsic height,
    // not the line-box height, so it underestimates wrapped rows.
    const codeTops = Array.from(codeLines).map((l) =>
      l.getBoundingClientRect().top,
    );
    let fallbackHeight = null;
    for (let i = 0; i < codeLines.length; i += 1) {
      let height;
      if (i < codeLines.length - 1) {
        height = codeTops[i + 1] - codeTops[i];
      } else {
        // Last line: reuse the last computed row height (line-height × font-size).
        if (fallbackHeight === null) {
          const cs = window.getComputedStyle(codeLines[0]);
          const lh = parseFloat(cs.lineHeight);
          fallbackHeight = Number.isFinite(lh) && lh > 0 ? lh : codeLines[i].offsetHeight;
        }
        height = fallbackHeight;
      }
      gutterLines[i].style.minHeight = `${height}px`;
      gutterLines[i].dataset.gutterSynced = "1";
    }
  }
};

const ensureWrapToggleFor = (container) => {
  // If already processed AND button already injected, nothing to do.
  // If already processed but no button injected (wasn't overflowing), we still
  // allow re-evaluation on resize so we inspect the injected flag here.
  const hasButton = container.querySelector(".wrap-toggle-button") !== null;
  if (container.dataset.wrapToggleReady === "1" && hasButton) {
    // Still re-sync wrap heights if enabled (e.g. after resize)
    if (container.classList.contains("code-wrap-enabled")) {
      syncGutterHeights(container);
    }
    return;
  }
  if (container.dataset.wrapToggleReady === "1" && !hasButton) {
    // Re-evaluate overflow on follow-up calls (resize / fonts load).
    if (!isOverflowing(container)) {
      return;
    }
    // Fall-through to inject button.
  }

  if (!isOverflowing(container)) {
    container.dataset.wrapToggleReady = "1";
    return;
  }

  container.insertAdjacentHTML(
    "beforeend",
    '<div class="wrap-toggle-button" role="button" tabindex="0"><i class="fa-solid fa-angles-right"></i></div>',
  );
  container.dataset.wrapButtonInjected = "1";

  const button = container.querySelector(".wrap-toggle-button");
  const icon = button?.querySelector("i");

  const trigger = () => {
    if (!button || !icon) return;
    container.classList.toggle("code-wrap-enabled");
    if (container.classList.contains("code-wrap-enabled")) {
      icon.className = "fa-solid fa-angles-down";
    } else {
      icon.className = "fa-solid fa-angles-right";
    }
    syncGutterHeights(container);
    try {
      window.dispatchEvent(new Event("resize"));
    } catch (_) {
      // Ignore dispatch errors on older browsers.
    }
  };

  if (button) {
    button.addEventListener("click", trigger);
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " " || event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        trigger();
      }
    });
  }

  container.dataset.wrapToggleReady = "1";
  // Sync once in case the block was previously toggled via state restoration.
  if (container.classList.contains("code-wrap-enabled")) {
    syncGutterHeights(container);
  }
};

const scanAllWrapToggles = () => {
  const containers = document.querySelectorAll(".highlight-container");
  containers.forEach((container) => {
    ensureWrapToggleFor(container);
  });
};

const debouncedScanWrapToggles = debounce(scanAllWrapToggles, 200);

const installWrapToggleHooks = () => {
  if (didInstallWrapToggleHooks) {
    return;
  }
  didInstallWrapToggleHooks = true;

  window.addEventListener("resize", debouncedScanWrapToggles);

  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        setTimeout(scanAllWrapToggles, 0);
      })
      .catch(() => {
        // No-op: fonts promise rejection shouldn't break anything.
      });
  }
};

// --- Wrap Toggle feature end ---

const initCopyCode = () => {
  const wrapToggleEnabled =
    (typeof window !== "undefined" &&
      window.theme &&
      window.theme.articles &&
      window.theme.articles.code_block &&
      window.theme.articles.code_block.wrap_toggle === true) ||
    false;

  if (wrapToggleEnabled) {
    installWrapToggleHooks();
  }

  document.querySelectorAll("figure.highlight").forEach((element) => {
    if (element.dataset.codeBlockReady || element.parentElement?.classList.contains("highlight-container")) {
      // If already wrapped but wrap toggle wasn't processed yet, try to do so now
      // (can happen on pages where script execution order varies).
      const container = element.parentElement;
      if (
        wrapToggleEnabled &&
        container &&
        container.classList.contains("highlight-container")
      ) {
        ensureWrapToggleFor(container);
      }
      return;
    }

    element.dataset.codeBlockReady = "true";

    const container = document.createElement("div");
    container.classList.add("highlight-container");
    wrapElement(element, container);

    container.insertAdjacentHTML(
      "beforeend",
      '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>',
    );
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>',
    );

    const copyButton = container.querySelector(".copy-button");
    const foldButton = container.querySelector(".fold-button");

    copyButton.addEventListener("click", () => {
      const codeLines = [...container.querySelectorAll(".code .line")];
      const code = codeLines.map((line) => line.innerText).join("\n");

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code);
      }

      copyButton.querySelector("i").className = "fa-regular fa-check";

      setTimeout(() => {
        copyButton.querySelector("i").className = "fa-regular fa-copy";
      }, 1000);
    });

    foldButton.addEventListener("click", () => {
      container.classList.toggle("folded");
      foldButton.querySelector("i").className = container.classList.contains(
        "folded",
      )
        ? "fa-solid fa-chevron-up"
        : "fa-solid fa-chevron-down";
    });

    if (wrapToggleEnabled) {
      ensureWrapToggleFor(container);
    }
  });
};

export default initCopyCode;
