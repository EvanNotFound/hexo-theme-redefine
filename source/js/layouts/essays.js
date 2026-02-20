export default function initEssays() {
  const dateElements = document.querySelectorAll(".essay-date");

  if (!dateElements.length) {
    return;
  }

  dateElements.forEach((element) => {
    const rawDate = element.getAttribute("data-date");
    const locale = config.language || "en";

    const formattedDate = moment(rawDate).locale(locale).calendar();
    element.textContent = formattedDate;
  });
}
