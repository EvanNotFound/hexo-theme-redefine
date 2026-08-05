import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");
const THEME_LINK = path.join(SITE_ROOT, "themes", "redefine");
const THEME_ENTRIES = [
  "_config.yml",
  "languages",
  "layout",
  "package.json",
  "scripts",
  "source",
];

export const linkTheme = () => {
  fs.rmSync(THEME_LINK, { recursive: true, force: true });
  fs.mkdirSync(THEME_LINK, { recursive: true });

  THEME_ENTRIES.forEach((entry) => {
    const target = path.join(THEME_ROOT, entry);
    const linkPath = path.join(THEME_LINK, entry);
    const type = fs.statSync(target).isDirectory()
      ? process.platform === "win32"
        ? "junction"
        : "dir"
      : "file";
    fs.symlinkSync(target, linkPath, type);
  });
};

if (path.resolve(process.argv[1] || "") === SCRIPT_PATH) linkTheme();
