## Context

The root package builds Tailwind CSS into `source/css/build/` and minifies or
copies browser JavaScript into `source/js/build/`. Those directories are
currently tracked and a branch push to `dev` or `main` triggers a GitHub Actions
workflow that commits refreshed output back to the branch. Husky only enforces a
local version of the artifact policy; it is not needed to produce release
artifacts.

The npm release workflow already builds before publishing. The Aliyun workflow
currently uploads the checked-out `source/` tree without building, so it relies
on tracked output. The PR preview and deployment workflows already build the
theme in their runner. Public installation guidance uses npm and pnpm rather
than Git checkouts.

## Goals / Non-Goals

**Goals:**

- Make source files the only authoritative theme implementation in Git.
- Produce CSS and JavaScript artifacts locally, in PR validation, and in release
  jobs without committing them back to the repository.
- Keep the published npm package and Aliyun upload complete.
- Keep a fresh checkout usable with `pnpm dev`.
- Preserve checked-in runtime assets under `source/assets/`.

**Non-Goals:**

- Do not move or rename `source/assets/` or the core CSS source tree.
- Do not change the theme's runtime asset URLs.
- Do not add a new build system, remote artifact store, or release service.
- Do not change the external cdnjs package configuration in this repository;
  its separate metadata PR is the integration prerequisite for future CDN
  releases.

## Decisions

### Keep generated output out of Git

Add the CSS and JavaScript build directories to the repository ignore rules and
remove their tracked contents in one migration change. Delete the
artifact-commit workflow and keep the PR build workflow as validation. The PR
check may continue rejecting force-added generated files, but it must no longer
make an exception for `dev` to `main` merges.

Keeping generated output in a bot-maintained branch commit was considered and
rejected because it preserves noisy history and creates a second commit for
each source change. A separate generated branch was also rejected because the
supported user distribution is the built npm package and release CDN uploads.

### Make package contents explicit

Add a `files` allowlist to the root `package.json` covering the runtime theme
directories and `source/`. This ensures ignored build output remains present in
the npm tarball while avoiding accidental dependence on Git ignore behavior.
Verify the result with a dry-run package listing after a clean build.

### Build at publication boundaries

Keep the npm release build and add the same dependency installation and build
steps to the Aliyun release workflow before it uploads `source/`. Use the Node
and pnpm versions used by the repository's current release workflows and root
package metadata. The workflows may build
independently because they consume the same tagged source and lockfile; merging
them into a shared artifact workflow is unnecessary scope for this change.

### Build browser JavaScript when local development starts

Make the `pnpm dev` command run a one-time `build:js` before starting the demo
site and CSS watcher. This replaces the implicit availability of tracked JS
output without adding a continuous JavaScript watcher. Remove the stale Husky
environment override from the development orchestrator.

### Preserve runtime assets

Leave `source/assets/` unchanged. `source/assets/odometer-theme-minimal.css` is
referenced by the runtime template, and `source/assets/hbe.style.css` is read by
the encryption generator and emitted into generated Hexo pages. The assets are
source inputs and are already covered by the cdnjs asset map.

## Risks / Trade-offs

- **[Risk]** A raw Git checkout will no longer contain production build output.
  → **Mitigation:** Public installation documentation already supports npm and
  pnpm; PR previews, releases, and local `pnpm dev` build the output.
- **[Risk]** An ignore rule could accidentally exclude build output from npm.
  → **Mitigation:** Explicitly include `source/` in `package.json` and verify
  `npm pack --dry-run` after building.
- **[Risk]** Aliyun could publish an incomplete tree if its build step fails or
  is skipped.
  → **Mitigation:** Build immediately before upload and fail the workflow on a
  non-zero build result.
- **[Trade-off]** Release workflows perform independent builds rather than
   sharing one uploaded artifact.
   → **Mitigation:** Pin Node, pnpm, dependencies, and the source revision; keep
   the workflows simple and aligned.

### Use pnpm/setup for GitHub Actions

All workflows that use pnpm use `pnpm/setup@v2` rather than separate Node.js and
pnpm setup actions. The action reads the pnpm version from `packageManager` in
`package.json` and installs Node.js 24 through `runtime: node@24`.

Root-based build and publication workflows use the action's automatic dependency
installation and pnpm store cache. The deploy workflows that check out the theme
under `theme/` provide `package-json-file: theme/package.json` and the matching
lockfile path, but defer installation until the theme has been moved into the
Hexo site. The artifact-only PR deploy checks out the workflow run's source at
its head SHA, uses `install: false`, and only uses pnpm to install the Vercel
CLI. The npm publication workflow configures the npm registry separately because
`pnpm/setup` does not expose `actions/setup-node`'s `registry-url` input.

No `devEngines.runtime` field is added because all workflows are standardized on
Node.js 24 through the setup action.

## Migration Plan

1. Update package metadata, ignore rules, development startup, release CI, PR
   checks, and contributor documentation.
2. Regenerate the lockfile after removing Husky.
3. Build and inspect the npm tarball from the source-only tree.
4. Remove the tracked CSS and JavaScript build directories and the obsolete
   Husky/artifact-commit files.
5. Run the root build and relevant documentation checks.
6. Merge the theme change after the cdnjs metadata PR is available, then use the
   updated release workflow for the next version.

Rollback consists of reverting the migration commit and restoring the tracked
generated files only if a supported distribution path is discovered to require
raw Git artifacts. Normal published npm versions remain immutable.

## Open Questions

None. This design assumes the existing documented npm/pnpm installation paths
remain the supported end-user distribution channels.
