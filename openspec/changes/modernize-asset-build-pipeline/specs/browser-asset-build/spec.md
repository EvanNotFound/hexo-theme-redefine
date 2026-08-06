## ADDED Requirements

### Requirement: Production JavaScript uses a modern bundled application entry

The production JavaScript build SHALL target modern evergreen browsers and SHALL
emit a minified ES module for the theme application entrypoint. The build SHALL
generate source maps for the bundled application output.

#### Scenario: Application bundle is generated

- **WHEN** the production JavaScript build completes successfully
- **THEN** the generated JavaScript directory contains a minified module entry
  for the theme application and its corresponding source map

#### Scenario: Modern browser syntax is preserved

- **WHEN** the application entry is built
- **THEN** the output does not require legacy browser transpilation or runtime
  polyfills beyond the APIs already required by the theme

### Requirement: Optional application features are lazy loaded

Large optional or page-dependent application features SHALL be loaded only when
their configuration or page content requires them. The production build SHALL
emit the required feature chunks beside the application entry using relative
import paths.

#### Scenario: Feature is not needed

- **WHEN** a page does not enable or contain an optional feature
- **THEN** the browser does not request that feature's generated chunk during
  initial application startup

#### Scenario: Feature is needed

- **WHEN** a page enables or contains an optional feature
- **THEN** the application requests the corresponding chunk and initializes the
  feature after the chunk resolves

#### Scenario: Navigation occurs while a chunk is loading

- **WHEN** a Swup navigation replaces the page before a lazy feature chunk
  resolves
- **THEN** the stale chunk completion does not attach handlers to or mutate the
  replaced page

### Requirement: Standalone and vendor assets remain publishable

The production build SHALL emit independently referenced plugin entrypoints
needed by generated pages, including the APlayer browser script and the HBE ES
module. Vendor libraries under `source/js/libs/` SHALL remain separately
available for conditional template loading.

#### Scenario: APlayer is enabled

- **WHEN** a generated page enables APlayer
- **THEN** the page loads a production-built standalone APlayer integration after
  the APlayer vendor library

#### Scenario: Encrypted content is generated

- **WHEN** Hexo generates an encrypted page
- **THEN** the generated page imports an available HBE module from the matching
  source or production asset mode

#### Scenario: Optional vendor library is disabled

- **WHEN** a theme feature backed by a vendor library is disabled
- **THEN** the vendor library is not bundled into the core application or loaded
  by the generated page solely because the build ran

### Requirement: Production CSS assets are optimized

The production asset workflow SHALL generate minified Tailwind CSS and SHALL
render the configuration-dependent Stylus stylesheet with compression enabled.
Stylus SHALL continue to evaluate `hexo-config()` values and conditional imports
against the consuming Hexo site's configuration.

#### Scenario: Tailwind production build completes

- **WHEN** the production CSS build completes successfully
- **THEN** the generated Tailwind stylesheet is minified and contains utilities
  detected from the theme's registered source files

#### Scenario: Production Stylus is rendered

- **WHEN** Hexo renders the theme stylesheet with developer mode disabled
- **THEN** the output is compressed without changing the selected configuration-
  dependent rules

#### Scenario: Stylus configuration is applied

- **WHEN** a consuming site changes a theme setting used by `hexo-config()`
- **THEN** the rendered Stylus output reflects that site's setting while still
  using the production compression mode

### Requirement: One production command coordinates owned asset builds

The normal production build SHALL coordinate the Tailwind and JavaScript build
steps and SHALL fail when either owned asset build fails. Focused CSS-only and
JavaScript-only commands SHALL remain available.

#### Scenario: Both asset builds succeed

- **WHEN** the normal production build is run
- **THEN** it completes only after Tailwind CSS and browser JavaScript outputs
  have both been generated successfully

#### Scenario: One asset build fails

- **WHEN** either the Tailwind or JavaScript build exits unsuccessfully
- **THEN** the normal production build exits unsuccessfully and reports the
  failed build step

#### Scenario: Focused build is requested

- **WHEN** a contributor runs the CSS-only or JavaScript-only build command
- **THEN** only the requested asset family is built

### Requirement: New release assets remain isolated by version

Generated entrypoints and lazy chunks SHALL be included in the package and
release asset inputs for the version being built. Asset URLs for a release SHALL
resolve within that release's versioned directory.

#### Scenario: New version contains lazy chunks

- **WHEN** a release package is built after the production asset build
- **THEN** the package contains the application entry, required chunks, source
  maps, standalone plugin outputs, and required vendor assets

#### Scenario: Older release is requested

- **WHEN** a consumer requests an asset from an already published version
- **THEN** the request continues to resolve the immutable asset from that older
  version without depending on the new build layout
