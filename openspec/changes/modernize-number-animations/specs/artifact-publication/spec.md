## MODIFIED Requirements

### Requirement: Published npm packages contain generated assets

The release process MUST build the tagged theme source through the standard
package publication lifecycle before npm publication, and the npm package MUST
include the resulting `source/` tree, including built CSS, built JavaScript, and
JavaScript source maps.

#### Scenario: Release package is built

- **WHEN** the npm release workflow publishes a tagged theme version with pnpm
- **THEN** the package's prepublication lifecycle runs the root build
- **AND** the published package contains `source/css/build/theme.css` and the generated files under `source/js/build/`

#### Scenario: Package contents are inspected

- **WHEN** the release package is checked with a dry-run package listing after the root build
- **THEN** the built source files are included
- **AND** generated local state outside the package allowlist is not required
