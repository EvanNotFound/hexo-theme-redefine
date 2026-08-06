## Why

The article page title and the Markdown headings inside article content are larger than the surrounding reading experience needs. The post title currently reaches 48px after the first refinement, while article headings still use the older, oversized scale.

## What Changes

- Reduce regular and cover article titles to one two-tier responsive scale: 30px below `md` and 36px at `md` and above.
- Reduce Markdown `h1`-`h6` defaults to a quieter hierarchy for desktop and tablet layouts.
- Preserve existing title and heading weights, alignment, spacing, wrapping, line heights, and semantic markup.

## Capabilities

### New Capabilities

- `article-typography`: Defines the responsive visual hierarchy for article page titles and Markdown headings.

### Modified Capabilities

<!-- No existing spec-level requirements are being modified. -->

## Impact

- Affects `layout/pages/post/article-content.ejs` and `source/css/common/markdown.styl`.
- Changes only theme typography defaults; no dependencies, configuration keys, APIs, or content formats change.
