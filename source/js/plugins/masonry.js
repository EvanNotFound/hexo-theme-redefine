export function initMasonry() {
  var loadingPlaceholder = document.querySelector(".loading-placeholder");
  var masonryContainer = document.querySelector("#masonry-container");
  if (!loadingPlaceholder || !masonryContainer) return;

  loadingPlaceholder.style.display = "block";
  masonryContainer.style.display = "none";

  //init Masonry without wait since <img> already have its size
  const masonry = new MiniMasonry({
    container: masonryContainer,
    baseWidth: window.innerWidth >= 768 ? 255 : 150,
    gutterX: 10,
    gutterY: 10,
    surroundingGutter: false,
  });
  masonry.layout(); 

  loadingPlaceholder.style.display = "none";
  loadingPlaceholder.style.opacity = 0;
  masonryContainer.style.display = "block";
  masonryContainer.style.opacity = 1;
}

if (data.masonry) {
  try {
    swup.hooks.on("page:view", initMasonry);
  } catch (e) {}

  document.addEventListener("DOMContentLoaded", initMasonry);
}


