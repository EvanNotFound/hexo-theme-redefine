## Context

The native CSS migration preserved two fixed `38px` spacing variables and a custom Tailwind radius namespace. The spacing variables coexist with Tailwind's default `4px` base, and responsive call sites multiply `38px` into fractional values such as `30.4px` and `22.8px`. The custom radius values duplicate deprecated names and make standard utilities resolve to unusually large values, including a non-monotonic `rounded-2xl` value of `48px` before Tailwind's default `rounded-3xl` value of `24px`.

The canonical `--rd-border` token is already broadly used for structural boundaries, but route-level surfaces do not share one elevation rule: articles use `shadow-rd`, standard pages and archives do not, and mobile border treatment differs among them. Theme-owned article modules also mix outer-shell and nested radii without consistently distinguishing edge-touching, truly concentric, and independent corners.

Hexo currently selects a root EJS layout and each root entry delegates to `layout/page.ejs`. That shell calls `getPagePartialPath(page)`, while `page-template.ejs` calls `getPageData(page)` and dynamically renders a second partial. The helper table stores titles, types, partial paths, and a property named `layout`; route classification is repeated in the page shell, page template, title helper, and script loading. Reusable rendered fragments are split between `components/` and `utils/`, while several page and component directories contain only one file.

This change is part of the major-release cleanup. It may remove undocumented template inference, but it must preserve required Hexo root layouts, public theme configuration other than the approved image-radius default, Swup boundaries, behavior hooks, page content, supported integrations, and light/dark behavior.

## Goals / Non-Goals

**Goals:**

- Use Tailwind's default spacing and radius systems instead of maintaining parallel fixed scales.
- Preserve a clear radius hierarchy, use concentric corner math only where the visible geometry requires it, and keep nested article surfaces one radius scale below route shells and standalone framed components.
- Give framed route-level content one consistent border, radius, elevation, and mobile-flattening contract.
- Keep `--rd-border` and `--rd-shadow` as the only Redefine structural border and elevation tokens.
- Make custom page selection explicit through `template` front matter and make every EJS dispatch edge visible in one router.
- Organize EJS by Hexo entry points, reusable components, and route-owned pages without creating additional micro-partials.
- Preserve existing DOM behavior contracts and normal route content while fixing directly coupled archive and duplicate-comment errors.

**Non-Goals:**

- Do not redesign typography, colors, content width, navigation behavior, or page composition beyond spacing, corner, border, and elevation ownership.
- Do not normalize internal radii or semantic borders owned by APlayer, comment systems, Mermaid, or other third-party markup.
- Do not add configurable spacing, radius, border, or shadow scales.
- Do not preserve title-based or `type`-based custom page aliases.
- Do not split `head`, `navbar`, `footer`, preloader, or other substantial features into new implementation layers solely to reduce file length.
- Do not change documented custom page content formats or plugin configuration.

## Decisions

### Use Tailwind's default spacing scale directly

Remove `--spacing-unit`, `--margin-spacing-unit`, and their runtime declaration. Replace fixed layout spacing with the nearest values from Tailwind's default `4px` scale: `10` for major `40px` separation, `8` for `32px`, `6` for `24px`, and smaller standard utilities for component gaps and padding. This removes fractional responsive results and keeps class names understandable to contributors.

Calculations remain only when combining independent dimensions. Post tools and the TOC will both use `--current-navbar-height` plus one fixed Tailwind-scale offset instead of combining different navbar variables with the removed spacing unit. Configurable heading spacing remains separate because it is a user-facing article setting rather than a general layout scale.

An alternative was to retain one semantic `--layout-spacing` token. It was rejected because the value is not configurable, its call sites do not share one semantic role, and Tailwind already provides the required scale.

### Use Tailwind's default radius namespace without overrides

Remove all authored `--radius-*` values, including deprecated aliases and the dormant generic `--radius`. Theme-owned markup will use Tailwind defaults by role:

- `rounded-2xl` (`16px`) for framed route-level content shells and standalone framed components such as home cards, sidebar panels, side tools, post tools, and dropdown surfaces.
- `rounded-xl` (`12px`) for code blocks, tables, callouts, tabs, folding blocks, copyright panels, and ordinary nested article surfaces.
- `rounded-lg` (`8px`) for controls and inner interactive elements.
- `rounded-md` (`6px`) or `rounded-sm` (`4px`) for badges, labels, and inline code.
- `rounded-3xl` (`24px`) for genuinely large independent overlays.
- `rounded-full` only for circles and pills.

The default `articles.style.image_border_radius` becomes `12px`, while the existing runtime CSS variable continues to expose a supported user override. This is the only domain-specific article radius because it is already public configuration.

Edge-touching media will be clipped by an `overflow-hidden` rounded parent, with redundant child radii removed. When an inset child exposes a parallel corner, its radius may use `calc(parent radius - inset)`. Components inset farther than the parent radius are independent surfaces and use the role-based Tailwind radius instead. Parent clipping will not be added where it would cut off focus rings, menus, tooltips, or overlays.

An alternative was to recreate a smaller custom radius scale. It was rejected because it would preserve the same namespace complexity and make standard Tailwind utility names project-specific.

### Keep one structural border and one elevation token

`--rd-border` remains the mode-aware color for Redefine-owned structural boundaries, mapped to `border-rd-border`. `--rd-shadow` remains the complete mode-aware static elevation value, mapped to `shadow-rd`. Theme-owned structural surfaces declare an explicit one-pixel border color; active, status, primary, translucent banner, and third-party borders retain their semantic colors.

Article, standard page, archive, category/tag detail through the standard panel, and equivalent framed route-level content use `rounded-2xl border border-rd-border shadow-rd` on inset desktop and tablet layouts. Standalone home cards, sidebars, recommendation cards, side tools, post tools, and dropdown surfaces also use `rounded-2xl`, while nested article modules use `rounded-xl`; those non-route components retain their component-owned border or floating treatment without inheriting the route-shell shadow. At the narrow edge-to-edge breakpoint, route shells remove border, radius, and shadow together rather than retaining only part of the surface treatment.

The unused shadcn-style color/radius variable block and Tailwind v3 global gray border fallback will be removed only after a source audit confirms every Redefine-owned structural border has an explicit semantic color. Third-party styles remain outside this cleanup.

The alternative of removing the article shadow was rejected in favor of the selected direction: consistent elevation across framed route-level content. Applying the shadow to every card was also rejected because it would erase the distinction between primary route depth and nested grouping.

### Resolve custom pages from `template` only

Required Hexo root entries remain the source of built-in route kinds. The index, post, archive, category, tag, and not-found entries pass or establish their explicit kind when delegating to the common page shell. Generic page rendering resolves a custom kind from an exact supported `page.template` value:

| Template | Page kind |
| --- | --- |
| `categories` | `categories` |
| `tags` | `tags` |
| `links` | `friends` |
| `masonry` | `masonry` |
| `bookmarks` | `bookmarks` |
| `essays` | `essays` |

Missing or unknown values resolve to `page`. `page.type` and title text no longer participate. The resolver returns only a page-kind string; it does not return EJS paths, layout modes, or executable configuration. The compatibility-only root `tags.ejs` can be removed if generation confirms Hexo does not select it for documented tag pages.

This intentionally breaks undocumented title inference and legacy `type` aliases. Keeping those aliases was rejected because it preserves ambiguity, allows ordinary page titles to select special rendering accidentally, and duplicates the documented `template` contract.

### Put literal dispatch in one EJS router

`layout/page.ejs` remains the common site shell and calls `layout/pages/router.ejs` with the resolved page kind. The router contains explicit branches with literal partial names. Raw route families render their page partial directly. Framed custom and ordinary pages render a literal content partial through `components/page-panel.ejs`, passing the rendered page body through one `pageBody` local.

The page panel owns the shared route-shell markup, appended `page.content`, exactly one optional comments region, and pagination. It is the only new reusable layout abstraction. The router replaces both `getPagePartialPath()` and the dynamic dispatch in `page-template.ejs`. Page-dependent scripts inspect the explicit template or page kind rather than comparing a stored partial path.

An alternative was to place the entire switch in `page.ejs`. It was rejected because the site shell already owns banner, navbar, main columns, footer, tools, and Swup composition; a single clearly named router keeps dispatch visible without making the shell harder to scan.

### Use `components` for reusable fragments and `pages` for route ownership

The layout root retains Hexo entry files and `layout.ejs`/`page.ejs`. Reusable rendered fragments move to a flat `components/` directory. The comments provider folder remains because it contains a cohesive integration family. Route-specific singletons are flattened under `pages/`; only `pages/home/` and `pages/post/` retain subdirectories because each owns several cohesive partials.

Representative moves and renames are:

- `components/header/head.ejs`, `navbar.ejs`, `preloader.ejs`, and `progress-bar.ejs` move out of the misleading `header/` grouping; the five-line progress markup is inlined into `page.ejs`.
- `components/footer/footer.ejs` becomes `components/footer.ejs`.
- Rendered `utils/*` partials become directly named components such as `paginator.ejs`, `page-title.ejs`, `posts-list.ejs`, `side-tools.ejs`, `local-search.ejs`, and `image-viewer.ejs`.
- `components/plugins/aplayer.ejs` becomes `components/aplayer.ejs`; comment providers remain in `components/comments/`, with the dispatcher named `index.ejs`.
- Shared statistics remains `components/statistics.ejs`; one-caller avatar and author fragments are folded into the home sidebar.
- Singleton page folders become `pages/archive.ejs`, `masonry.ejs`, `bookmarks.ejs`, `friends.ejs`, `essays.ejs`, and `not-found.ejs`.
- `pages/home/home-content.ejs` becomes `pages/home/index.ejs`, `home-article.ejs` becomes `post-card.ejs`, and the one-line `home-background.ejs` is inlined. Banner image and sidebar remain meaningful page-family parts.
- `pages/post/article-content.ejs` becomes `pages/post/index.ejs` and `article-info.ejs` becomes `meta.ejs`; copyright, TOC, and tools remain separate.

Large existing partials are not split further in this change. The goal is direct ownership and fewer directory concepts, not a target file count.

### Preserve behavior hooks and correct coupled route behavior

Moves retain existing IDs, `data-*` attributes, ARIA state, Swup container boundaries, and comment/provider initialization contracts. Partial path references in EJS, browser scripts, helpers, Tailwind source scanning, and verification code are updated together.

The archive partial uses `page.posts` so year, month, and paginated archive routes remain scoped. Category content no longer renders comments independently because the page panel owns the single comments region. Unused `index` and `pageObject` partial arguments are removed. Masonry asset loading checks the explicit template/page kind instead of a partial-path string. These corrections are included because they are directly coupled to removing the old dispatch flow.

## Risks / Trade-offs

- **[Default Tailwind radii substantially shrink some current utilities]** Existing `rounded-xl` and `rounded-2xl` consumers currently resolve to `24px` and `48px`. → Classify each theme-owned consumer by role and change its utility where needed rather than relying on the same class name after token removal.
- **[Parent clipping can hide interaction affordances]** Applying `overflow-hidden` broadly could cut off focus rings or overlays. → Use clipping only for edge-touching media and connected visual regions with no escaping content.
- **[Route-shell shadows can add visual weight]** Applying elevation too broadly would make repeated cards compete with primary content. → Restrict the shadow to the explicit framed route-shell list and flatten it together with border/radius on edge-to-edge mobile layouts.
- **[Removing the global border fallback can expose missing colors]** Bare border utilities could resolve to `currentColor`. → Audit generated and authored markup before removing the fallback, and add explicit semantic colors only to actual structural borders.
- **[Template-only selection is breaking]** Sites and demo fixtures using `type` or title inference will render ordinary pages. → Update every canonical fixture and bilingual guide, add a major-release migration note, and verify each documented template output.
- **[Moving EJS files can break ambient contracts]** A stale partial path or missing local can fail generation or omit content. → Move cohesive groups, update all references in the same step, preserve ambient Hexo locals, and use explicit locals for the new router and page panel contracts.
- **[DOM changes can break browser behavior]** Reorganization may accidentally rename IDs or data hooks. → Treat current behavior selectors as fixed contracts and assert representative generated markup after the move.

## Migration Plan

1. Replace spacing and radius token ownership, classify theme-owned radius consumers, and update the image-radius default in both theme and demo configuration.
2. Apply the route-shell border/radius/shadow contract and subordinate article geometry, then verify representative light, dark, desktop, and mobile generated output.
3. Add explicit page-kind resolution and the literal router/page-panel flow while the existing files remain in place.
4. Move and rename components and page partials by cohesive group, updating all EJS, script, helper, and verification references after each group.
5. Convert canonical demo pages to explicit `template` front matter, remove legacy dispatch helpers and compatibility entry files, and verify built-in and custom routes.
6. Update bilingual user and developer documentation and run theme, demo-generation, CSS, docs, and OpenSpec checks.

The change affects generated markup and styling only; it stores no user data. Rollback consists of reverting the source, fixture, documentation, and spec changes together.

## Open Questions

None. The selected decisions are Tailwind's default radius scale with `rounded-2xl` route shells and standalone framed components, `rounded-xl` nested article modules, consistent elevation across framed route-level content, template-only custom page selection, theme-owned geometry only, and `components/` as the reusable EJS fragment boundary.
