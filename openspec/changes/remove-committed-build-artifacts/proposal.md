## Why

Generated CSS and JavaScript are currently tracked in the theme repository and
refreshed by a post-merge bot commit. This creates noisy history and makes the
repository's source state temporarily differ from its generated state, even
though release publication already builds the package. The repository should
keep source files authoritative while CI produces artifacts at the points where
they are consumed.

## What Changes

- Remove Husky and its pre-commit artifact policy.
- Stop tracking generated files under `source/css/build/` and
  `source/js/build/`; keep `source/assets/` as checked-in runtime source.
- Remove the workflow that commits generated artifacts back to `dev` and
  `main`.
- Keep PR build validation and make npm and Aliyun release publication build
  artifacts before consuming them.
- Make npm packaging explicitly include the built `source/` tree.
- Build browser JavaScript once when `pnpm dev` starts so a fresh source-only
  checkout remains usable.
- Update contributor and bilingual developer guidance to describe the
  source-only artifact workflow.

## Capabilities

### New Capabilities

- `artifact-publication`: Defines source-only repository state and CI-generated
  artifacts for local development, validation, npm publication, and Aliyun
  publication.

### Modified Capabilities

- `docs-guidance`: Update contributor documentation to describe generated
  artifacts as local/CI output and document the initial JavaScript build during
  `pnpm dev`.

## Impact

- Root package metadata, lockfile, build/development scripts, and generated
  artifact paths.
- Husky configuration and GitHub Actions workflows for PR previews, releases,
  and artifact commits.
- npm package contents and Aliyun release uploads.
- English and Chinese developer documentation, plus repository contribution
  guidance.
- The external cdnjs metadata PR must be merged before a release that relies on
  cdnjs serving the built CSS and source maps.
