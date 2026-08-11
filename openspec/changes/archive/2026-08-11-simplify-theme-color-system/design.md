## Context

Redefine currently defines three solid backgrounds, five generic text colors, several precomposed transparent backgrounds, an `--rd-border` alias, and multiple unused or misclassified variables. Names such as `first`, `second`, `third`, `fourth`, and `default` do not tell contributors which value belongs to a page background, component state, border, or readable text. The three strongest text colors are nearly identical, while `fourth-text-color` is used as a divider and background rather than text.

Vercel's Geist system provides a useful organizing idea: numbered ranges have stable meanings, and components choose from the scale instead of receiving an alias for every card, popover, or sidebar. Redefine is a content theme rather than a dashboard, so it needs only the neutral levels demonstrated by current theme-owned components. The configurable primary color, component-specific callout/code colors, and vendor-owned status colors remain separate.

## Goals / Non-Goals

**Goals:**

- Replace ordinal and ambiguous colors with a compact numbered RD foundation whose ranges have documented meanings.
- Use two page-background levels, three neutral component-state levels, one alpha border level, and two text/icon levels.
- Collapse first, second, and default text into one primary text level; retain one secondary text level.
- Remove `--rd-border` indirection and use the numbered alpha border directly.
- Preserve `--rd-shadow` as a meaningful complete treatment.
- Generate readable text for the user-configurable primary color.
- Make Tailwind utilities resolve mode-aware and generated values directly.

**Non-Goals:**

- Do not copy Vercel's complete gray-alpha, brand-color, chart, sidebar, or functional-color scales.
- Do not add shadcn aliases such as card, popover, foreground, muted-foreground, or accent-foreground.
- Do not replace Tailwind's radius, color, or shadow defaults.
- Do not move callout variants, code themes, home-banner text configuration, or vendor-owned status colors into the neutral scale.
- Do not add compatibility aliases for undocumented retired CSS variables during this major-release cleanup.

## Decisions

### Use a focused numbered foundation

The canonical neutral variables are:

| Variable | Intended use |
| --- | --- |
| `--rd-background-100` | Primary page, panel, card, dialog, and neutral canvas background |
| `--rd-background-200` | Alternate page region or secondary large-area background |
| `--rd-gray-100` | Default low-contrast component background |
| `--rd-gray-200` | Hover or more visible neutral component background |
| `--rd-gray-300` | Active or strongest neutral component background |
| `--rd-gray-alpha-400` | Standard structural border and neutral divider |
| `--rd-gray-900` | Secondary text, metadata, descriptions, and secondary icons |
| `--rd-gray-1000` | Primary text, headings, labels, and primary icons |

Numbers 500 through 800 are intentionally undefined. Defining unused levels would create an artificial API and require palette decisions with no current consumer. If a future component demonstrates a high-contrast neutral role, that role can add the appropriate level deliberately.

The initial values preserve Redefine's neutral character while making component states slightly more distinguishable:

| Variable | Light | Dark |
| --- | --- | --- |
| `--rd-background-100` | `#fff` | `#202124` |
| `--rd-background-200` | `#fafafa` | `#242529` |
| `--rd-gray-100` | `#f7f7f8` | `#27282c` |
| `--rd-gray-200` | `#f2f3f4` | `#2a2c30` |
| `--rd-gray-300` | `#eef0f2` | `#2d2f34` |
| `--rd-gray-alpha-400` | `rgb(0 0 0 / 8%)` | `rgb(255 255 255 / 8%)` |
| `--rd-gray-900` | `#5c6669` | `#9595a2` |
| `--rd-gray-1000` | `#343a3c` | `#cbcbd1` |

The secondary text level remains at or above WCAG AA contrast on the strongest approved neutral background in both modes. Typography weight and size, not nearly identical text-color variants, provide heading hierarchy.

An alternative was to define complete 100–1000 gray and gray-alpha ramps. It was rejected because Redefine currently needs only component backgrounds, one structural border, and two text levels. Another alternative was a semantic alias per component; it was rejected because it recreates the naming and ownership ambiguity this change removes.

### Use direct levels instead of a border alias

Structural borders use `--rd-gray-alpha-400` or `border-rd-gray-alpha-400` directly. `--rd-border` is removed because it only aliases that one scale level and provides no separate behavior. Underlines and dividers currently using `fourth-text-color` also use the border level when they represent a boundary.

`--rd-shadow` remains because it stores a complete mode-aware shadow declaration and communicates a real effect rather than redirecting to a numbered color.

### Use two text levels and one primary-background text value

`first-text-color`, `second-text-color`, and `default-text-color` collapse into `--rd-gray-1000`. `third-text-color` becomes `--rd-gray-900`. Components use `text-rd-gray-1000` and `text-rd-gray-900` directly; there is no foreground or heading-text alias.

`fourth-text-color` is removed by role: dividers and underlines use gray-alpha 400, while neutral fills use the applicable background or gray level. Unused `link-color` and `copyright-info-color` are deleted. `invert-text-color` is replaced only where primary-colored backgrounds require readable text.

Because `colors.primary` is documented as Hex and may be light or dark, `themeStyles()` computes WCAG relative luminance for the normalized primary and compares the light and dark candidates. It emits `--rd-primary-text` using whichever candidate has stronger contrast. Primary-filled controls, paginator states, tags, and text selection consume that value. Unsupported or invalid input continues through the existing normalized primary fallback.

### Use Tailwind's inline runtime bridge

The static Tailwind theme block continues to define fonts, containers, z-index values, and other compile-time tokens. Runtime-backed RD colors, the configurable primary color, component-configured colors, and `--rd-shadow` move into `@theme inline` mappings so utilities reference the underlying runtime values directly.

The resulting utilities are intentionally explicit: `bg-rd-background-100`, `bg-rd-gray-200`, `border-rd-gray-alpha-400`, `text-rd-gray-900`, `text-rd-gray-1000`, `text-rd-primary-text`, and `shadow-rd`. Opacity variants such as `bg-rd-background-100/40` use Tailwind's generated color mixing rather than global `transparent-15`, `transparent-40`, or `transparent-80` variables.

### Migrate each existing value by visible role

The migration follows these rules rather than a blind one-to-one rename:

| Retired value | Migration |
| --- | --- |
| `background-color` | `rd-background-100` |
| `second-background-color` | `rd-background-200` or the applicable component gray level |
| `third-background-color` | `rd-gray-100`, `200`, or `300` according to default/hover/active role |
| `background-color-transparent*` | opacity modifier on the applicable background level |
| `third-background-color-transparent` | local plugin mix from the applicable gray level |
| `first-text-color`, `second-text-color`, `default-text-color` | `rd-gray-1000` |
| `third-text-color` | `rd-gray-900` |
| `fourth-text-color` | gray-alpha 400 for boundaries or a numbered neutral fill for backgrounds |
| `invert-text-color` | `rd-primary-text` only on primary backgrounds |
| `rd-border` | `rd-gray-alpha-400` |

The preloader uses background 100 instead of maintaining a duplicate light/dark pair. Search, image-viewer, home-banner, and navbar translucency use opacity modifiers at their existing visual strengths. Bundled comment and player styles map their neutral vendor roles to the numbered foundation, while vendor status, branding, syntax, and functional colors remain untouched.

### Document the breaking CSS migration

The background, text, and border variables are undocumented internal CSS today, but consuming sites may reference them in custom CSS. The English and Chinese major-version migration pages will include the retired-to-numbered mapping and state that no compatibility aliases remain. The color configuration pages will continue to document `colors.primary` as Hex and will explain that text on primary backgrounds is selected automatically for contrast.

## Risks / Trade-offs

- **[Broad rename misses a generated or plugin consumer]** EJS, native CSS, Hexo modules, browser-generated class strings, and bundled adapters all use the current names. → Search every owning source area, migrate by role, and generate the default, feature, and plugin fixture matrices.
- **[Numeric levels become arbitrary without guidance]** Contributors could choose numbers by appearance alone. → Keep the range table in the design and contributor guidance, and define only levels with demonstrated roles.
- **[Neutral tuning changes familiar contrast]** Component backgrounds become modestly more distinct. → Keep page backgrounds close to current values, verify secondary text contrast on the strongest neutral level, and avoid introducing extra elevation or borders.
- **[Custom CSS breaks]** Retired variables and `--rd-border` have no aliases. → Document a direct migration table in both locales as part of the major release.
- **[Configured primary is not valid Hex]** Contrast calculation cannot reliably parse arbitrary CSS color functions. → Preserve existing primary normalization and use the documented fallback path when a supported Hex value is unavailable.
- **[Third-party styles lose vendor intent]** A mechanical replacement could overwrite branded or functional states. → Change only Redefine-neutral adapter colors and retain vendor-owned values.

## Migration Plan

1. Add the numbered RD palette, inline Tailwind mappings, and generated primary-text value while existing consumers remain unchanged.
2. Migrate core backgrounds, component states, borders, text, icons, and translucent variants by documented role.
3. Migrate browser/Hexo-generated classes and bundled plugin adapters, preserving component-specific colors.
4. Remove every retired declaration and mapping after a complete source search confirms no active consumer remains.
5. Update focused tests, bilingual color/migration guidance, and contributor token guidance; run theme, docs, and OpenSpec checks.

Rollback consists of reverting the palette, consumer, adapter, test, documentation, and spec changes together. No user data or persistent state is affected.

## Open Questions

None. The selected direction is a focused numbered RD foundation, direct scale usage without component aliases, no `--rd-border` compatibility alias, retained `--rd-shadow`, two text levels, and generated readable text for configurable primary backgrounds.
