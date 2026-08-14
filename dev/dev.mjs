import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { buildDevelopmentJavaScript } from "./build-js.mjs";
import { cleanSite } from "./clean.mjs";
import { linkTheme } from "./link-theme.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");
const HEXO_PATH = path.join(SITE_ROOT, "node_modules", ".bin", "hexo");

const children = [];
let shuttingDown = false;
let jsContext = null;

const shutdown = async (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) child.kill("SIGTERM");
  });
  await jsContext?.dispose();
  process.exitCode = exitCode;
};

const start = (command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, NODE_ENV: "development" },
    stdio: "inherit",
  });
  children.push(child);
  return child;
};

const main = async () => {
  cleanSite();
  linkTheme();
  jsContext = await buildDevelopmentJavaScript({ watch: true });
  const hexo = start(
    HEXO_PATH,
    ["server", "--config", "_config.yml,_config.dev.yml", ...process.argv.slice(2)],
    SITE_ROOT,
  );
  const css = start(
    process.execPath,
    [path.join(THEME_ROOT, "dev", "watch-css.mjs")],
    THEME_ROOT,
  );

  hexo.on("exit", (code) => {
    if (!shuttingDown) void shutdown(code || 0);
  });
  css.on("exit", (code) => {
    if (!shuttingDown && code !== 0) void shutdown(code || 1);
  });

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());

  console.log("Demo site -> http://127.0.0.1:4000");
};

main().catch((error) => {
  console.error("× Development server failed:", error);
  void shutdown(1);
});
