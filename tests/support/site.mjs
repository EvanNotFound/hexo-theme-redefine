import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanSite } from "../../dev/clean.mjs";
import { linkTheme } from "../../dev/link-theme.mjs";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SITE_ROOT = path.join(ROOT, "dev", "site");

const HEXO = path.join(
  SITE_ROOT,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "hexo.cmd" : "hexo",
);

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} ${args.join(" ")} failed\n${output}`);
  }
};

export const buildStyles = () =>
  run(process.execPath, [path.join(ROOT, "dev", "build-css.mjs")], ROOT);
export const buildDevelopmentJavaScript = () =>
  run(process.execPath, [path.join(ROOT, "dev", "build-js.mjs")], ROOT);

export const generateSite = (config) => {
  cleanSite();
  linkTheme();
  const args = ["generate"];
  if (config) args.push("--config", `_config.yml,${config}`);
  run(HEXO, args, SITE_ROOT);
};

export const readOutput = (relativePath = "index.html") =>
  fs.readFileSync(path.join(SITE_ROOT, "public", relativePath), "utf8");

export const outputExists = (relativePath) =>
  fs.existsSync(path.join(SITE_ROOT, "public", relativePath));
