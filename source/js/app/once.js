const globalRegistry = new Set();

const normalizeKey = (key) =>
  String(key)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_");

export const onceGlobal = (key, callback) => {
  if (typeof callback !== "function") {
    return;
  }

  const normalizedKey = normalizeKey(key);
  if (globalRegistry.has(normalizedKey)) {
    return;
  }

  globalRegistry.add(normalizedKey);
  callback();
};

export const oncePerElement = (element, key, callback) => {
  if (!element || typeof callback !== "function") {
    return;
  }

  const normalizedKey = normalizeKey(key);
  const datasetKey = `redefine${normalizedKey}`;

  if (element.dataset[datasetKey]) {
    return;
  }

  element.dataset[datasetKey] = "true";
  callback(element);
};
