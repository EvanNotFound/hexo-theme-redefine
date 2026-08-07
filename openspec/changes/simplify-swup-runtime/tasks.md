## 1. Simplify runtime ownership

- [x] 1.1 Wire initial setup and Swup hooks directly in `source/js/main.js`, move abort-scope state into the entry, and remove the lifecycle/page-scope modules and Swup-ready event.

## 2. Remove Pjax residue

- [x] 2.1 Delete the unused Pjax library and remove stale Pjax progress markup and CSS/Tailwind tokens while preserving the active Swup progress bar.

## 3. Align guidance and verify behavior

- [x] 3.1 Update the English and Chinese JavaScript guides for the direct lifecycle model while preserving marked-script guidance, then run the theme build and focused source checks.
