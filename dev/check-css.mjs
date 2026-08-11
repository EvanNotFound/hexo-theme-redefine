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

const readSource = (relativePath) =>
  fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");

const collectSource = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSource(entryPath);
    return /\.(?:css|ejs|js)$/.test(entry.name) ? [fs.readFileSync(entryPath, "utf8")] : [];
  });

const themeSource = readSource("styles/theme.css");
const variableSource = readSource("styles/base/variables.css");
const styleHelperSource = readSource("scripts/helpers/style-helpers.js");
const geometrySource = [
  themeSource,
  ...collectSource(path.join(THEME_ROOT, "styles", "base")),
  ...collectSource(path.join(THEME_ROOT, "styles", "components")),
  ...collectSource(path.join(THEME_ROOT, "layout")),
  ...collectSource(path.join(THEME_ROOT, "scripts")),
].join("\n");

[
  [/--(?:margin-)?spacing-unit|\b(?:margin-)?spacing-unit\b/, "custom spacing unit"],
  [/--radius(?:-[\w-]+)?\s*:|var\(--radius(?:-[\w-]+)?\)/, "authored radius variable"],
].forEach(([pattern, label]) => {
  if (pattern.test(geometrySource)) {
    throw new Error(`Theme source still contains a ${label}`);
  }
});

[
  "--background:",
  "--foreground:",
  "--card:",
  "--popover:",
  "--secondary:",
  "--muted:",
  "--accent:",
  "--destructive:",
  "--border:",
  "--input:",
  "--ring:",
  "--chart-1:",
].forEach((value) => {
  if (themeSource.includes(value)) {
    throw new Error(`Unused competing visual variable remains: ${value}`);
  }
});

if (themeSource.includes("var(--color-gray-200, currentcolor)")) {
  throw new Error("Tailwind v3 global border fallback is still present");
}

const lightShadow = "0 6px 24px rgb(0 0 0 / 6%)";
if (!variableSource.includes(`--rd-shadow: ${lightShadow}`)
  || !styleHelperSource.includes(`"--rd-shadow": "${lightShadow}"`)) {
  throw new Error("Light shadow fallback and runtime values are not aligned");
}

[
  "_config.yml",
  "dev/site/_config.redefine.yml",
].forEach((relativePath) => {
  if (!readSource(relativePath).includes("image_border_radius: 12px")) {
    throw new Error(`${relativePath} is missing the 12px article image radius default`);
  }
});

const routeShellSources = [
  "layout/pages/post/index.ejs",
  "layout/components/page-panel.ejs",
  "layout/pages/archive.ejs",
];
const routeShellClasses = [
  "rounded-2xl",
  "border-rd-border",
  "shadow-rd",
  "max-[640px]:rounded-none",
  "max-[640px]:border-0",
  "max-[640px]:shadow-none",
];

routeShellSources.forEach((relativePath) => {
  const source = readSource(relativePath);
  routeShellClasses.forEach((className) => {
    if (!source.includes(className)) {
      throw new Error(`${relativePath} is missing route-shell geometry ${className}`);
    }
  });
});

[
  "layout/pages/home/index.ejs",
  "layout/pages/home/sidebar.ejs",
  "scripts/helpers/recommendation-helpers.js",
].forEach((relativePath) => {
  if (/\bshadow-(?:rd|\[)/.test(readSource(relativePath))) {
    throw new Error(`${relativePath} gives a repeated or sidebar surface elevation`);
  }
});

const articleSource = readSource("layout/pages/post/index.ejs");
if (!articleSource.includes("top-[calc(var(--current-navbar-height)+2.5rem)]")) {
  throw new Error("Article TOC is not aligned to the current navbar height");
}
if (!articleSource.includes("overflow-hidden rounded-t-[calc(1rem-1px)]")) {
  throw new Error("Article cover parent is missing derived clipping geometry");
}
if (/object-cover[^\n]*rounded-t-|rounded-t-[^\n]*object-cover/.test(articleSource)) {
  throw new Error("Article cover duplicates its parent corner geometry");
}

[
  ["layout/pages/post/copyright.ejs", "rounded-xl"],
  ["scripts/modules/callout.js", "rounded-xl border border-rd-border"],
  ["scripts/modules/button.js", "rounded-xl border border-rd-border"],
  ["scripts/modules/folding.js", "rounded-xl border border-rd-border"],
  ["scripts/modules/tabs.js", "rounded-xl border border-rd-border"],
].forEach(([relativePath, geometry]) => {
  if (!readSource(relativePath).includes(geometry)) {
    throw new Error(`${relativePath} is missing nested article geometry ${geometry}`);
  }
});

if (/\bshadow-(?:rd|\[)/.test(readSource("scripts/modules/tabs.js"))) {
  throw new Error("Nested tab surfaces still have elevation");
}
if (!readSource("scripts/modules/folding.js").includes("rounded-[calc(0.75rem-1px)]")
  || !readSource("scripts/modules/tabs.js").includes("rounded-b-[calc(0.75rem-1px)]")) {
  throw new Error("Connected writing modules are missing derived inner corners");
}

[
  "layout/pages/home/index.ejs",
  "layout/pages/home/sidebar.ejs",
  "layout/components/side-tools.ejs",
  "layout/pages/post/tools.ejs",
  "scripts/helpers/recommendation-helpers.js",
].forEach((relativePath) => {
  if (!readSource(relativePath).includes("rounded-2xl")) {
    throw new Error(`${relativePath} is missing standalone component geometry`);
  }
});

const pageHelperSource = readSource("scripts/helpers/page-helpers.js");
if (!pageHelperSource.includes('register("resolvePageKind"')
  || /getPageData|getPagePartialPath|getPageTitle|getAllPageData|\.type|\.title/.test(pageHelperSource)) {
  throw new Error("Page kind helper is not limited to explicit template resolution");
}

const pageRouterSource = readSource("layout/pages/router.ejs");
[
  "pages/home/index",
  "pages/post/index",
  "pages/archive",
  "pages/categories",
  "pages/tags",
  "pages/friends",
  "pages/essays",
  "pages/masonry",
  "pages/bookmarks",
  "pages/not-found",
  "components/page-panel",
].forEach((partialPath) => {
  if (!pageRouterSource.includes(`partial('${partialPath}'`)) {
    throw new Error(`Page router is missing literal partial ${partialPath}`);
  }
});

[
  "layout/tags.ejs",
  "layout/pages/page-template.ejs",
  "layout/pages/home/home-background.ejs",
  "layout/pages/home/sidebar-profile.ejs",
  "layout/components/comments/comment.ejs",
  "layout/utils/paginator.ejs",
].forEach((relativePath) => {
  if (fs.existsSync(path.join(THEME_ROOT, relativePath))) {
    throw new Error(`Superseded EJS partial remains: ${relativePath}`);
  }
});

run(PNPM, ["run", "build:css"], THEME_ROOT);
cleanSite();
linkTheme();
run(HEXO, ["generate"], SITE_ROOT);

const indexHtml = fs.readFileSync(path.join(SITE_ROOT, "public", "index.html"), "utf8");
const customPageChecks = [
  ["masonry", 'id="masonry-container"'],
  ["bookmarks", "data-bookmark-nav"],
  ["essays", "data-essay-date"],
  ["categories", 'class="categories"'],
  ["tags", "group/tags"],
];

customPageChecks.forEach(([route, marker]) => {
  const output = fs.readFileSync(path.join(SITE_ROOT, "public", route, "index.html"), "utf8");
  if (!output.includes(marker)) {
    throw new Error(`Custom page ${route} is missing ${marker}`);
  }
});

[
  ["legacy-template", "links"],
  ["shuoshuo", "shuoshuo"],
  ["unknown-template", "Unknown Template"],
].forEach(([route, title]) => {
  const output = fs.readFileSync(path.join(SITE_ROOT, "public", route, "index.html"), "utf8");
  if (!output.includes(`<h1>${title}</h1>`)) {
    throw new Error(`${route} did not fall back to ordinary page rendering`);
  }
});

const showcaseHtml = fs.readFileSync(path.join(SITE_ROOT, "public", "showcase", "index.html"), "utf8");
if (showcaseHtml.split('id="comments"').length !== 2) {
  throw new Error("Framed custom page did not render exactly one comments region");
}

const archiveSource = readSource("layout/pages/archive.ejs");
if (!archiveSource.includes("posts: page.posts") || archiveSource.includes("posts: site.posts")) {
  throw new Error("Archive page does not use its route-scoped posts");
}
const requiredOutput = [
  'id="redefine-theme-vars"',
  'data-heading-spacing=',
  'data-image-alignment=',
  '--content-max-width:',
  '--article-font-size:',
  '--article-line-height:',
  '--image-radius:12px',
  '--rd-shadow:0 6px 24px rgb(0 0 0 / 6%)',
  '--font-title:var(--font-display)',
  '--font-home:var(--font-display)',
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
  '--font-display:"Chillax-Variable", sans-serif',
  '.font-display{font-family:var(--font-display)}',
  '.font-title{font-family:var(--font-title)}',
  '.font-home{font-family:var(--font-home)}',
  '--radius-sm:.25rem',
  '--radius-md:.375rem',
  '--radius-lg:.5rem',
  '--radius-2xl:1rem',
  '--radius-3xl:1.5rem',
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
  'top:calc(var(--current-navbar-height) + 2.5rem)',
  '.markdown-body .table-scroll{border-radius:12px;',
  '.code-container{background:var(--highlight-background);border:1px solid var(--rd-border);border-radius:12px;',
].forEach((value) => {
  if (!themeCss.includes(value)) {
    throw new Error(`Generated theme stylesheet is missing ${value}`);
  }
});

const codeControlRule = themeCss.match(/\.code-container :is\(\.copy-button,\.fold-button\)\{([^}]*)\}/)?.[1];
if (!codeControlRule?.includes("background:0 0")) {
  throw new Error("Code block controls do not have a transparent background");
}

if (themeCss.includes('color:var(--home-title-size)')) {
  throw new Error("Home banner title size was compiled as a color");
}

if (themeCss.includes('--highlight-gutter-bg-color')) {
  throw new Error("Code gutter uses a separate background color");
}

[
  '--spacing-unit',
  '--margin-spacing-unit',
  'border-color:var(--color-gray-200,currentcolor)',
].forEach((value) => {
  if (themeCss.includes(value)) {
    throw new Error(`Generated theme stylesheet still contains ${value}`);
  }
});

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
const standardPageHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "music", "index.html"),
  "utf8",
);
const archiveHtml = fs.readFileSync(
  path.join(SITE_ROOT, "public", "archives", "index.html"),
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

const routeShellTags = [
  ["article", articleTag],
  ["standard page", standardPageHtml.match(/<div class="[^\"]*\bbox-border\b[^\"]*\bmb-8\b[^\"]*">/)?.[0]],
  ["archive", archiveHtml.match(/<div class="[^\"]*\bbox-border\b[^\"]*\bmb-8\b[^\"]*">/)?.[0]],
];

routeShellTags.forEach(([label, tag]) => {
  if (!tag) throw new Error(`Generated ${label} route shell is missing`);
  routeShellClasses.forEach((className) => {
    if (!tag.includes(className)) {
      throw new Error(`Generated ${label} route shell is missing ${className}`);
    }
  });
});

if (!articleLayoutTag || articleLayoutTag.includes("gap-0")) {
  throw new Error("Article layout contains a utility-layer TOC gap state");
}
if (!articleTag || articleTag.includes("w-full")) {
  throw new Error("Article contains a utility-layer TOC width state");
}
if (!tocTag || tocTag.includes("w-0") || tocTag.includes("opacity-0")) {
  throw new Error("TOC contains utility-layer closed-state styles");
}
if (!tocTag.includes("top-[calc(var(--current-navbar-height)+2.5rem)]")) {
  throw new Error("Generated TOC is not aligned to the current navbar height");
}

const articleHeaderTag = writingHtml.match(/<header class="[^\"]*">/)?.[0];
const articleCoverTag = writingHtml.match(/<img[^>]*class="[^\"]*\bobject-cover\b[^\"]*"[^>]*>/)?.[0];
if (!articleHeaderTag?.includes("overflow-hidden") || !articleHeaderTag.includes("rounded-t-[calc(1rem-1px)]")) {
  throw new Error("Generated article cover parent is missing clipping geometry");
}
if (!articleCoverTag || articleCoverTag.includes("rounded-t-")) {
  throw new Error("Generated article cover duplicates or is missing parent clipping geometry");
}

const tabsTag = nestedWritingHtml.match(/<div id="tab-[^>]*data-tabs[^>]*>/)?.[0];
const foldingTag = nestedWritingHtml.match(/<details class="[^\"]*\bfolding\b[^\"]*"[^>]*>/)?.[0];
const writingButtonTag = writingHtml.match(/<(?:a|span) data-writing-button[^>]*>/)?.[0];
[
  ["tabs", tabsTag],
  ["folding", foldingTag],
].forEach(([label, tag]) => {
  if (!tag?.includes("rounded-xl") || !tag.includes("border-rd-border")) {
    throw new Error(`Generated ${label} module is missing subordinate geometry`);
  }
  if (/\bshadow-(?:rd|\[)/.test(tag)) {
    throw new Error(`Generated ${label} module has nested elevation`);
  }
});

if (!writingButtonTag?.includes("rounded-xl") || !writingButtonTag.includes("border-rd-border")) {
  throw new Error("Generated writing button is missing nested article geometry");
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
