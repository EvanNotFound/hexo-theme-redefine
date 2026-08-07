## Why

Redefine's styles are split between Stylus and Tailwind without a consistent
ownership rule, leaving page markup with long styling-only class names, hidden
wildcard import ordering, and Stylus errors that are not checked by the normal
asset build. The theme needs a simpler system that keeps Tailwind's development
speed, preserves configuration behavior, and removes the downstream Stylus
renderer requirement.

## What Changes

- Define Tailwind as the default for ordinary styling in theme-owned markup,
  reusable EJS templates as the owner of repeated UI, and native CSS as the
  owner of global, rendered, complex, and third-party content.
- Organize native CSS with direct names under `base`, `components`, and
  `plugins`, using short component names and no BEM or vague architectural
  categories.
- Replace styling-only wrapper classes with inline utilities; use IDs for
  unique JavaScript targets and semantic or `data-*` attributes for repeated
  behavior and state.
- Replace Stylus `hexo-config()` styling with validated CSS custom properties,
  markup state, and conditionally loaded prebuilt plugin styles while preserving
  existing theme configuration behavior.
- Build and publish the theme CSS so consuming sites do not need to install a
  replacement stylesheet renderer.
- Add a CSS verification path that compiles owned styles and generates the demo
  site so syntax and configuration failures are caught before release.
- **BREAKING** Remove undocumented internal DOM class names in the next major
  release without compatibility aliases.
- **BREAKING** Remove the Stylus source entry, renderer filter, and demo Stylus
  renderer dependency after all owned styles have migrated.

## Capabilities

### New Capabilities

- `theme-styles`: Defines ownership, naming, reuse, behavior hooks, runtime
  configuration, and migration requirements for theme styling.
- `style-build`: Defines generated CSS assets, optional plugin styles,
  development checks, publication, and renderer-free consumption.

### Modified Capabilities

None.

## Impact

- Affects `source/css/**`, Tailwind source configuration, theme templates under
  `layout/**`, generated tag markup under `scripts/**`, and JavaScript selectors
  under `source/js/**`.
- Adds a native CSS source tree and changes the CSS build, watch, demo generation,
  package contents, and stylesheet loading path.
- Replaces Stylus-derived configuration values with a Hexo helper/template
  bridge while keeping current `_config.yml` options and visible behavior.
- Removes `hexo-renderer-stylus` from the demo after migration; end users gain no
  new dependency or setup step.
- Requires aligned English and Chinese contributor documentation and updated
  repository guidance.
