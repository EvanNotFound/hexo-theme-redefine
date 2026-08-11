## Why

Redefine's color variables use overlapping ordinal names such as `first`, `second`, `third`, and `fourth`, so contributors cannot tell whether a value is intended for a background, component state, border, or text. The theme needs a compact numbered foundation with documented ranges, similar in clarity to Geist's color scales but limited to the roles Redefine actually uses.

## What Changes

- Introduce a small mode-aware RD color foundation: two page background levels, three low-contrast gray levels for component states, one gray-alpha border level, and two high-contrast gray levels for text and icons.
- Use `--rd-background-100` and `--rd-background-200` for primary and alternate page backgrounds; use `--rd-gray-100` through `--rd-gray-300` for neutral component backgrounds and interaction states.
- Replace `first`, `second`, `default`, and `third` text colors with `--rd-gray-1000` for primary text/icons and `--rd-gray-900` for secondary text/icons.
- **BREAKING** Remove `--rd-border` and use `--rd-gray-alpha-400` directly for structural borders; retain `--rd-shadow` because it owns a complete shadow treatment rather than aliasing a scale value.
- Add `--rd-primary-text`, derived from the configurable primary color, for readable text and icons placed on primary-colored backgrounds.
- **BREAKING** Remove the retired ordinal background/text variables, numbered transparent-background variables, and unused link, copyright, inverse-text, and home-banner icon aliases without compatibility aliases.
- Expose the focused RD scale through Tailwind's inline theme bridge while preserving Tailwind's built-in color and shadow scales.
- Update core markup, rendered-content CSS, browser-generated markup, bundled plugin adapters, tests, and bilingual migration/color guidance together.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `theme-visual-system`: Replace the canonical border alias and ordinal color variables with a compact numbered RD background/gray foundation, direct text levels, configurable primary text contrast, and the existing complete shadow token.
- `theme-styles`: Require runtime-backed RD colors to use Tailwind's inline theme bridge and remove the retired color API consistently without changing supported color configuration names.

## Impact

- Mode-aware variables and Tailwind mappings in `styles/base/variables.css` and `styles/theme.css`.
- Config-derived primary color output in `scripts/helpers/style-helpers.js`.
- Theme-owned EJS, native CSS, script-generated markup, and browser-generated class strings that consume current background, text, and border names.
- Bundled APlayer and comment-system adapters that map vendor UI to Redefine colors; vendor-owned status and syntax colors remain unchanged.
- Focused helper and canonical generation tests under `tests/`.
- English and Chinese color and major-version migration documentation for sites with custom CSS that references retired variables.
