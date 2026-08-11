## Why

The theme currently maintains fixed spacing and radius scales alongside Tailwind, producing fractional spacing, unexpectedly large corner utilities, inconsistent route-shell elevation, and unnecessary visual rules. Its EJS render path also repeats page classification and stores executable partial paths in helper data, making page ownership and template flow harder to follow than the behavior requires.

## What Changes

- Remove the fixed `--spacing-unit`, `--margin-spacing-unit`, custom Tailwind radius scale, deprecated radius aliases, and unused competing visual tokens; use Tailwind's default spacing and radius utilities for theme-owned layout.
- Apply concentric-corner geometry where nested surfaces share a visible corner, use parent clipping for edge-touching media, use `rounded-2xl` for standalone framed components, and keep article-content components one scale below them at `rounded-xl` while retaining the configurable article image radius with a `12px` default.
- Give article, standard page, archive, and equivalent route-level content panels the same structural border, `rounded-2xl` radius, and static Redefine shadow on non-mobile layouts; flatten those shells consistently when they become edge-to-edge on mobile.
- Keep `--rd-border` as the structural border color and reserve non-Redefine borders for semantic states, translucent banner controls, and third-party plugin internals.
- **BREAKING** Resolve custom page templates only from the documented `template` front-matter field; remove legacy `type` and title-based custom-page inference.
- Replace dynamic EJS partial-path dispatch with one page-kind resolver and an explicit router, retain one reusable route-level page panel, flatten singleton layout directories, and organize rendered fragments under `components/` and route-owned content under `pages/`.
- Update bilingual migration, page-template, configuration, and contributor guidance together with canonical demo fixtures.

## Capabilities

### New Capabilities

- `page-rendering`: Defines explicit page-kind resolution, template-only custom page selection, route dispatch, and EJS ownership boundaries.

### Modified Capabilities

- `theme-styles`: Replaces custom spacing and radius scales with Tailwind defaults and defines the theme's concentric-corner and plugin-ownership rules.
- `theme-visual-system`: Expands static depth from floating UI to consistent route-level content shells while preserving structural border semantics.
- `article-prose`: Defines the smaller default geometry for article media and nested writing modules without changing their prose behavior.

## Impact

- Theme CSS and runtime variables under `styles/**` and `scripts/helpers/style-helpers.js`.
- Route shells, article modules, generated writing markup, and other theme-owned EJS or script-generated components.
- EJS entry points and partials under `layout/**`, plus page helper and page-dependent asset selection logic under `scripts/**`.
- The default article image radius in `_config.yml` and `dev/site/_config.redefine.yml`.
- Canonical demo front matter and bilingual page-template, migration, configuration, and developer documentation.
- Existing sites that rely on undocumented title matching or legacy `type` values for custom page templates must migrate to `template`.
