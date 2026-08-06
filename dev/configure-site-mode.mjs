import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "./site/node_modules/js-yaml/index.js";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const CONFIG_PATH = path.join(THEME_ROOT, "dev", "site", "_config.redefine.yml");

const modes = {
  preview: { developer: false, cdn: false },
  production: { developer: false, cdn: true },
};

const mode = process.argv[2];
const settings = modes[mode];

if (!settings) {
  console.error("Usage: node dev/configure-site-mode.mjs <preview|production>");
  process.exit(1);
}

const config = yaml.load(fs.readFileSync(CONFIG_PATH, "utf8")) || {};
config.developer = { ...(config.developer || {}), enable: settings.developer };
config.cdn = { ...(config.cdn || {}), enable: settings.cdn };

fs.writeFileSync(
  CONFIG_PATH,
  yaml.dump(config, { lineWidth: -1, noRefs: true, sortKeys: false }),
);
