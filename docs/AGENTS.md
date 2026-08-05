# AGENTS.md

This repository is a Next.js 16 + Fumadocs docs site.
Use these notes when making changes in this repo.

## Project overview

- App router in `src/app` with route handlers and pages.
- Docs content lives in `content/docs/{zh,en}` as MDX.
- Fumadocs generates `.source` content during postinstall or typecheck.
- Styling uses Tailwind CSS with Prettier Tailwind plugin.
- TypeScript is strict; prefer typed APIs.

## Commands

- Install deps (preferred): `pnpm install`
- Dev server: `pnpm dev` (Next.js dev)
- Production build: `pnpm build`
- Start prod server: `pnpm start`
- Lint: `pnpm lint` (eslint-config-next core-web-vitals)
- Typecheck: `pnpm types:check` (fumadocs-mdx + next typegen + tsc)
- Postinstall hook: `pnpm postinstall` (runs `fumadocs-mdx`)

## Tests

- No automated test runner is configured in `package.json`.
- There is no single-test command today.
- If you add tests, also add scripts for `test` and `test:watch`
  and document a "single test" invocation.

## Code style and conventions

- Use TypeScript for all logic under `src/`.
- Keep components and hooks in `src/components` and `src/app`.
- Prefer functional components; use hooks only in client components.
- Add `'use client'` at the top of files that use hooks/state.
- Server components are the default in app router.
- Pages in `src/app/[lang]/...` are async and resolve `params`.

### Imports

- Prefer absolute imports with `@/` alias for `src/*`.
- Group imports: external packages, internal alias, relative files.
- Use `type` imports for types (`import type { ... }`).
- Keep import ordering consistent with the existing file.

### Formatting

- Prettier is configured with `prettier-plugin-tailwindcss`.
- Run Prettier on changed files before committing.
- Do not manually reorder Tailwind classes; plugin handles it.
- Match existing quote style in a file (many use single quotes).
- Keep JSX props on multiple lines when they are long.

### Types and data flow

- `tsconfig.json` is `strict`; avoid `any`.
- Use `unknown` and narrow types when data is not trusted.
- Prefer explicit return types for exported helpers.
- Avoid `as` casts unless you have no better option.
- Use `InferPageType` and Fumadocs helpers where appropriate.

### Naming

- Components: `PascalCase` (e.g. `PromoCard`).
- Functions/vars: `camelCase`.
- Files: follow existing folder naming (kebab or lower case).
- Constants: `UPPER_SNAKE_CASE` when truly constant.

### Error handling

- Route handlers should return `Response` and handle missing data.
- Use `notFound()` for missing docs pages.
- Wrap async UI actions in `try/finally` to restore UI state.
- Avoid swallowing errors silently; log or rethrow when needed.

### React/Next conventions

- Use `Metadata` generation via `generateMetadata`.
- Use `generateStaticParams` for docs pages.
- Prefer `next/link` and `next/image`.
- Use `revalidate = false` or ISR intentionally.

### Styling and UI

- Tailwind CSS is the default styling approach.
- Use existing `cn` helper and `class-variance-authority` for variants.
- Keep class strings readable; split long strings when needed.
- Maintain accessible markup (labels, aria attrs, button types).

### MDX content conventions

- Docs use frontmatter with `title`, `description`, `icon`.
- Do not add an H1 in the body; title comes from frontmatter.
- Keep component imports at the top of MDX files.
- Use relative links where possible; Fumadocs handles routing.

### I18n

- Languages are `zh` and `en`; default is `zh`.
- Keep content parity between `content/docs/zh` and `content/docs/en`.
- Use `i18n` config in `src/lib/i18n.ts`.

### Search and content source

- Docs source comes from `src/lib/source.ts`.
- Search route uses `createFromSource` in `src/app/api/search/route.ts`.
- Fumadocs collections live in `.source`; do not edit generated files.

## Repo structure notes

- `src/app` holds Next.js routes, layouts, and pages.
- `src/components` contains UI and layout components.
- `content/docs` holds documentation in MDX.
- `styles` and Tailwind config are in repo root (Tailwind via PostCSS).

## Linting rules

- ESLint config extends Next core-web-vitals.
- Ignored paths: `.next`, `out`, `build`, `.source`, `next-env.d.ts`.
- Fix lint issues before requesting review.

## Dependency notes

- Package manager is likely pnpm (`pnpm-lock.yaml` present).
- Use `pnpm` for installs unless maintainer requests npm/yarn.
- React 19 + Next 16; follow app router patterns.

## Content generation

- `fumadocs-mdx` runs on `postinstall` and in `types:check`.
- Generated MDX output is used by the app; keep content valid.

## Cursor/Copilot rules

- Copilot path-specific instructions: `.github/instructions/docs-bilingual.instructions.md`.
- Copilot custom agent profile: `.github/agents/docs-maintainer.agent.md`.
- If new rules are added, update this file accordingly.

## How to add new docs

- Add MDX under `content/docs/{zh,en}/...`.
- Ensure frontmatter includes `title`, `description`, `icon` when needed.
- Keep images remote-friendly or use `next/image` with allowed domains.
- Add new nav entries via Fumadocs metadata files if used.

## How to add new UI components

- Place shared UI in `src/components/ui`.
- Use existing patterns for Radix wrappers in `src/components/ui`.
- Export types for props when components are reused.
- Keep component APIs small and predictable.

## Testing and verification checklist

- Run `pnpm lint` and `pnpm types:check` for code changes.
- Run `pnpm dev` to verify page rendering and MDX output.
- For MDX changes, verify both `zh` and `en` versions.

## Change hygiene

- Avoid editing generated `.source` or `.next` outputs.
- Keep diffs focused; do not reformat unrelated files.
- Prefer small, reviewable changes.

## Quick links

- Docs site: https://redefine-docs.ohevan.com
- Theme repo: https://github.com/evannotfound/hexo-theme-redefine
- Docs repo: https://github.com/EvanNotFound/redefine-docs-v2

## Notes for agents

- Ask if you need a new dependency or script.
- Clarify expected tests if none exist.
- Keep responses concise and actionable.
