## MODIFIED Requirements

### Requirement: Developer mode serves bundled JavaScript with source maps

When theme developer mode is enabled, generated pages SHALL reference an
unminified esbuild application under `source/js/build/dev/`. The development
build SHALL resolve the same local npm dependency graph as production, emit
source maps and stable lazy chunk names, and rebuild when browser JavaScript
source changes.

#### Scenario: Demo development server starts

- **WHEN** the canonical demo development command starts with developer mode enabled
- **THEN** esbuild completes the initial development application build before Hexo starts
- **AND** the generated page loads `source/js/build/dev/main.js` through the theme's local asset path

#### Scenario: Browser JavaScript changes

- **WHEN** a contributor changes browser JavaScript while `pnpm dev` is running
- **THEN** esbuild rebuilds the unminified development entry and affected lazy chunks
- **AND** the contributor can load the update by refreshing the browser manually

### Requirement: Development CSS remains observable and current

The development workflow SHALL continue watching Tailwind source inputs and SHALL render readable Stylus output using the active demo-site configuration.

#### Scenario: Tailwind source changes

- **WHEN** a contributor changes a Tailwind source file, layout class, or registered script source
- **THEN** the development Tailwind stylesheet is regenerated without requiring a separate manual build command

#### Scenario: Stylus source changes

- **WHEN** a contributor changes a Stylus source file while the demo server is running
- **THEN** Hexo renders the changed configuration-dependent stylesheet in developer-readable form

### Requirement: Developer and production asset modes are explicit

The theme SHALL keep separate development and production application outputs under the ignored JavaScript build directory. Development output SHALL be unminified with stable chunk names, while production output SHALL remain minified with hashed lazy chunks.

#### Scenario: Production-like preview is requested

- **WHEN** a contributor runs the production build and generated-site workflow
- **THEN** the generated page uses the minified production JavaScript, optimized Tailwind CSS, and compressed Stylus output

#### Scenario: Development debugging is requested

- **WHEN** a contributor runs `pnpm dev`
- **THEN** browser debugging uses source maps from the unminified development bundle without changing the production asset contract

### Requirement: Lazy application features resolve through esbuild in development

Optional features converted to dynamic imports and their npm dependencies SHALL be bundled into stable development chunks when developer mode is enabled.

#### Scenario: Optional feature is needed during development

- **WHEN** a developer-mode page enables or contains a lazily loaded feature
- **THEN** the browser requests its local development chunk and initializes it normally

#### Scenario: Optional feature is unused during development

- **WHEN** a developer-mode page does not enable or contain an optional feature
- **THEN** its development chunk is not requested during initial startup
