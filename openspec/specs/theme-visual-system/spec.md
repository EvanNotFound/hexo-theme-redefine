# Theme Visual System Specification

## Purpose

Define the theme's structural borders, static depth, and interaction-effect contract.

## Requirements

### Requirement: Redefine provides semantic mode-aware visual tokens

The theme SHALL provide a canonical `--rd-border` token for structural borders and a canonical `--rd-shadow` token for static depth. Both tokens MUST resolve to appropriate values in light and dark modes, and `--rd-shadow` MUST contain a complete `box-shadow` value rather than only a color.

#### Scenario: Light mode tokens are available

- **WHEN** the theme renders in light mode
- **THEN** `--rd-border` resolves to the light structural border color and `--rd-shadow` resolves to the light static shadow value

#### Scenario: Dark mode tokens are available

- **WHEN** the theme renders in dark mode
- **THEN** `--rd-border` resolves to the dark structural border color and `--rd-shadow` resolves to the dark static shadow value

### Requirement: Tailwind exposes the canonical tokens without overriding defaults

The Tailwind source SHALL map `--rd-border` into a `--color-*` theme variable and `--rd-shadow` into a `--shadow-*` theme variable. The mappings MUST expose `border-rd-border` and `shadow-rd` utilities, and MUST NOT replace Tailwind's built-in `shadow-sm`, `shadow-md`, `shadow-lg`, or other default shadow utilities.

#### Scenario: A template uses the Redefine border utility

- **WHEN** a Redefine-owned template contains `border-rd-border`
- **THEN** the generated Tailwind CSS applies the current `--rd-border` value

#### Scenario: A template uses the Redefine shadow utility

- **WHEN** a Redefine-owned template contains `shadow-rd`
- **THEN** the generated Tailwind CSS applies the current `--rd-shadow` value

#### Scenario: A host uses a built-in Tailwind shadow utility

- **WHEN** a host site uses `shadow-md` or another built-in Tailwind shadow utility
- **THEN** the Redefine token mapping does not change that utility's meaning

### Requirement: Flat visual treatments use real borders

Redefine-owned surfaces that previously used a flat redefined shadow as a border SHALL use a one-pixel border based on `--rd-border` or the equivalent `border-rd-border` utility. These surfaces MUST NOT use a zero-offset shadow to simulate a border.

#### Scenario: A former flat-shadow surface renders normally

- **WHEN** a card, button, table, code block, content panel, or equivalent former flat-shadow surface renders
- **THEN** it has the intended structural border from `--rd-border` and does not require a flat redefined shadow

#### Scenario: A former flat-shadow surface is hovered

- **WHEN** a former flat-shadow surface is hovered
- **THEN** its structural border remains stable and no generic inset or flat shadow is added

### Requirement: Static shadows are limited to genuine depth

Redefine-owned route-level content shells and components whose role requires visual elevation SHALL use the single static `--rd-shadow` token or `shadow-rd` utility. Floating tools and overlays MAY use the same treatment. Repeated cards, buttons, tables, images, nested writing modules, and third-party internals MUST NOT receive the shadow without an explicit elevated role. Static shadows MUST NOT include a fake one-pixel border, inset border, or hover-specific replacement.

#### Scenario: A framed route-level surface renders

- **WHEN** a primary article, standard page, archive, or equivalent route shell is displayed as an inset surface
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

Article, standard page, archive, and equivalent framed route-level content shells SHALL use the same one-pixel `--rd-border` structural border, Tailwind `rounded-2xl` radius, background, and static `--rd-shadow` elevation on layouts where they appear as inset surfaces. Repeated cards, sidebar panels, and nested article modules MUST NOT receive the route-shell shadow solely because they have a border.

#### Scenario: Framed route content renders

- **WHEN** an article, standard page, archive, or equivalent framed route is displayed above the mobile edge-to-edge layout
- **THEN** its primary content shell has the canonical structural border, `rounded-2xl` radius, and `shadow-rd` elevation

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

The theme SHALL remove old `redefine-box-shadow*`, `shadow-redefine*`, flat hover, shadow color variant, and global hover configuration names from Redefine-owned source, generated markup, demo configuration, and bilingual documentation. No compatibility alias SHALL reintroduce the retired variants.

#### Scenario: The theme source is searched after migration

- **WHEN** Redefine-owned source is searched for retired redefined shadow or generic hover names
- **THEN** no active consumer, token, helper, configuration entry, or documentation reference remains

#### Scenario: The demo site uses the new system

- **WHEN** the demo site is built with the updated theme
- **THEN** its generated CSS and markup use actual borders and the new semantic tokens without requiring the retired configuration or utility names
