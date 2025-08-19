export function initMasonry() {
  var loadingPlaceholder = document.querySelector(".loading-placeholder");
  var masonryContainer = document.querySelector("#masonry-container");
  if (!loadingPlaceholder || !masonryContainer) return;

  loadingPlaceholder.style.display = "none";
  loadingPlaceholder.style.opacity = 0;
  masonryContainer.style.display = "block";

  //init Masonry without 'wait' since <img> already have its size
  var masonry = new MiniMasonry({
    baseWidth: window.innerWidth >= 768 ? 255 : 150,
    container: masonryContainer,
    gutterX: 10,
    gutterY: 10,
    surroundingGutter: false,
  });
  masonry.layout();

  masonryContainer.style.opacity = 1;
}


if (data.masonry) {
  try {
    swup.hooks.on("page:view", ()=>{
      initMasonry();
    });
  } catch (e) {
    console.log("❌ Masonry swup init failed: " + e);
  }

  document.addEventListener("DOMContentLoaded", initMasonry);
}


