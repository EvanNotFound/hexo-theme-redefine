## Context

The root theme is a published Hexo theme rather than a standalone web
application. EJS templates are rendered by Hexo, `style.styl` is compiled by
`hexo-renderer-stylus` against the consuming site's theme configuration, and
Tailwind CSS is built separately from `source/css/tailwind.source.css`.

The browser code under `source/js/` is already written as ES modules with
`source/js/main.js` as the application entrypoint. The current JavaScript build
minifies each file independently with Terser, copies vendor libraries, and
leaves the browser to resolve the application's module graph. The template
helpers select source paths in developer mode and generated paths in production
mode. Some scripts, especially the blog-encryption plugin, are emitted directly
by Hexo generators rather than by the normal layout helper.

The CDN URLs are versioned and immutable. A new release may therefore change
the generated asset layout as long as that release contains all of its required
files and relative chunk URLs resolve within the same version directory.

## Goals / Non-Goals

**Goals:**

- Use a maintained modern browser bundler for the theme's own JavaScript.
- Target current evergreen browsers without legacy transpilation or polyfills.
- Bundle the application entrypoint and lazy-load large optional features.
- Keep optional vendor libraries as separately rendered assets.
- Compress Stylus output for production while preserving readable developer CSS.
- Serve source JavaScript modules in developer mode.
- Keep one clear production build entrypoint for CSS and JavaScript.
- Preserve npm packaging, Hexo generation, and versioned CDN publication.

**Non-Goals:**

- Do not migrate Stylus authoring to Tailwind, PostCSS, or another preprocessor.
- Do not convert the theme to Next.js, React, Vite application pages, or an SPA.
- Do not bundle every vendor library into the application bundle.
- Do not change the behavior or assets of already published theme versions.
- Do not redesign the theme's runtime lifecycle or Swup integration beyond what
  is required for safe asynchronous feature loading.

## Decisions

### Use esbuild for the browser application

Add esbuild as a direct root development dependency and use its JavaScript API
for the application build. Build `source/js/main.js` as a browser ES module
with minification, external source maps, and code splitting enabled. Use a
modern target such as `es2020`; the exact target should be kept in one build
configuration rather than spread across scripts.

esbuild is preferred over Next.js because the theme has no application server
or React component tree. It is preferred over Vite because the required
development server is Hexo and the theme must render against Hexo's runtime
configuration. Rollup remains viable, but would add more configuration without
an identified need for its plugin ecosystem.

### Split only optional application features

Keep core lifecycle, utility, navigation, and page initialization code in the
main bundle. Replace static imports for large or configuration/page-dependent
features with dynamic imports so esbuild emits chunks for them. Candidate
features include image viewing, local search, Mermaid, Masonry, Typed, and
Pangu.

Each lazy initializer must check its page `AbortSignal` after the import
resolves and before it attaches handlers or mutates the DOM. This prevents a
chunk requested during one Swup visit from initializing after navigation to a
different page. Import failures must be reported through the existing runtime
error handling path without preventing unrelated initialization.

### Preserve vendor and standalone entry boundaries

Files under `source/js/libs/` remain copied and independently rendered because
they are optional, expose globals, and participate in the theme's CDN settings.
Build the standalone APlayer script separately as a non-module browser entry.
Build the HBE module separately as an ES module because the encryption filter
emits and imports that path directly.

The normal generated application entry remains addressable by the existing
layout helper. Lazy chunks are emitted under the generated JavaScript build
directory and use relative URLs, allowing local paths and versioned CDN paths
to resolve to the same release directory.

### Keep vendor bootstrap separate from page initialization

`layout/components/scripts.ejs` remains responsible for emitting the application
entry and the global vendor scripts whose browser globals are consumed by the
application. The module entry is deferred by the browser, so the classic vendor
scripts emitted after it are available before the application module executes.

Page behavior SHALL remain in the application lifecycle rather than in inline
template scripts. In particular, `source/js/tools/runtime.js` SHALL initialize
Odometer after the DOM and vendor script are available, and the footer SHALL not
attempt to construct Odometer before `scripts.ejs` has loaded its vendor file.

The globally emitted Moment script does not need Swup re-evaluation; the
application's page lifecycle handles essays after navigation. MiniMasonry keeps
its reload marker because it can be page-specific and may not have been emitted
on the initial page.

### Apply Stylus compression in the renderer filter

`hexo-renderer-stylus` reads `hexo.config.stylus.compress`, which is the site
configuration and cannot be reliably supplied by the theme's `_config.yml`.
Initialize that renderer configuration from `hexo.config.theme_config` in the
existing Stylus integration before rendering begins. Developer mode leaves CSS
readable; normal production mode enables compression. The existing `url-for`
definition and all `hexo-config()`-based conditional imports remain unchanged.

### Keep source modules in developer mode

Developer-mode template helpers continue to render paths under `source/js/`.
The canonical demo configuration already enables developer mode, so the normal
`pnpm dev` flow does not need a production JavaScript build merely to serve the
demo. Tailwind remains watched by the existing Tailwind CLI process, and Hexo
continues to render Stylus with the active demo-site configuration.

Production-like verification uses the normal build and generated-site workflow
with developer mode disabled. This keeps source debugging fast while retaining
an explicit check for bundled output.

### Coordinate production builds without replacing Tailwind CLI

Retain Tailwind CSS v4 CLI as the CSS compiler. Move the root build flow to a
small coordinator that runs the Tailwind build and esbuild build as the two
owned asset steps, reporting failures as one build failure. Keep focused
`build:css` and `build:js` commands available for contributors and CI. The
coordinator may run independent steps concurrently, but must wait for both
results before succeeding.

## Risks / Trade-offs

- **[Risk]** A lazy chunk could initialize after a Swup navigation.
  → **Mitigation:** Check the current page signal after every dynamic import
  resolves and before initialization.
- **[Risk]** Relative chunk URLs could fail when assets are served from a CDN.
  → **Mitigation:** Emit chunks beside the entrypoint, retain relative imports,
  and verify both local generated output and a versioned CDN-shaped path.
- **[Risk]** A standalone generated HBE path could diverge from the path emitted
  by the encryption generator.
  → **Mitigation:** Make the generator select source output in developer mode
  and built output otherwise, then generate an encrypted demo page.
- **[Risk]** Compression could hide a Stylus rendering regression.
  → **Mitigation:** Validate representative theme configurations and compare
  compressed output's rendered behavior in the generated demo.
- **[Trade-off]** Bundling improves request and cross-module optimization, but
  asynchronous feature loading adds lifecycle complexity.
  → **Mitigation:** Restrict lazy loading to large optional features and keep
  core initialization synchronous.
- **[Risk]** New generated chunks may not be included by a release asset map.
  → **Mitigation:** Validate package contents and publication workflow inputs
  after a production build.

## Migration Plan

1. Add the esbuild dependency and replace the custom JavaScript build with
   configured application and standalone entry builds.
2. Introduce lazy application imports with page-scope cancellation checks.
3. Update the HBE generator path selection and keep the layout helper's
   developer/production behavior aligned with the new output.
4. Enable production Stylus compression through the renderer filter.
5. Coordinate CSS and JavaScript production builds while retaining focused
   component commands.
6. Update development, CI, packaging, and contributor guidance as required by
   the new generated output.
7. Build the theme, generate the demo site, inspect package contents, and verify
   representative source-mode and production-mode behavior.

Rollback is a source change rollback: restore the previous JavaScript builder,
remove the lazy imports and compression override, and use the previous build
commands. Existing published versions remain immutable throughout the change.

## Open Questions

There are no remaining product-level decisions. Exact lazy boundaries and chunk
names are implementation details, provided the required optional features are
not eagerly loaded and the generated assets remain publishable.
