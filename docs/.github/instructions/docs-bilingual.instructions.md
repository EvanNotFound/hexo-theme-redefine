---
applyTo: "content/docs/**"
---

## Documentation scope

This instruction applies only to documentation content under `content/docs/**`.

## Purpose

You are editing documentation for the maintainer. Keep docs accurate, consistent, and aligned across locales.

## Bilingual parity (required)

- Any documentation change under `content/docs/**` MUST update both `content/docs/zh/**` and `content/docs/en/**` in the same task/PR.
- Single-locale updates are only allowed if the task explicitly says `ZH-only` or `EN-only`.
- File pairing rule: `content/docs/zh/<path>` maps to `content/docs/en/<path>` (same relative path), and vice versa.
- Add/rename/move/delete operations must be mirrored across both locales.

## ZH is canonical

- Treat `zh` as the source of truth. If content differs or a change is ambiguous, update `en` to match `zh` meaning and structure.
- `zh` docs should be written in simplified Chinese, straightforward and clear. When there are english technical terms such as `class` that you need to reference, use the english term in the `zh` docs. It is okay to use english technical terms to avoid confusion.
- If a task does not specify a locale, update `zh` first, then translate/adapt to `en`.

## Translation policy

- Always provide a best-effort English translation for any new or updated `zh` content.
- Do not add placeholder-only English pages.

## Navigation parity (`meta.json`)

- When pages are added/removed/renamed/moved/reordered, update the corresponding `meta.json` files in BOTH locales (root and section-level).
- Keep the same slug structure and ordering across locales.
- Divider labels may be localized (e.g. `---配置---` vs `---Configuration---`), but keep their groupings aligned.

## MDX components and style

- Use existing Fumadocs MDX components when they improve clarity and match current docs style:
  - `<Callout>` for notes/warnings/info.
  - `<Tabs>` / `<Tab>` for multi-option instructions.
  - `fd-steps` wrapper for step sequences.
- Keep MDX imports at the top of the file when needed.
- Do not add an H1 in the body; frontmatter title is used.

## Do not translate technical literals

- Do not translate config keys, CLI commands, file paths, code identifiers, URLs, or code blocks.
- Translate prose only.

## Repo rules

- Follow `AGENTS.md` for additional MDX and repository conventions.
- Do not edit generated content such as `.source`.
