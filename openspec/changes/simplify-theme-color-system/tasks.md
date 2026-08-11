## 1. Establish The Numbered Foundation

- [ ] 1.1 Replace the ordinal background, text, and border declarations with the approved mode-aware RD background/gray levels, move runtime-backed Tailwind mappings to `@theme inline`, retain `--rd-shadow`, and cover generated primary-text contrast plus fixed-token ownership with focused helper tests.

## 2. Migrate Theme Consumers

- [ ] 2.1 Migrate theme-owned EJS, native CSS, Hexo-generated markup, and browser-generated class strings to numbered backgrounds, component states, borders, primary/secondary text, opacity modifiers, and `--rd-primary-text` according to the design role table.
- [ ] 2.2 Update bundled APlayer and comment-system adapters to the numbered neutral foundation while preserving vendor colors, remove duplicate component palettes such as the preloader background, and delete all retired declarations, mappings, and active references without compatibility aliases.

## 3. Document And Verify The Change

- [ ] 3.1 Update aligned English and Chinese color and major-version migration guidance with primary-text behavior and the retired-to-numbered custom-CSS mapping; update contributor token guidance where ownership rules change.
- [ ] 3.2 Run the focused helper and default/feature/plugin generation tests, JavaScript build, documentation lint and type checks, strict OpenSpec validation, retired-name source search, and diff hygiene checks.
