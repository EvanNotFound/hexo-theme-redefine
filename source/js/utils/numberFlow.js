export const setNumberValue = (element, value) => {
  if (!element) {
    return;
  }

  const nextValue = Math.trunc(value);
  if (element.dataset.numberValue === String(nextValue)) {
    return;
  }

  element.dataset.numberValue = String(nextValue);
  if (typeof element.update === "function") {
    element.update(nextValue);
  } else {
    element.textContent = String(nextValue);
  }
};
