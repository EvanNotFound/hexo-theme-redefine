## MODIFIED Requirements

### Requirement: Developer documentation describes the current workspace

The English and Chinese developer documentation MUST describe the repository-root
pnpm workflow, including frozen-lockfile installation, the `pnpm dev` local demo
flow, the initial browser JavaScript build performed by `pnpm dev`, `pnpm clean`,
the available build commands, the `dev/site` demo location, and the distinction
between editable source files and ignored generated build output. The guide MUST
identify Node.js 24 and the pnpm 11 version declared by the repository's
`packageManager` field.

#### Scenario: Contributor starts local development

- **WHEN** a contributor follows the developer setup guide from the repository
  root
- **THEN** the guide instructs them to install dependencies with
  `pnpm install --frozen-lockfile` and start the demo with `pnpm dev`
- **AND** the guide explains that `pnpm dev` initializes browser JavaScript,
  runs the demo from `dev/site`, and watches CSS

#### Scenario: Contributor builds or resets the workspace

- **WHEN** a contributor needs to reset, build, or watch the theme
- **THEN** the guide documents `pnpm clean`, `pnpm run build`,
  `pnpm run build:css`, and `pnpm run build:js`
- **AND** it identifies `source/css/build/` and `source/js/build/` as generated
  output that is not committed or edited manually

#### Scenario: Contributor uses the repository toolchain

- **WHEN** a contributor checks the documented runtime prerequisites
- **THEN** the guide identifies Node.js 24 and pnpm 11.20.0 as the workspace
  toolchain
