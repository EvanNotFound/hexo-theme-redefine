## 1. Make Builds and Packages Source-Driven

- [x] 1.1 Add an npm `files` allowlist for the runtime theme directories and `source/`, and ignore `source/css/build/` and `source/js/build/` without excluding them from the published package.
- [x] 1.2 Remove the Husky prepare script and dependency, remove the tracked pre-commit hook, regenerate `pnpm-lock.yaml`, and make `pnpm dev` perform an initial `build:js` while removing the stale Husky environment override.
- [x] 1.3 Update the Aliyun release workflow to install the pinned Node/pnpm dependencies and build theme assets before uploading `source/`.

## 2. Remove Repository Artifact Commits

- [x] 2.1 Delete the tracked contents of `source/css/build/` and `source/js/build/`, preserve `source/assets/`, and remove generated-only Git attributes.
- [x] 2.2 Delete the branch workflow that commits generated artifacts and simplify PR artifact validation so all PRs reject generated output while still building the source.

## 3. Align Contributor Guidance

- [x] 3.1 Update `AGENTS.md` and `CONTRIBUTING.md` to describe CI/release-generated artifacts and the source-only repository policy.
- [x] 3.2 Update the English and Chinese developer documentation to describe the initial JavaScript build during `pnpm dev`, ignored build output, and the unchanged checked-in `source/assets/` runtime assets.

## 4. Verify Publication and Migration Behavior

- [x] 4.1 Run the root build from the source-only tree, inspect the npm dry-run package contents for built CSS, JavaScript, and maps, and run the affected docs lint/type checks.
- [x] 4.2 Verify the final workflow and Git diff contain no artifact-commit path, no Husky setup, and no accidental deletion of `source/assets/`; confirm cdnjs PR #2185 is available before the next CDN-backed release.

## 5. Migrate GitHub Actions to pnpm/setup

- [x] 5.1 Update all pnpm workflows to use `pnpm/setup@v2` with Node.js 24 and
  package-manager autodetection, preserving root installs, theme-path installs,
  artifact-only deployment, cache behavior, and npm registry configuration.
- [x] 5.2 Update the proposal, design, artifact-publication and docs-guidance
  specifications, repository guidance, localized developer documentation, and
  task record with the finalized pnpm/setup workflow contract.
