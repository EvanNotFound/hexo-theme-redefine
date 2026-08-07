## 1. Establish the visual token contract

- [x] 1.1 Replace the duplicated light/dark shadow and border color variables with canonical `--rd-border` and `--rd-shadow` values in the theme CSS, preserving appropriate light and dark results.
- [x] 1.2 Update `source/css/tailwind.source.css` to map the canonical tokens into `border-rd-border` and `shadow-rd`, remove the retired `shadow-redefine*` and shadow-color mappings, and leave Tailwind's built-in shadow utilities unchanged.
- [x] 1.3 Remove `global.hover.scale` and `global.hover.shadow` from `_config.yml` and `dev/site/_config.redefine.yml`, and update the English and Chinese global configuration documentation to remove the retired settings.

## 2. Remove the shared effect helpers and migrate Stylus consumers

- [x] 2.1 Remove `redefine-container`, `hover-style`, and the `.redefine-box-shadow*` utilities while retaining responsive helpers and unrelated shared utilities.
- [x] 2.2 Replace every `redefine-container` call with explicit component-owned spacing, background, radius, box-sizing, and margin rules without implicit shadow or scale behavior.
- [x] 2.3 Convert flat-shadow consumers in buttons, content surfaces, code blocks, tables, recommended articles, avatars, category cards, masonry images, and comment styles to `border: 1px solid var(--rd-border)` or no decoration where an existing border already provides the edge.
- [x] 2.4 Review regular-shadow consumers and apply `var(--rd-shadow)` only to genuine floating tools or overlays; remove regular hover and inset shadow states from ordinary cards, controls, images, and content surfaces.
- [x] 2.5 Remove Redefine-owned hover and active transforms and shadow transitions while preserving semantic color/background/focus states and unrelated responsive, animation, image-viewer, and third-party transforms.

## 3. Migrate Tailwind and generated markup consumers

- [x] 3.1 Replace `shadow-redefine*`, `redefine-box-shadow*`, `shadow-shadow-color-*`, and related hover utility classes in EJS templates with `border-rd-border`, `shadow-rd`, or no utility according to the component classification.
- [x] 3.2 Update JavaScript- and script-generated markup, including callouts and image-viewer UI, to use the new semantic utilities without retired hover variants.
- [x] 3.3 Remove obsolete Redefine shadow class references from demo fixtures and verify no active source consumer still depends on the retired token names.

## 4. Validate the unified system

- [x] 4.1 Run `pnpm run build` and confirm the theme CSS and JavaScript build successfully without committing generated build output.
- [x] 4.2 Run a focused source search for retired container, hover, shadow, and configuration names, then confirm the new `--rd-border`, `--rd-shadow`, `border-rd-border`, and `shadow-rd` paths are represented in both Stylus and Tailwind consumers.
