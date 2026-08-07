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
];

requiredOutput.forEach((value) => {
  if (!indexHtml.includes(value)) {
    throw new Error(`Generated theme CSS output is missing ${value}`);
  }
});

if (!fs.existsSync(path.join(SITE_ROOT, "public", "css", "build", "theme.css"))) {
  throw new Error("Generated theme stylesheet is missing");
}

console.log("✓ Theme CSS check complete");
