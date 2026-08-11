"use strict";

const DEFAULT_FONT = "Geist Variable, Noto Sans SC, -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial";
const DEFAULT_CHINESE_FONT = "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Heiti SC, WenQuanYi Micro Hei, sans-serif";

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

const modeColors = ({ dark, primary, selection, bannerText }) => dark ? {
  "--background-color": "#202124",
  "--background-color-transparent": "rgb(32 33 36 / 40%)",
  "--background-color-transparent-15": "rgb(32 33 36 / 15%)",
  "--background-color-transparent-40": "rgb(32 33 36 / 40%)",
  "--background-color-transparent-80": "rgb(32 33 36 / 80%)",
  "--second-background-color": "#242529",
  "--third-background-color": "#292b2f",
  "--third-background-color-transparent": "rgb(32 33 36 / 60%)",
  "--primary-color": primary,
  "--first-text-color": "#d2d2d7",
  "--second-text-color": "#cbcbd1",
  "--third-text-color": "#9595a2",
  "--fourth-text-color": "#36363e",
  "--default-text-color": "#bebec6",
  "--invert-text-color": "#373d3f",
  "--rd-border": "rgb(255 255 255 / 8%)",
  "--selection-color": selection,
  "--scrollbar-color": "#898989",
  "--scrollbar-color-hover": "#a1a1a1",
  "--scroll-bar-bg-color": "#2a2c30",
  "--link-color": "#c5c5cc",
  "--copyright-info-color": "#a30029",
  "--avatar-background-color": "#005cb8",
  "--home-banner-text-color": bannerText,
  "--home-banner-icons-container-border-color": "rgb(197 197 197 / 35%)",
  "--home-banner-icons-container-background-color": "rgb(197 197 197 / 30%)",
  "--rd-shadow": "0 6px 24px rgb(0 0 0 / 25%)",
} : {
  "--background-color": "#fff",
  "--background-color-transparent": "rgb(255 255 255 / 60%)",
  "--background-color-transparent-15": "rgb(255 255 255 / 15%)",
  "--background-color-transparent-40": "rgb(255 255 255 / 40%)",
  "--background-color-transparent-80": "rgb(255 255 255 / 80%)",
  "--second-background-color": "#fafafa",
  "--third-background-color": "#f7f7f7",
  "--third-background-color-transparent": "rgb(241 241 241 / 60%)",
  "--primary-color": primary,
  "--first-text-color": "#323739",
  "--second-text-color": "#343a3c",
  "--third-text-color": "#5c6669",
  "--fourth-text-color": "#eaeced",
  "--default-text-color": "#373d3f",
  "--invert-text-color": "#bebec6",
  "--rd-border": "rgb(0 0 0 / 8%)",
  "--selection-color": selection,
  "--scrollbar-color": "#c1c1c1",
  "--scrollbar-color-hover": "#a1a1a1",
  "--scroll-bar-bg-color": "#fafafa",
  "--link-color": "#323739",
  "--copyright-info-color": "#c03",
  "--avatar-background-color": "#06c",
  "--home-banner-text-color": bannerText,
  "--home-banner-icons-container-border-color": "rgb(255 255 255 / 35%)",
  "--home-banner-icons-container-background-color": "rgb(255 255 255 / 30%)",
  "--rd-shadow": "0 6px 24px rgb(0 0 0 / 6%)",
};

hexo.extend.helper.register("themeStyles", function () {
  const theme = this.theme || {};
  const articleStyle = theme.articles?.style || {};
  const primary = safeColor(theme.colors?.primary, "#a31f34");
  const selection = lightenHex(primary, 0.1);
  const contentWidth = safeLength(theme.global?.content_max_width, "1000px");
  const light = modeColors({
    dark: false,
    primary,
    selection,
    bannerText: safeColor(theme.home_banner?.text_color?.light, "#fff"),
  });
  const dark = modeColors({
    dark: true,
    primary,
    selection,
    bannerText: safeColor(theme.home_banner?.text_color?.dark, "#d1d1b6"),
  });
  const navLeft = safeColor(theme.navbar?.color?.left, "#f78736");
  const navRight = safeColor(theme.navbar?.color?.right, "#367df7");
  const layout = {
    "--navbar-height": "70px",
    "--navbar-shrink-height": "50.4px",
    "--content-max-width": contentWidth,
    "--content-with-toc-max-width": scaleLength(contentWidth, 1.2, "1200px"),
    "--navbar-width-home": safeLength(theme.navbar?.width?.home, "1200px"),
    "--navbar-width-pages": safeLength(theme.navbar?.width?.pages, "1000px"),
    "--toc-width": safeLength(theme.global?.sidebar_width, "210px"),
    "--article-font-size": safeLength(articleStyle.font_size, "16px"),
    "--article-line-height": safeLength(articleStyle.line_height, "1.5", true),
    "--image-radius": safeLength(articleStyle.image_border_radius, "12px"),
    "--image-alignment": ["left", "center"].includes(articleStyle.image_alignment) ? articleStyle.image_alignment : "center",
    "--font-default": DEFAULT_FONT,
    "--font-english": theme.global?.fonts?.english?.enable ? safeValue(theme.global.fonts.english.family, "Geist Variable") : "Geist Variable",
    "--font-chinese": theme.global?.fonts?.chinese?.enable ? safeValue(theme.global.fonts.chinese.family, "PingFang SC") : DEFAULT_CHINESE_FONT,
    "--font-title": theme.global?.fonts?.title?.enable ? safeValue(theme.global.fonts.title.family, "var(--font-display)") : "var(--font-display)",
    "--font-article-title": "var(--font-english), var(--font-chinese), Noto Sans SC, sans-serif",
    "--code-font": theme.articles?.code_block?.font?.enable && theme.articles.code_block.font.family
      ? safeValue(theme.articles.code_block.font.family, "Geist Mono")
      : "Geist Mono",
    "--font-home": theme.home_banner?.custom_font?.enable ? `${safeValue(theme.home_banner.custom_font.family, "var(--font-display)")}, sans-serif` : "var(--font-display)",
    "--home-title-size": safeLength(theme.home_banner?.text_style?.title_size, "2.8rem"),
    "--home-subtitle-size": safeLength(theme.home_banner?.text_style?.subtitle_size, "1.5rem"),
    "--home-line-height": safeLength(theme.home_banner?.text_style?.line_height, "1.2", true),
    "--nav-color-1": withHexAlpha(navLeft, theme.navbar?.color?.transparency, "rgb(247 135 54 / 20.8%)"),
    "--nav-color-2": withHexAlpha(navRight, theme.navbar?.color?.transparency, "rgb(54 125 247 / 20.8%)"),
    ...headings(articleStyle),
  };
  layout["--nav-color-bg"] = "linear-gradient(120deg, var(--nav-color-1), var(--nav-color-2))";
  const defaults = theme.colors?.default_mode === "dark" ? dark : light;

  return `<style id="redefine-theme-vars">:root{${declarations({ ...defaults, ...layout })}}.light{${declarations(light)}}.dark{${declarations(dark)}}</style>`;
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
