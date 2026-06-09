const keys = new Set();
const inflight = new Map();

const normalizeKey = (key) => String(key).trim().replace(/[^a-zA-Z0-9]/g, "_");

const isPromiseLike = (value) => value && typeof value.then === "function";

export const onceGlobal = (key, callback) => {
  if (typeof callback !== "function") {
    return;
  }

  const normalizedKey = normalizeKey(key);
  if (keys.has(normalizedKey)) {
    return;
  }
  if (inflight.has(normalizedKey)) {
    return inflight.get(normalizedKey);
  }

  try {
    const result = callback();
    if (isPromiseLike(result)) {
      const promise = result
        .then((value) => {
          keys.add(normalizedKey);
          inflight.delete(normalizedKey);
          return value;
        })
        .catch((error) => {
          inflight.delete(normalizedKey);
          throw error;
        });
      inflight.set(normalizedKey, promise);
      return promise;
    }
    keys.add(normalizedKey);
    return result;
  } catch (error) {
    throw error;
  }
};

export const oncePerElement = (element, key, callback) => {
  if (!element?.dataset || typeof callback !== "function") {
    return;
  }

  const dataKey = `redefine${normalizeKey(key)}`;
  if (element.dataset[dataKey]) {
    return;
  }

  try {
    const result = callback(element);
    if (isPromiseLike(result)) {
      return result.then((value) => {
        element.dataset[dataKey] = "true";
        return value;
      });
    }
    element.dataset[dataKey] = "true";
    return result;
  } catch (error) {
    throw error;
  }
};
