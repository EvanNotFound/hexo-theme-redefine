const readyCallbacks = [];
const pageViewCallbacks = [];
const visitStartCallbacks = [];
const beforeReplaceCallbacks = [];

let readyFired = false;
let didInitSwupHooks = false;

const runCallbacks = (callbacks, payload) => {
  callbacks.forEach((callback) => {
    try {
      callback(payload);
    } catch (error) {
      console.error("Lifecycle callback failed:", error);
    }
  });
};

const fireReady = () => {
  if (readyFired) {
    return;
  }

  readyFired = true;
  runCallbacks(readyCallbacks);
  runCallbacks(pageViewCallbacks, { initial: true });
};

const initSwupHooks = (swupInstance) => {
  if (didInitSwupHooks || !swupInstance || !swupInstance.hooks) {
    return;
  }

  didInitSwupHooks = true;
  swupInstance.hooks.on("page:view", (visit) => {
    runCallbacks(pageViewCallbacks, visit);
  });
  swupInstance.hooks.on("visit:start", (visit) => {
    runCallbacks(visitStartCallbacks, visit);
  });
  swupInstance.hooks.before("content:replace", (visit) => {
    runCallbacks(beforeReplaceCallbacks, visit);
  });
};

const handleSwupReady = (event) => {
  const swupInstance = window.swup || event?.detail?.swup;
  initSwupHooks(swupInstance);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fireReady, { once: true });
} else {
  fireReady();
}

if (window.swup && window.swup.hooks) {
  initSwupHooks(window.swup);
} else {
  window.addEventListener("redefine:swup:ready", handleSwupReady, {
    once: true,
  });
}

export const onReady = (callback) => {
  if (typeof callback !== "function") {
    return;
  }

  if (readyFired) {
    callback();
    return;
  }

  readyCallbacks.push(callback);
};

export const onPageView = (callback) => {
  if (typeof callback !== "function") {
    return;
  }

  pageViewCallbacks.push(callback);

  if (readyFired) {
    callback({ initial: true });
  }
};

export const onVisitStart = (callback) => {
  if (typeof callback !== "function") {
    return;
  }

  visitStartCallbacks.push(callback);
};

export const onBeforeContentReplace = (callback) => {
  if (typeof callback !== "function") {
    return;
  }

  beforeReplaceCallbacks.push(callback);
};
