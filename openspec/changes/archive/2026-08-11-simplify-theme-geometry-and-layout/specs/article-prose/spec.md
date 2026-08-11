## ADDED Requirements

### Requirement: Article modules use subordinate corner geometry

Theme-owned media and writing modules inside article prose SHALL use corner radii that remain visually subordinate to the route-level article shell. The default configurable article image radius SHALL be `12px`, and nested code, table, callout, tab, folding, copyright, and equivalent content surfaces SHALL normally use Tailwind's default `rounded-xl` radius or a smaller role-appropriate default.

#### Scenario: Article uses the default image radius

- **WHEN** a site does not override `articles.style.image_border_radius`
- **THEN** Markdown images render with a `12px` radius

#### Scenario: Article overrides the image radius

- **WHEN** a site provides a supported `articles.style.image_border_radius` value
- **THEN** the generated article image style uses that normalized configured value

#### Scenario: Nested writing module renders

- **WHEN** a code block, table, callout, tab group, folding block, copyright panel, or equivalent theme-owned module appears inside article content
- **THEN** its outer radius is smaller than the route-level article shell radius
- **AND** connected child regions rely on clipping or derived corner geometry instead of repeating the same outer radius

#### Scenario: Third-party content appears inside prose

- **WHEN** third-party markup owns an internal control, state, or branded surface inside article content
- **THEN** the theme does not normalize that integration's internal radius solely to match article modules
