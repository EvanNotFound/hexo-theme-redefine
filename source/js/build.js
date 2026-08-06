const esbuild = require("esbuild");
const fs = require("fs/promises");
const path = require("path");

const THEME_ROOT = path.join(__dirname, "../..");
const SOURCE_DIR = path.join(THEME_ROOT, "source/js");
const BUILD_DIR = path.join(SOURCE_DIR, "build");
const LIBS_DIR = path.join(SOURCE_DIR, "libs");

const sharedOptions = {
  bundle: true,
  logLevel: "info",
  minify: true,
  platform: "browser",
  sourcemap: true,
  target: "es2020",
};

const copyJavaScriptFiles = async (sourceDir, targetDir) => {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await copyJavaScriptFiles(sourcePath, targetPath);
        return;
      }

      if (path.extname(entry.name) !== ".js") {
        return;
      }

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(sourcePath, targetPath);
    }),
  );
};

const buildApplication = () =>
  esbuild.build({
    ...sharedOptions,
    chunkNames: "chunks/[name]-[hash]",
    entryPoints: [path.join(SOURCE_DIR, "main.js")],
    entryNames: "[name]",
    format: "esm",
    outdir: BUILD_DIR,
    splitting: true,
  });

const buildStandalone = (entry, format) =>
  esbuild.build({
    ...sharedOptions,
    entryPoints: [
      {
        in: path.join(SOURCE_DIR, entry.source),
        out: entry.output,
      },
    ],
    format,
    outdir: BUILD_DIR,
  });

const buildJavaScript = async () => {
  await fs.rm(BUILD_DIR, { force: true, recursive: true });
  await fs.mkdir(BUILD_DIR, { recursive: true });

  await Promise.all([
    copyJavaScriptFiles(LIBS_DIR, path.join(BUILD_DIR, "libs")),
    buildApplication(),
    buildStandalone({ source: "plugins/aplayer.js", output: "plugins/aplayer" }, "iife"),
    buildStandalone({ source: "plugins/hbe.js", output: "plugins/hbe" }, "esm"),
  ]);

  console.log("✓ JavaScript build complete");
};

buildJavaScript().catch((error) => {
  console.error("× JavaScript build failed:", error);
  process.exitCode = 1;
});
