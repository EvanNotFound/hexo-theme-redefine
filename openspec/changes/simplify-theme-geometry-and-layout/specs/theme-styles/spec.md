## ADDED Requirements

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
