## 1. Consolidate Canonical Demo Content

- [x] 1.1 Reconcile the external demo snapshot with `dev/site`, preserving the
  current pnpm workspace package, Hexo 7-compatible dependency set, and root
  lockfile while excluding external Git metadata, npm lockfile, IDE files, and
  the unused Landscape theme.
- [x] 1.2 Merge the external public demo content/configuration with durable local
  theme regression pages, resolve colliding paths intentionally, and remove
  duplicate, boilerplate, stale tutorial, unrelated personal, and filler posts.
- [x] 1.3 Keep the tracked local demo configuration developer-enabled with CDN
  disabled, and review migrated analytics, comments, injection, URLs, and other
  public configuration values for the canonical demo.

## 2. Use the Canonical Site in CI/CD

- [x] 2.1 Add a shared deployment-mode configuration step that applies
  developer-disabled preview or production settings in the CI working tree
  without permanently rewriting the tracked local configuration.
- [x] 2.2 Update PR preview generation to disable developer mode while retaining
  local preview assets, then update branch preview and production workflows to
  install the workspace once, build/link the root theme, generate `dev/site`,
  and deploy its output without cloning the external repository.
- [x] 2.3 Remove obsolete external-clone, nested-theme-installation, theme
  package-removal, and PyYAML workflow steps while preserving existing Vercel
  artifact boundaries, aliases, credentials, and production domains.

## 3. Align Guidance and Verify the Migration

- [x] 3.1 Update the English and Chinese developer documentation to identify
  `dev/site` as the canonical demo source and document local developer mode,
  deployed production mode, and the target-specific CDN policy.
- [x] 3.2 Generate the consolidated site in local/developer, preview, and
  production-like modes and verify that source modules, built assets, local CDN
  behavior, production CDN references, and representative retained regression
  pages work as specified.
- [x] 3.3 Run the root theme build and relevant workflow/configuration checks,
  confirm generated state remains ignored, and verify no deployment workflow
  still references `EvanNotFound/redefine-demo` as a build input.
