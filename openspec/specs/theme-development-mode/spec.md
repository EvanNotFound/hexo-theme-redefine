# Theme Development Mode Specification

## Purpose

Define how source assets and generated assets are used during local theme development and production-like builds.

## Requirements

### Requirement: Developer mode serves source JavaScript modules

When the theme developer mode is enabled, generated pages SHALL reference the JavaScript source entrypoints and source-relative imports rather than requiring production JavaScript build output.

#### Scenario: Demo development server starts from source

- **WHEN** the canonical demo development command starts with developer mode enabled
- **THEN** the generated page loads `source/js/main.js` through the theme's developer asset path and can resolve its local module imports

#### Scenario: JavaScript build output is absent

- **WHEN** developer mode is enabled and generated JavaScript build output does not exist
- **THEN** the development page still loads the source application successfully

### Requirement: Development CSS remains observable and current

The development workflow SHALL continue watching Tailwind source inputs and SHALL render readable Stylus output using the active demo-site configuration.

#### Scenario: Tailwind source changes

- **WHEN** a contributor changes a Tailwind source file, layout class, or registered script source
- **THEN** the development Tailwind stylesheet is regenerated without requiring a separate manual build command

#### Scenario: Stylus source changes

- **WHEN** a contributor changes a Stylus source file while the demo server is running
- **THEN** Hexo renders the changed configuration-dependent stylesheet in developer-readable form

### Requirement: Developer and production asset modes are explicit

The theme SHALL keep a clear distinction between source assets used for local development and generated assets used for production, preview, and publication.

#### Scenario: Production-like preview is requested

- **WHEN** a contributor runs the production build and generated-site workflow
- **THEN** the generated page uses the bundled JavaScript, optimized Tailwind CSS, and compressed Stylus output

#### Scenario: Source debugging is requested

- **WHEN** a contributor enables developer mode
- **THEN** browser debugging points to source JavaScript modules and readable Stylus output without changing the production asset contract

### Requirement: Lazy source modules work without a bundler in development

Optional features converted to dynamic imports SHALL remain resolvable from the source module tree when developer mode is enabled.

#### Scenario: Optional feature is needed during development

- **WHEN** a developer-mode page enables or contains a lazily loaded feature
- **THEN** the browser resolves the feature's source module through a relative dynamic import and initializes it normally

#### Scenario: Optional feature is unused during development

- **WHEN** a developer-mode page does not enable or contain an optional feature
- **THEN** its source module is not requested during initial startup
