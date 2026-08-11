import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const loadHelpers = (...relativePaths) => {
  const helpers = new Map();
  globalThis.hexo = {
    extend: {
      helper: {
        register(name, helper) {
          helpers.set(name, helper);
        },
      },
    },
  };

  try {
    relativePaths.forEach((relativePath) => {
      const modulePath = path.join(ROOT, relativePath);
      delete require.cache[require.resolve(modulePath)];
      require(modulePath);
    });
  } finally {
    delete globalThis.hexo;
  }

  return helpers;
};

const baseTheme = {
  colors: { primary: "#336699" },
  global: {
    content_max_width: "1080px",
    sidebar_width: "240px",
    fonts: {
      chinese: { enable: false },
      english: { enable: false },
      title: { enable: false },
    },
  },
  articles: {
    style: {
      font_size: "18px",
      line_height: "1.7",
      image_border_radius: "10px",
      image_alignment: "left",
    },
    code_block: { font: { enable: false } },
  },
  home_banner: {
    text_color: { light: "#112233", dark: "#ddeeff" },
    text_style: {},
    custom_font: { enable: false },
  },
  navbar: {
    width: { home: "1280px", pages: "960px" },
    color: { left: "#123456", right: "#654321", transparency: "35" },
  },
};

test("themeStyles emits configured values without fixed CSS tokens", () => {
  const themeStyles = loadHelpers("scripts/helpers/style-helpers.js").get("themeStyles");
  const output = themeStyles.call({ theme: baseTheme });

  assert.match(output, /:root\{[^}]*--primary-color:#336699/);
  assert.match(output, /--rd-primary-text:#fff/);
  assert.match(output, /--content-max-width:1080px/);
  assert.match(output, /--article-font-size:18px/);
  assert.match(output, /--image-radius:10px/);
  assert.match(output, /\.light\{--home-banner-text-color:#112233\}/);
  assert.match(output, /\.dark\{--home-banner-text-color:#ddeeff\}/);

  [
    "--rd-background-100:",
    "--rd-gray-1000:",
    "--rd-gray-alpha-400:",
    "--rd-shadow:",
    "--navbar-height:",
    "--navbar-shrink-height:",
    "--font-default:",
    "--font-article-title:",
    "--nav-color-bg:",
  ].forEach((token) => assert.doesNotMatch(output, new RegExp(token)));
});

test("themeStyles chooses readable text for light primary colors", () => {
  const themeStyles = loadHelpers("scripts/helpers/style-helpers.js").get("themeStyles");
  const theme = structuredClone(baseTheme);
  theme.colors.primary = "#fff";

  const output = themeStyles.call({ theme });

  assert.match(output, /--primary-color:#ffffff/);
  assert.match(output, /--rd-primary-text:#202124/);
});

test("themeStyles emits enabled custom fonts", () => {
  const themeStyles = loadHelpers("scripts/helpers/style-helpers.js").get("themeStyles");
  const theme = structuredClone(baseTheme);
  theme.global.fonts = {
    chinese: { enable: true, family: "Noto Serif SC" },
    english: { enable: true, family: "Inter" },
    title: { enable: true, family: "Sora" },
  };
  theme.articles.code_block.font = { enable: true, family: "JetBrains Mono" };
  theme.home_banner.custom_font = { enable: true, family: "Bricolage Grotesque" };

  const output = themeStyles.call({ theme });

  assert.match(output, /--font-chinese:Noto Serif SC/);
  assert.match(output, /--font-english:Inter/);
  assert.match(output, /--font-title:Sora/);
  assert.match(output, /--code-font:JetBrains Mono/);
  assert.match(output, /--font-home:Bricolage Grotesque, sans-serif/);
});

test("themeStyles rejects unsafe configured values", () => {
  const themeStyles = loadHelpers("scripts/helpers/style-helpers.js").get("themeStyles");
  const theme = structuredClone(baseTheme);
  theme.colors.primary = "red;--rd-shadow:none";
  theme.global.content_max_width = "1000px;display:none";

  const output = themeStyles.call({ theme });

  assert.match(output, /--primary-color:#a31f34/);
  assert.match(output, /--rd-primary-text:#fff/);
  assert.match(output, /--content-max-width:1000px/);
  assert.doesNotMatch(output, /display:none|--rd-shadow:none/);
});

test("resolvePageKind uses built-in routes and explicit templates", () => {
  const resolvePageKind = loadHelpers("scripts/helpers/page-helpers.js").get("resolvePageKind");
  const route = (active) => ({
    is_home: () => active === "home",
    is_post: () => active === "post",
    is_archive: () => active === "archive",
    is_category: () => active === "category",
    is_tag: () => active === "tag",
  });

  ["home", "post", "archive", "category", "tag"].forEach((kind) => {
    assert.equal(resolvePageKind.call(route(kind), {}), kind);
  });

  const ordinaryPage = route("page");
  const templates = {
    categories: "categories",
    tags: "tags",
    links: "friends",
    masonry: "masonry",
    bookmarks: "bookmarks",
    essays: "essays",
  };
  Object.entries(templates).forEach(([template, kind]) => {
    assert.equal(resolvePageKind.call(ordinaryPage, { template }), kind);
  });
  assert.equal(resolvePageKind.call(ordinaryPage, { type: "links", title: "links" }), "page");
  assert.equal(resolvePageKind.call(ordinaryPage, { template: "unknown" }), "page");
});
