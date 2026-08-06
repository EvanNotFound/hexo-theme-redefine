# Demo Deployment Mode Specification

## Purpose

Define how CI generates preview and production demo output from the canonical
workspace site.

## ADDED Requirements

### Requirement: Deployed builds disable developer mode

Every PR preview, branch preview, and production demo build MUST set
`developer.enable` to `false` in the effective demo configuration before Hexo
generation. The tracked local-development configuration MUST remain enabled.

#### Scenario: Preview output is generated

- **WHEN** a PR or `dev` branch preview is built
- **THEN** Hexo generates the site with developer mode disabled
- **AND** generated pages reference built theme assets rather than source theme
  modules

#### Scenario: Production output is generated

- **WHEN** the production demo is built
- **THEN** Hexo generates the site with developer mode disabled
- **AND** the checked-in local-development configuration is not permanently
  rewritten

### Requirement: Deployment CDN behavior is target-specific

Preview builds MUST use checked-out local theme assets with CDN disabled.
Production demo builds MUST preserve the existing versioned published CDN
behavior.

#### Scenario: Preview assets are local

- **WHEN** a PR or branch preview is generated
- **THEN** the effective configuration has CDN disabled
- **AND** generated asset references resolve against the checked-out theme build

#### Scenario: Production assets use the published CDN

- **WHEN** the production demo is generated
- **THEN** the effective configuration retains production CDN usage
- **AND** generated theme asset references use the configured versioned provider

### Requirement: CI builds the local theme and site once

Deployment workflows MUST install the workspace once, build the root theme
assets, link the root theme into `dev/site/themes/redefine`, and generate from
`dev/site`. They MUST NOT clone the external demo repository, move the theme
checkout into another site, remove an installed theme package, or install the
theme as a nested package.

#### Scenario: Branch or production deployment runs

- **WHEN** the deployment workflow prepares Hexo output
- **THEN** the generated output directory belongs to `dev/site`
- **AND** the deployment action receives that generated site output
- **AND** no external demo checkout is involved

### Requirement: Preview and production deployment boundaries remain usable

The workflow changes MUST preserve the existing preview aliases, production
domain, Vercel credentials, and PR preview artifact/deploy boundary.

#### Scenario: Preview is deployed

- **WHEN** a preview generation succeeds
- **THEN** the existing preview deployment action can deploy the generated output
- **AND** the existing preview aliases remain available

#### Scenario: Production is deployed

- **WHEN** the production generation succeeds
- **THEN** the existing production deployment action can deploy the generated
  output to the production demo domain
