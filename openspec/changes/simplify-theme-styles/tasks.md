## 1. Stabilize Current CSS

- [x] 1.1 Add a documented CSS verification command that builds owned styles and generates the canonical demo site so stylesheet syntax, imports, outputs, and Hexo configuration rendering fail in one place.
- [x] 1.2 Replace wildcard Stylus imports with the current explicit order, consolidate the duplicated responsive mixin definitions, and confirm the compatibility stylesheet output remains equivalent.

## 2. Add The Native CSS Build

- [ ] 2.1 Create the `styles/theme.css` entry and direct `base`, `components`, and `plugins` source structure, preserving Tailwind scans of EJS templates and generated script markup.
- [ ] 2.2 Update CSS build, watch, package, and layout loading paths to emit and serve the generated core stylesheet beside the temporary Stylus compatibility stylesheet.

## 3. Move Theme Configuration And Base Styles

- [ ] 3.1 Add a focused Hexo style helper that normalizes supported theme settings into mode-aware CSS custom properties, template conditions, and state attributes without changing `_config.yml` names or defaults.
- [ ] 3.2 Migrate variables, global rules, animation, and Markdown prose into native CSS, remove their matching Stylus ownership, and cover representative light, dark, typography, spacing, width, radius, and alignment settings in demo generation.

## 4. Migrate Theme-Owned Components

- [ ] 4.1 Migrate the page shell, navbar, footer, side tools, and global page regions to Tailwind and focused native CSS, replacing unique JavaScript class hooks with IDs.
- [ ] 4.2 Migrate the home banner, article list, sidebar, paginator, and related home markup while preserving sidebar positions, banner modes, responsive behavior, and reusable partials.
- [ ] 4.3 Migrate article layout, metadata, table of contents, post tools, copyright, recommendations, comments wrapper, and navigation while preserving article configuration and interaction behavior.
- [ ] 4.4 Migrate archive, category, tag, page-template, friends, masonry, bookmarks, essays, and not-found styles using direct component names and shared templates instead of styling-only wrapper classes.
- [ ] 4.5 Migrate search, image viewer, progress, and other interactive utility markup, using IDs for unique targets and semantic or `data-*` hooks for repeated controls and state.
- [ ] 4.6 Migrate tabs, folding, callouts, buttons, grid, tables, links, masks, and other generated writing markup, keeping ordinary appearance in Tailwind and only short CSS scopes where rendered descendants require them.

## 5. Move Optional Plugin Styles

- [ ] 5.1 Convert code-block chrome and selectable light/dark code themes into native core or named plugin assets and preserve the existing code style, font, and theme selections.
- [ ] 5.2 Convert Waline, Gitalk, Twikoo, and Utterances styles into separate comment assets and load only the configured comment system through the existing CSS helper path.
- [ ] 5.3 Convert APlayer and Odometer styling into separate assets and preserve their enablement, mode, CDN, and browser initialization behavior.

## 6. Complete The Major-Release Migration

- [ ] 6.1 Remove remaining Stylus files, the Stylus renderer filter and demo dependency, the compatibility stylesheet link, and undocumented internal class names; verify the production build, CSS check, representative config matrix, and packed npm contents use only published native CSS/Tailwind assets.
- [ ] 6.2 Update AGENTS guidance, aligned English and Chinese developer documentation, and major-release migration notes with the source layout, ownership boundary, commands, generated outputs, plugin entries, and internal DOM class removal.
