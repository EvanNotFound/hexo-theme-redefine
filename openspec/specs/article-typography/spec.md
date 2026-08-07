# Article Typography Specification

## Purpose

Define the default visual hierarchy for article page titles and Markdown headings
in Theme Redefine.

## Requirements

### Requirement: Unified article title scale

The article page SHALL render both regular and cover-image post titles with the same responsive font-size scale: 30px below the `md` breakpoint and 36px at the `md` breakpoint and above.

#### Scenario: Regular article title

- **WHEN** a post has no usable cover image
- **THEN** its title uses 30px below `md` and 36px at `md` and above

#### Scenario: Cover article title

- **WHEN** a post has a usable cover image
- **THEN** its overlaid title uses the same 30px below `md` and 36px at `md` and above

### Requirement: Reduced Markdown heading hierarchy

The article content SHALL use the following default heading sizes: on desktop, `h1`-`h6` SHALL be 36px, 32px, 26px, 22px, 19px, and 17px; at the tablet breakpoint, they SHALL be 28px, 24px, 22px, 20px, 17px, and 16px.

#### Scenario: Desktop article headings

- **WHEN** Markdown headings are rendered above the tablet breakpoint
- **THEN** each heading level uses its corresponding reduced desktop size

#### Scenario: Tablet article headings

- **WHEN** Markdown headings are rendered at or below the tablet breakpoint
- **THEN** each heading level uses its corresponding reduced tablet size

### Requirement: Preserve article title hierarchy and behavior

The typography change SHALL preserve the existing semantic `h1` elements, font
weights, alignment behavior, natural title wrapping, and responsive title
behavior. Heading top spacing SHALL use the documented preset API, with
explicit legacy per-heading values retained when supplied by a consuming site.

#### Scenario: Existing title presentation

- **WHEN** the article title is rendered in either variant
- **THEN** its semantic markup, weight, alignment, wrapping, and responsive
  behavior remain unchanged apart from the approved typography hierarchy and
  spacing changes

#### Scenario: Heading spacing migration

- **WHEN** a site has existing `headings_top_spacing.h1` through `.h6` values
- **THEN** each supplied legacy value remains effective for its matching heading
  level while the new preset controls unspecified levels

### Requirement: Heading spacing uses bounded presets

The published theme SHALL provide `articles.style.heading_spacing` with the
values `compact`, `default`, and `spacious`. Each preset SHALL provide a
descending top-spacing scale for `h1` through `h6`, and the documented default
SHALL be `default`.

#### Scenario: Default heading spacing

- **WHEN** a site does not select a heading-spacing preset
- **THEN** the theme uses the `default` preset for all Markdown heading levels

#### Scenario: User selects a preset

- **WHEN** a site sets `articles.style.heading_spacing` to `compact`, `default`,
  or `spacious`
- **THEN** all Markdown heading levels use the corresponding bounded scale while
  preserving their descending hierarchy

#### Scenario: Invalid preset value

- **WHEN** a site supplies a value other than `compact`, `default`, or `spacious`
- **THEN** the theme uses the `default` preset

### Requirement: Legacy heading spacing remains readable

The theme SHALL continue to honor an explicitly supplied legacy
`articles.style.headings_top_spacing.h1` through `.h6` value for the matching
heading level. A legacy value SHALL take precedence for that level over the
selected preset, while levels without legacy values SHALL use the preset.

#### Scenario: Existing per-level configuration

- **WHEN** a consuming site provides one or more legacy per-heading spacing
  values
- **THEN** those provided levels retain their configured top spacing and all
  other levels use the selected preset

### Requirement: Article title remains distinct from prose headings

The article front-matter title SHALL remain the visually dominant heading over a
Markdown `h1` in the article body while preserving the existing semantic title
elements, regular and cover variants, responsive title scale, alignment, weight,
wrapping, and line-height behavior.

#### Scenario: Article contains a Markdown h1

- **WHEN** a post renders its front-matter title and also contains a Markdown
  `h1` in its content
- **THEN** the front-matter title remains visually distinct and the Markdown
  heading follows the prose hierarchy
