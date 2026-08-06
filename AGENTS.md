# AGENTS.md

This repository is a pnpm monorepo for Hexo Theme Redefine, its local Hexo
demo site, and its Next.js documentation site. Work from the repository root
unless a package-specific command says otherwise.

## Start Here

- Read this file for workspace boundaries, shared workflows, and root theme
  conventions.
- For work under `docs/**`, also follow `docs/AGENTS.md`. The nearest guidance
  file takes precedence for package-specific details.
- Keep a change focused on the package that owns it. Update another package
  only when the behavior or workflow genuinely crosses that boundary.
- Use pnpm and the versions declared by the repository: pnpm `10.29.3` and
  Node.js 20.x for development and CI.

## Repository Map

| Path                                                          | Package or responsibility                       | Main contents                                                     |
| ------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `source/`, `scripts/`, `layout/`, `languages/`, `_config.yml` | Root theme package, `hexo-theme-redefine`       | Theme runtime, Hexo integration, styles, configuration            |
| `dev/site/`                                                   | Private workspace package, `redefine-demo-site` | Hexo configuration, demo pages, posts, and validation fixtures    |
| `dev/dev.mjs`                                                 | Local development orchestration                 | Cleans and links the demo site, starts Hexo, and watches root CSS |
| `dev/clean.mjs`                                               | Demo-site cleanup                               | Removes generated Hexo state                                      |
| `dev/link-theme.mjs`                                          | Local theme mounting                            | Links the current root theme into `dev/site/themes/redefine`      |
| `docs/`                                                       | Private workspace package, `redefine-docs`      | Next.js 16, Fumadocs, TypeScript UI, and bilingual MDX content    |

The workspace packages are declared in `pnpm-workspace.yaml`. The root
package is the published theme; `dev/site` and `docs` are excluded from the
published npm package.

## Commands

Run these from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run build:css
pnpm run build:js
pnpm clean
pnpm dev
```

- `pnpm run build` builds Tailwind CSS and minifies browser JavaScript.
- `pnpm run build:css` writes `source/css/build/tailwind.css`.
- `pnpm run build:js` writes minified files and source maps under
  `source/js/build/`.
- `pnpm clean` removes the demo site's `db.json` and `public/` directory.
- `pnpm dev` builds browser JavaScript once, resets the demo site, links the
  current theme, starts Hexo at `http://127.0.0.1:4000`, and starts the root CSS
  watcher. It does not watch browser JavaScript.
- `pnpm run watch:css` runs the root CSS watcher without starting Hexo.
- `pnpm dev:setup` installs dependencies with the offline preference used by
  the worktree setup.

Run docs commands from the root with `--dir docs`, or change into `docs/`:

```sh
pnpm --dir docs dev
pnpm --dir docs lint
pnpm --dir docs types:check
pnpm --dir docs build
pnpm --dir docs start
```

The docs package has no automated test runner or single-test command. The
root theme package also has no test runner or lint script. Use the focused
build, lint, typecheck, preview, or Hexo generation command for the package
you changed.

## Choose the Right Package

Before editing, classify the task:

- Theme behavior, templates, styles, browser code, Hexo helpers, theme
  configuration, or language strings belongs in the root package.
- Demo-only posts, pages, fixtures, or Hexo settings belong in `dev/site/`.
  Do not edit the linked `dev/site/themes/redefine/` copy.
- Documentation prose belongs in `docs/content/docs/{zh,en}/`. Update both
  locales unless the task explicitly allows one locale, and keep `zh` as the
  canonical source.
- Documentation UI, routing, search, layouts, or components belongs in
  `docs/src/`.
- Workspace dependency changes belong in the package's `package.json` and
  the root `pnpm-lock.yaml`; do not edit the lockfile by hand.

For a cross-package change, describe the relationship in the change and run
the verification commands for every affected package.

## Local Preview Workflow

The canonical theme preview is the root command:

```text
pnpm dev
  ├─ build browser JavaScript once
  ├─ reset dev/site/db.json and dev/site/public/
  ├─ link root theme entries into dev/site/themes/redefine/
  ├─ run Hexo server in dev/site on port 4000
  └─ watch root Tailwind CSS
```

`dev/site/source/` is committed validation content and may be changed when a
theme change needs a reproducible demo. The linked theme directory,
`db.json`, and `public/` are generated local state.

For a one-off generated preview without keeping a server running:

```sh
pnpm run build
pnpm clean
node dev/link-theme.mjs
pnpm --dir dev/site exec hexo generate
```

## Generated Files

Do not edit generated files directly:

- Root theme build output: `source/css/build/` and `source/js/build/`.
- Docs Fumadocs output: `docs/.source/`.
- Docs Next.js output: `docs/.next/`, `docs/out/`, and `docs/next-env.d.ts`.
- Demo-site state: `dev/site/db.json`, `dev/site/public/`, and
  `dev/site/themes/`.

Run the source build when it is useful for verification, but do not include
root theme build output in ordinary PR commits. PR CI rejects those files, and
release workflows regenerate the output when publishing packages or CDN
assets.

## Root Theme Conventions

### Browser JavaScript

- Source lives under `source/js/**` and uses ES modules.
- Use 2-space indentation, semicolons, double quotes, and trailing commas in
  multiline objects, arrays, and parameters.
- Prefer `const`; use `let` only when reassignment is needed.
- Use `camelCase` for functions and variables, `PascalCase` for classes, and
  `UPPER_SNAKE_CASE` for constants.
- Keep initialization in `init*`, `on*`, or explicit lifecycle functions.
- Guard missing DOM nodes with early returns and keep config access null-safe.
- Use abort or cleanup patterns for event listeners when the surrounding code
  supports them.

### Hexo and Node code

- Files under `scripts/**` use CommonJS and start with `"use strict";`.
- Use `hexo.extend.*` APIs and avoid direct DOM access.
- Keep helpers small and mostly pure. Use `try/catch` for unsafe parsing or
  external data and log non-fatal failures with `console.warn` or
  `console.error`.

### Styling and configuration

- Tailwind source is `source/css/tailwind.source.css`; do not edit its build
  output.
- Stylus files use `//` comments, `$`-prefixed hyphenated variables, and the
  existing `redefine-tablet()` and `redefine-mobile()` mixins.
- Add theme defaults to `_config.yml`. If client code needs the value, update
  `scripts/config-export.js` and consume it with a default in JavaScript.
- Add user-facing theme strings to the relevant files under `languages/`.

## Verification and Change Hygiene

- Theme source or config change: run `pnpm run build`; use `pnpm dev` for
  browser-facing behavior.
- Demo-site change: run `pnpm clean`, link the theme, and use
  `pnpm --dir dev/site exec hexo generate` or `pnpm dev`.
- Docs code change: run `pnpm --dir docs lint` and
  `pnpm --dir docs types:check`.
- Docs MDX change: verify both locale files and their matching `meta.json`
  navigation when pages move or are added.
- Keep diffs focused, preserve existing file headers, and do not add a new
  dependency or abstraction unless the task requires it.
- Never expose secrets from `_config.yml` or environment files. Treat external
  URLs and configuration values as untrusted input.

## Contribution Rules

- Pull requests target the `dev` branch.
- Use commit messages in the form `[section]: [brief info]`, for example
  `footer: optimize style`.
- Do not commit generated theme assets in ordinary PRs. Test local builds, but
  leave generated output unstaged unless working on the workflow that updates
  `main` or `dev`.
- Keep this file and the nested package guidance current when the workspace or
  development commands change.

## Quick Links

- User docs: https://redefine-docs.ohevan.com/
- Developer docs: https://redefine-docs.ohevan.com/developer
- Theme homepage: https://redefine.ohevan.com/
