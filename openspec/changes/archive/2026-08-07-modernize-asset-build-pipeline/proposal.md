## Why

The theme's browser JavaScript is authored as ES modules, but the current build
minifies each file independently and leaves the browser to load the full local
module graph. CSS generation is also split between a Tailwind CLI command and
Hexo's configuration-dependent Stylus renderer, while development currently
builds JavaScript once and watches only Tailwind. The project needs a simpler,
modern asset pipeline that improves delivery performance without replacing the
Stylus authoring model or affecting immutable assets from older releases.

## What Changes

- Replace the custom per-file JavaScript minification flow with an esbuild-based
  browser build targeting modern browsers.
- Bundle the local application entrypoint and emit lazy-loaded chunks for large
  optional features when they are not needed by a page.
- Keep vendor libraries and independently rendered plugin scripts compatible
  with their existing conditional loading and CDN behavior.
- Keep `scripts.ejs` as a small vendor bootstrap and move page behavior,
  including Odometer initialization, into the browser lifecycle.
- Compress the configuration-dependent Stylus stylesheet for production output
  while keeping developer-mode CSS readable.
- Keep developer mode serving source JavaScript modules directly and continue
  watching Tailwind CSS for fast source feedback.
- Coordinate CSS and JavaScript production builds through the repository's
  normal build commands and keep generated output out of source control.
- Preserve versioned CDN isolation so output changes in a new release cannot
  alter assets served by previous releases.

## Capabilities

### New Capabilities

- `browser-asset-build`: Defines modern production generation for bundled,
  minified JavaScript, optional chunks, Tailwind CSS, and compressed Stylus CSS.
- `theme-development-mode`: Defines source-module development behavior,
  Tailwind watching, and the relationship between source and production assets.

### Modified Capabilities

<!-- No existing capability requirements cover this build pipeline. -->

## Impact

- Root package scripts and development orchestration.
- JavaScript build configuration and generated `source/js/build/` contents.
- Stylus renderer filter behavior under `scripts/filters/`.
- Layout helpers and encryption asset generation where independently built
  JavaScript entrypoints are referenced.
- Root development dependencies and the lockfile.
- Production, preview, and package publication checks that consume generated
  theme assets.
- No changes to historical npm or CDN releases; new releases may contain a
  different internal asset layout within their versioned directory.
