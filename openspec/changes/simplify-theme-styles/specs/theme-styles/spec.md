## ADDED Requirements

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
