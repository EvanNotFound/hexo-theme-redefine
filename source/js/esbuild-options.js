const path = require("path");

const THEME_ROOT = path.join(__dirname, "../..");
const SOURCE_DIR = path.join(THEME_ROOT, "source/js");
const BUILD_DIR = path.join(SOURCE_DIR, "build");

const sharedOptions = {
  bundle: true,
  logLevel: "info",
  platform: "browser",
  sourcemap: true,
  target: "es2020",
};

const applicationOptions = ({ chunkNames, minify, outdir }) => ({
  ...sharedOptions,
  chunkNames,
  entryPoints: [path.join(SOURCE_DIR, "main.js")],
  entryNames: "[name]",
  format: "esm",
  minify,
  outdir,
  splitting: true,
});

module.exports = {
  applicationOptions,
  BUILD_DIR,
  SOURCE_DIR,
  sharedOptions,
  THEME_ROOT,
};
