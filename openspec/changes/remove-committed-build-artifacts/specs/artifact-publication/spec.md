## ADDED Requirements

### Requirement: Source repository excludes generated browser artifacts

The theme repository MUST treat `source/css/build/` and `source/js/build/` as
generated local or CI output rather than authoritative source. These directories
MUST NOT be tracked in normal source commits, while `source/assets/` MUST remain
available as checked-in runtime source.

#### Scenario: Fresh source checkout

- **WHEN** a contributor checks out the repository before running a build
- **THEN** the generated CSS and JavaScript directories are absent or empty
- **AND** the checked-in `source/assets/` files remain available

#### Scenario: Local build output

- **WHEN** a contributor runs a CSS or JavaScript build
- **THEN** the build writes output under the existing `source/css/build/` and
  `source/js/build/` paths
- **AND** the generated output does not appear as an ordinary Git change

### Requirement: Pull requests validate builds without generated commits

The pull request workflow MUST build the theme from source and reject
force-added generated artifact paths. The repository MUST NOT use a workflow or
other automation to commit generated build output back to `dev` or `main`.

#### Scenario: Source change in a pull request

- **WHEN** a pull request changes theme source, build inputs, or dependencies
- **THEN** CI installs the pinned workspace dependencies and runs the root build
- **AND** the pull request is considered invalid if the build fails

#### Scenario: Generated output is added to a pull request

- **WHEN** a pull request includes files under `source/css/build/` or
  `source/js/build/`
- **THEN** the PR validation check fails with a message identifying generated
  artifacts as disallowed

### Requirement: Published npm packages contain generated assets

The release process MUST build the tagged theme source before npm publication,
and the npm package MUST include the resulting `source/` tree, including built
CSS, built JavaScript, and JavaScript source maps.

#### Scenario: Release package is built

- **WHEN** the npm release workflow publishes a tagged theme version
- **THEN** it runs the root build before publication
- **AND** the published package contains `source/css/build/tailwind.css`
  and the generated files under `source/js/build/`

#### Scenario: Package contents are inspected

- **WHEN** the release package is checked with a dry-run package listing
- **THEN** the built source files are included
- **AND** generated local state outside the package allowlist is not required

### Requirement: Aliyun publication builds before upload

The Aliyun release workflow MUST install the pinned build dependencies and run
the root build before uploading the theme `source/` tree.

#### Scenario: Aliyun release upload

- **WHEN** a published release triggers the Aliyun workflow
- **THEN** the workflow builds the CSS and JavaScript artifacts from the tagged
  source
- **AND** it uploads the resulting `source/` tree only after the build succeeds

### Requirement: Local development initializes browser assets

The `pnpm dev` command MUST perform a one-time browser JavaScript build before
starting the local Hexo demo and CSS watcher.

#### Scenario: Contributor starts the demo from a fresh checkout

- **WHEN** a contributor runs `pnpm dev` without previously generated JS output
- **THEN** the command generates the browser JavaScript output first
- **AND** the Hexo demo starts with the existing local source paths available
- **AND** the CSS watcher continues to handle CSS development output
