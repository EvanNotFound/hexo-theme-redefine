## 1. Local Release-Note Command

- [ ] 1.1 Add the Redefine-specific `.opencode/commands/changelog.md` prompt and
  configure it to inspect the previous release through the target tag, write
  only `release-notes.md`, and follow the bilingual release-note contract.
- [ ] 1.2 Add reproducible local package commands for generating and checking a
  hypothetical release preview, ignore the transient notes file, and document
  the pinned OpenCode invocation and provider environment without committing
  secrets.

## 2. Notes Contract And Validation

- [ ] 2.1 Implement the dependency-free Node release-note validator for safe
  file handling, bilingual structure, allowed heading order, paired sections,
  non-empty `* ` bullets, size limits, and credential detection.
- [ ] 2.2 Exercise the validator with representative valid and invalid
  Redefine-style notes, including malformed locale structure and unsafe-file
  cases, using the repository's available Node checks.

## 3. Tag Release Automation

- [ ] 3.1 Add tag-triggered release CI that checks the tag against
  `package.json`, installs the pinned workspace dependencies, builds the
  source-only theme, and verifies the npm package contents before release
  creation.
- [ ] 3.2 Add the non-blocking OpenCode notes job and artifact handoff, pin the
  CLI/model configuration, validate generated notes, and create the GitHub
  Release with validated notes or GitHub automatic notes as the fallback.
- [ ] 3.3 Verify that the created published Release continues to trigger the
  existing npm publication, Aliyun CDN publication, and ready-for-release issue
  workflows without changing their contracts.

## 4. Maintainer Guidance

- [ ] 4.1 Document the local preview workflow, hypothetical-tag usage, review
  expectations, and manual version/tag responsibility in contributor and
  developer guidance, keeping English and Chinese documentation aligned where
  both locales are updated.
