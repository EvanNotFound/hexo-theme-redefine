# Page Rendering Specification

## Purpose

Define route classification, EJS dispatch, template ownership, and preserved page behavior.

## Requirements

### Requirement: Page kind resolution is explicit

The theme SHALL resolve each route to one stable page kind. Built-in Hexo home, post, archive, category, and tag routes SHALL retain their framework-defined kinds. Custom page kinds SHALL be selected only through the documented `template` front-matter field, and the resolver MUST return a page-kind identifier rather than an executable partial path.

#### Scenario: Built-in Hexo route renders

- **WHEN** Hexo renders a home, post, archive, category-detail, or tag-detail route
- **THEN** the route resolves to its corresponding built-in page kind without requiring custom front matter

#### Scenario: Supported custom template renders

- **WHEN** a page declares a supported `template` value such as `categories`, `tags`, `links`, `masonry`, `bookmarks`, or `essays`
- **THEN** the route resolves to that documented custom page kind

#### Scenario: Legacy type or title is used alone

- **WHEN** a page omits `template` but its `type` or title matches a former custom-page alias
- **THEN** the route renders as an ordinary page
- **AND** no title or `type` value implicitly selects a custom template

#### Scenario: Unknown template is declared

- **WHEN** a page declares an unsupported `template` value
- **THEN** the route renders through the ordinary page kind without suppressing its title or content

### Requirement: Page dispatch is visible in one router

The common page shell SHALL render route content through one EJS router whose branches name literal page partials. Page classification data MUST NOT store partial paths or layout modes, and a framed custom page SHALL use one reusable page-panel component rather than a second dynamic dispatcher.

#### Scenario: Contributor traces a route

- **WHEN** a contributor opens the page router for a resolved page kind
- **THEN** the selected literal partial and whether it uses the page panel are visible in that file

#### Scenario: Framed custom page renders

- **WHEN** categories, tags, links, essays, or ordinary page content uses the shared framed treatment
- **THEN** the router renders its literal page content through the reusable page-panel component
- **AND** the panel owns shared page content, optional comments, and pagination behavior

#### Scenario: Raw route renders

- **WHEN** home, post, archive, masonry, bookmarks, or not-found content requires route-specific composition
- **THEN** the router renders its literal route partial without an unnecessary page-panel wrapper

### Requirement: EJS ownership follows rendered responsibility

Required Hexo layout entries SHALL remain at the layout root. Reusable rendered fragments SHALL live under `layout/components`, route-owned content SHALL live under `layout/pages`, and subdirectories SHALL be retained only for cohesive multi-file page families or integrations. Rendered UI MUST NOT be categorized as a utility solely because it is reused.

#### Scenario: Contributor locates reusable UI

- **WHEN** a contributor needs the navbar, footer, paginator, page title, side tools, search, image viewer, statistics, player integration, or comment integration
- **THEN** the rendered fragment is located under `layout/components` with a direct concrete name

#### Scenario: Contributor locates page-specific content

- **WHEN** a contributor needs archive, taxonomy, friends, essays, masonry, bookmarks, home, or post markup
- **THEN** the markup is located under `layout/pages` and grouped only when the page family has multiple cohesive parts

#### Scenario: Hexo selects a layout entry

- **WHEN** Hexo requests a supported root layout such as index, post, archive, category, tag, page, or not-found
- **THEN** the required root entry remains available and delegates to the common page shell without duplicating that shell

### Requirement: Route behavior remains complete

The explicit render flow SHALL preserve page content, page titles, optional comments, pagination, Swup boundaries, behavior IDs and data attributes, conditional assets, and route-scoped collections. Archive and taxonomy routes MUST render the collection supplied for the current route rather than silently replacing it with the complete site collection.

#### Scenario: Paginated or filtered archive renders

- **WHEN** Hexo supplies posts for an archive year, month, or pagination route
- **THEN** the archive renders that route-scoped post collection

#### Scenario: Framed page enables comments

- **WHEN** a custom or ordinary page explicitly enables comments
- **THEN** exactly one comments region renders through the page panel

#### Scenario: Masonry template renders

- **WHEN** a page declares `template: masonry`
- **THEN** the masonry partial and its required browser assets are selected without comparing a stored partial path

#### Scenario: Swup navigation replaces route content

- **WHEN** single-page navigation is enabled and the user changes routes
- **THEN** the existing Swup replacement boundaries and behavior hooks remain available after the EJS reorganization
