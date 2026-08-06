---
description: Generate repository-grounded bilingual notes for a Redefine release
model: openai/gpt-5.4
variant: high
---

Generate `release-notes.md` for the hexo-theme-redefine release tagged
`$ARGUMENTS`.

If `release-notes.md` already exists, ignore its contents completely. Do not
preserve, merge, or reuse text from it.

Before writing:

- Work autonomously. Use `gh`, Git commands, repository search, and file reads
  as needed.
- Use GitHub release metadata to find the latest non-draft release before the
  target tag. The target release may not exist yet.
- Inspect the commits and real diffs from the previous release to the target. If
  the target tag does not exist, treat the current checkout as the target.
- Read relevant theme source, `_config.yml`, configuration deprecations,
  language files, documentation, and pull request descriptions when needed to
  understand user-visible behavior and migration requirements.
- Use commit messages and pull request descriptions as context, but treat the
  inspected implementation as authoritative. Ground every retained claim in a
  real change.
- Treat documentation-only, test-only, CI-only, generated-artifact, and
  internal refactor changes as release-note material only when they produce a
  real user or operator outcome.

Output contract:

- Write only `release-notes.md`. Do not write, edit, or publish any other file.
- Start with `## 更新日志`, then an English `## Release Notes` block after a
  `---` separator.
- Use only these section pairs, in this order, and include a pair only when it
  has a notable entry:
  - `### 新增` / `### Features`
  - `### 修复` / `### Fixes`
  - `### 优化` / `### Improvements`
  - `### Breaking Changes` / `### Breaking Changes` (yeah you read it right)
  - `### 更新方法` / `### Update Instructions`
- Keep every section non-empty. Put all entries in `* ` Markdown bullets and
  leave a blank line between headings and bullets.
- Use one bullet for each distinct user-visible or operator-visible change.
  Combine commits that deliver one change and separate unrelated changes.
- Start each change bullet with a concise bold area or feature label followed by
  a direct user-facing result. Start the sentence with a capitalized Chinese
  phrase or a direct English verb such as `Add`, `Improve`, `Fix`, `Prevent`,
  `Support`, or `Keep`.
- Keep bullets concise and skimmable. Omit implementation details, raw commit
  prefixes, hashes, generated-by notices, contributor roll calls, and vague
  filler. Include issue numbers or contributor handles only when they add useful
  release context.
- Include npm/Git update commands, the Redefine update documentation link, CDN
  synchronization guidance, or configuration-migration instructions only when
  the inspected release makes them relevant. When included, put the guidance
  in the paired update-instruction sections.
- Do not add release-banner images, promotional sections such as `## 更多 🔥`,
  or unrelated advertising.
- Do not add an opening summary unless the release has a clear overall theme
  and the sentence does not repeat the bullets.

Example shape only; do not copy entries unless the inspected release contains
those changes:

```markdown
## 更新日志

### 新增 / 重大更新

* **Callout 模块**：新增 `{% callout %}` 标签并保持旧标签兼容。

### 更新方法

* **NPM**：`npm install hexo-theme-redefine@latest`
* **迁移**：本版本无需迁移配置文件。

---

## Release Notes

### New Features / Major Updates

* **Callout module**: Add the `{% callout %}` tag while keeping legacy tags compatible.

### Update Instructions

* **NPM**: `npm install hexo-theme-redefine@latest`
* **Migration**: This version does not require configuration migration.
```
