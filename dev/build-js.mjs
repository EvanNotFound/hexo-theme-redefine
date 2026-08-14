import fs from "fs/promises";
import path from "path";
import esbuild from "esbuild";
import buildOptions from "../source/js/esbuild-options.js";

const { applicationOptions, BUILD_DIR } = buildOptions;
const DEV_BUILD_DIR = path.join(BUILD_DIR, "dev");

export const buildDevelopmentJavaScript = async ({ watch = false } = {}) => {
  await fs.rm(DEV_BUILD_DIR, { force: true, recursive: true });
  await fs.mkdir(DEV_BUILD_DIR, { recursive: true });

  const context = await esbuild.context(
    applicationOptions({
      chunkNames: "chunks/[name]",
      minify: false,
      outdir: DEV_BUILD_DIR,
    }),
  );

  await context.rebuild();
  if (watch) {
    await context.watch();
    console.log("✓ Development JavaScript watcher ready");
    return context;
  }

  await context.dispose();
  console.log("✓ Development JavaScript build complete");
  return null;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  buildDevelopmentJavaScript({ watch: process.argv.includes("--watch") }).catch(
    (error) => {
      console.error("× Development JavaScript build failed:", error);
      process.exitCode = 1;
    },
  );
}
