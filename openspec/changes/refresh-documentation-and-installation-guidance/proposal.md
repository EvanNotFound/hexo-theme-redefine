## Why

The repository has moved to a pnpm monorepo with a local Hexo demo site and a single `pnpm dev` workflow, but the README and developer documentation still describe the previous theme-directory/npm/watch-only workflow. Public installation and migration pages also continue to present Git cloning as an installation method even though the next release will be distributed through package registries only.

## What Changes

- **BREAKING** Remove Git cloning and Git pull as end-user theme installation or update methods from all README and public documentation variants.
- Document npm and pnpm registry commands for installing and updating the published theme.
- Replace the detailed development instructions in all README variants with a concise link to the developer guide.
- Rewrite the English and Simplified Chinese developer guides to describe repository-root pnpm setup, the local `dev/site` demo workflow, build commands, generated assets, and current source paths.
- Keep Git-based repository checkout guidance for contributors in contribution documentation, since it is source acquisition rather than theme installation.

## Capabilities

### New Capabilities

- `documentation-installation-and-development`: Provide accurate package-registry installation, migration, and contributor development guidance for the current release and repository workflow.

### Modified Capabilities

<!-- No existing OpenSpec capabilities are defined in this repository. -->

## Impact

- Root README files: `README.md`, `README_zh-CN.md`, and `README_zh-TW.md`.
- Bilingual docs content under `docs/content/docs/{en,zh}/getting-started.mdx`, `migrate.mdx`, and `developer/`.
- No runtime code, package dependencies, public APIs, or build configuration changes.
