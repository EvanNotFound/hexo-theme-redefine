## Why

The theme's Swup behavior is currently routed through a callback registry and a separate page-scope module even though `main.js` is their only consumer. This adds indirection to a small, concrete runtime flow and leaves Pjax migration residue in the published theme.

## What Changes

- Wire initial theme setup and Swup navigation hooks directly from `source/js/main.js`.
- Move application and page abort-scope ownership into the main runtime entry.
- Remove the internal Swup-ready event and lifecycle callback adapter.
- Preserve all existing Swup plugins, navigation behavior, and `data-swup-reload-script` handling.
- Delete the unused Pjax library and stale Pjax progress markup and CSS tokens.
- Update the bilingual JavaScript development guidance to describe the direct runtime model.

## Capabilities

### New Capabilities

- `swup-runtime`: Defines the theme's initial-load, navigation, page-scope cleanup, and marked-script behavior.

### Modified Capabilities

None.

## Impact

- Affected browser runtime: `source/js/main.js` and the removed lifecycle/page-scope modules.
- Affected Swup template bootstrap: `layout/components/swup.ejs`.
- Affected legacy progress styling and published library assets.
- Affected bilingual developer documentation.
- No dependency changes and no removal of Swup plugins.
