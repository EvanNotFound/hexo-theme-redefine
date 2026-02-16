"use strict";

const { isPlainObject, hasValue } = require("../utils");

const ID = "home_banner.social_links.object_map";
const MESSAGE =
  "Config deprecation: `home_banner.social_links.links` and `home_banner.social_links.qrs` " +
  "object-map format is deprecated; use array items instead. " +
  "Object-map ordering is unstable due to Hexo config merge behavior and will be removed in the next major release.";

const toArray = (map, type) => {
  const items = [];

  Object.keys(map).forEach((key) => {
    const value = map[key];
    if (!hasValue(value)) {
      return;
    }

    if (type === "links") {
      if (key === "email") {
        items.push({ icon: "email", url: value });
      } else if (key.includes("fa-") || key.startsWith("/") || key.startsWith("http")) {
        items.push({ icon: key, url: value });
      } else {
        items.push({ icon: key, url: value });
      }
    } else if (type === "qrs") {
      if (key.includes("fa-") || key.startsWith("/") || key.startsWith("http")) {
        items.push({ icon: key, qr: value });
      } else {
        items.push({ icon: key, qr: value });
      }
    }
  });

  return items;
};

const detect = (themeConfig) => {
  const socialLinks = themeConfig?.home_banner?.social_links;
  return (
    isPlainObject(socialLinks?.links) || isPlainObject(socialLinks?.qrs)
  );
};

const apply = (themeConfig) => {
  const socialLinks = themeConfig?.home_banner?.social_links;
  if (!socialLinks) {
    return { changed: false };
  }

  let changed = false;

  if (isPlainObject(socialLinks.links)) {
    socialLinks.links = toArray(socialLinks.links, "links");
    changed = true;
  }

  if (isPlainObject(socialLinks.qrs)) {
    socialLinks.qrs = toArray(socialLinks.qrs, "qrs");
    changed = true;
  }

  return { changed };
};

module.exports = {
  id: ID,
  message: MESSAGE,
  detect,
  apply,
};
