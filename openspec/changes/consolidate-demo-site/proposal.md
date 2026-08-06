## Why

The repository already contains `dev/site` for local theme development, but the
production demo and branch preview workflows still clone and modify a second
repository. This duplicates site maintenance and makes the deployed demo differ
from the site contributors test locally.

## What Changes

- Make `dev/site` the canonical Redefine demo site and merge the external demo's
  maintained content with the useful embedded theme regression pages.
- Remove temporary, duplicate, boilerplate, and unrelated test content from the
  consolidated site while retaining durable coverage of theme features.
- Keep the monorepo's pnpm workspace package and modern Hexo dependency set;
  do not import the external repository's Git metadata, npm lockfile, or unused
  bundled Landscape theme.
- Update PR preview, branch preview, and production demo workflows to build and
  generate `dev/site` from the checked-out monorepo.
- Keep developer mode enabled for local `pnpm dev`, but disable it for every
  deployed build, including PR previews.
- Preserve the current CDN policy: local and non-production previews use local
  generated assets, while the production demo may use versioned published CDN
  assets.
- Freeze the standalone `redefine-demo` repository after the migration and
  document the monorepo as the maintained source.
- Update bilingual developer guidance when the supported demo and deployment
  workflow changes.

## Capabilities

### New Capabilities

- `canonical-demo-site`: Defines the canonical demo site's ownership, content
  boundaries, workspace integration, and local development behavior.
- `demo-deployment-mode`: Defines how preview and production workflows generate
  the canonical demo with developer mode disabled and the appropriate CDN mode.

### Modified Capabilities

- `docs-guidance`: Extend developer guidance to identify `dev/site` as the
  canonical demo source and describe the local/deployed mode distinction.

## Impact

- `dev/site` content and configuration.
- Root workspace dependency and generation commands only where needed for the
  consolidated site.
- `.github/workflows/pr-preview-build.yml`, `dev-deploy.yml`, and
  `prod-deploy.yml`, with possible shared deployment logic.
- Developer documentation in both supported locales.
- The external demo repository's maintenance status and README guidance.
- No published theme API or npm package contract changes.
