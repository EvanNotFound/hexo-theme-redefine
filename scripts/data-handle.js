const { applyConfigDeprecations } = require("./deprecations/config");

const isPlainObject = (value) => {
  return value && typeof value === "object" && !Array.isArray(value);
};

const normalizeIconValue = (icon) => {
  if (!icon || typeof icon !== "string") {
    return icon;
  }

  if (icon === "email") {
    return "fa-solid fa-at";
  }

  if (icon.startsWith("/") || icon.startsWith("http")) {
    return icon;
  }

  if (icon.includes("fa-")) {
    return icon;
  }

  return `fa-brands fa-${icon}`;
};

const normalizeSocialLinksList = (list) => {
  if (Array.isArray(list)) {
    let changed = false;
    const normalizedItems = list.map((item) => {
      if (!isPlainObject(item)) {
        return item;
      }

      const normalized = { ...item };
      const iconSource = normalized.icon || normalized.name;
      const normalizedIcon = normalizeIconValue(iconSource);

      if (normalizedIcon && normalizedIcon !== normalized.icon) {
        normalized.icon = normalizedIcon;
        changed = true;
      }

      return normalized;
    });

    return { value: normalizedItems, changed };
  }

  return { value: list, changed: false };
};

const normalizeSocialLinksConfig = (data) => {
  if (!data) {
    return;
  }

  const homeBanner = data.home_banner;
  if (!homeBanner || !homeBanner.social_links) {
    return;
  }

  const socialLinks = homeBanner.social_links;

  if (socialLinks.links) {
    const normalized = normalizeSocialLinksList(socialLinks.links);
    if (normalized.changed) {
      socialLinks.links = normalized.value;
    }
  }

  if (socialLinks.qrs) {
    const normalized = normalizeSocialLinksList(socialLinks.qrs);
    if (normalized.changed) {
      socialLinks.qrs = normalized.value;
    }
  }
};

hexo.on('generateBefore', function () {

  if (hexo.locals.get) {
    const data = hexo.locals.get('data');

    if (data) {
      // theme config file handle
      if (data._config) {
        hexo.theme.config = data._config;

      } else if (data.redefine) {
        hexo.theme.config = data.redefine;

      } else if (data._redefine) {
        hexo.theme.config = data._redefine;
      }

      // friends link file handle
      if (data.links || data.link) {
        hexo.theme.config.links = (data.links || data.link);
      }

      if (data.essays || data.essay || data.shuoshuo) {
        hexo.theme.config.essays = (data.essays || data.essay || data.shuoshuo);
      }

      if (data.masonry || data.gallery || data.photos) {
        hexo.theme.config.masonry = (data.masonry || data.gallery || data.photos);
      }

      if (data.bookmarks || data.tools) {
        hexo.theme.config.bookmarks = data.bookmarks || data.tools;
      }

    }
  }

  applyConfigDeprecations({
    hexo,
    themeConfig: hexo.theme.config,
  });
  normalizeSocialLinksConfig(hexo.theme.config);
});
