## Why

Redefine currently has no repeatable release-note workflow. Release bodies are
manually written in a bilingual maintainer style, while the old
`standard-version` workflow was removed and the existing publication workflows
only run after a GitHub Release already exists. This makes release-note
generation difficult to preview locally and leaves release creation separate
from the verified build and publication flow.

## What Changes

- Add a Redefine-specific OpenCode `changelog` command that inspects the
  repository history and writes bilingual release notes for a target tag.
- Define the Redefine release-note structure and editorial rules from the
  existing release bodies, including conditional update instructions, CDN
  guidance, documentation links, and configuration-migration notes.
- Add deterministic validation for generated `release-notes.md`; invalid or
  unavailable AI output must never be used as the release body.
- Add a local invocation that uses the same pinned OpenCode CLI and provider
  configuration as CI without publishing a package or creating a release.
- Add tag-driven release CI that builds and checks the source-only theme before
  generating notes and creating the GitHub Release.
- Fall back to GitHub-generated release notes when OpenCode installation,
  provider access, generation, or validation is unavailable.
- Preserve the existing downstream npm, Aliyun, and ready-for-release issue
  workflows, which continue to react to a published GitHub Release.

## Capabilities

### New Capabilities

- `release-notes`: Generate, validate, preview, and publish Redefine-style
  bilingual release notes as part of the tag release flow.

### Modified Capabilities

None.

## Impact

- New OpenCode command and release-note validator under `.opencode/` and
  `scripts/`.
- New or restored tag-driven GitHub Actions release workflow.
- Root package scripts and ignore rules for local release-note preview output.
- Release workflow permissions, OpenCode provider secrets, and GitHub Release
  creation.
- Existing npm, Aliyun CDN, and issue-closing workflows are downstream
  consumers and should not be otherwise redesigned.
