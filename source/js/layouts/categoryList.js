const handleCategoryToggle = (event) => {
  const button = event.target.closest("[data-category-toggle]");
  if (!button) {
    return;
  }

  const childList = document.getElementById(button.getAttribute("aria-controls"));
  if (!childList) {
    return;
  }

  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  childList.hidden = isOpen;
};

export default function initCategoryList({ signal } = {}) {
  signal
    ? document.addEventListener("click", handleCategoryToggle, { signal })
    : document.addEventListener("click", handleCategoryToggle);
}
