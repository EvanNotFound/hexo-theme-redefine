## 1. Simplify Theme Geometry

- [x] 1.1 Remove the custom spacing variables and fractional multipliers, replace their layout call sites with Tailwind's default spacing utilities, align sticky and fixed navbar offsets on `--current-navbar-height`, and cover the removed variables in focused source/generated-output assertions.
- [x] 1.2 Remove authored radius namespace overrides and deprecated aliases, use `rounded-2xl` for route shells and standalone framed components, use `rounded-xl` for nested article modules and smaller defaults for inner controls, apply clipping or derived radii only to genuinely connected corners, change the article image-radius default to `12px` in theme and demo configuration, and cover representative outer and nested geometry.
- [x] 1.3 Apply the shared border, `rounded-2xl`, and `shadow-rd` treatment to framed route-level content, flatten border/radius/shadow together on edge-to-edge mobile layouts, keep nested surfaces border-only, and remove verified-unused competing visual variables and border fallback behavior after explicit border-color coverage is complete.

## 2. Make Page Rendering Explicit

- [x] 2.1 Replace partial-path page metadata with explicit built-in route kinds and template-only custom page resolution, add the literal page router and reusable page-panel component, preserve page content/comments/pagination/conditional assets, and add focused generation assertions for supported, unknown, and legacy custom-page inputs.
- [x] 2.2 Flatten reusable EJS fragments under `layout/components`, retain the cohesive comments group, inline the progress fragment and one-line home background, merge one-caller sidebar fragments, and update every partial, helper, script, and verification reference without changing behavior IDs or Swup boundaries.
- [x] 2.3 Flatten singleton route partials under `layout/pages`, keep only the cohesive home and post groups, adopt direct page and component names, render route-scoped archive posts, remove duplicate category comments and unused partial arguments, and delete superseded dispatch helpers and compatibility entries after canonical generation succeeds.

## 3. Migrate Fixtures And Documentation

- [x] 3.1 Convert canonical demo custom pages to documented `template` front matter, add or adjust fixtures needed to exercise every supported custom page kind and route-shell geometry, and confirm title-only or `type`-only pages no longer select a custom template.
- [x] 3.2 Update aligned English and Chinese page-template, configuration, migration, and developer guidance for template-only routing, Tailwind-owned spacing/radii, the `12px` image default, and the simplified EJS ownership model; update repository agent guidance only where contributor paths change.
- [x] 3.3 Complete the focused theme build and canonical configuration matrix, documentation lint and type checks, OpenSpec validation, and diff hygiene after the implementation and regression assertions pass.

## 4. Centralize Variables And Verification

- [x] 4.1 Move fixed mode, layout, and typography variables to their CSS owners, reduce `themeStyles()` to normalized configuration-derived declarations, and cover the ownership boundary with focused helper tests.
- [ ] 4.2 Replace the monolithic `check:css` source scanner with Node test-runner unit and generated-site tests, wire `pnpm test` into contributor guidance and CI, and remove brittle migration-only string assertions.
