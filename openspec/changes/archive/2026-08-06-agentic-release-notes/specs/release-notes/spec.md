## ADDED Requirements

### Requirement: Local release-note generation

The repository SHALL provide a local OpenCode changelog command that accepts a
target version tag and writes `release-notes.md` from repository-grounded
history and diffs without publishing a package or creating a GitHub Release.

#### Scenario: Preview notes for a future tag

- **WHEN** a maintainer runs the documented local command with a hypothetical
  target tag such as `v2.10.0`
- **THEN** OpenCode inspects the latest applicable published release and the
  current repository changes and writes a previewable `release-notes.md`

#### Scenario: Existing notes are present

- **WHEN** `release-notes.md` already exists before generation
- **THEN** the command ignores its contents and replaces it with notes based on
  the requested release range

#### Scenario: Local preview completes

- **WHEN** the local command is run with the configured provider credentials
- **THEN** it performs no npm publish, CDN upload, GitHub Release creation, or
  version bump

### Requirement: Redefine bilingual release-note format

Generated release notes SHALL contain an ordered Chinese `## 更新日志` block
followed by an English `## Release Notes` block. Included feature, improvement,
fix, breaking-change, and operational sections SHALL be release-sized and
paired across the two locales. The notes SHALL use concise maintainer-style
Markdown bullets and SHALL omit raw commit history, generated-by notices,
implementation diaries, release banners, and promotional material.

#### Scenario: Release contains user-visible features and fixes

- **WHEN** the inspected release includes notable features and bug fixes
- **THEN** the notes include matching Chinese and English feature/fix sections
  in the established order with one concise `* ` bullet per distinct change

#### Scenario: Release has operational guidance

- **WHEN** the inspected release requires update commands, CDN propagation
  guidance, documentation links, or configuration migration
- **THEN** the notes include that guidance in the relevant Chinese and English
  sections or statements without adding irrelevant boilerplate

#### Scenario: Release has no changes in a category

- **WHEN** a feature, improvement, fix, or breaking-change category has no
  notable user-facing or operator-facing change
- **THEN** that category is omitted from both locale blocks rather than emitted
  as an empty heading

### Requirement: Deterministic release-note validation

The repository SHALL provide a dependency-free validator that accepts only a
safe, non-empty UTF-8 `release-notes.md` matching the Redefine bilingual
structure, allowed heading order, paired included sections, non-empty bullets,
and configured size limit. The validator SHALL return a non-zero status for
invalid output.

#### Scenario: Valid notes are checked

- **WHEN** the validator receives a correctly structured bilingual release-note
  file
- **THEN** it exits successfully without modifying the file

#### Scenario: AI output violates the contract

- **WHEN** generated notes contain an invalid heading, empty section, missing
  locale block, unpaired section, malformed bullet, or out-of-order section
- **THEN** the validator exits non-zero and identifies the validation failure

#### Scenario: Notes are unsafe

- **WHEN** the notes path is missing, a symlink, non-UTF-8, empty, oversized,
  NUL-containing, or contains configured credentials
- **THEN** the validator exits non-zero and the content is unavailable for
  release publication

### Requirement: Tag-driven release creation

Release CI SHALL run for pushed semantic-version tags, verify that the tag
matches the package version, build and package-check the source-only theme, and
create the GitHub Release only after the safety check succeeds.

#### Scenario: Tagged source passes release checks

- **WHEN** a pushed version tag matches `package.json` and the dependency
  install, theme build, and package dry run succeed
- **THEN** CI proceeds to release-note generation and creates a GitHub Release
  for the verified tag

#### Scenario: Tag and package version disagree

- **WHEN** the pushed tag does not match the semantic version in `package.json`
- **THEN** the release safety job fails before creating a GitHub Release

#### Scenario: Build or package check fails

- **WHEN** the source-only theme cannot install, build, or produce the expected
  package contents
- **THEN** CI fails before creating a GitHub Release

### Requirement: Non-blocking release-note fallback

OpenCode installation, provider access, generation, artifact transfer, and
validation SHALL be non-blocking after the release safety check succeeds. If no
validated OpenCode notes are available, CI SHALL create the Release with
GitHub-generated notes and SHALL not expose provider credentials.

#### Scenario: OpenCode generates valid notes

- **WHEN** OpenCode writes notes that pass validation and the notes artifact is
  successfully transferred to the release job
- **THEN** the GitHub Release body uses the validated bilingual notes

#### Scenario: OpenCode is unavailable

- **WHEN** OpenCode installation, provider configuration, generation, or
  validation fails
- **THEN** the release job logs a non-secret notice and creates the GitHub
  Release with GitHub automatic notes

#### Scenario: Published release triggers existing distribution

- **WHEN** the tag workflow creates and publishes the GitHub Release
- **THEN** the existing npm publication, Aliyun CDN publication, and
  ready-for-release issue workflows continue to receive their published-release
  event without requiring changes to their contracts
