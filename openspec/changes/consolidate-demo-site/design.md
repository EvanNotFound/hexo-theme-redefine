## Context

The monorepo contains the published Hexo theme at the repository root and a
private Hexo workspace package at `dev/site`. Local development already cleans
the site, links the current theme into `dev/site/themes/redefine`, starts Hexo,
and watches Tailwind CSS.

The PR preview workflow uses this embedded site, but the branch preview and
production workflows still clone `EvanNotFound/redefine-demo`, install the theme
inside that checkout, and generate from there. The external repository is an
older standalone Hexo site with its own npm lockfile and an unused Landscape
theme. The embedded site has newer Hexo dependencies and additional theme
regression fixtures.

The tracked demo configuration enables developer mode for local source-module
debugging. Deployed builds must use generated theme assets instead. CDN usage
remains environment-specific: local and non-production previews use checked-out
assets, while production may use the published versioned CDN assets.

## Goals / Non-Goals

**Goals:**

- Make `dev/site` the only maintained demo-site source in this repository.
- Merge the external demo's maintained content and public configuration with the
  useful local theme regression fixtures.
- Keep the monorepo's pnpm workspace and current Hexo 7 dependency set.
- Make local development source-oriented and every deployed build
  production-oriented.
- Remove external repository cloning and nested theme installation from CI/CD.
- Keep preview generation and deployment based on the generated `dev/site`
  output.
- Keep bilingual developer documentation aligned with the new ownership and mode
  behavior.

**Non-Goals:**

- Do not change the published theme's public API or npm package layout.
- Do not preserve the external repository's Git history, npm lockfile, or
  Landscape theme in the monorepo.
- Do not maintain a synchronization process between the monorepo and the frozen
  external repository.
- Do not change the theme's general CDN implementation or asset build pipeline.
- Do not add a separate production copy of the demo site.

## Decisions

### Use `dev/site` as the canonical site package

The external repository's content is migrated into the existing `dev/site`
workspace instead of creating a second package or changing the workspace
layout. The current `dev/site/package.json` and root `pnpm-lock.yaml` remain the
dependency source of truth because they target the current Hexo 7-based setup.
The external `package-lock.json`, `.git` metadata, IDE metadata, and bundled
Landscape theme are excluded.

The external site is used as the public-content baseline. Local content is then
added selectively for durable theme coverage. The migration removes duplicate
fixture posts, Hexo boilerplate, stale deployment tutorials, unrelated personal
articles, and filler content. It retains tests for Markdown, syntax highlighting,
images and math, Mermaid, tabs, nested paths, long titles, and representative
theme layouts.

Where both repositories contain the same path, the content is reconciled once
during migration. The result must have one intentional version of each page and
must not rely on whichever copy happened to be copied last.

### Keep local developer mode in the tracked configuration

`dev/site/_config.redefine.yml` remains developer-enabled so `pnpm dev` serves
source JavaScript modules and readable development CSS. CI changes the mode in
its ephemeral checkout before generation; it does not commit or require a
second tracked site configuration.

A small existing-workspace-compatible configuration step may update the nested
theme configuration for a named target (`preview` or `production`). It must set
developer mode explicitly and leave unrelated YAML values unchanged. The
preview target disables CDN use, while the production target preserves CDN use.

### Generate every deployment from the workspace site

Each deployment workflow checks out the monorepo at its normal root, installs
the workspace once with the frozen lockfile, builds the root theme assets, links
the theme into `dev/site/themes/redefine`, applies the target mode, and runs
Hexo generation from `dev/site`.

The existing PR preview artifact/deploy split remains a valid deployment
boundary. Branch preview and production jobs may deploy directly from the
generated site, but none may clone the external repository or install the theme
as a nested package.

### Preserve the CDN split

Local development and all non-production previews generate and serve assets from
the checked-out theme. Production generation keeps the existing published CDN
behavior, so the production workflow must continue to run only when the
corresponding versioned theme assets are available.

### Freeze the external repository

After the migration is merged, the standalone demo repository is no longer a
workflow input. Its README may identify the monorepo's `dev/site` path as the
maintained source, but no mirror or push-back automation is introduced.

## Risks / Trade-offs

- **[Risk]** The external configuration contains production analytics, comments,
  injection, and CDN settings that may not be appropriate for local work.
  → **Mitigation:** Reconcile those values explicitly and keep local developer
  mode/CDN settings distinct from deployment overrides.
- **[Risk]** Content collisions can silently replace useful regression coverage.
  → **Mitigation:** Review colliding paths as a named migration step and retain
  only intentional pages.
- **[Risk]** Production CDN assets can lag the checked-out theme version.
  → **Mitigation:** Preserve the current production ordering and verify the
  generated asset URLs against the published version.
- **[Risk]** Removing the external clone changes the repository used by existing
  Vercel setup or operators.
  → **Mitigation:** Keep the generated output directory and deployment action
  contract stable, and update the old repository README before freezing it.

## Migration Plan

1. Reconcile external and embedded demo configuration and content into
   `dev/site`, retaining the current workspace dependency model.
2. Add the deployment-mode configuration step and update all preview and
   production workflows to use the local site.
3. Update English and Chinese developer guidance and the frozen repository
   pointer.
4. Generate the site in local/developer, preview, and production-like modes;
   verify asset paths, CDN behavior, and generated output.
5. Freeze or archive the external repository after the monorepo deployment is
   confirmed.

Rollback is a source-level revert of the migration and workflow changes. The
external repository remains available as a frozen source snapshot during the
transition.

## Open Questions

- Whether the external repository should receive a final README-only pointer
  commit or simply be archived without changes.
- Whether production CDN availability should be checked automatically before
  the production deployment proceeds.
