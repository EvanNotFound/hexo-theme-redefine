import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tailwind = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tailwindcss.cmd" : "tailwindcss",
);
const pluginSource = path.join(root, "styles", "plugins");
const buildOutput = path.join(root, "source", "css", "build");
const pluginOutput = path.join(buildOutput, "plugins");

fs.rmSync(buildOutput, { force: true, recursive: true });
fs.mkdirSync(buildOutput, { recursive: true });
fs.cpSync(pluginSource, pluginOutput, { recursive: true });

const result = spawnSync(
  tailwind,
  ["-i", "styles/theme.css", "-o", "source/css/build/theme.css", "--minify"],
  { cwd: root, stdio: "inherit" },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
