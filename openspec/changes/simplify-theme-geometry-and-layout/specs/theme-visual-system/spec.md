## ADDED Requirements

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

## MODIFIED Requirements

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
