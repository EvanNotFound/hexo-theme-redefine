# Docs Guidance Specification

## Purpose

Define the supported installation, update, and contributor-development guidance
for Theme Redefine's public documentation.

## Requirements

### Requirement: Public installation uses package registries

Public README, Quick Start, and migration documentation MUST document npm and
pnpm registry commands as the supported methods for installing and updating the
published theme, and MUST NOT present Git clone or Git pull as an end-user
theme installation or update method.

#### Scenario: User installs the theme

- **WHEN** a user follows the installation instructions
- **THEN** the instructions provide `npm install hexo-theme-redefine@latest`
  and `pnpm add hexo-theme-redefine@latest` options
- **AND** no Git-based theme installation option is shown

#### Scenario: User updates the theme

- **WHEN** a user follows the update instructions
- **THEN** the instructions provide npm installation and
  `pnpm update hexo-theme-redefine --latest` options
- **AND** no Git pull or Git clone update path is shown

### Requirement: README development guidance stays concise

The English, Simplified Chinese, and Traditional Chinese README files MUST keep
development guidance concise and link to the developer documentation for the
full contributor workflow.

#### Scenario: Contributor reads the README

- **WHEN** a contributor reaches the README development section
- **THEN** the README points to the developer guide
- **AND** it does not duplicate the full local setup and build procedure

### Requirement: Developer documentation describes the current workspace

The English and Chinese developer documentation MUST describe the repository-root
pnpm workflow, including Node.js 24, the repository's pnpm 11 version,
frozen-lockfile installation, the `pnpm dev` local demo flow, `pnpm clean`, the
available build commands, the `dev/site` demo location, and the distinction
between editable source files and ignored generated build output. It MUST
identify `dev/site` as the canonical source for local development and deployed
demos, explain that local development applies a dedicated override to serve
source modules with developer mode enabled, and document that every deployed
demo uses checked-out assets with developer mode and CDN disabled.

#### Scenario: Contributor starts local development

- **WHEN** a contributor follows the developer setup guide from the repository
  root
- **THEN** the guide instructs them to install dependencies with
  `pnpm install --frozen-lockfile` and start the demo with `pnpm dev`
- **AND** the guide explains that the demo runs from `dev/site`, serves source
  JavaScript modules, and watches Tailwind CSS

#### Scenario: Contributor builds or resets the workspace

- **WHEN** a contributor needs to reset, build, or watch the theme
- **THEN** the guide documents `pnpm clean`, `pnpm run build`,
  `pnpm run build:css`, and `pnpm run build:js`
- **AND** it identifies `source/css/build/` and `source/js/build/` as ignored
  generated output that must not be edited manually
- **AND** it identifies `source/assets/` as checked-in runtime source

#### Scenario: Contributor uses the repository toolchain

- **WHEN** a contributor checks the documented runtime prerequisites
- **THEN** the guide identifies Node.js 24 and pnpm 11.20.0 as the workspace
  toolchain

#### Scenario: Contributor interprets deployed demo behavior

- **WHEN** a contributor reads the demo deployment guidance
- **THEN** it identifies `dev/site` as the source used by PR previews, branch
  previews, and the production demo
- **AND** it explains the full deployed configuration and local-development
  override without tracked configuration rewrites
- **AND** it documents that deployed builds disable developer mode and CDN use

### Requirement: Localized documentation remains aligned

The English and Chinese versions of each changed documentation page MUST contain
matching commands, paths, workflow steps, and user-visible installation rules.

#### Scenario: Documentation is reviewed across locales

- **WHEN** a changed page is compared between `en` and `zh`
- **THEN** both locales cover the same workflow and installation behavior
- **AND** technical literals such as commands, paths, and URLs remain unchanged

### Requirement: JavaScript guide uses current source paths

The JavaScript development guides MUST refer to repository-relative source paths
such as `source/js/**` and `scripts/**`, while identifying
`dev/site/themes/redefine/` as generated local linking state rather than the
primary source location.

#### Scenario: Contributor locates JavaScript source

- **WHEN** a contributor uses the JavaScript guide to find or add theme code
- **THEN** the guide points them to repository-relative source directories
- **AND** it distinguishes editable source from generated build output
