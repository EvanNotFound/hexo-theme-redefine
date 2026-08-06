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

The typography change SHALL preserve the existing semantic `h1` elements, font weights, alignment behavior, spacing, line heights, heading top-spacing configuration, and natural title wrapping.

#### Scenario: Existing title presentation

- **WHEN** the article title is rendered in either variant
- **THEN** its semantic markup, weight, alignment, spacing, line height, heading top-spacing behavior, and wrapping remain unchanged apart from font size
