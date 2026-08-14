# Theme Visual System Specification

## Purpose

Define the theme's structural borders, static depth, and interaction-effect contract.

## Requirements

### Requirement: Numbered RD colors have fixed roles

Redefine SHALL provide a mode-aware numbered color foundation consisting of `--rd-background-100`, `--rd-background-200`, solid `--rd-gray-100` through `--rd-gray-1000`, and translucent `--rd-gray-alpha-100` through `--rd-gray-alpha-1000`. The background levels SHALL represent primary and alternate page backgrounds; gray levels 100 through 300 SHALL represent increasingly visible neutral component backgrounds; gray levels 400 through 600 SHALL represent increasingly visible component borders; gray levels 700 and 800 SHALL represent default and hover high-contrast component backgrounds; and gray levels 900 and 1000 SHALL represent secondary and primary text and icons. Each gray-alpha level SHALL mirror the corresponding solid gray role when transparency is required, with gray-alpha 400 representing the standard structural border.

#### Scenario: Contributor chooses a page background

- **WHEN** a theme-owned page, panel, card, or alternate page region needs a neutral background
- **THEN** it uses `--rd-background-100` or `--rd-background-200` according to the documented level
- **AND** it does not introduce a component-specific card, panel, or popover alias for the same value

#### Scenario: Contributor chooses a component state

- **WHEN** a neutral control or nested component needs default, hover, or active differentiation
- **THEN** it uses the applicable `--rd-gray-100`, `--rd-gray-200`, or `--rd-gray-300` level

#### Scenario: Contributor chooses a component border

- **WHEN** a neutral component border needs default, hover, or active differentiation
- **THEN** it uses the applicable `--rd-gray-400`, `--rd-gray-500`, or `--rd-gray-600` level

#### Scenario: Contributor chooses a high-contrast component background

- **WHEN** a neutral high-contrast component needs default or hover differentiation
- **THEN** it uses `--rd-gray-700` or `--rd-gray-800`, respectively

#### Scenario: Contributor needs a translucent gray

- **WHEN** a numbered gray role must allow the underlying surface to show through
- **THEN** it uses the corresponding `--rd-gray-alpha-*` level

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

#### Scenario: A template uses the Redefine shadow utility

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

### Requirement: Static shadows are limited to genuine depth

Redefine-owned route-level content shells and components whose role requires visual elevation SHALL use the single static `--rd-shadow` token or `shadow-rd` utility. Floating tools and overlays MAY use the same treatment. Repeated cards, buttons, tables, images, nested writing modules, and third-party internals MUST NOT receive the shadow without an explicit elevated role. Static shadows MUST NOT include a fake one-pixel border, inset border, or hover-specific replacement.

#### Scenario: A framed route-level surface renders

- **WHEN** a primary article, standard page, or equivalent route shell is displayed as an inset surface
- **THEN** it uses the static `--rd-shadow` treatment together with its structural border

#### Scenario: A floating Redefine surface renders

- **WHEN** a component identified as a floating tool or overlay renders
- **THEN** it may use the static `--rd-shadow` treatment without a redefined shadow variant

#### Scenario: A nested flat surface renders

- **WHEN** a repeated card, nested article module, table, image, button, or equivalent non-elevated surface renders
- **THEN** it uses a structural border or no decoration without the route-shell shadow

#### Scenario: A static shadow surface is hovered

- **WHEN** a static-shadow surface is hovered
- **THEN** its shadow does not change to a hover or inset variant

### Requirement: Route-level content shells share one treatment

Article, standard page, and equivalent framed route-level content shells SHALL use the same one-pixel `--rd-gray-alpha-400` structural border, Tailwind `rounded-2xl` radius, background, and static `--rd-shadow` elevation on layouts where they appear as inset surfaces. Archive routes SHALL render their chronological index without a framed route shell. Repeated cards, sidebar panels, and nested article modules MUST NOT receive the route-shell shadow solely because they have a border.

#### Scenario: Framed route content renders

- **WHEN** an article, standard page, or equivalent framed route is displayed above the mobile edge-to-edge layout
- **THEN** its primary content shell has the `--rd-gray-alpha-400` structural border, `rounded-2xl` radius, and `shadow-rd` elevation

#### Scenario: Archive timeline renders

- **WHEN** an archive route displays its chronological index
- **THEN** the index remains unframed within the shared main-content width
- **AND** it does not receive a route-shell border, radius, background, or shadow

#### Scenario: Repeated content renders inside a route

- **WHEN** a home card, sidebar panel, article module, or other repeated nested surface renders
- **THEN** it uses its component-owned border and background treatment without inheriting the route-shell shadow

#### Scenario: Route content becomes edge-to-edge

- **WHEN** a supported mobile layout flattens a route-level content shell against the viewport
- **THEN** its border, radius, and shadow are removed together

### Requirement: Generic scaling and shadow hover effects are removed

Redefine SHALL NOT provide the `redefine-container` or `hover-style` behavior, generic hover scaling, generic hover shadow changes, or Redefine-owned active scale feedback. The theme SHALL preserve unrelated responsive transforms, image-viewer zoom behavior, animations, and meaningful color/background/focus states.

#### Scenario: A former container-backed layout surface renders

- **WHEN** an article, page, archive, tag, sidebar, submenu, or homepage surface renders
- **THEN** its layout styles come from the owning component and it does not receive implicit container hover scaling or shadow behavior

#### Scenario: A Redefine-owned control is hovered or activated

- **WHEN** a button, paginator item, category item, tag item, or tool control is hovered or activated
- **THEN** it does not scale or swap to a hover shadow, while any intentional color, background, focus, or visibility state remains available

#### Scenario: An unrelated transform remains in use

- **WHEN** responsive sizing, image viewing, animation, or a third-party integration requires a transform
- **THEN** that transform remains unaffected by removal of the generic hover system

### Requirement: The retired visual API is removed consistently

The theme SHALL remove `--rd-border`, ordinal background and text variables, numbered transparent-background variables, unused link/copyright/inverse-text aliases, retired home-banner icon color aliases, and the earlier redefined shadow and generic hover names from Redefine-owned source, generated markup, demo configuration, and documentation. No compatibility alias SHALL reintroduce a retired value.

#### Scenario: Theme source is searched after migration

- **WHEN** Redefine-owned source is searched for retired background, text, border, shadow, or generic hover names
- **THEN** no active consumer, token, helper, configuration entry, or documentation reference remains outside migration guidance

#### Scenario: Demo site uses the numbered system

- **WHEN** the canonical demo is generated with the updated theme
- **THEN** its markup and CSS use numbered RD colors, direct structural borders, `--rd-primary-text`, and the retained shadow token without compatibility aliases
