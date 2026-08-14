## 1. Establish Shared Numeric Motion

- [x] 1.1 Add Number Flow to the root package and lockfile, create the lazy numeric-motion integration and plain-value bridge, and remove the Odometer global script, stylesheet, and conditional template loading.

## 2. Integrate Existing Numeric Displays

- [x] 2.1 Render footer runtime units through the shared integration with forward rollover, short motion, non-live timer semantics, reduced-motion behavior, and current-element initialization across Swup page replacement.
- [x] 2.2 Render the toolbar reading percentage through the shared integration only when its rounded integer changes, preserve continuous top-bar updates and back-to-top behavior, and keep the control dimensionally stable during one-, two-, and three-digit values.

## 3. Align Coverage And Guidance

- [x] 3.1 Add focused runtime and generated-output coverage for lazy loading, duplicate suppression, disabled-feature asset behavior, and Odometer removal, then run the affected theme build and tests.
- [x] 3.2 Update aligned English and Chinese footer, reading-progress, and developer asset documentation to describe the shared animated numbers and bundled dependency ownership, then run docs lint and type checks.

## 4. Bundle Developer-Mode JavaScript

- [x] 4.1 Add an initial esbuild development build and watcher to `pnpm dev`, load its unminified entry and stable lazy chunks through Hexo, remove the import-map workaround, update development contracts and bilingual guidance, and verify manual-refresh behavior with focused build, generation, and browser checks.
- [x] 4.2 Replace implementation-level package scripts with outcome-oriented root and docs commands, make root cleanup cover all generated theme and demo state, align CI build and publication callers, update command guidance and contracts, and run the canonical checks.
