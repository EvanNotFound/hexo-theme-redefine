export default function initEssays() {
  if (typeof window.moment === "undefined" || typeof window.config === "undefined") {
    return;
  }

  const dateElements = document.querySelectorAll(".essay-date");

  if (!dateElements.length) {
    return;
  }

  dateElements.forEach((element) => {
    const rawDate = element.getAttribute("data-date");
    const locale = window.config.language || "en";

    const formattedDate = window.moment(rawDate).locale(locale).calendar();
    element.textContent = formattedDate;
  });
}
