import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanSite } from "./clean.mjs";
import { linkTheme } from "./link-theme.mjs";

const THEME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");
const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const HEXO = path.join(SITE_ROOT, "node_modules", ".bin", process.platform === "win32" ? "hexo.cmd" : "hexo");

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run(PNPM, ["run", "build:css"], THEME_ROOT);
cleanSite();
linkTheme();
run(HEXO, ["generate"], SITE_ROOT);

const indexHtml = fs.readFileSync(path.join(SITE_ROOT, "public", "index.html"), "utf8");
const requiredOutput = [
  'id="redefine-theme-vars"',
  'data-heading-spacing=',
  'data-image-alignment=',
  '--content-max-width:',
  '--article-font-size:',
  '--article-line-height:',
  '--image-radius:',
  '--heading-h1-margin:',
  '.light{',
  '.dark{',
  '/css/build/theme.css',
  'id="navbar"',
  'data-navbar-width="home"',
  'id="navbar-toggle"',
  'id="page-shell"',
  'id="page-header"',
  'id="page-content"',
  'id="main-content"',
  'id="site-footer"',
  'id="side-tools"',
  '/css/build/plugins/code-themes/light/github.css',
  '/css/build/plugins/code-themes/dark/vs2015.css',
  '/css/build/plugins/comments/waline.css',
  '/css/build/plugins/odometer.css',
  'class="page-number current"',
  'data-scroll-arrow class="fas fa-arrow-up !hidden group-hover:!flex"',
  'data-scroll-percent class="flex text-base group-hover:!hidden"',
];

requiredOutput.forEach((value) => {
  if (!indexHtml.includes(value)) {
    throw new Error(`Generated theme CSS output is missing ${value}`);
  }
});

const themeCssPath = path.join(SITE_ROOT, "public", "css", "build", "theme.css");
if (!fs.existsSync(themeCssPath)) {
  throw new Error("Generated theme stylesheet is missing");
}

const themeCss = fs.readFileSync(themeCssPath, "utf8");
[
  'font-size:var(--home-title-size)',
  '[data-navbar-content][data-navbar-width=home]{max-width:var(--navbar-width-home)}',
  '[data-navbar-content][data-navbar-width=pages]{max-width:var(--navbar-width-pages)}',
  '.article-layout{gap:0}.article-layout>.article{width:100%}.toc{width:0',
  '.article-layout[data-toc-state=open]>.toc{width:var(--toc-width);opacity:1',
  '.highlight .gutter pre{color:var(--highlight-gutter-color);text-align:center;background-color:var(--highlight-background)',
  '.highlight .code pre{background-color:var(--highlight-background)',
  '.paginator span.page-number.current{color:var(--background-color);background:var(--primary-color)}',
  '.\\!hidden{display:none!important}',
  '.group-hover\\:\\!flex:is(:where(.group):hover *){display:flex!important}',
].forEach((value) => {
  if (!themeCss.includes(value)) {
    throw new Error(`Generated theme stylesheet is missing ${value}`);
  }
});

if (themeCss.includes('color:var(--home-title-size)')) {
  throw new Error("Home banner title size was compiled as a color");
}

if (themeCss.includes('--highlight-gutter-bg-color')) {
  throw new Error("Code gutter uses a separate background color");
}

if (indexHtml.includes('data-navbar-width="pages"')) {
  throw new Error("Home page loaded the pages navbar width");
}

['id="font-increase"', 'id="font-decrease"'].forEach((value) => {
  if (indexHtml.includes(value)) {
    throw new Error(`Removed font zoom control is still rendered: ${value}`);
  }
});

if (indexHtml.includes('/css/style.css') || fs.existsSync(path.join(SITE_ROOT, "public", "css", "style.css"))) {
  throw new Error("Stylus compatibility stylesheet is still present");
}

if (indexHtml.includes('/css/build/plugins/aplayer.css')) {
  throw new Error("Disabled APlayer stylesheet was loaded");
}

run(
  HEXO,
  ["generate", "--config", "_config.yml,_config.style-features.yml"],
  SITE_ROOT,
);

const featureHtml = fs.readFileSync(path.join(SITE_ROOT, "public", "index.html"), "utf8");
[
  'id="local-search"',
  'id="local-search-input"',
  'id="reading-progress"',
  'role="progressbar"',
  'id="preloader"',
  'data-preloader-letter',
  'data-aplayer-mode="mini"',
  'id="aplayer"',
  '/css/build/plugins/aplayer.css',
].forEach((value) => {
  if (!featureHtml.includes(value)) {
    throw new Error(`Generated feature style output is missing ${value}`);
  }
});

const writingHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "2022", "10", "02", "theme-demo", "index.html"),
  "utf8",
);
const nestedWritingHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "2026", "08", "06", "tab-folding-nesting-test", "index.html"),
  "utf8",
);
const markdownHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "2007", "01", "09", "markdown-test", "index.html"),
  "utf8",
);
const tableHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "2023", "02", "14", "theme-demo-with-banner", "index.html"),
  "utf8",
);

[
  'data-navbar-width="pages"',
  'id="article-toc"',
  'class="nav-item ',
].forEach((value) => {
  if (!writingHtml.includes(value)) {
    throw new Error(`Generated article style output is missing ${value}`);
  }
});

if (writingHtml.includes('data-navbar-width="home"')) {
  throw new Error("Article page loaded the home navbar width");
}

const articleLayoutTag = writingHtml.match(/<div id="article-layout"[^>]*>/)?.[0];
const articleTag = writingHtml.match(/<article class="[^"]*\barticle\b[^"]*">/)?.[0];
const tocTag = writingHtml.match(/<aside id="article-toc"[^>]*>/)?.[0];

if (!articleLayoutTag || articleLayoutTag.includes("gap-0")) {
  throw new Error("Article layout contains a utility-layer TOC gap state");
}
if (!articleTag || articleTag.includes("w-full")) {
  throw new Error("Article contains a utility-layer TOC width state");
}
if (!tocTag || tocTag.includes("w-0") || tocTag.includes("opacity-0")) {
  throw new Error("TOC contains utility-layer closed-state styles");
}

[
  [nestedWritingHtml, 'data-tabs'],
  [nestedWritingHtml, 'role="tabpanel"'],
  [nestedWritingHtml, 'class="folding'],
  [nestedWritingHtml, 'data-variant='],
  [writingHtml, 'data-writing-button'],
  [markdownHtml, 'data-external-link'],
  [tableHtml, 'class="table-scroll"'],
  [writingHtml + markdownHtml, 'data-lazy-state="pending"'],
].forEach(([output, value]) => {
  if (!output.includes(value)) {
    throw new Error(`Generated writing style output is missing ${value}`);
  }
});

run(
  HEXO,
  ["generate", "--config", "_config.yml,_config.style-plugins.yml"],
  SITE_ROOT,
);

const pluginHtml = fs.readFileSync(path.join(SITE_ROOT, "public", "index.html"), "utf8");
[
  '/css/build/plugins/code-themes/light/atom-one-light.css',
  '/css/build/plugins/code-themes/dark/nord.css',
  '/css/build/plugins/comments/twikoo.css',
  '/css/build/plugins/aplayer.css',
  'data-aplayer-mode="fixed"',
].forEach((value) => {
  if (!pluginHtml.includes(value)) {
    throw new Error(`Generated plugin style output is missing ${value}`);
  }
});

[
  '/css/build/plugins/comments/waline.css',
  '/css/build/plugins/odometer.css',
].forEach((value) => {
  if (pluginHtml.includes(value)) {
    throw new Error(`Disabled plugin stylesheet was loaded: ${value}`);
  }
});

console.log("✓ Theme CSS check complete");
