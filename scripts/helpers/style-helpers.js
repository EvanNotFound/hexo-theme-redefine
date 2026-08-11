"use strict";

const safeValue = (value, fallback) => {
  const text = String(value ?? "").trim();
  return text && !/[;{}<>\u0000-\u001f]/.test(text) ? text : fallback;
};

const safeLength = (value, fallback, unitless = false) => {
  const text = String(value ?? "").trim();
  const pattern = unitless
    ? /^-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|%|vh|vw|ch)?$/i
    : /^-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|%|vh|vw|ch)$/i;
  return pattern.test(text) ? text : fallback;
};

const safeColor = (value, fallback) => {
  const text = String(value ?? "").trim();
  const pattern = /^(?:#[\da-f]{3,8}|[a-z]+|(?:rgb|hsl|oklab|oklch|lab|lch|color)\([^;{}<>]+\))$/i;
  return pattern.test(text) ? text : fallback;
};

const scaleLength = (value, factor, fallback) => {
  const match = String(value).match(/^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em|%|vh|vw|ch)$/i);
  return match ? `${Number(match[1]) * factor}${match[2]}` : fallback;
};

const lightenHex = (color, amount) => {
  const value = color.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(value)) return color;
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let saturation = 0;
  let lightness = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    hue = max === r
      ? (g - b) / delta + (g < b ? 6 : 0)
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
    hue /= 6;
  }

  lightness = Math.min(1, lightness + amount * (1 - lightness));
  const hueToRgb = (p, q, input) => {
    let t = input;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channels = saturation === 0
    ? [lightness, lightness, lightness]
    : [hueToRgb(p, q, hue + 1 / 3), hueToRgb(p, q, hue), hueToRgb(p, q, hue - 1 / 3)];
  return `#${channels.map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0")).join("")}`;
};

const withHexAlpha = (color, alpha, fallback) => {
  const hex = String(color).replace("#", "");
  const alphaText = String(alpha ?? "35").padStart(2, "0").slice(-2);
  if (!/^[\da-f]{6}$/i.test(hex) || !/^[\da-f]{2}$/i.test(alphaText)) return fallback;
  const channels = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const opacity = (parseInt(alphaText, 16) / 255 * 100).toFixed(1);
  return `rgb(${channels.join(" ")} / ${opacity}%)`;
};

const headings = (style = {}) => {
  const presets = {
    compact: ["2.4rem", "1.8rem", "1.5rem", "1.25rem", "1.05rem", "0.95rem"],
    default: ["3.2rem", "2.4rem", "1.9rem", "1.6rem", "1.4rem", "1.3rem"],
    spacious: ["4rem", "3rem", "2.4rem", "2rem", "1.75rem", "1.5rem"],
  };
  const values = presets[style.heading_spacing] || presets.default;
  return Object.fromEntries(values.map((fallback, index) => {
    const level = `h${index + 1}`;
    return [`--heading-${level}-margin`, safeLength(style.headings_top_spacing?.[level], fallback)];
  }));
};

const declarations = (values) => Object.entries(values)
  .map(([name, value]) => `${name}:${value}`)
  .join(";");

hexo.extend.helper.register("themeStyles", function () {
  const theme = this.theme || {};
  const articleStyle = theme.articles?.style || {};
  const primary = safeColor(theme.colors?.primary, "#a31f34");
  const selection = lightenHex(primary, 0.1);
  const contentWidth = safeLength(theme.global?.content_max_width, "1000px");
  const light = {
    "--home-banner-text-color": safeColor(theme.home_banner?.text_color?.light, "#fff"),
  };
  const dark = {
    "--home-banner-text-color": safeColor(theme.home_banner?.text_color?.dark, "#d1d1b6"),
  };
  const navLeft = safeColor(theme.navbar?.color?.left, "#f78736");
  const navRight = safeColor(theme.navbar?.color?.right, "#367df7");
  const layout = {
    "--primary-color": primary,
    "--selection-color": selection,
    "--content-max-width": contentWidth,
    "--content-with-toc-max-width": scaleLength(contentWidth, 1.2, "1200px"),
    "--navbar-width-home": safeLength(theme.navbar?.width?.home, "1200px"),
    "--navbar-width-pages": safeLength(theme.navbar?.width?.pages, "1000px"),
    "--toc-width": safeLength(theme.global?.sidebar_width, "210px"),
    "--article-font-size": safeLength(articleStyle.font_size, "16px"),
    "--article-line-height": safeLength(articleStyle.line_height, "1.5", true),
    "--image-radius": safeLength(articleStyle.image_border_radius, "12px"),
    "--image-alignment": ["left", "center"].includes(articleStyle.image_alignment) ? articleStyle.image_alignment : "center",
    ...(theme.global?.fonts?.english?.enable && {
      "--font-english": safeValue(theme.global.fonts.english.family, "Geist Variable"),
    }),
    ...(theme.global?.fonts?.chinese?.enable && {
      "--font-chinese": safeValue(theme.global.fonts.chinese.family, "PingFang SC"),
    }),
    ...(theme.global?.fonts?.title?.enable && {
      "--font-title": safeValue(theme.global.fonts.title.family, "var(--font-display)"),
    }),
    ...(theme.articles?.code_block?.font?.enable && theme.articles.code_block.font.family && {
      "--code-font": safeValue(theme.articles.code_block.font.family, "Geist Mono"),
    }),
    ...(theme.home_banner?.custom_font?.enable && {
      "--font-home": `${safeValue(theme.home_banner.custom_font.family, "var(--font-display)")}, sans-serif`,
    }),
    "--home-title-size": safeLength(theme.home_banner?.text_style?.title_size, "2.8rem"),
    "--home-subtitle-size": safeLength(theme.home_banner?.text_style?.subtitle_size, "1.5rem"),
    "--home-line-height": safeLength(theme.home_banner?.text_style?.line_height, "1.2", true),
    "--nav-color-1": withHexAlpha(navLeft, theme.navbar?.color?.transparency, "rgb(247 135 54 / 20.8%)"),
    "--nav-color-2": withHexAlpha(navRight, theme.navbar?.color?.transparency, "rgb(54 125 247 / 20.8%)"),
    ...headings(articleStyle),
  };
  return `<style id="redefine-theme-vars">:root{${declarations(layout)}}.light{${declarations(light)}}.dark{${declarations(dark)}}</style>`;
});

const attr = (name, value) => `${name}="${String(value).replace(/[&"<>]/g, "")}"`;

hexo.extend.helper.register("themeStyleAttrs", function () {
  const theme = this.theme || {};
  const articleStyle = theme.articles?.style || {};
  const values = {
    "data-code-style": ["mac", "default"].includes(theme.articles?.code_block?.style) ? theme.articles.code_block.style : "default",
    "data-heading-spacing": ["compact", "spacious"].includes(articleStyle.heading_spacing) ? articleStyle.heading_spacing : "default",
    "data-image-alignment": ["left", "center"].includes(articleStyle.image_alignment) ? articleStyle.image_alignment : "center",
    "data-tag-style": safeValue(theme.page_templates?.tags_style, "cloud"),
    "data-aplayer-mode": safeValue(theme.plugins?.aplayer?.type, "default"),
  };
  return Object.entries(values).map(([name, value]) => attr(name, value)).join(" ");
});
