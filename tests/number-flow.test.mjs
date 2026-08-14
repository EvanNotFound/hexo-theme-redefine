import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

const readSource = (relativePath) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf8");

const loadNumberFlowBridge = async () => {
  const source = readSource("source/js/utils/numberFlow.js");
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
};

test("number flow bridge renders plain values and suppresses duplicates", async () => {
  const { setNumberValue } = await loadNumberFlowBridge();
  const element = { dataset: {}, textContent: "" };

  setNumberValue(element, 42.9);
  assert.equal(element.dataset.numberValue, "42");
  assert.equal(element.textContent, "42");

  let updates = 0;
  element.update = () => updates++;
  setNumberValue(element, 42);
  assert.equal(updates, 0);

  setNumberValue(element, 43);
  assert.equal(updates, 1);
  assert.equal(element.dataset.numberValue, "43");
});

test("numeric motion is lazy and shared by footer and scroll values", () => {
  const main = readSource("source/js/main.js");
  const plugin = readSource("source/js/plugins/numberFlow.js");
  const runtime = readSource("source/js/tools/runtime.js");
  const scroll = readSource("source/js/utils/scroll.js");

  assert.match(main, /theme\.footer\?\.runtime\s*\|\|[\s\S]*scroll_progress\?\.percentage/);
  assert.match(main, /import\("\.\/plugins\/numberFlow\.js"\)/);
  assert.match(plugin, /import "number-flow"/);
  assert.match(runtime, /setNumberValue\(runtimeSeconds, seconds\)/);
  assert.match(scroll, /setNumberValue\(percentDom, percent\)/);
  assert.doesNotMatch(main, /odometer/i);
});

test("development JavaScript is bundled locally without import maps", () => {
  const dev = readSource("dev/dev.mjs");
  const builder = readSource("dev/build-js.mjs");
  const scripts = readSource("layout/components/scripts.ejs");
  const config = readSource("dev/site/_config.dev.yml");

  assert.match(dev, /buildDevelopmentJavaScript\(\{ watch: true \}\)/);
  assert.match(builder, /minify: false/);
  assert.match(builder, /chunkNames: "chunks\/\[name\]"/);
  assert.match(scripts, /build\/dev\/main\.js/);
  assert.doesNotMatch(config, /importmap|esm\.sh/);
});
