## Context

Redefine currently loads a Hexo-rendered `source/css/style.styl` stylesheet and
a separately prebuilt Tailwind stylesheet. The Stylus entry imports 59 files
through a mix of explicit and wildcard `@require` statements, reads theme
configuration through `hexo-config()`, and conditionally includes comment,
syntax, sidebar, and player styles. Tailwind scans EJS templates and generated
markup under `scripts/**`, but many components split related properties between
inline utilities and long Stylus-only selector names.

Hexo ignores underscore-prefixed theme assets, which explains the current
`_partials` and `_modules` directories but does not give those directories a
clear ownership model. The normal root build compiles Tailwind and JavaScript;
Stylus is compiled only during Hexo rendering. Published builds already create
ignored output under `source/css/build/` before packaging.

The migration must preserve all supported `_config.yml` behavior, light and
dark mode tokens, conditional plugin loading, CDN paths, development watching,
and the generated demo. Existing users must not install a new stylesheet
renderer. Removing undocumented internal class names is reserved for a major
release.

## Goals / Non-Goals

**Goals:**

- Give Tailwind, templates, native CSS, and browser JavaScript distinct and
  documented responsibilities.
- Replace long styling-only wrapper names with inline utilities and direct
  behavior hooks.
- Organize authored CSS under simple `base`, `components`, and `plugins`
  directories with explicit imports.
- Preserve theme configuration through CSS custom properties, markup state,
  and selected prebuilt plugin styles.
- Produce publishable CSS without requiring a stylesheet renderer in a
  consuming Hexo site.
- Make the normal verification path catch CSS syntax and configuration errors.

**Non-Goals:**

- Redesigning the theme or changing existing configuration defaults.
- Migrating to SCSS, Sass, Less, CSS Modules, or another Hexo renderer.
- Recreating component classes with Tailwind `@apply`.
- Bundling every optional comment system, player mode, and syntax theme into the
  core stylesheet.
- Preserving undocumented internal class names after the major release.

## Decisions

### Use one ownership rule for every style

Tailwind will own ordinary layout and appearance in markup controlled by the
theme. Repeated UI will be reused through EJS partials or generated-markup
helpers rather than through new CSS abstraction classes. Native CSS will own
document-wide rules, `.markdown-body`, complex nested or pseudo-element rules,
and markup controlled by third-party plugins.

Unique JavaScript targets will use IDs. Repeated controls and state will use
existing semantics such as `role` and `aria-*` or focused `data-*` attributes.
CSS will not style IDs. Classes that remain CSS-owned will use short concrete
names such as `article`, `tabs`, `tab-panel`, `callout`, `search`, and
`markdown-body`; BEM and unnecessary `container`, `wrapper`, or `inner` suffixes
will not be introduced.

This makes the element's purpose visible at its source and prevents `@apply`
from rebuilding the previous hidden class system. A long utility list that
occurs once remains inline. Identical repeated markup is extracted to a
template or helper.

### Keep authored native CSS outside Hexo's source processing

The final source structure will be shallow and direct:

```text
styles/
  theme.css
  base/
    variables.css
    global.css
    animations.css
    prose.css
  components/
    page.css
    navbar.css
    footer.css
    home.css
    article.css
    archive.css
    categories.css
    tags.css
    search.css
    image-viewer.css
    tabs.css
    folding.css
    buttons.css
    callouts.css
  plugins/
    comments/
    aplayer.css
    code-themes/
    odometer.css
```

`styles/theme.css` will be the explicit core entry and will retain Tailwind's
EJS and script source scanning. It will import project CSS in a visible order
using the existing `theme`, `base`, `components`, and `utilities` cascade
layers so Tailwind utilities can intentionally override component defaults.
Only meaningful owners remain separate; tiny related rules may be combined,
while copied or adapted plugin CSS stays isolated.

The authored `styles/` directory will be included in the npm package for source
inspection and customization. Generated output will remain under
`source/css/build/`, ignored by Git and created before publication.

### Move configuration through a focused Hexo style helper

A dedicated helper under `scripts/helpers/` will read the merged theme config,
normalize supported values, and emit a small style block containing CSS custom
properties for configurable colors, dimensions, type, spacing, radii, and
mode-aware values. Values that can alter CSS syntax will be validated or
escaped before output.

Boolean and enum choices that change selectors will use existing template
conditions or focused attributes on the nearest stable element. Examples
include code style, image alignment, heading spacing, tag display mode, and
player mode. The current light/dark classes remain the mode selector.

Optional comments, APlayer styling, and code themes will be prebuilt as
separate assets and selected through the existing `renderCSS` helper. This
preserves current conditional behavior without compiling against each
consumer's config or shipping every plugin in the core stylesheet.

### Introduce native CSS beside Stylus, then remove Stylus

The migration will start by replacing wildcard Stylus imports with an explicit
manifest and adding a full CSS check. A generated native stylesheet will then
load beside `style.css`. Rules will move one owner at a time; the matching
Stylus rule will be removed in the same task so one property does not have two
owners.

Configuration variables move before the rules that consume them. Theme-owned
components move before copied plugin CSS. During the transition, the stylesheet
order remains explicit and generated output is compared against the baseline
for unintended changes.

After no active source uses Stylus, the layout stops loading `css/style`, the
Stylus renderer filter and demo dependency are removed, and development and
production both load the generated theme CSS plus selected plugin assets.

### Treat internal DOM cleanup as a major-release change

Undocumented styling-only names such as `main-content-container`,
`article-content-container`, and `page-template-container` will be removed as
their styling and behavior move to the new owners. They will not remain as empty
aliases. Documented content scopes and required third-party classes remain.

### Reject a direct SCSS replacement

SCSS would improve syntax familiarity but would retain a stylesheet renderer,
introduce a new configuration bridge, and rely on a dated Hexo adapter using
Sass's deprecated legacy JavaScript API. Keeping Stylus permanently would not
resolve its syntax and build-check weaknesses. Native CSS through the existing
Tailwind build removes the renderer rather than replacing it.

## Risks / Trade-offs

- **Cascade changes during mixed-mode migration** -> Keep imports explicit,
  remove old and new ownership together, and compare generated CSS and demo
  pages after each migration group.
- **Unsafe or malformed user configuration in inline CSS** -> Normalize each
  supported value type and escape emitted text instead of interpolating raw
  configuration into arbitrary declarations.
- **A plugin loses styles when conditional imports disappear** -> Build named
  plugin entries and verify every supported comment system, selected code
  themes, and APlayer modes through representative demo configurations.
- **Published packages omit generated assets** -> Build before packing and
  inspect package contents as part of release verification.
- **User custom CSS targets removed internal names** -> Announce the DOM cleanup
  as a major-release breaking change and publish a concise old-to-new migration
  note without retaining aliases.
- **The migration becomes an unreviewable rewrite** -> Work in ordered groups
  with behavior-preserving checks and stop each group after its owner has moved.

## Migration Plan

1. Add CSS verification and replace wildcard Stylus imports with the current
   explicit order; remove duplicate mixin definitions without changing output.
2. Add `styles/theme.css`, update build/watch/package paths, and load its
   generated output beside the compatibility Stylus stylesheet.
3. Add the style-config helper and move shared variables, global rules,
   animation, and prose into native CSS.
4. Migrate theme-owned page and component markup to Tailwind, reusable partials,
   short CSS scopes, and ID/data/semantic JavaScript hooks.
5. Convert optional plugin and code-theme styles into separately built assets
   and preserve conditional loading.
6. Remove all remaining Stylus inputs, its renderer integration and dependency,
   and the compatibility stylesheet link.
7. Update bilingual contributor guidance, run the configuration/demo matrix,
   inspect the npm package, and record the major-release DOM migration notes.

Rollback is phase-local until step 6: restore the migrated owner's Stylus import
and remove its native import. The final removal occurs only after the full demo
and package checks pass.

## Open Questions

None.
