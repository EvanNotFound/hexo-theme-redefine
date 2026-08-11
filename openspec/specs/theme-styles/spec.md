# Theme Styles Specification

## Purpose

Define styling ownership, selector conventions, configuration behavior, and migration compatibility for theme styles.

## Requirements

### Requirement: Styling ownership is explicit

Redefine SHALL use Tailwind utilities for ordinary layout and appearance in
theme-owned markup, reusable templates or helpers for repeated UI, and native
CSS for global rules, rendered content, complex selectors, and third-party
markup. A component property MUST NOT remain owned by both inline utilities and
component CSS after that component is migrated.

#### Scenario: Theme-owned element is styled

- **WHEN** an EJS template or generated theme component owns an element's markup
- **THEN** its ordinary layout and appearance are expressed with Tailwind
  utilities at that markup source

#### Scenario: Repeated UI is introduced

- **WHEN** the same styled markup is required in more than one location
- **THEN** the markup is reused through a template or helper rather than a new
  `@apply`-based CSS abstraction

#### Scenario: Theme does not control the rendered descendants

- **WHEN** Markdown, a Hexo renderer, or a third-party plugin produces nested
  markup that the theme cannot annotate directly
- **THEN** the applicable styles are owned by a focused native CSS scope

### Requirement: Style names are short and direct

CSS-owned classes SHALL use short concrete names that describe visible theme
parts. New BEM names and vague structural names such as `foundation`,
`taxonomy`, or styling-only `container`, `wrapper`, and `inner` variants MUST
NOT be introduced.

#### Scenario: A CSS scope is needed

- **WHEN** a component requires a stable native CSS selector
- **THEN** it uses a direct name such as `article`, `tabs`, `tab-panel`,
  `callout`, `search`, or `markdown-body`

#### Scenario: A wrapper only needs ordinary styling

- **WHEN** a wrapper exists only to receive layout or appearance declarations
- **THEN** it uses inline Tailwind utilities and does not receive a new semantic
  class solely as a styling hook

### Requirement: Behavior hooks are separate from styling

Unique browser behavior targets SHALL use IDs. Repeated controls and state SHALL
use semantic roles, ARIA attributes, or focused `data-*` attributes. Native CSS
MUST NOT depend on IDs as styling selectors.

#### Scenario: JavaScript targets a unique page element

- **WHEN** browser code needs the one navbar, main content region, footer, or
  equivalent unique page element
- **THEN** it locates that element through a unique ID

#### Scenario: JavaScript targets repeated components

- **WHEN** browser code handles tabs, controls, cards, panels, or another
  repeatable component
- **THEN** it uses existing roles or ARIA state where suitable, otherwise a
  focused `data-*` hook

#### Scenario: Component state changes

- **WHEN** an interactive component changes selection, expansion, or visibility
- **THEN** its state is represented by semantic ARIA or `data-state` attributes
  rather than a styling-only container class

### Requirement: Existing theme configuration remains effective

Every supported theme configuration value currently consumed by Stylus SHALL
continue to affect the generated site through validated CSS custom properties,
template conditions, state attributes, or selected plugin styles. This change
MUST NOT require users to rename or replace existing supported `_config.yml`
options.

#### Scenario: User changes a configurable visual value

- **WHEN** a consuming site changes a supported color, width, font, spacing,
  radius, alignment, or equivalent visual setting
- **THEN** the generated page exposes the normalized value and the matching
  theme styles use it

#### Scenario: User changes a conditional style option

- **WHEN** a consuming site selects a supported code style, code theme, comment
  system, sidebar mode, tag mode, or player mode
- **THEN** the generated markup and loaded styles reflect that selection without
  compiling Stylus in the consuming site

#### Scenario: User switches color mode

- **WHEN** the theme applies its light or dark mode class
- **THEN** mode-aware CSS custom properties resolve to the corresponding existing
  theme values

### Requirement: Internal class cleanup is explicit

The major release that completes this migration SHALL remove undocumented
styling-only internal class names without compatibility aliases while retaining
documented content scopes and classes required by third-party integrations.

#### Scenario: Migrated page markup is rendered

- **WHEN** a styling-only wrapper class has been replaced by Tailwind and a
  separate behavior hook where needed
- **THEN** the old internal class is absent from the rendered markup

#### Scenario: Public content scope is still required

- **WHEN** rendered Markdown or a supported plugin relies on an established
  scope such as `markdown-body` or a third-party root class
- **THEN** that required scope remains available

### Requirement: The migration preserves visible behavior

The styling-system migration SHALL preserve the theme's existing responsive
layout, light and dark appearance, interactions, and configuration results
except for separately approved visual changes.

#### Scenario: Representative theme pages are generated

- **WHEN** home, article, archive, category, tag, custom page, and plugin fixture
  pages are rendered before and after a migration group
- **THEN** their intended layout and interaction behavior remain equivalent

### Requirement: Theme spacing uses the Tailwind scale

Redefine-owned layout SHALL use Tailwind's default spacing scale for fixed padding, margins, and gaps. The theme MUST NOT define a second fixed spacing unit or derive responsive spacing by multiplying that unit by fractional values. Calculations MAY combine independent dimensions when the resulting position cannot be expressed by one spacing utility.

#### Scenario: Responsive layout spacing is rendered

- **WHEN** page, article, home-card, sidebar, or tool spacing changes across supported breakpoints
- **THEN** each fixed spacing value uses a Tailwind spacing utility from the default scale
- **AND** the rendered CSS does not depend on `--spacing-unit` or `--margin-spacing-unit`

#### Scenario: A tool is offset from the navbar

- **WHEN** a sticky or fixed component must begin below the current navbar
- **THEN** its position may calculate the current navbar height plus one Tailwind-scale offset
- **AND** responsive variants use the current navbar height rather than a separate fixed navbar value

### Requirement: Theme radii use Tailwind defaults

Redefine-owned surfaces SHALL use Tailwind's default border-radius scale without overriding the `--radius-*` namespace or defining deprecated radius aliases. Route-level content shells and standalone framed components SHALL use `rounded-2xl`, subordinate article-content surfaces SHALL normally use `rounded-xl`, controls and inner interactive elements SHALL use `rounded-lg`, compact details SHALL use smaller default utilities, and circles or pills SHALL use `rounded-full` only when their shape requires it.

#### Scenario: Route shell and nested content render together

- **WHEN** an article or framed page contains a theme-owned code block, table, callout, tab group, folding block, copyright panel, or equivalent nested surface
- **THEN** the route shell resolves to Tailwind's default `rounded-2xl` radius
- **AND** the nested surface uses a smaller default radius appropriate to its role

#### Scenario: Standalone framed component renders

- **WHEN** a home card, sidebar panel, side tool, post tool, dropdown, recommendation card, or equivalent standalone framed component renders
- **THEN** it uses Tailwind's default `rounded-2xl` radius
- **AND** its inner controls use a smaller default radius

#### Scenario: Edge-touching media follows an outer corner

- **WHEN** media touches a rounded parent edge
- **THEN** the parent clips the media to its own corner geometry instead of duplicating the outer radius on the child

#### Scenario: Inset corners are visibly concentric

- **WHEN** an inset child and its parent expose parallel rounded corners
- **THEN** the child radius is derived from the parent radius minus the actual inset
- **AND** an independently positioned child does not receive a concentric calculation solely because it is nested in the DOM

#### Scenario: Third-party markup renders

- **WHEN** a comment system, player, or other third-party integration owns its internal geometry
- **THEN** this radius contract does not replace its internal semantic or vendor-owned corner values

### Requirement: CSS variables have one owning layer

Fixed visual and layout variables SHALL be defined in theme CSS. The generated theme style SHALL contain only values derived from site configuration and MUST NOT repeat fixed light or dark palettes, structural borders, shadows, or dimensions.

#### Scenario: A fixed visual token changes

- **WHEN** a contributor changes a fixed mode-aware token such as `--rd-shadow`
- **THEN** the browser receives that value from the compiled theme stylesheet
- **AND** no generated runtime declaration overrides it

#### Scenario: A configured style changes

- **WHEN** a site configures a supported color, width, font, or article style value
- **THEN** the generated theme style contains the normalized configured value
- **AND** fixed CSS variables remain absent from that generated style
