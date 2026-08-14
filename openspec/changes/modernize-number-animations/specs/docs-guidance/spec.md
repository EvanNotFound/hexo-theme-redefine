## MODIFIED Requirements

### Requirement: Developer documentation describes the current workspace

The English and Chinese developer documentation MUST describe the repository-root
pnpm workflow, including Node.js 24, the repository's pnpm 11 version,
frozen-lockfile installation, the `pnpm dev` local demo flow, `pnpm clean`, the
outcome-oriented build and validation commands, the `dev/site` demo location, and the distinction
between editable source files and ignored generated build output. It MUST
identify `dev/site` as the canonical source for local development and deployed
demos, explain that local development watches an unminified esbuild application
and Tailwind CSS, state that JavaScript changes require manual browser refresh,
and document the deployed preview and production CDN behavior.

#### Scenario: Contributor starts local development

- **WHEN** a contributor follows the developer setup guide from the repository root
- **THEN** the guide instructs them to install dependencies with `pnpm install --frozen-lockfile` and start the demo with `pnpm dev`
- **AND** the guide explains that the demo runs from `dev/site`, watches an unminified JavaScript bundle and Tailwind CSS, and requires manual refresh after JavaScript changes

#### Scenario: Contributor builds, validates, or resets the workspace

- **WHEN** a contributor needs to reset, build, test, or validate the theme
- **THEN** the guide documents `pnpm clean`, `pnpm build`, `pnpm test`, and `pnpm check`
- **AND** it explains that `pnpm dev` owns JavaScript and CSS watching without exposing the internal build and watch helpers as package commands
- **AND** it explains that `pnpm clean` removes all root-owned generated theme and demo state
- **AND** it identifies `source/css/build/` and `source/js/build/` as ignored generated output that must not be edited manually
- **AND** it identifies `source/assets/` as checked-in runtime source

#### Scenario: Contributor validates documentation

- **WHEN** a contributor changes documentation code or content
- **THEN** repository guidance instructs them to run the docs package's `pnpm check` command, which performs lint and type validation

#### Scenario: Contributor uses the repository toolchain

- **WHEN** a contributor checks the documented runtime prerequisites
- **THEN** the guide identifies Node.js 24 and pnpm 11.20.0 as the workspace toolchain

#### Scenario: Contributor interprets deployed demo behavior

- **WHEN** a contributor reads the demo deployment guidance
- **THEN** it identifies `dev/site` as the source used by PR previews, branch previews, and the production demo
- **AND** it explains that deployed builds disable developer mode
- **AND** it documents local preview assets and the production versioned CDN policy
