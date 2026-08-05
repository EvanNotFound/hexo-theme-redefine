import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");

export const cleanSite = () => {
  fs.rmSync(path.join(SITE_ROOT, "db.json"), { force: true });
  fs.rmSync(path.join(SITE_ROOT, "public"), { recursive: true, force: true });
};

if (path.resolve(process.argv[1] || "") === SCRIPT_PATH) cleanSite();
