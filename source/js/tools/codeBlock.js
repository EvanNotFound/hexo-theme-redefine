const wrapElement = (element, wrapper) => {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

const initCopyCode = () => {
  document.querySelectorAll(".code-container, figure.highlight").forEach((element) => {
    if (element.dataset.codeBlockReady) {
      return;
    }

    const container = element.classList.contains("code-container")
      ? element
      : document.createElement("div");

    if (container !== element) {
      container.classList.add("code-container");
      wrapElement(element, container);
    }

    container.dataset.codeBlockReady = "true";

    if (!container.querySelector(".copy-button")) {
      container.insertAdjacentHTML(
        "beforeend",
        '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>',
      );
    }
    if (!container.querySelector(".fold-button")) {
      container.insertAdjacentHTML(
        "beforeend",
        '<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>',
      );
    }

    const copyButton = container.querySelector(".copy-button");
    const foldButton = container.querySelector(".fold-button");

    copyButton.addEventListener("click", () => {
      const codeLines = [...container.querySelectorAll(".code .line")];
      const code = codeLines.length
        ? codeLines.map((line) => line.innerText).join("\n")
        : (container.querySelector("pre code")?.innerText || "");
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
