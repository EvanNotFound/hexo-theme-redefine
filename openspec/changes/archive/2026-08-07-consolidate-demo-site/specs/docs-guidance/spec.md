# Docs Guidance Delta

## MODIFIED Requirements

### Requirement: Developer documentation describes the current workspace

The English and Chinese developer documentation MUST describe the repository-root
pnpm workflow, including frozen-lockfile installation, the `pnpm dev` local demo
flow, `pnpm clean`, the available build commands, the `dev/site` demo location,
the distinction between editable source files and generated build output, and the
fact that `dev/site` is also the canonical source for deployed previews and the
production demo. It MUST explain that local development enables theme developer
mode, while CI deployments disable developer mode before generating the site.

#### Scenario: Contributor starts local development

- **WHEN** a contributor follows the developer setup guide from the repository
  root
- **THEN** the guide instructs them to install dependencies with
  `pnpm install --frozen-lockfile` and start the demo with `pnpm dev`
- **AND** the guide explains that the demo runs from `dev/site` in developer
  mode

#### Scenario: Contributor builds or resets the workspace

- **WHEN** a contributor needs to reset, build, or watch the theme
- **THEN** the guide documents `pnpm clean`, `pnpm run build`,
  `pnpm run build:css`, and `pnpm run build:js`
- **AND** it identifies generated files that must not be edited manually

#### Scenario: Contributor interprets deployed demo behavior

- **WHEN** a contributor reads the demo deployment guidance
- **THEN** it identifies `dev/site` as the source used by PR previews, branch
  previews, and the production demo
- **AND** it explains that deployed builds disable developer mode and use the
  target-specific CDN policy
