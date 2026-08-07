## 1. Add Heading Spacing Presets

- [x] 1.1 Replace the theme and demo configuration's copied per-heading defaults with the documented `articles.style.heading_spacing` preset setting and define compact, default, and spacious descending six-level scales.
- [x] 1.2 Update the Stylus configuration variables to resolve the selected preset, fall back to default for invalid values, and honor explicitly supplied legacy `articles.style.headings_top_spacing.h1` through `.h6` values per level.

## 2. Consolidate The Prose Contract

- [x] 2.1 Rewrite the `.markdown-body` element rules into one consistent contract for text, headings, lists, blockquotes, links, code, tables, figures, images, captions, horizontal rules, raw media, and MathJax while preserving existing theme colors, font configuration, and module-specific visual treatments.
- [x] 2.2 Establish predictable sibling spacing and first/last-child normalization, including responsive heading spacing, without relying on broad module-wide universal selectors or duplicated margin patches.

## 3. Normalize Nested Content And Responsive Boundaries

- [x] 3.1 Give tab panes and folding content the same prose boundary as article, page, home excerpt, and callout content while keeping tab navigation, folding summaries, and other `not-markdown` UI excluded.
- [x] 3.2 Contain wide tables, long links, inline code, and block code within article and nested-module content areas on narrow viewports while preserving table semantics and existing code/table visuals.
- [x] 3.3 Reconcile the article title and Markdown heading styles so the front-matter title remains visually dominant and the existing regular/cover title markup and responsive behavior remain intact.

## 4. Document And Verify The Published Theme

- [x] 4.1 Update the English and Chinese theme documentation with the three heading-spacing presets, legacy fallback behavior, and the recommendation to use front-matter titles with article content beginning at `h2`.
- [x] 4.2 Run the theme build and verify the Markdown fixture, nested module fixture, title variants, responsive heading hierarchy, spacing presets, and generated wide-content behavior without committing generated build output.
