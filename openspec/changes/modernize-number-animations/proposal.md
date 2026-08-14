## Why

The footer runtime still depends on Odometer 0.4.6, a legacy global script and
plugin stylesheet that lack modern motion-preference and accessibility behavior.
The theme also updates the toolbar reading percentage as plain text, creating an
opportunity to use one maintained numeric animation primitive across both
features instead of retaining a single-purpose vendor asset.

## What Changes

- Replace the legacy Odometer script and stylesheet with the maintained,
  framework-independent Number Flow package.
- Animate footer runtime values and the toolbar reading percentage with the same
  short numeric transition while respecting reduced-motion preferences.
- Keep the top reading-progress bar continuous and update the animated toolbar
  percentage only when its rounded integer value changes.
- Load the numeric animation code only when footer runtime or toolbar percentage
  display is enabled, and preserve both features across Swup page replacement.
- Bundle and watch an unminified development application so direct npm imports
  resolve locally during `pnpm dev`, with manual browser refresh after changes.
- Keep build and watch helpers internal, expose outcome-oriented root commands,
  and use one `check` command per workspace package for contributor validation.
- Make root cleanup remove all generated theme and demo state and ensure npm
  publication builds through the standard package lifecycle.
- Remove the Odometer global bootstrap, source asset, and plugin stylesheet.
- Update generated-output coverage and bilingual user/developer documentation
  for the new shared behavior and asset ownership.

## Capabilities

### New Capabilities

- `numeric-motion`: Defines animated footer runtime and toolbar reading-progress
  numbers, including reduced-motion and lifecycle behavior.

### Modified Capabilities

- `browser-asset-build`: Replaces the required Odometer global asset path with a
  conditionally bundled Number Flow dependency used by the application runtime.
- `theme-development-mode`: Replaces direct source-module serving with a watched,
  unminified esbuild application and stable development chunks.
- `canonical-demo-site`: Loads the generated development application during
  `pnpm dev` while retaining local theme assets.
- `docs-guidance`: Documents JavaScript watching, development output, and manual
  browser refresh through the simplified command workflow in both locales.
- `artifact-publication`: Builds through the standard publish lifecycle and
  verifies the current generated CSS path.

## Impact

The change affects footer and side-tools markup, browser runtime initialization,
scroll percentage updates, the JavaScript dependency graph and lockfile, and
the local development orchestrator, build paths, and generated-output tests. It removes
`source/js/libs/odometer.min.js` and `styles/plugins/odometer.css`, adds Number
Flow to the root package, and updates the matching English and Chinese footer,
global settings, and developer asset guidance. Root and docs package scripts,
generated-state cleanup, and build/publication workflows are also aligned around
the simplified command interface. Existing theme configuration keys and the
continuous top progress bar remain unchanged.
