# Canonical Demo Site Specification

## Purpose

Define the ownership and content boundary of the Redefine demo site used for local development and deployed demonstrations.

## Requirements

### Requirement: The monorepo owns the canonical demo site

The repository MUST maintain the canonical Hexo demo site under `dev/site`, and local development and deployment workflows MUST use that path as their site source.

#### Scenario: Contributor starts the local demo

- **WHEN** a contributor runs `pnpm dev` from the repository root
- **THEN** Hexo serves the site whose configuration and content are under `dev/site`
- **AND** the current root theme is linked into `dev/site/themes/redefine`

#### Scenario: Deployment checks out the monorepo

- **WHEN** a preview or production deployment runs
- **THEN** it generates the site from the checked-out `dev/site` directory
- **AND** it does not clone `EvanNotFound/redefine-demo` as a build input

### Requirement: The demo uses the workspace dependency model

The demo site MUST remain a private pnpm workspace package using the repository's root `pnpm-lock.yaml`. The migrated site MUST NOT require its own npm lockfile, Git metadata, or bundled unused theme checkout.

#### Scenario: CI installs the demo dependencies

- **WHEN** CI runs the repository installation step
- **THEN** the root frozen-lockfile installation resolves the `dev/site` dependencies
- **AND** CI does not perform a second theme installation inside the demo site

### Requirement: The canonical content is curated

The canonical demo MUST combine the external demo's maintained public content with durable local theme regression coverage. Temporary duplicate fixtures, boilerplate, stale deployment tutorials, unrelated personal articles, and filler posts MUST NOT remain in the deployed content set.

#### Scenario: Demo content is migrated

- **WHEN** the external and embedded site content is consolidated
- **THEN** colliding paths have one intentionally selected final version
- **AND** retained regression pages cover representative Markdown, code, images/math, Mermaid, tabs, nested paths, long titles, and theme layouts
- **AND** duplicate/random content is absent from generated pages

### Requirement: Local development enables developer mode

The canonical demo MUST keep a full deployed configuration in `dev/site/_config.redefine.yml` and a local-development override in `dev/site/_config.redefine.dev.yml`. The `pnpm dev` command MUST apply the local override without rewriting either tracked file so the demo serves source modules and supports live theme development.

#### Scenario: Local mode starts

- **WHEN** `pnpm dev` starts Hexo
- **THEN** Hexo merges the local-development override over the full demo configuration
- **AND** the effective configuration has `developer.enable` set to `true`
- **AND** the local demo does not depend on versioned CDN theme assets

#### Scenario: Demo configuration is maintained

- **WHEN** theme configuration defaults or demo-specific values change
- **THEN** the full deployed demo configuration is kept current with the theme defaults
- **AND** the local-development file remains limited to explicit development overrides
