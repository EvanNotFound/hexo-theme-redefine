let didInit = false;

const prepareCategories = () => {
  const items = document.querySelectorAll(".categories .category-list-item");
  items.forEach((item, index) => {
    const childList = Array.from(item.children).find((child) =>
      child.classList.contains("category-list-child"),
    );
    if (!childList || item.querySelector(":scope > [data-category-toggle]")) {
      return;
    }

    const link = item.querySelector(":scope > .category-list-link");
    const childId = `category-children-${index}`;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.categoryToggle = "";
    button.setAttribute("aria-controls", childId);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", `Toggle ${link?.textContent?.trim() || "category"}`);
    button.className =
      "ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-rd-gray-900 hover:text-primary aria-expanded:rotate-90";
    button.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';

    childList.id = childId;
    childList.hidden = true;
    item.insertBefore(button, childList);
  });
};

const handleCategoryClick = (event) => {
  const toggle = event.target.closest("[data-category-toggle]");
  if (!toggle) {
    return;
  }

  const childList = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!childList) {
    return;
  }

  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  childList.hidden = isOpen;
};

export default function initCategoryList({ signal } = {}) {
  prepareCategories();
  if (didInit) {
    return;
  }

  didInit = true;
  signal
    ? document.addEventListener("click", handleCategoryClick, { signal })
    : document.addEventListener("click", handleCategoryClick);
}
