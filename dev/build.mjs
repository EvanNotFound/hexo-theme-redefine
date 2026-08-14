import { spawn } from "child_process";

const buildScripts = ["dev/build-css.mjs", "source/js/build.js"];

const runBuild = (script) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [script], {
      stdio: "inherit",
    });

    child.on("error", (error) => {
      resolve({ error, script });
    });
    child.on("exit", (code, signal) => {
      resolve({ code: code ?? 1, script, signal });
    });
  });

const main = async () => {
  const results = await Promise.all(buildScripts.map(runBuild));
  const failures = results.filter((result) => result.error || result.code !== 0);

  if (failures.length !== 0) {
    failures.forEach(({ code, error, script, signal }) => {
      const reason = error?.message || `exit code ${code} (${signal || "no signal"})`;
      console.error(`× ${script} failed: ${reason}`);
    });
    process.exitCode = 1;
    return;
  }

  console.log("✓ Theme asset build complete");
};

main().catch((error) => {
  console.error("× Theme asset build failed:", error);
  process.exitCode = 1;
});
