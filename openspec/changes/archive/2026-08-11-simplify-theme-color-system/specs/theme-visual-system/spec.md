## ADDED Requirements

### Requirement: Numbered RD colors have fixed roles

Redefine SHALL provide a compact mode-aware numbered color foundation consisting of `--rd-background-100`, `--rd-background-200`, `--rd-gray-100`, `--rd-gray-200`, `--rd-gray-300`, `--rd-gray-alpha-400`, `--rd-gray-900`, and `--rd-gray-1000`. The background levels SHALL represent primary and alternate page backgrounds, gray levels 100 through 300 SHALL represent increasingly visible neutral component backgrounds, gray-alpha 400 SHALL represent the standard structural border, and gray levels 900 and 1000 SHALL represent secondary and primary text and icons.

#### Scenario: Contributor chooses a page background

- **WHEN** a theme-owned page, panel, card, or alternate page region needs a neutral background
- **THEN** it uses `--rd-background-100` or `--rd-background-200` according to the documented level
- **AND** it does not introduce a component-specific card, panel, or popover alias for the same value

#### Scenario: Contributor chooses a component state

- **WHEN** a neutral control or nested component needs default, hover, or active differentiation
- **THEN** it uses the applicable `--rd-gray-100`, `--rd-gray-200`, or `--rd-gray-300` level

#### Scenario: Contributor chooses text color

- **WHEN** primary or secondary text or an icon renders on a supported neutral background
- **THEN** it uses `--rd-gray-1000` for primary content or `--rd-gray-900` for secondary content
- **AND** the selected combination meets WCAG AA contrast for normal text where the content is intended to be read

### Requirement: Primary-colored backgrounds use readable text

The theme SHALL provide `--rd-primary-text` for text and icons placed on the configurable primary color. The generated value MUST select a documented light or dark text candidate that has the stronger WCAG contrast against the normalized Hex primary color.

#### Scenario: Dark primary color is configured

- **WHEN** the configured primary color has stronger contrast with the light text candidate
- **THEN** `--rd-primary-text` resolves to that light candidate

#### Scenario: Light primary color is configured

- **WHEN** the configured primary color has stronger contrast with the dark text candidate
- **THEN** `--rd-primary-text` resolves to that dark candidate

#### Scenario: Primary-colored control renders

- **WHEN** a button, paginator item, tag, tool, selection, or equivalent state uses the primary color as its background
- **THEN** its text and icons use `--rd-primary-text`
- **AND** no background token is reused as a text color

## MODIFIED Requirements

### Requirement: Redefine provides semantic mode-aware visual tokens

The theme SHALL provide the numbered mode-aware RD color foundation for neutral backgrounds, component states, structural borders, text, and icons. The theme SHALL retain `--rd-shadow` as the canonical static-depth token because it contains a complete mode-aware `box-shadow` value. The theme MUST NOT provide a separate `--rd-border` alias over `--rd-gray-alpha-400`.

#### Scenario: Light mode tokens are available

- **WHEN** the theme renders in light mode
- **THEN** every numbered RD color resolves to its light value
- **AND** `--rd-shadow` resolves to the light static shadow value

#### Scenario: Dark mode tokens are available

- **WHEN** the theme renders in dark mode
- **THEN** every numbered RD color resolves to its dark value
- **AND** `--rd-shadow` resolves to the dark static shadow value

### Requirement: Tailwind exposes the canonical tokens without overriding defaults

The Tailwind source SHALL expose the numbered RD colors and `--rd-primary-text` through `--color-*` mappings and SHALL expose `--rd-shadow` through a `--shadow-*` mapping. Runtime-backed mappings MUST use Tailwind's inline theme bridge so mode and configured values resolve at the consuming element. The mappings MUST NOT replace Tailwind's built-in color, radius, or shadow utilities.

#### Scenario: Template uses a numbered RD color

- **WHEN** Redefine-owned markup uses a class such as `bg-rd-background-100`, `border-rd-gray-alpha-400`, `text-rd-gray-900`, or `text-rd-gray-1000`
- **THEN** the generated utility applies the corresponding current-mode RD value

#### Scenario: Template uses primary text

- **WHEN** Redefine-owned markup uses `text-rd-primary-text`
- **THEN** the generated utility applies the configured `--rd-primary-text` value

#### Scenario: Template uses the Redefine shadow utility

- **WHEN** Redefine-owned markup uses `shadow-rd`
- **THEN** the generated utility applies the complete current-mode `--rd-shadow` value

#### Scenario: Host uses a built-in Tailwind utility

- **WHEN** a host site uses a built-in Tailwind color, radius, or shadow utility
- **THEN** the RD mappings do not change that utility's meaning

### Requirement: Flat visual treatments use real borders

Redefine-owned surfaces that require a structural boundary SHALL use a one-pixel border based directly on `--rd-gray-alpha-400` or the equivalent `border-rd-gray-alpha-400` utility. These surfaces MUST NOT use `--rd-border`, a zero-offset shadow, or a component-specific alias to simulate the same border.

#### Scenario: Bordered surface renders normally

- **WHEN** a card, button, table, code block, content panel, or equivalent structural surface renders
- **THEN** it has the intended border from `--rd-gray-alpha-400`
- **AND** it does not require `--rd-border` or a flat shadow

#### Scenario: Bordered surface is hovered

- **WHEN** a bordered surface is hovered
- **THEN** its structural border remains stable unless that component explicitly uses another numbered level for an interaction state

### Requirement: Route-level content shells share one treatment

Article, standard page, archive, and equivalent framed route-level content shells SHALL use the same one-pixel `--rd-gray-alpha-400` structural border, Tailwind `rounded-2xl` radius, background, and static `--rd-shadow` elevation on layouts where they appear as inset surfaces. Repeated cards, sidebar panels, and nested article modules MUST NOT receive the route-shell shadow solely because they have a border.

#### Scenario: Framed route content renders

- **WHEN** an article, standard page, archive, or equivalent framed route is displayed above the mobile edge-to-edge layout
- **THEN** its primary content shell has the `--rd-gray-alpha-400` structural border, `rounded-2xl` radius, and `shadow-rd` elevation

#### Scenario: Repeated content renders inside a route

- **WHEN** a home card, sidebar panel, article module, or other repeated nested surface renders
- **THEN** it uses its component-owned border and background treatment without inheriting the route-shell shadow

#### Scenario: Route content becomes edge-to-edge

- **WHEN** a supported mobile layout flattens a route-level content shell against the viewport
- **THEN** its border, radius, and shadow are removed together

### Requirement: The retired visual API is removed consistently

The theme SHALL remove `--rd-border`, ordinal background and text variables, numbered transparent-background variables, unused link/copyright/inverse-text aliases, retired home-banner icon color aliases, and the earlier redefined shadow and generic hover names from Redefine-owned source, generated markup, demo configuration, and documentation. No compatibility alias SHALL reintroduce a retired value.

#### Scenario: Theme source is searched after migration

- **WHEN** Redefine-owned source is searched for retired background, text, border, shadow, or generic hover names
- **THEN** no active consumer, token, helper, configuration entry, or documentation reference remains outside migration guidance

#### Scenario: Demo site uses the numbered system

- **WHEN** the canonical demo is generated with the updated theme
- **THEN** its markup and CSS use numbered RD colors, direct structural borders, `--rd-primary-text`, and the retained shadow token without compatibility aliases
