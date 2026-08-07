# Style Build Specification

## Purpose

Define how theme CSS is authored, built, conditionally loaded, verified, and published.

## Requirements

### Requirement: Theme CSS is built from one explicit core entry

The theme SHALL provide one explicit native CSS entry that imports project-owned
base and component styles in a visible order and includes Tailwind's registered
EJS and script sources. The production CSS build SHALL emit a minified core
stylesheet under the theme's generated CSS directory.

#### Scenario: Production CSS is built

- **WHEN** the focused CSS build or normal production build completes
- **THEN** it emits the minified core theme stylesheet containing current
  Tailwind utilities and imported native CSS

#### Scenario: A new source file is added

- **WHEN** a contributor adds a base or component stylesheet
- **THEN** the file affects output only after it is explicitly imported by the
  appropriate entry or index file

### Requirement: Optional plugin styles remain separate

Large or optional third-party styles SHALL be emitted as named plugin assets and
loaded only when the corresponding supported theme feature or selected theme is
active. The core stylesheet MUST NOT include every comment system, player mode,
and code theme solely to avoid conditional loading.

#### Scenario: Optional plugin is disabled

- **WHEN** a comment system, APlayer, Odometer, or equivalent optional feature is
  disabled
- **THEN** its dedicated stylesheet is not loaded solely because the core build
  ran

#### Scenario: Configured plugin style is selected

- **WHEN** a consuming site selects a supported comment system or code theme
- **THEN** the generated page loads the corresponding published style asset

### Requirement: Consuming sites do not need a stylesheet renderer

Published theme packages SHALL contain the generated core and plugin CSS needed
at runtime. A consuming Hexo site MUST NOT need Stylus, Sass, Less, or another
stylesheet renderer to apply Redefine's supported styles and configuration.

#### Scenario: Theme is installed from the package registry

- **WHEN** a user installs the completed major release into a supported Hexo
  site
- **THEN** the theme renders its CSS without asking the user to install a
  stylesheet renderer

#### Scenario: Published package is inspected

- **WHEN** the release package is packed after the production build
- **THEN** it contains the required generated CSS assets and their authored
  source files

### Requirement: Development keeps CSS output current

The development command SHALL watch the native CSS entry, imported project
styles, EJS templates, and generated-markup script sources needed by Tailwind.
Generated development pages SHALL load current CSS without requiring a manual
rebuild after a watched source change.

#### Scenario: Contributor edits a style source

- **WHEN** a contributor changes native CSS or a Tailwind class in a registered
  template or script while the development server is running
- **THEN** the generated development stylesheet is rebuilt and the served site
  receives the current output

### Requirement: CSS verification covers the generated theme

The repository SHALL provide a documented verification command that builds
owned CSS and performs a complete demo Hexo generation. The command SHALL fail
for CSS syntax errors, missing imports or outputs, and configuration-dependent
rendering failures.

#### Scenario: CSS source is invalid

- **WHEN** a contributor introduces invalid CSS or a missing stylesheet import
- **THEN** the CSS verification command exits unsuccessfully

#### Scenario: CSS and demo generation succeed

- **WHEN** all core, plugin, template, and configuration style paths are valid
- **THEN** the CSS verification command completes successfully without requiring
  generated output to be committed

### Requirement: Stylus is removed after migration

After every active style owner has migrated, the theme SHALL remove the Stylus
entrypoint, renderer integration, demo dependency, and stylesheet link. The
build and contributor documentation MUST refer only to the native CSS/Tailwind
pipeline and generated plugin assets.

#### Scenario: Migration is complete

- **WHEN** the repository is searched for active theme Stylus inputs and renderer
  setup
- **THEN** no runtime style path depends on `.styl`, `hexo-config()` in a
  stylesheet, or `hexo-renderer-stylus`

#### Scenario: Contributor follows the CSS guide

- **WHEN** a contributor reads the aligned English or Chinese development guide
- **THEN** it explains the native CSS source tree, Tailwind ownership boundary,
  build and watch commands, generated outputs, and plugin style entries
