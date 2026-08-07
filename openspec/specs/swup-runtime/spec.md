## Purpose

Define how the theme initializes browser behavior across initial loads and Swup navigation while preserving page cleanup and marked-script integrations.

## Requirements

### Requirement: Theme runtime initializes directly across page views
The theme runtime SHALL initialize global behavior once on the initial document-ready event and SHALL initialize page behavior once for the initial page and once after each subsequent Swup `page:view` hook.

#### Scenario: Initial page load
- **WHEN** the document becomes ready
- **THEN** the runtime initializes global handlers and initializes the current page

#### Scenario: Swup navigation completes
- **WHEN** Swup fires `page:view` after replacing the configured container
- **THEN** the runtime initializes the newly rendered page without requiring a full document reload

### Requirement: Page-scoped work is cancelled before replacement
The theme runtime SHALL abort the active page scope before Swup replaces the `#swup` container and SHALL provide a fresh page scope to the next page initialization.

#### Scenario: Navigation replaces page content
- **WHEN** Swup reaches the `before('content:replace')` hook
- **THEN** active page listeners and abortable work receive cancellation before the old DOM is replaced

#### Scenario: A new page initializes
- **WHEN** page initialization starts after a Swup view
- **THEN** feature initializers receive a non-aborted scope associated with that page

### Requirement: Marked scripts retain Swup reload behavior
The theme SHALL retain Swup Scripts Plugin opt-in behavior so scripts carrying `data-swup-reload-script` are re-evaluated after Swup content replacement, while unmarked scripts are not newly re-evaluated by that plugin.

#### Scenario: Marked script exists in the incoming page
- **WHEN** Swup replaces content containing a `data-swup-reload-script` script
- **THEN** the script is re-evaluated by the retained Scripts Plugin

#### Scenario: Unmarked script exists in the incoming page
- **WHEN** Swup replaces content containing a script without `data-swup-reload-script`
- **THEN** the opt-in Scripts Plugin does not re-evaluate that script

### Requirement: Encrypted content can refresh page features
The theme SHALL continue responding to `redefine:page:refresh` by re-running page initialization for content inserted by the standalone encrypted-content bundle.

#### Scenario: Encrypted content is decrypted
- **WHEN** the HBE bundle dispatches `redefine:page:refresh`
- **THEN** the theme re-initializes page features against the decrypted DOM

### Requirement: Pjax residue is absent from the theme runtime
The published theme source SHALL not include the unused Pjax library or unreferenced Pjax progress markup and CSS tokens, while retained Swup progress styling remains available.

#### Scenario: Theme assets and styles are built
- **WHEN** the theme source is inspected or built
- **THEN** no internal theme file loads the Pjax library or emits Pjax progress tokens, and Swup progress styling remains present
