## Why

Theme Redefine currently styles Markdown through a mixture of Tailwind resets,
`.markdown-body` Stylus rules, and module-specific spacing patches. The same
content can therefore have different margins or missing element styles in an
article, home excerpt, callout, tab, or folding block. The published theme needs
one predictable prose contract with a simpler heading-spacing control that keeps
users from having to tune six independent values.

## What Changes

- Establish one coherent `.markdown-body` prose contract for common Markdown and
  raw HTML elements, including paragraphs, headings, lists, blockquotes, links,
  code, tables, images, figures, captions, horizontal rules, and MathJax.
- Make first-child and last-child spacing normalization consistent across full
  article content, standalone page content, excerpts, callouts, tabs, and
  folding blocks.
- Separate prose rhythm from module shell spacing so embedded writing modules
  remain readable without inheriting article-level layout gaps.
- Add a three-tier heading top-spacing preset API: `compact`, `default`, and
  `spacious`, preserving a descending rhythm from `h1` through `h6`.
- Preserve existing per-heading `headings_top_spacing` values as a legacy
  compatibility fallback while documenting the preset API as the normal choice.
- Keep the article title visually distinct from Markdown headings while retaining
  the existing semantic title markup and responsive title behavior.
- Update the bilingual published-theme configuration guidance for the new
  heading-spacing presets and the recommended front-matter title hierarchy.

## Capabilities

### New Capabilities

- `article-prose`: Defines the uniform Markdown prose element coverage, spacing
  rhythm, nested content boundaries, and module composition behavior.

### Modified Capabilities

- `article-typography`: Replaces unrestricted heading top-spacing behavior with
  documented three-tier presets while preserving legacy configured values and
  clarifying the visual distinction between the article title and Markdown
  headings.

## Impact

- Affects the published theme's Stylus prose and module styles under
  `source/css/`, article and module renderers under `layout/` and `scripts/`,
  and theme defaults in `_config.yml` plus the demo configuration mirror.
- Affects bilingual theme documentation under `docs/content/docs/{en,zh}`;
  the private documentation site's own prose styling is out of scope.
- Changes the documented configuration surface but adds no dependency, runtime
  service, or content-format requirement.
