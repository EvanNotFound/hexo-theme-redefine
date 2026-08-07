## Context

Redefine currently emits light/dark CSS variables for generic colors and four
composed shadow values. The `redefine-container` and `hover-style` Stylus
helpers apply those values across layout surfaces and controls. Tailwind also
defines the same four values under its `--shadow-*` theme namespace, and
templates and generated markup consume utilities such as `shadow-redefine-flat`.

The flat values are primarily being used as a one-pixel border with a small
blurred shadow. The regular values add actual blur-based depth, but also embed
the same fake border. Hover variants add an inset border and are coupled to the
optional global scale setting. The result is duplicated token ownership,
implicit component geometry, and shadow transitions on many elements.

## Goals / Non-Goals

**Goals:**

- Give Redefine one semantic border token and one semantic shadow token.
- Make border-like surfaces use real borders rather than zero-offset shadows.
- Keep a static shadow only on components where depth is part of the component's
  role.
- Remove generic hover scaling, hover shadow changes, and active scale feedback
  owned by Redefine.
- Keep the canonical tokens namespaced as `--rd-border` and `--rd-shadow`.
- Map those tokens into Tailwind's `--color-*` and `--shadow-*` namespaces,
  producing `border-rd-border` and `shadow-rd` without overriding Tailwind's
  built-in `shadow-sm` through `shadow-2xl` utilities.
- Make layout and interaction styles explicit at their component owners after
  removing the overloaded helpers.

**Non-Goals:**

- Do not create a complete border or shadow scale for hypothetical future use.
- Do not remove ordinary semantic hover states such as color, background,
  focus, or visibility changes.
- Do not remove transforms used for responsive sizing, image viewing,
  animations, or third-party integrations.
- Do not redesign border radii, spacing, or component composition beyond what
  is required when removing `redefine-container`.
- Do not replace unrelated shadows in bundled assets, Mermaid, APlayer, docs,
  or third-party comment implementation details.

## Decisions

### Use semantic names, not visual variants

The canonical runtime variables will be `--rd-border` and `--rd-shadow`.
`--rd-border` stores the mode-aware border color. `--rd-shadow` stores the
complete mode-aware `box-shadow` declaration for static depth. There will be
no flat, hover, inset, numbered, or size-specific Redefine shadow tokens.

This follows the useful part of shadcn/ui's approach: components consume
semantic roles, while the theme owns the actual light/dark values. It avoids
preallocating `small`, `medium`, or `primary` variants without a demonstrated
component need.

### Bridge the canonical tokens into Tailwind

Tailwind v4 generates utilities from `--color-*` and `--shadow-*` theme
variables. `source/css/tailwind.source.css` will map the canonical variables
through those namespaces:

- `--color-rd-border: var(--rd-border)` generates `border-rd-border`.
- `--shadow-rd: var(--rd-shadow)` generates `shadow-rd`.

The values remain owned by the Redefine theme variables. The Tailwind aliases
exist only to make the same tokens available to utility-class consumers.
Tailwind's built-in shadow scale remains available and unchanged.

### Replace flat shadows with borders

Each Redefine-owned `flat` consumer will be classified as a structural surface
and migrated to `border: 1px solid var(--rd-border)` or the equivalent
`border-rd-border` utility. Its flat hover variant will be removed; the border
will remain stable while any intentional color or background state continues.

Elements that already declare an explicit border will lose the redundant flat
shadow utility rather than receiving a second border.

### Restrict the static shadow to genuine depth

Regular shadow consumers will be reviewed individually. Floating tools,
overlays, and similar surfaces may use `var(--rd-shadow)` or `shadow-rd` as a
static visual treatment. Ordinary cards, buttons, tables, images, and content
surfaces will use a border or no decoration instead. No regular shadow will
change on hover.

### Remove the overloaded styling helpers

All `redefine-container` call sites will be replaced with local padding,
background, radius, box-sizing, and margin rules. All `hover-style` call sites
will be replaced with the specific static border, shadow, and semantic state
rules needed by each owner. The responsive mixins and unrelated utility rules
in `redefine-theme.styl` may remain because they do not implement the removed
feature.

The global hover configuration and its documentation will be removed because
there is no longer a configurable generic shadow or scale effect.

### Remove old names instead of keeping aliases

The old `redefine-*` shadow CSS variables, Stylus utility classes, Tailwind
theme variables, and generated markup class names will be migrated and deleted
without compatibility aliases. This is a deliberate theme styling contract
change and prevents future consumers from continuing to depend on the retired
system.

## Risks / Trade-offs

- **[Visual regressions from border replacement]** A real border will not have
  the same blur as a flat shadow. → Use the existing light/dark border values
  as the starting point and review structural consumers by category during the
  generated CSS build.
- **[Some surfaces may lose needed depth]** Removing all regular variants at
  once could flatten overlays or floating tools. → Keep one static `--rd-shadow`
  and apply it only to components whose role communicates elevation.
- **[Tailwind and Stylus can drift]** The two build systems have different
  token namespaces. → Keep one canonical Redefine value and use Tailwind
  aliases that reference it; validate both `build:css` and the theme build.
- **[Breaking utility/configuration names]** User overrides using old classes or
  hover settings will no longer have an effect. → Document the removed options
  and new `border-rd-border`/`shadow-rd` utility names as part of the change.
- **[Interaction feedback may become quieter]** Removing scale and shadow hover
  states changes control feedback. → Preserve color, background, focus, and
  active-state feedback where it remains meaningful without transforms.

## Migration Plan

1. Add the canonical mode-aware tokens and Tailwind aliases.
2. Migrate Stylus consumers, templates, scripts, and browser-generated markup
   from old shadow utilities and helper calls.
3. Remove the old helpers, variants, configuration options, and documentation.
4. Build the theme CSS and generate the demo site for visual inspection.
5. If the result is unacceptable, revert the consumer migration together with
   the token/helper removal; no data or persisted content is affected.

## Open Questions

None. The migration will make `--rd-border` the canonical Redefine border
token, remove Redefine-owned uses of the old unnamespaced shadow color tokens,
and retain `--rd-shadow` only for floating tools and overlays whose depth is
meaningful after review.
