## Context

Redefine is a pnpm-managed Node theme package. Its current version is kept in
`package.json`, and the old `standard-version` scripts and release workflow were
removed when version bumps became manual. The current npm, Aliyun, and
ready-for-release issue workflows react to `release.published`; they do not
create the GitHub Release or generate its body.

The sibling `evanovation-db` repository provides the desired pattern: an
OpenCode project command inspects the repository, a small deterministic
validator accepts only a safe document shape, and release CI uses the result
when available while retaining a GitHub-generated fallback.

Redefine release bodies are generally bilingual. Recent releases organize
Chinese and English user-facing changes into feature and fix/improvement
sections, then conditionally include update commands, documentation links, CDN
guidance, configuration migration status, and contributor or issue references.
The generated core must not invent the promotional `## 更多 🔥` material that
appeared in one release.

## Goals / Non-Goals

**Goals:**

- Generate release notes locally for a hypothetical or existing target tag
  without publishing a package or creating a GitHub Release.
- Use the same pinned OpenCode CLI version and provider configuration locally
  and in CI.
- Produce concise bilingual Markdown that follows the established Redefine
  release-note shape.
- Reject malformed, unsafe, or non-conforming AI output before it can become a
  release body.
- Create GitHub Releases from pushed version tags only after the source-only
  theme passes its build/package check.
- Fall back to GitHub automatic notes when OpenCode is unavailable or its
  output is invalid, so verified publication is not blocked by the notes
  service.
- Leave the existing publication and issue-closing workflows as downstream
  consumers of a published GitHub Release.

**Non-Goals:**

- Do not restore `standard-version` or automate package version bump commits.
- Do not publish npm or Aliyun artifacts from the local preview command.
- Do not make AI-generated promotional copy, release banners, or unrelated
  advertising part of the release-note contract.
- Do not replace or merge the existing npm and Aliyun publication workflows.
- Do not share generated CSS/JavaScript artifacts between release jobs; the
  completed source-only artifact migration keeps publication builds independent.
- Do not require a live release to preview notes locally.

## Decisions

### Keep versioning and release creation separate

Manual version bumping and tag creation remain the maintainer's responsibility.
A new tag-triggered workflow validates the tagged source and creates the
GitHub Release. This preserves the current versioning decision while making the
release boundary deterministic. Restoring `standard-version` was rejected
because it would combine an unrelated versioning policy change with release
note generation.

### Adapt the sibling OpenCode command, rather than add a release-note service

Add `.opencode/commands/changelog.md` with `$ARGUMENTS` as the target tag. The
command tells OpenCode to find the previous non-draft release, inspect the real
commit range and relevant diffs, and write only `release-notes.md`. Existing
contents are ignored so stale or manually edited notes cannot bias a new run.

The local package command invokes the pinned `opencode-ai` package through
`npx`; CI installs the same exact version globally before running
`opencode run --pure --command changelog TAG`. OpenCode receives the same
OpenAI-compatible endpoint and key through `RELEASE_LLM_URL` and
`RELEASE_LLM_KEY`, while the model configuration remains inline through
`OPENCODE_CONFIG_CONTENT`.

### Make the Redefine format explicit but release-sized

The command and validator define two ordered locale blocks:

```text
## 更新日志
  optional relevant Chinese change sections
  optional Chinese update instructions
---
## Release Notes
  matching optional English change sections
  optional English update instructions
```

Feature and fix/improvement sections are included only when they contain
notable changes. Operational sections are included only when the inspected
release requires them. Each included semantic section has a matching section
in the other locale. Bullets use the established `* ` style, begin with a
maintainer-style summary, and avoid raw commit prefixes, hashes, generated-by
notices, and implementation diaries. The validator enforces structure and
safety; the OpenCode prompt supplies the editorial judgment and bilingual
content.

### Validate at both generation and publication boundaries

Add a dependency-free Node validator under `scripts/` that checks
`release-notes.md` as a regular UTF-8 file, rejects symlinks, empty content,
embedded credentials, excessive size, invalid headings, out-of-order locale or
section blocks, empty sections, and malformed bullets. The notes job validates
before uploading its artifact, and the publish job validates again after
downloading it. The second check protects the release boundary from corrupted
or substituted artifacts.

The validator is intentionally structural rather than a second language model:
it cannot prove that a migration claim is factually correct or that the two
languages are perfectly translated. Those responsibilities stay in the
repository-grounded command prompt and maintainer review of the local output.

### Gate release creation on the existing source build

The tag workflow runs a source checkout with full history, installs the pinned
Node/pnpm dependencies, verifies that `package.json` matches the semantic
version tag, builds the theme, and checks the package contents with a dry run.
The notes job runs after that check and remains non-blocking. The release job
creates the verified tag as a GitHub Release with OpenCode notes when valid or
`--generate-notes` otherwise.

The release workflow needs read access for checkout and notes inspection, and
write access only in the release-creation job. Its published Release event
continues to trigger the existing npm, Aliyun, and issue-closing workflows.

### Keep generated preview output local-only

`release-notes.md` is a transient local/CI artifact and should be ignored by
the repository. CI uploads it between jobs when valid; local users can inspect
or copy it without changing package contents or invoking publication.

## Risks / Trade-offs

- **[Risk]** OpenCode can misunderstand a subtle theme behavior or migration
  requirement. → **Mitigation:** Require inspection of diffs and relevant source,
  configuration, and documentation; keep the output local-previewable for
  maintainer review.
- **[Risk]** A provider outage produces a GitHub-generated body that does not
  match the bilingual Redefine style. → **Mitigation:** Never publish invalid
  AI output, but use the selected non-blocking GitHub fallback so package and
  CDN publication remain available. A fully uniform format would require a
  blocking gate or a deterministic fallback generator.
- **[Risk]** The release check and downstream npm/Aliyun jobs build the theme
  independently. → **Mitigation:** Keep the builds pinned to the same tagged
  source and lockfile; avoid introducing a shared artifact store.
- **[Risk]** Local and CI OpenCode behavior diverges. → **Mitigation:** Pin the
  CLI version, share the command file and provider configuration shape, and
  run the same validator locally and in both CI jobs.
- **[Trade-off]** A strict document parser may reject a useful note because of
  formatting drift. → **Mitigation:** Keep the allowed section grammar aligned
  with the recent Redefine release bodies and make the local validator easy to
  run before a tag is pushed.

## Migration Plan

1. Add the command, validator, local package scripts, ignored output path, and
   contributor/developer documentation.
2. Add the tag release workflow and connect its successful Release creation to
   the existing publication workflows.
3. Run the local command against a hypothetical next tag, inspect the
   bilingual output, and run the validator without publishing.
4. Test the workflow's build, validator, and fallback branches with local
   fixtures or workflow validation before using a real tag.
5. For rollback, disable or revert the tag workflow; manually created GitHub
   Releases continue to trigger the existing downstream publication behavior.

## Open Questions

- The exact allowed aliases for release-sized headings (`新增` versus
  `新增 / 重大更新`, and `修复` versus `修复 / 优化`) should be encoded from
  the chosen canonical examples during implementation.
- Whether documentation should expose the provider environment setup in full
  or only point maintainers to a private local configuration remains a
  documentation decision; secrets must never be committed.
