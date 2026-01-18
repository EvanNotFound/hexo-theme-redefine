"use strict";

hexo.extend.generator.register("masonry-data", function () {
  const data = hexo.locals.get ? hexo.locals.get("data") : null;
  const masonryData =
    data?.masonry || data?.gallery || data?.photos || hexo.theme.config.masonry;

  const items = Array.isArray(masonryData)
    ? masonryData
        .map((entry) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const image = entry.image || entry.url || entry.src;
          if (!image) {
            return null;
          }

          return {
            image,
            title: entry.title || "",
            description: entry.description || "",
          };
        })
        .filter(Boolean)
    : [];

  return {
    path: "masonry/data.json",
    data: JSON.stringify(items),
  };
});
