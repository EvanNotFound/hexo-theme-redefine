const wrapElement = (element, wrapper) => {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

const initCopyCode = () => {
  document.querySelectorAll("figure.highlight").forEach((element) => {
    if (element.dataset.codeBlockReady || element.parentElement?.classList.contains("highlight-container")) {
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
      const icon = copyButton.querySelector("i");
      const restoreIcon = () => {
        if (icon) {
          icon.className = "fa-regular fa-copy";
        }
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            if (icon) {
              icon.className = "fa-regular fa-check";
            }
            setTimeout(restoreIcon, 1000);
          })
          .catch((error) => {
            restoreIcon();
            console.warn("Failed to copy code:", error);
          });
      } else {
        restoreIcon();
        console.warn("Clipboard API is not available.");
      }
    });

    foldButton.addEventListener("click", () => {
      container.classList.toggle("folded");
      foldButton.querySelector("i").className = container.classList.contains(
        "folded",
      )
        ? "fa-solid fa-chevron-up"
        : "fa-solid fa-chevron-down";
    });
  });
};

export default initCopyCode;
