import { spawn } from "child_process";
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
const pluginOutput = path.join(root, "source", "css", "build", "plugins");

const syncPlugins = () => {
  fs.rmSync(pluginOutput, { force: true, recursive: true });
  fs.cpSync(pluginSource, pluginOutput, { recursive: true });
};

syncPlugins();

const tailwindProcess = spawn(
  tailwind,
  ["-i", "styles/theme.css", "-o", "source/css/build/theme.css", "--watch", "--minify"],
  { cwd: root, stdio: "inherit" },
);
const watcher = fs.watch(pluginSource, { recursive: true }, syncPlugins);

const shutdown = () => {
  watcher.close();
  if (!tailwindProcess.killed) tailwindProcess.kill("SIGTERM");
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
tailwindProcess.on("exit", (code) => {
  watcher.close();
  process.exitCode = code ?? 1;
});
