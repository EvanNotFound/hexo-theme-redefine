## Context

Footer runtime values are rendered inside `#swup`, recalculated once per second
by `source/js/tools/runtime.js`, and currently animated by the classic global
Odometer script plus a separately copied plugin stylesheet. The toolbar reading
percentage is also inside the Swup content and is updated directly from the
global scroll handler whenever the rounded page percentage changes.

The application is an ES2020 esbuild bundle with code splitting. Page-owned DOM
is replaced on Swup navigation while global listeners and the footer timer remain
alive, so numeric elements can disappear and be recreated without reloading the
application. Number Flow is a maintained framework-independent custom element
that supports interrupted digit transitions and respects reduced-motion
preferences.

## Goals / Non-Goals

**Goals:**

- Use one maintained numeric animation dependency for footer runtime values and
  the toolbar reading percentage.
- Keep value calculation and lifecycle ownership in the existing footer and
  scroll modules.
- Avoid loading Number Flow when both consuming features are disabled.
- Preserve correct values before and during lazy loading and after Swup replaces
  the rendered elements.
- Keep rapid scrolling responsive and avoid replaying stale percentage values.
- Remove the Odometer global script and copied stylesheet.

**Non-Goals:**

- Animate the continuous top reading-progress bar with Number Flow.
- Add a general public counter API or new theme configuration.
- Change elapsed-time calculation, progress calculation, side-tool actions, or
  the existing footer and progress configuration keys.
- Reproduce Odometer's legacy markup, themes, formatting API, or exact motion.

## Decisions

### Use Number Flow as a bundled dependency

Add `number-flow` to the root package and let esbuild own it as part of the
application dependency graph. The application will dynamically import a small
numeric-motion integration module when either `footer.runtime` or
`global.scroll_progress.percentage` is enabled. This produces one reusable lazy
chunk instead of another template-loaded global script and stylesheet.

The canonical demo will use esbuild's context API to build the application once,
then watch the same dependency graph while Hexo and Tailwind continue running.
Development output will be unminified, include source maps, and use stable chunk
names under `source/js/build/dev/`. This lets npm dependencies resolve locally
without import maps or another HTTP server. Contributors will refresh the browser
manually after JavaScript changes; live reload remains out of scope.

Number Flow is preferred over CountUp because it provides per-digit movement,
interruption handling, and reduced-motion behavior. A custom digit reel is not
preferred because rollover, interrupted animations, layout stability, and
accessible output would recreate a small animation library inside the theme.

### Keep package commands outcome-oriented

The root package will expose `dev`, `build`, `test`, `check`, and `clean` as the
complete contributor workflows. CSS and JavaScript build/watch files remain
internal executable helpers called directly by the build orchestrator,
development server, and tests. The docs package will expose its own `check`
command for lint and type validation without adding root-level docs aliases.

Root `clean` will remove ignored theme builds and generated demo state, while
the development server and tests continue using the narrower internal site
cleanup. Publishing will use pnpm and the standard `prepublishOnly` lifecycle so
the package is always built before publication. This keeps the public script
list focused on outcomes without adding another task runner.

### Keep a lightweight bridge in the application core

Footer and scroll code will call a shared lightweight setter that records the
latest integer on each numeric element. Before Number Flow is ready, the setter
renders a plain text value. After the lazy import registers the custom element,
the bridge upgrades the currently connected numeric elements from their latest
recorded values.

The bridge will compare each new integer with the recorded value and skip
duplicates. This is especially important because the scroll handler runs more
often than the rounded percentage changes. Recording only the latest value also
prevents values observed during module loading from being replayed as a burst of
stale animations.

This bridge is preferred over moving footer and scroll calculations into one
numeric feature module. Existing modules retain clear ownership, and the shared
code remains limited to rendering and dependency readiness.

### Tailor motion to each numeric display

Both displays will use a short digit transition suitable for frequently changing
compact controls. Footer elapsed units always progress forward, including unit
rollover, while toolbar percentage direction follows the value delta so scrolling
up and down produces corresponding movement. Minute and second digit limits will
describe their normal rollover ranges. Hours use the forward trend without a
static digit limit because their `00–23` range depends on both digits, and elapsed
days remain unbounded.

The toolbar percentage will update Number Flow only when the rounded integer
changes. The top progress bar will continue receiving its continuous width and
`aria-valuenow` updates independently.

### Treat Swup replacement as element replacement

The Number Flow module and global timer load once, but rendered numeric elements
remain page-owned. Setters will operate only on current connected elements, and
page initialization will provide the newly rendered footer and toolbar elements
with their current values. A lazy import that resolves after navigation will
query and upgrade the current page rather than retaining references to removed
elements.

Footer elapsed time will retain a non-live timer grouping, and Number Flow's
reduced-motion preference will remain enabled. The toolbar button will retain its
stable back-to-top accessible name so percentage changes are not announced on
every scroll step. Tabular numeric styling and stable control dimensions will
prevent digit changes from shifting the side-tools layout.

## Risks / Trade-offs

- **Number Flow adds more bundled code than a minimal custom transition** → Use
  one lazy chunk for both default numeric features and do not load it when both
  are disabled.
- **Fast scrolling can start animations faster than they finish** → Skip repeated
  rounded values, use short timings, and rely on Number Flow's interruption
  handling to converge on the latest value.
- **The dependency may resolve after Swup replaces the page** → Store values on
  elements without queuing element references, then initialize only connected
  elements from the current document after load.
- **Custom-element upgrade can briefly show plain text** → Render the correct
  plain value first; animation enhancement may arrive later without withholding
  information.
- **A future Number Flow release could alter rendering or bundle size** → Pin the
  accepted semver range in the lockfile and cover build output, generated asset
  selection, and both value integrations with focused tests.
