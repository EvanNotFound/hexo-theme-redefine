# Contributing to hexo-theme-redefine

Thank you for considering contributing to hexo-theme-redefine! We appreciate your time and effort to make our theme better.

Before you start, please make sure you read the [README](README.md) and familiarize yourself with the project.

## Getting Started

To start contributing to hexo-theme-redefine, please follow these steps:

1. Fork the [repository](https://github.com/EvanNotFound/hexo-theme-redefine) on GitHub.
2. Clone your forked repository to your local machine.
3. Install the workspace dependencies from the repository root:

   ```sh
   pnpm install --frozen-lockfile
   ```

4. Make your changes in the package that owns them and test them locally.
5. Commit your changes and push them to your forked repository.
6. Create a pull request (PR) on GitHub to **`dev` branch**.

## Repository Areas

- The root package is the published Hexo theme. Theme code lives in
  `source/`, `scripts/`, `layout/`, `languages/`, and `_config.yml`.
- `dev/site/` is a private Hexo demo-site workspace package. Its posts,
  pages, and fixtures are committed validation content.
- `docs/` is a private Next.js and Fumadocs workspace package. Its detailed
  contribution rules are in `docs/AGENTS.md`.

Use `pnpm dev` from the repository root to preview theme changes at
`http://127.0.0.1:4000`. This resets generated Hexo state, links the current
theme into the demo site, builds browser JavaScript once, starts Hexo, and
watches root CSS. The preview does not continuously watch browser JS.

For docs work, use the package scripts from `docs/` or their root equivalents:

```sh
pnpm --dir docs dev
pnpm --dir docs lint
pnpm --dir docs types:check
pnpm --dir docs build
```

Documentation changes under `docs/content/docs/**` must update both `zh` and
`en` unless the task explicitly allows a single locale. Treat `zh` as the
canonical version and keep matching `meta.json` navigation files aligned.

## Preview Release Notes

Release version bumps and tag creation remain manual. Before pushing a matching
version tag, generate and inspect the bilingual release-note preview locally:

```sh
RELEASE_LLM_URL=... RELEASE_LLM_KEY=... pnpm release:notes -- v2.10.0
pnpm release:notes:check
```

The target tag can be hypothetical. These commands only write the ignored
`release-notes.md`; they do not publish npm or CDN assets and do not create a
GitHub Release. A pushed matching tag runs the release workflow, which builds
the theme and creates the GitHub Release. OpenCode failures fall back to
GitHub-generated notes.

## Guidelines

We value your contributions and want to ensure they are appropriate for the project. Please follow these guidelines when contributing:

1. Use [GitHub issues](https://github.com/yourusername/yourthemename/issues) to report bugs, suggest new features, or ask questions.

2. Use descriptive commit messages and include references to related issues or PRs.

   Format:

   ```
   [section]: [brief info]
   ```

   For example:

   ```
   footer: optimize style
   ```

3. Do not commit generated assets (`source/js/build/**`, `source/css/build/**`) in ordinary PRs. PR CI rejects them. You can run `pnpm run build` locally for verification; the output is generated locally or by release CI and is not committed to `dev` or `main`.

4. Follow the existing code style and conventions.

5. Write clear and concise documentation for any changes you make. When
   changing the docs site, follow the bilingual and MDX rules in
   `docs/AGENTS.md`.

6. Test your changes locally and ensure they do not break the existing functionality.

## Code of Conduct

To ensure a welcoming and inclusive community, we adhere to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read this before contributing.

## Contact

If you have any questions or need help with your contributions, please contact me at contact@ohevan.com.

Thank you for your contributions to hexo-theme-redefine!
