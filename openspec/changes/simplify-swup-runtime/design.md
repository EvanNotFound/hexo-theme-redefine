## Context

The page template loads Swup and its browser-global plugins before the bundled `main.js` module. The current main entry delegates initial-load and Swup hook handling to `app/lifecycle.js`, which exposes callback arrays used only by `main.js`; page cancellation state is similarly split into `app/pageScope.js`.

Swup 4.3.1 and the existing plugin set already provide the required navigation behavior. The theme also intentionally re-executes scripts marked with `data-swup-reload-script` for comment systems, injected scripts, encrypted posts, and page-specific integrations. An unused Pjax library and Pjax-named progress tokens remain from the previous navigation implementation.

## Goals / Non-Goals

**Goals:**

- Make `main.js` the direct owner of initial setup, Swup hooks, and page-scope cancellation.
- Preserve all current Swup plugins, transition behavior, scroll behavior, preload behavior, and marked-script re-execution.
- Remove the internal Swup-ready event and callback registry.
- Remove confirmed Pjax migration residue from the published theme and source styling.
- Keep English and Chinese developer guidance aligned with the resulting runtime model.

**Non-Goals:**

- Do not replace Swup or remove any Swup plugin.
- Do not redesign third-party comment integrations or the `data-swup-reload-script` contract.
- Do not refactor individual feature modules beyond changes required by the lifecycle ownership move.
- Do not change the encrypted-content refresh event, which is needed by the standalone HBE bundle.

## Decisions

### Direct lifecycle wiring in `main.js`

`main.js` will read the already-created `window.swup` instance and register `visit:start`, `before('content:replace')`, and `page:view` hooks directly. Initial global and page initialization will run from `DOMContentLoaded` (or immediately when the document is already ready). The Swup template will continue to own library loading and instance construction, keeping server-rendered asset selection separate from browser application logic.

This is preferred over moving Swup construction into the bundle because the current template already controls whether Swup is rendered and keeps the browser-global plugin dependencies visible beside their configuration.

### Inline abort-scope ownership

The app and page `AbortController` references will live in `main.js`. Creating a page scope will abort the previous scope, and the `content:replace` hook will abort the active scope before Swup replaces `#swup`. Existing feature-module signal contracts remain unchanged.

This is preferred over introducing a replacement lifecycle or scope manager because there is one runtime consumer and no public module API depends on these files.

### Preserve marked script reloads

`SwupScriptsPlugin({ optin: true })` and all existing `data-swup-reload-script` emitters remain unchanged. The direct lifecycle change must not move or duplicate script execution; Swup continues to execute marked scripts during content replacement.

### Remove Pjax residue together

Delete the unused `source/js/libs/pjax.min.js`, remove the unused `.pjax-progress-bar` element and commented progress icon, and remove the unreferenced Pjax CSS variables from Stylus and Tailwind source. The active `.swup-progress-bar` styling remains because it belongs to the retained Swup progress plugin.

## Risks / Trade-offs

- **[Risk]** A separately loaded or unusually ordered `main.js` might evaluate before `window.swup` exists. → **Mitigation:** guard hook registration when the instance or its hooks are absent; normal theme rendering still loads Swup before the deferred module.
- **[Risk]** Removing Pjax-named CSS variables could affect undocumented custom CSS. → **Mitigation:** remove only tokens with no internal consumers, and treat the explicit Pjax cleanup as the compatibility decision for this change.
- **[Risk]** Third-party scripts could be initialized twice if lifecycle wiring is duplicated. → **Mitigation:** do not add a second script runner; preserve the existing Scripts Plugin and only run theme initialization from the direct hooks.
