import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { cleanSite } from "./clean.mjs";
import { linkTheme } from "./link-theme.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");
const HEXO_PATH = path.join(SITE_ROOT, "node_modules", ".bin", "hexo");

const children = [];
let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) child.kill("SIGTERM");
  });
  process.exitCode = exitCode;
};

const start = (command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, HUSKY: "0", NODE_ENV: "development" },
    stdio: "inherit",
  });
  children.push(child);
  return child;
};

const main = () => {
  cleanSite();
  linkTheme();
  const hexo = start(HEXO_PATH, ["server", ...process.argv.slice(2)], SITE_ROOT);
  const css = start("pnpm", ["run", "watch:css"], THEME_ROOT);

  hexo.on("exit", (code) => {
    if (!shuttingDown) shutdown(code || 0);
  });
  css.on("exit", (code) => {
    if (!shuttingDown && code !== 0) shutdown(code || 1);
  });

  process.on("SIGINT", () => shutdown());
  process.on("SIGTERM", () => shutdown());

  console.log("Demo site -> http://127.0.0.1:4000");
};

main();
