## ADDED Requirements

### Requirement: Runtime color mappings resolve at the consumer

Redefine SHALL declare Tailwind mappings that reference mode-aware or generated runtime color variables with `@theme inline`. A generated utility MUST resolve the current light/dark or configured value where the utility is applied rather than relying on a separately inherited theme variable.

#### Scenario: Color mode changes

- **WHEN** the root document switches between light and dark mode
- **THEN** numbered RD background, gray, border, and text utilities resolve to the matching mode values

#### Scenario: Opacity modifier is used

- **WHEN** theme-owned markup uses an opacity modifier such as `bg-rd-background-100/40`
- **THEN** Tailwind derives the requested alpha from the current RD color
- **AND** the theme does not require a precomposed numbered transparent-background variable

### Requirement: Color migration uses the numbered foundation directly

Theme-owned markup and native CSS SHALL use the numbered RD foundation directly according to its documented ranges. The theme MUST NOT add shadcn-style card, popover, sidebar, foreground, muted-foreground, or equivalent component aliases when a numbered RD value already expresses the required color.

#### Scenario: Theme-owned component is migrated

- **WHEN** an existing component uses an ordinal background, text, or border variable
- **THEN** the component selects the applicable numbered RD level from its visible role and interaction state
- **AND** it does not receive a new component-specific color alias

#### Scenario: Third-party adapter is migrated

- **WHEN** bundled APlayer or comment-system CSS needs a Redefine neutral background, border, or text color
- **THEN** the adapter maps that vendor role to the applicable numbered RD value
- **AND** vendor-owned status, branding, and syntax colors remain unchanged

## MODIFIED Requirements

### Requirement: Existing theme configuration remains effective

Every supported theme configuration value currently consumed by the native style system SHALL continue to affect the generated site through validated CSS custom properties, template conditions, state attributes, or selected plugin styles. This change MUST NOT require users to rename or replace existing supported `_config.yml` options. The documented Hex `colors.primary` value SHALL also determine `--rd-primary-text` through contrast comparison.

#### Scenario: User changes a configurable visual value

- **WHEN** a consuming site changes a supported color, width, font, spacing, radius, alignment, or equivalent visual setting
- **THEN** the generated page exposes the normalized value and the matching theme styles use it

#### Scenario: User changes primary color

- **WHEN** a consuming site supplies a documented Hex `colors.primary` value
- **THEN** the generated page uses that primary color
- **AND** it generates the stronger-contrast `--rd-primary-text` candidate for text and icons on primary backgrounds

#### Scenario: User changes a conditional style option

- **WHEN** a consuming site selects a supported code style, code theme, comment system, sidebar mode, tag mode, or player mode
- **THEN** the generated markup and loaded styles reflect that selection without compiling Stylus in the consuming site

#### Scenario: User switches color mode

- **WHEN** the theme applies its light or dark mode class
- **THEN** mode-aware numbered RD values resolve to the corresponding theme values

### Requirement: The migration preserves visible behavior

The color-system migration SHALL preserve the theme's responsive layout, interactions, configuration results, component-specific functional colors, and third-party integration behavior while applying the approved neutral background/state tuning and primary-text contrast correction.

#### Scenario: Representative theme pages are generated

- **WHEN** home, article, archive, category, tag, custom page, and plugin fixture pages are rendered after the migration
- **THEN** their intended layout, interactions, and integrations remain available
- **AND** their neutral backgrounds, borders, text, and icons use the approved numbered RD levels

#### Scenario: Functional component color renders

- **WHEN** a callout, code theme, status, selection, home-banner text, or vendor-owned state requires a component-specific or configured color
- **THEN** that color remains owned by the applicable component or configuration rather than being forced into the neutral RD scale
