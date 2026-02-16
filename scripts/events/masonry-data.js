"use strict";

hexo.extend.generator.register("masonry-data", function () {
  const data = hexo.locals.get ? hexo.locals.get("data") : null;
  const themeConfig = hexo.theme?.config || {};
  const masonryData =
    data?.masonry ||
    data?.gallery ||
    data?.photos ||
    themeConfig.masonry ||
    themeConfig.gallery ||
    themeConfig.photos;

  const toPositiveInt = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

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

          const width = toPositiveInt(entry.width ?? entry.w);
          const height = toPositiveInt(entry.height ?? entry.h);
          const item = {
            image,
            title: entry.title || "",
            description: entry.description || "",
            exif: entry.exif === true,
          };

          if (width && height) {
            item.width = width;
            item.height = height;
          }

          return item;
        })
        .filter(Boolean)
    : [];

  return {
    path: "masonry/data.json",
    data: JSON.stringify(items),
  };
});
