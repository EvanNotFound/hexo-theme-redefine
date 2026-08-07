# Article Prose Specification

## Purpose

Define the shared typography, spacing, and containment behavior for Markdown content throughout the theme.

## Requirements

### Requirement: Markdown content has one prose contract

The published theme SHALL apply one coherent `.markdown-body` contract to paragraphs, headings, links, emphasis, lists, nested lists, blockquotes, inline and block code, tables, figures, images, captions, horizontal rules, definition lists, raw media, and MathJax content.

#### Scenario: Standard Markdown article content

- **WHEN** a post contains the supported Markdown elements
- **THEN** each element receives the theme's prose typography, color, spacing, and responsive behavior without relying on browser defaults

#### Scenario: Explicit UI content inside prose

- **WHEN** generated navigation or module UI is marked `not-markdown`
- **THEN** the prose contract does not apply its Markdown typography or list marker behavior to that UI content

### Requirement: Prose spacing is predictable at boundaries

Each `.markdown-body` boundary SHALL remove the top margin from its first direct content child and the bottom margin from its last direct content child. Adjacent headings and block content SHALL use one predictable vertical rhythm without accidental doubled margins caused by wrapper-specific patches.

#### Scenario: Prose starts with a heading or block element

- **WHEN** article, page, excerpt, callout, tab, or folding content starts with a heading, paragraph, quote, image, table, or code block
- **THEN** the first content element does not create an unrelated leading gap

#### Scenario: Prose ends with a block element

- **WHEN** article, page, excerpt, callout, tab, or folding content ends with a paragraph, list, quote, image, table, or code block
- **THEN** the prose boundary does not add trailing margin beyond its owning module shell

### Requirement: Nested writing modules preserve prose behavior

The content areas of callouts, tab panes, and folding blocks SHALL use the same prose boundary and element rules as article content, while their outer shells MUST retain responsibility for component spacing, padding, decoration, and UI controls.

#### Scenario: Markdown inside a callout

- **WHEN** a callout contains multiple paragraphs, a heading, a list, a quote, an image, a table, or a code block
- **THEN** its content follows the prose rhythm and its shell does not add a second content-level margin

#### Scenario: Markdown inside tabs or folding content

- **WHEN** a tab pane or folding body contains supported Markdown
- **THEN** the same typography, boundary normalization, nested-list behavior, and responsive containment apply inside that module

### Requirement: Wide prose content remains contained

Tables, long links, inline code, block code, and other intrinsically wide prose content SHALL remain within the article or module content width on narrow viewports without removing table semantics or making normal text unreadable.

#### Scenario: Wide table on a narrow viewport

- **WHEN** a Markdown table is wider than its article or module content area
- **THEN** the table is contained by a reliable horizontal scrolling region and the surrounding prose layout does not overflow

#### Scenario: Long inline content in a nested module

- **WHEN** a callout or tab contains a long URL or unbroken inline code token
- **THEN** the content wraps or scrolls within the module content area without widening the module shell

### Requirement: Prose hierarchy remains responsive

The prose contract SHALL preserve the configured article body font size and line height while maintaining a clear descending visual hierarchy from `h1` through `h6` at desktop, tablet, and mobile widths.

#### Scenario: Responsive prose content

- **WHEN** the same article is rendered at desktop, tablet, and mobile widths
- **THEN** body text remains readable, heading levels remain distinguishable, and configured heading spacing does not create disproportionate mobile gaps
