## Why

Redefine's shared container and hover helpers combine layout, scaling, hover shadows, and shadow-based borders into one implicit visual system. The four redefined shadow variants duplicate responsibilities, make the theme harder to reason about, and apply expensive blur/inset effects where a real border is clearer and more consistent.

This change establishes a small, semantic visual system with an actual border token, one optional static theme shadow, and no generic scaling or shadow hover effects.

## What Changes

- **BREAKING** Remove the `redefine-container` and `hover-style` styling features and replace their behavior with component-owned layout and interaction styles.
- **BREAKING** Remove `global.hover.scale` and `global.hover.shadow` from the theme configuration and bilingual configuration documentation.
- Replace flat/redefined shadow borders with a mode-aware `--rd-border` token and actual `border` declarations.
- Replace the regular, flat, hover, and inset redefined shadow variants with one static `--rd-shadow` token for surfaces that genuinely need depth.
- Expose the same visual tokens to Tailwind through namespaced aliases that generate `border-rd-border` and `shadow-rd` utilities without overriding Tailwind's built-in shadow scale.
- Remove generic hover scaling, hover shadow transitions, and active scale feedback from Redefine-owned controls; retain meaningful color, background, focus, and other non-shadow interaction states.
- Migrate Redefine-owned Stylus selectors, EJS templates, generated markup helpers, and JavaScript-generated Tailwind classes away from `redefine-*` shadow utilities.
- Remove obsolete shadow color variables, shadow utility classes, and duplicate Tailwind theme definitions once no Redefine-owned consumer requires them.
- Leave unrelated shadows and transforms owned by third-party integrations, image viewing, animations, or specialized component behavior unchanged.

## Capabilities

### New Capabilities

- `theme-visual-system`: Defines Redefine's semantic border and static shadow tokens, their light/dark behavior, Tailwind mappings, and the removal of generic scaling and hover shadow effects.

### Modified Capabilities

<!-- No existing capability specification covers this behavior. -->

## Impact

- Theme configuration: `_config.yml` and the demo override in `dev/site/_config.redefine.yml`.
- Theme CSS: shared color/theme tokens, responsive/style helpers, component layout styles, controls, content surfaces, and comment integrations owned by Redefine.
- Tailwind input and utility consumers in EJS templates, scripts, and browser-generated markup.
- English and Chinese global configuration documentation.
- Generated CSS must be rebuilt for validation but remains generated output and is not committed.
