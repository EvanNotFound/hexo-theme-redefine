## Context

Theme Redefine renders Markdown through Hexo, then combines a Stylus stylesheet
with a separately generated Tailwind stylesheet. The published article body and
standalone page body use `.markdown-body`; home excerpts and callout content use
it as well, while tab panes and folding content render Markdown inside different
wrappers. Tailwind preflight resets list and link defaults globally, and the
current prose rules restore only part of the expected Markdown surface with
module-specific first/last-child patches.

The theme also exposes six independent `headings_top_spacing` values. They are
not documented in the bilingual theme guide, but existing users may have copied
them into their consuming Hexo configuration. The change must improve the normal
configuration experience without unnecessarily breaking those values.

## Goals / Non-Goals

**Goals:**

- Make `.markdown-body` the single, explicit prose contract for normal Markdown
  and common raw HTML content.
- Establish predictable block spacing, heading hierarchy, and first/last-child
  behavior across articles, pages, excerpts, callouts, tabs, and folding blocks.
- Add `articles.style.heading_spacing` with the values `compact`, `default`, and
  `spacious`.
- Keep legacy per-heading spacing values usable when an existing site supplies
  `articles.style.headings_top_spacing.h1` through `.h6`.
- Preserve the theme's existing visual language, color variables, configurable
  article font size/line height, custom modules, and semantic article title
  markup.
- Update the English and Chinese theme configuration guidance.

**Non-Goals:**

- Do not change the private Fumadocs site's prose styling.
- Do not add the Tailwind Typography dependency or replace the Stylus pipeline.
- Do not change Markdown parsing, front-matter formats, or module syntax.
- Do not redesign the article shell, table of contents, comments, or code-theme
  colors.
- Do not expose six new configurable bottom-margin values or a general CSS theme
  editor.

## Decisions

### Keep `.markdown-body` and adopt a prose contract

Retain the existing class name because it is emitted by published templates,
module renderers, and theme JavaScript. Consolidate its rules around the normal
Markdown element surface: paragraphs, headings, links, emphasis, lists, nested
lists, blockquotes, inline and block code, tables, figures, images, captions,
horizontal rules, definition-list elements, raw media, and MathJax.

Use Tailwind Typography as a structural reference rather than importing the
plugin: explicit element coverage, low-friction sibling rules, and first/last
child normalization are useful, while the theme still needs Hexo configuration
lookups, Stylus mixins, existing variables, and its own module visuals.

### Give every rendered Markdown module a prose boundary

Keep the outer module shell responsible for its own box margin, padding, and
decoration. Mark the inner Markdown content as prose consistently:

- article and page content remain `.markdown-body`;
- callout content remains `.markdown-body`;
- tab panes gain the same prose boundary;
- folding `.content` gains the same prose boundary while its `summary` remains
  `not-markdown` UI.

Prose rules should target content descendants rather than relying on one exact
wrapper shape. First-child and last-child normalization belongs to each prose
boundary, not to unrelated module shells.

### Use a scalar heading-spacing preset

Add the documented setting:

```yaml
articles:
  style:
    heading_spacing: default # compact, default, spacious
```

The implementation owns a descending six-level scale for each preset. The
initial `default` preset preserves the current theme defaults unless the prose
redesign establishes a specific replacement scale during implementation. The
`compact` and `spacious` presets adjust the same six levels together, preserving
their relative hierarchy rather than letting users create arbitrary inversions.

The legacy `headings_top_spacing.h1` through `.h6` values are checked first when
they are explicitly supplied by a consuming site. If no legacy value exists for
a level, the selected preset supplies that level. The theme defaults should use
the new scalar setting, so the demo configuration exercises the public API and
does not mask the fallback path with copied legacy defaults.

### Keep spacing relationships explicit and bounded

Define block margins in one prose stylesheet and normalize the boundaries:

- the first direct prose child has no top margin;
- the last direct prose child has no bottom margin;
- heading-following content does not receive accidental doubled spacing;
- nested lists, quotes, figures, code, tables, and MathJax use the same block
  rhythm unless their component shell intentionally compresses the outer gap.

Use selectors scoped to `.markdown-body` and keep UI exclusions explicit through
`.not-markdown`. Avoid broad module-wide universal selectors when a prose
boundary can express the same rule.

### Make wide content contained by its prose boundary

Style tables and other intrinsically wide content so it cannot force the article
column wider on mobile. Preserve table semantics and existing striping/cell
visuals; use a reliable scrolling containment strategy rather than depending on
`overflow` on a table formatting box. Ensure long inline URLs and code can wrap
inside callout and tab content.

### Preserve article-title hierarchy

Retain the current regular and cover-image title markup and responsive scale from
the existing article typography capability. Markdown `h1` remains supported for
semantic compatibility, but the article's front-matter title must remain the
visually dominant heading. The writing guidance continues to recommend using
front-matter `title` and beginning article content at `h2`.

## Risks / Trade-offs

- [Legacy configuration detection may be ambiguous after Hexo config merging]
  → Remove copied legacy defaults from the theme and demo configuration, then
  resolve legacy values only when they are present in the consuming site's
  merged configuration; document the fallback behavior.
- [Changing selector structure can affect custom HTML in existing posts]
  → Cover the standard Markdown surface and retain `.not-markdown` as an
  explicit escape hatch; use the demo Markdown fixtures for representative
  nested content.
- [Adding prose classes to nested modules can change their current whitespace]
  → Keep module shell margins and padding separate, normalize only the inner
  prose boundary, and verify callout, tab, and folding examples.
- [A visually dominant article title may still coexist with a Markdown `h1`]
  → Preserve semantic support but document the recommended `h2` starting level
  and keep the title treatment distinct from prose heading treatment.
- [Wide tables may require generated wrappers or equivalent containment]
  → Keep the solution inside the published theme's existing render/style path
  and verify generated article markup before finalizing the implementation.

## Migration Plan

1. Add `heading_spacing: default` to the theme and demo configuration, remove
   copied legacy defaults, and retain Stylus fallback reads for user-supplied
   legacy values.
2. Implement the consolidated prose and module-boundary rules.
3. Update the bilingual configuration guidance, including the preset values and
   legacy fallback note.
4. Run the theme build and inspect generated demo output for the Markdown,
   nested-module, and responsive-content fixtures.

Rollback is a source revert. Existing consuming sites that still provide the
legacy per-heading object continue to receive those values during the transition.

## Open Questions

- What exact six margin values best represent the `compact`, `default`, and
  `spacious` presets after comparing the rendered demo fixtures? The hierarchy
  and preset names are fixed; the final numeric scale can be tuned during
  implementation without changing the public API.
- Should the reliable wide-table containment use the existing after-render filter
  to add a wrapper, or can the current generated markup be contained without a
  wrapper while preserving table semantics?
