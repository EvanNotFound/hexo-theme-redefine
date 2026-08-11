import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildStyles,
  generateSite,
  outputExists,
  readOutput,
  ROOT,
} from "./support/site.mjs";

const includes = (output, values) => {
  values.forEach((value) => assert.ok(output.includes(value), `missing ${value}`));
};

test("theme build and generation matrices", async (t) => {
  buildStyles();

  await t.test("CSS build produces the theme stylesheet", () => {
    const cssPath = path.join(ROOT, "source", "css", "build", "theme.css");
    assert.ok(fs.statSync(cssPath).size > 0);
    const css = fs.readFileSync(cssPath, "utf8");
    includes(css, [
      ".max-w-content{max-width:var(--content-max-width)}",
      "max-width:var(--content-with-toc-max-width)!important",
    ]);
    assert.ok(!css.includes("--archive-timeline-last-child-color"));
  });

  generateSite();

  await t.test("default site renders core structure and configured styles", () => {
    const home = readOutput();
    const post = readOutput("2022/10/02/theme-demo/index.html");
    includes(home, [
      'id="redefine-theme-vars"',
      "--content-max-width:1000px",
      "--image-radius:12px",
      'data-home-banner="fixed"',
      "data-sidebar-panel",
      'id="page-shell"',
      'id="main-content"',
      'id="site-footer"',
    ]);
    includes(post, ['id="article-layout"', 'id="toc-toggle"']);
    [home, post].forEach((output) => {
      assert.equal(output.split('id="swup"').length, 2);
      assert.equal(output.split('id="page-content"').length, 2);
      assert.equal(output.split('id="main-content"').length, 2);
    });
    assert.ok(!home.includes('id="toc-toggle"'));
    assert.ok(!post.includes("data-home-banner"));
    assert.ok(!home.includes("--rd-shadow:"), "fixed shadow leaked into generated styles");
    assert.ok(outputExists("css/build/theme.css"));
  });

  await t.test("archive renders an unframed semantic timeline", () => {
    const archive = readOutput("archives/index.html");
    includes(archive, [
      '<h1 class="text-4xl',
      '<ol class="timeline',
      'class="timeline-post relative"',
      "<time datetime=",
    ]);
    assert.ok(!archive.includes("data-date="));
  });

  await t.test("documented custom templates render their route content", () => {
    const routes = {
      "masonry/index.html": 'id="masonry-container"',
      "bookmarks/index.html": "data-bookmark-nav",
      "essays/index.html": "data-essay-date",
      "categories/index.html": 'class="categories"',
      "tags/index.html": "group/tags",
    };

    Object.entries(routes).forEach(([route, marker]) => {
      assert.ok(readOutput(route).includes(marker), `${route} is missing ${marker}`);
    });
  });

  await t.test("legacy and unknown templates use ordinary page rendering", () => {
    const pages = {
      "legacy-template/index.html": "links",
      "shuoshuo/index.html": "shuoshuo",
      "unknown-template/index.html": "Unknown Template",
    };

    Object.entries(pages).forEach(([route, title]) => {
      assert.ok(readOutput(route).includes(`<h1>${title}</h1>`));
    });
    assert.equal(readOutput("showcase/index.html").split('id="comments"').length, 2);
  });

  await t.test("default configuration loads only enabled style assets", () => {
    const home = readOutput();
    includes(home, [
      "/css/build/plugins/code-themes/light/github.css",
      "/css/build/plugins/code-themes/dark/vs2015.css",
      "/css/build/plugins/comments/waline.css",
      "/css/build/plugins/odometer.css",
    ]);
    assert.ok(!home.includes("/css/build/plugins/aplayer.css"));
  });

  generateSite("_config.style-features.yml");

  await t.test("feature configuration renders enabled controls and writing modules", () => {
    const home = readOutput();
    const writing = readOutput("2022/10/02/theme-demo/index.html");
    const nested = readOutput("2026/08/06/tab-folding-nesting-test/index.html");
    includes(home, ['id="local-search"', 'id="reading-progress"', 'id="preloader"', 'id="aplayer"']);
    includes(writing, ["data-writing-button", 'data-lazy-state="pending"']);
    includes(nested, ["data-tabs", 'role="tabpanel"', 'class="folding']);
  });

  generateSite("_config.style-plugins.yml");

  await t.test("plugin configuration selects only configured style assets", () => {
    const home = readOutput();
    includes(home, [
      "/css/build/plugins/code-themes/light/atom-one-light.css",
      "/css/build/plugins/code-themes/dark/nord.css",
      "/css/build/plugins/comments/twikoo.css",
      "/css/build/plugins/aplayer.css",
      'data-aplayer-mode="fixed"',
    ]);
    assert.ok(!home.includes("/css/build/plugins/comments/waline.css"));
    assert.ok(!home.includes("/css/build/plugins/odometer.css"));
  });
});
