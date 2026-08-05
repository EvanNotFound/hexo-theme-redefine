## Context

The published theme is installed as an npm package, while the repository is a
pnpm workspace containing the theme, a private Hexo demo site, and the docs
site. The root `pnpm dev` script owns the local preview flow: it cleans demo
state, links the current theme checkout into `dev/site/themes/redefine`, starts
Hexo, and watches Tailwind CSS. The current public docs predate this workflow
and still present Git as an end-user installation method.

The docs package requires bilingual parity. The Chinese pages remain the
canonical wording source, with English pages matching their meaning and
structure.

## Goals / Non-Goals

**Goals:**

- Make npm and pnpm the only documented end-user installation and update
  methods.
- Keep README files concise by linking to the developer guide for contributor
  setup.
- Describe the repository-root pnpm workflow, demo-site layout, build commands,
  and generated files accurately in both developer locales.
- Keep Git guidance where it is needed for contributor source checkout.

**Non-Goals:**

- Change the theme package, runtime behavior, scripts, dependencies, or release
  workflow.
- Remove Git from contribution mechanics.
- Rewrite unrelated user documentation or package-plugin installation examples.

## Decisions

### Use registry tabs for public docs

The Quick Start and migration pages will use existing `<Tabs>` and `<Tab>`
components for `npm` and `pnpm`. Installation will use `npm install
hexo-theme-redefine@latest` and `pnpm add hexo-theme-redefine@latest`; updates
will use the npm install command and `pnpm update hexo-theme-redefine --latest`.
This preserves both supported package-manager entry points while removing the
obsolete Git installation path.

### Keep README development sections link-only

Each README will retain a short contribution pointer and link to
`https://redefine-docs.ohevan.com/developer`. Local commands and workflow
details will live in the docs site so they do not drift across four copies.

### Document the existing scripts directly

The developer guide will describe the commands already defined in the root
`package.json`: `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm clean`,
`pnpm run build`, `pnpm run build:css`, and `pnpm run build:js`. It will identify
`source/css/tailwind.source.css` and source JavaScript directories as editable
inputs, and `source/css/build/` and `source/js/build/` as generated outputs.

### Use repository-relative source paths

Developer documentation for repository work will refer to `source/`,
`scripts/`, and `dev/site/` directly. The generated link under
`dev/site/themes/redefine/` will be described as local runtime state rather
than as the primary source location.

## Risks / Trade-offs

- [Existing external links may still point to old installation examples] ->
  Update all matching README and docs pages found in the repository, while
  leaving unrelated plugin dependency examples unchanged.
- [English and Chinese pages could drift] -> Update paired files together and
  verify matching commands, paths, and section structure.
- [Contributors may mistake package installation for source development] ->
  Keep the developer page explicit that its commands run from the repository
  root and that the local demo site is under `dev/site`.

## Migration Plan

1. Update the three README variants and paired public installation/migration
   pages.
2. Rewrite paired developer landing pages and correct paired JavaScript guide
   paths.
3. Run the docs lint and typecheck commands, then inspect the final search for
   obsolete end-user Git installation instructions.

There is no runtime migration or rollback step; reverting the documentation
commit restores the previous wording.

## Open Questions

None. The installation methods, contributor Git boundary, README scope, and
developer-guide scope have been decided.
