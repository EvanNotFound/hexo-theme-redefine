## 1. Build Tooling

- [x] 1.1 Add esbuild as a direct root development dependency and update the
  lockfile without changing unrelated workspace dependencies.
- [x] 1.2 Replace the per-file Terser build with an esbuild configuration that
  targets modern browsers, emits a minified ES module application entry, writes
  source maps, emits relative lazy chunks, and builds the standalone APlayer
  and HBE entrypoints while preserving vendor-library copying.
- [x] 1.3 Update the root build commands so the normal production build
  coordinates Tailwind CSS and JavaScript generation while retaining focused
  `build:css` and `build:js` commands and clear failure reporting.

## 2. Runtime Loading

- [x] 2.1 Refactor the application entry imports so large optional features are
  dynamically loaded only when their configuration or page content requires
  them, while keeping core initialization synchronous.
- [x] 2.2 Make lazy feature initialization safe across Swup navigation by
  checking page-scope signals after imports resolve and routing asynchronous
  import failures through the existing error handling behavior.
- [x] 2.3 Align layout helpers and the encryption generator with the new
  production and developer entrypoint paths, including the standalone APlayer
  and HBE outputs and relative CDN chunk loading.

## 3. CSS And Development Workflow

- [x] 3.1 Extend the existing Stylus renderer filter so developer mode keeps
  readable output and normal production rendering enables Stylus compression
  without changing `hexo-config()` behavior or conditional imports.
- [x] 3.2 Update the canonical development orchestration to serve source
  JavaScript modules without requiring generated JavaScript output, while
  retaining the Tailwind watcher and Hexo-rendered Stylus workflow.
- [x] 3.3 Update root and bilingual developer guidance to document source-mode
  development, coordinated production builds, lazy generated chunks, and
  compressed production Stylus output.

## 4. Publication Integration

- [x] 4.1 Update preview, release, and package validation workflows so generated
  application entries, lazy chunks, standalone plugins, source maps, and vendor
  assets are built and included at the publication boundary.
- [x] 4.2 Verify CDN and npm packaging inputs use the complete generated output
  for the current version without altering or regenerating assets from older
  releases.

## 5. Verification

- [x] 5.1 Run the focused JavaScript and CSS builds and confirm the generated
  output contains the application entry, expected chunks, standalone scripts,
  source maps, and minified stylesheets.
- [x] 5.2 Generate the demo site in developer and production-like modes and
  verify source module loading, lazy feature loading, compressed Stylus output,
  Swup navigation, APlayer, and encrypted-page HBE behavior.
- [x] 5.3 Inspect the package dry-run and relevant CI checks to confirm the
  generated release asset set is complete and no generated files are added to
  source control.
