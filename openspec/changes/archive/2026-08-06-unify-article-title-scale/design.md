## Context

The post template renders the regular article title and the cover-image title as separate `h1` elements with Tailwind utilities. Both variants currently use `text-3xl sm:text-4xl md:text-5xl`. Markdown headings are styled separately in Stylus and still use the previous large defaults.

## Goals / Non-Goals

**Goals:**

- Give both article-title variants one two-tier scale: 30px below `md` and 36px at `md` and above.
- Set Markdown heading defaults to desktop `h1`-`h6` sizes of 36px, 32px, 26px, 22px, 19px, and 17px.
- Set tablet Markdown heading sizes to 28px, 24px, 22px, 20px, 17px, and 16px.

**Non-Goals:**

- Do not add user configuration or deprecation logic.
- Do not change title or heading weight, alignment, spacing, wrapping, markup, line heights, or heading-spacing configuration.

## Decisions

- Update both title utility strings to `text-3xl md:text-4xl`. Omitting the `sm` utility makes mobile and tablet share the same title size while retaining a desktop step.
- Update only the `font-size` declarations in `markdown.styl`; retain each heading's existing responsive mixin, margins, weights, borders, letter spacing, and line heights.

## Risks / Trade-offs

- [Long titles may still wrap] → Preserve normal wrapping so the full title remains readable; the smaller scale reduces, but does not eliminate, wrapping pressure.
- [Content using Markdown `h1` may appear less prominent] → The theme documentation already recommends using the front-matter title and starting article content at `h2`; the new sizes reinforce that hierarchy.
