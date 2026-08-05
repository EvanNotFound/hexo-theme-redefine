import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { createServer } from "net";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const THEME_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SITE_ROOT = path.join(THEME_ROOT, "dev", "site");
const HOST = process.env.REDEFINE_PREVIEW_HOST || "127.0.0.1";
const PORT_START = Number.parseInt(
  process.env.REDEFINE_PREVIEW_PORT_START || "4100",
  10,
);
const PORT_RANGE = Number.parseInt(
  process.env.REDEFINE_PREVIEW_PORT_RANGE || "2000",
  10,
);
const PREVIEW_ROOT = path.resolve(
  process.env.REDEFINE_PREVIEW_DIR || path.join(os.tmpdir(), "redefine-preview"),
);

const parseArgs = (argv) => {
  const args = {
    generate: false,
    noBuild: false,
    noCssWatch: false,
    outputDir: null,
    port: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--generate") {
      args.generate = true;
      continue;
    }
    if (arg === "--no-build") {
      args.noBuild = true;
      continue;
    }
    if (arg === "--no-css-watch") {
      args.noCssWatch = true;
      continue;
    }
    if (arg === "--output-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("--output-dir requires a path.");
      args.outputDir = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--output-dir=")) {
      args.outputDir = arg.slice("--output-dir=".length);
      continue;
    }
    if (arg === "--port") {
      const value = argv[index + 1];
      if (!value) throw new Error("--port requires a number.");
      args.port = Number.parseInt(value, 10);
      index += 1;
      continue;
    }
    if (arg.startsWith("--port=")) {
      args.port = Number.parseInt(arg.slice("--port=".length), 10);
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: pnpm dev [--port PORT] [--no-build] [--no-css-watch]",
      );
      console.log("       pnpm run preview:generate [--output-dir PATH]");
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (args.port !== null && !Number.isFinite(args.port)) {
    throw new Error("--port must be a number.");
  }
  return args;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
    const stdout = typeof result.stdout === "string" ? result.stdout.trim() : "";
    throw new Error(stderr || stdout || `${command} ${args.join(" ")}`);
  }
};

const ensurePath = (filePath, message) => {
  if (!fs.existsSync(filePath)) throw new Error(message);
};

const ensureDependencies = () => {
  ensurePath(
    path.join(SITE_ROOT, "node_modules", ".bin", "hexo"),
    "Hexo dependencies are missing. Run pnpm install in the theme repository.",
  );
  ensurePath(
    path.join(THEME_ROOT, "node_modules", ".bin", "tailwindcss"),
    "Theme dependencies are missing. Run pnpm install in the theme repository.",
  );
};

const resolveThemePath = () => {
  const packagePath = path.join(THEME_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  if (packageJson.name !== "hexo-theme-redefine") {
    throw new Error(`Unexpected theme package in ${THEME_ROOT}.`);
  }
  return fs.realpathSync(THEME_ROOT);
};

const isPortAvailable = (port) =>
  new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen(port, HOST, () => {
      server.close(() => resolve(true));
    });
  });

const findAvailablePort = async (requestedPort) => {
  if (requestedPort !== null) {
    if (requestedPort < 1 || requestedPort > 65535) {
      throw new Error("--port must be between 1 and 65535.");
    }
    if (!(await isPortAvailable(requestedPort))) {
      throw new Error(`Port ${requestedPort} is already in use.`);
    }
    return requestedPort;
  }

  if (!Number.isFinite(PORT_START) || !Number.isFinite(PORT_RANGE) || PORT_RANGE < 1) {
    throw new Error("Invalid preview port configuration.");
  }

  for (let offset = 0; offset < PORT_RANGE; offset += 1) {
    const port = PORT_START + offset;
    if (port > 65535) break;
    if (await isPortAvailable(port)) return port;
  }

  throw new Error(`No available preview port found starting at ${PORT_START}.`);
};

const ensureSymlink = (target, linkPath) => {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.rmSync(linkPath, { recursive: true, force: true });
  if (process.platform === "win32") {
    const type = fs.statSync(target).isDirectory() ? "junction" : "file";
    fs.symlinkSync(target, linkPath, type);
    return;
  }
  fs.symlinkSync(target, linkPath);
};

const getRuntimePath = (themePath) => {
  const id = crypto.createHash("sha256").update(themePath).digest("hex").slice(0, 16);
  return path.join(PREVIEW_ROOT, id);
};

const prepareRuntime = ({ port, themePath }) => {
  const runtimePath = getRuntimePath(themePath);
  fs.rmSync(runtimePath, { recursive: true, force: true });
  fs.mkdirSync(runtimePath, { recursive: true });

  ensureSymlink(path.join(SITE_ROOT, "source"), path.join(runtimePath, "source"));
  ensureSymlink(path.join(SITE_ROOT, "scaffolds"), path.join(runtimePath, "scaffolds"));
  ensureSymlink(
    path.join(SITE_ROOT, "node_modules"),
    path.join(runtimePath, "node_modules"),
  );
  ensureSymlink(path.join(SITE_ROOT, "package.json"), path.join(runtimePath, "package.json"));
  ensureSymlink(path.join(SITE_ROOT, "_config.yml"), path.join(runtimePath, "_config.yml"));
  ensureSymlink(
    path.join(SITE_ROOT, "_config.redefine.yml"),
    path.join(runtimePath, "_config.redefine.yml"),
  );
  ensureSymlink(themePath, path.join(runtimePath, "themes", "redefine"));
  fs.mkdirSync(path.join(runtimePath, "public"), { recursive: true });

  const overridePath = path.join(runtimePath, "_config.preview.yml");
  fs.writeFileSync(
    overridePath,
    `url: "http://${HOST}:${port}"\ntheme: redefine\n`,
    "utf8",
  );

  return { overridePath, runtimePath };
};

const getConfigFiles = ({ overridePath, runtimePath }) =>
  [
    path.join(runtimePath, "_config.yml"),
    path.join(runtimePath, "_config.redefine.yml"),
    overridePath,
  ].join(",");

const runHexo = ({ args, configFiles, runtimePath }) => {
  const hexoPath = path.join(SITE_ROOT, "node_modules", ".bin", "hexo");
  run(hexoPath, [...args, "--config", configFiles], {
    cwd: runtimePath,
    stdio: "inherit",
  });
};

const pipeWithPrefix = (stream, prefix, isError = false) => {
  if (!stream) return;
  let buffer = "";
  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";
    lines.forEach((line) => {
      if (!line.trim()) return;
      const message = `[redefine-preview] ${prefix} ${line}`;
      if (isError) console.error(message);
      else console.log(message);
    });
  });
  stream.on("end", () => {
    if (!buffer.trim()) return;
    const message = `[redefine-preview] ${prefix} ${buffer}`;
    if (isError) console.error(message);
    else console.log(message);
  });
};

const spawnProcess = ({ command, args, cwd, label }) => {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, HUSKY: "0", NODE_ENV: "development" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  pipeWithPrefix(child.stdout, label);
  pipeWithPrefix(child.stderr, label, true);
  return child;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const themePath = resolveThemePath();
  ensurePath(SITE_ROOT, `Missing preview site: ${SITE_ROOT}`);
  ensureDependencies();

  if (!args.noBuild) {
    console.log("[redefine-preview] Building theme JavaScript...");
    run("pnpm", ["run", "build:js"], { cwd: THEME_ROOT, stdio: "inherit" });
  }

  const port = await findAvailablePort(args.port);
  const runtime = prepareRuntime({ port, themePath });
  const configFiles = getConfigFiles(runtime);

  runHexo({ args: ["clean"], configFiles, runtimePath: runtime.runtimePath });

  if (args.generate) {
    runHexo({ args: ["generate"], configFiles, runtimePath: runtime.runtimePath });
    if (args.outputDir) {
      const outputDir = path.resolve(process.cwd(), args.outputDir);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.cpSync(path.join(runtime.runtimePath, "public"), outputDir, {
        recursive: true,
      });
      console.log(`[redefine-preview] Copied generated files to ${outputDir}`);
    }
    console.log(`[redefine-preview] Generated ${runtime.runtimePath}/public`);
    return;
  }

  const children = [];
  let shuttingDown = false;
  const shutdown = (reason, exitCode = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    if (reason) console.error(`[redefine-preview] ${reason}`);
    children.forEach((child) => {
      if (!child.killed) child.kill("SIGTERM");
    });
    setTimeout(() => {
      children.forEach((child) => {
        if (!child.killed) child.kill("SIGKILL");
      });
    }, 2000).unref();
    process.exitCode = exitCode;
  };

  process.on("SIGINT", () => shutdown("Interrupted"));
  process.on("SIGTERM", () => shutdown("Terminated"));

  const hexo = spawnProcess({
    command: path.join(SITE_ROOT, "node_modules", ".bin", "hexo"),
    args: [
      "server",
      "-i",
      HOST,
      "-p",
      String(port),
      "--config",
      configFiles,
    ],
    cwd: runtime.runtimePath,
    label: "hexo",
  });
  children.push(hexo);

  if (!args.noCssWatch) {
    const css = spawnProcess({
      command: "pnpm",
      args: ["run", "watch:css"],
      cwd: THEME_ROOT,
      label: "css",
    });
    children.push(css);
  }

  console.log(`[redefine-preview] theme -> ${themePath}`);
  console.log(`[redefine-preview] preview -> http://${HOST}:${port}`);

  children.forEach((child, index) => {
    child.on("exit", (code, signal) => {
      if (shuttingDown) return;
      const label = index === 0 ? "hexo" : "css";
      const reason = signal
        ? `${label} exited (${signal})`
        : `${label} exited (${code ?? "unknown"})`;
      if (index === 0 || (code && code !== 0)) shutdown(reason, code ?? 1);
      else console.log(`[redefine-preview] ${reason}`);
    });
  });
};

main().catch((error) => {
  console.error(
    `[redefine-preview] ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
