## MODIFIED Requirements

### Requirement: Local development enables developer mode

The tracked demo configuration MUST enable theme developer mode and local asset loading so `pnpm dev` serves the watched unminified JavaScript application, local vendor assets, and current theme styles.

#### Scenario: Local mode starts

- **WHEN** `pnpm dev` starts the development application build and Hexo
- **THEN** the demo configuration has `developer.enable` set to `true`
- **AND** the local demo does not depend on versioned CDN theme assets or browser import maps
