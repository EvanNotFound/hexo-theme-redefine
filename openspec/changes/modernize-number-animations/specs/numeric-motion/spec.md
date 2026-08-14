## ADDED Requirements

### Requirement: Shared numeric motion enhances existing displays

The theme SHALL use the same Number Flow integration to animate footer runtime
units and the toolbar reading percentage when their existing configuration keys
enable those displays. The integration SHALL render the current integer value
even before its animation dependency is ready.

#### Scenario: Footer runtime is enabled

- **WHEN** the footer runtime calculates its elapsed day, hour, minute, and second values
- **THEN** the rendered runtime units show those values through Number Flow and continue updating once per second

#### Scenario: Toolbar percentage is enabled

- **WHEN** scrolling changes the rounded reading percentage to a different integer
- **THEN** the toolbar percentage animates to that integer through Number Flow

#### Scenario: Animation code is still loading

- **WHEN** a footer or toolbar value is available before Number Flow is ready
- **THEN** the correct latest value remains visible as plain text and is enhanced after the dependency becomes ready

### Requirement: Numeric motion follows each display's update semantics

Footer runtime digits SHALL move in the forward elapsed-time direction and SHALL
support normal hour, minute, and second rollover. Toolbar percentage digits SHALL
follow increases and decreases in the rounded scroll percentage. Repeated updates
with the same integer MUST NOT restart numeric animation, and the continuous top
progress bar SHALL retain its existing width updates independently.

#### Scenario: Elapsed unit rolls over

- **WHEN** a runtime unit advances from the end of its range to the beginning of the next cycle
- **THEN** its digits animate in the forward elapsed-time direction and settle on the new value

#### Scenario: Reader reverses scroll direction

- **WHEN** the rounded toolbar percentage changes from increasing to decreasing
- **THEN** its digit movement follows the new value direction and settles on the latest percentage

#### Scenario: Scroll event keeps the same rounded percentage

- **WHEN** a scroll update produces the same rounded integer as the previous update
- **THEN** the toolbar number is not updated again while the top progress bar continues to reflect scroll position

### Requirement: Numeric motion respects user preferences and stable semantics

Number Flow animation SHALL respect the user's reduced-motion preference.
Frequently changing numeric displays SHALL expose their current value without
creating live announcements on every update, and digit changes SHALL NOT resize
the toolbar control.

#### Scenario: Reduced motion is requested

- **WHEN** the user prefers reduced motion and a numeric value changes
- **THEN** the display updates to the new value without a rolling transition

#### Scenario: Runtime timer updates

- **WHEN** the footer runtime advances by one second
- **THEN** its current values remain available within non-live timer semantics

#### Scenario: Toolbar digit count changes

- **WHEN** the percentage crosses between one, two, or three digits
- **THEN** the back-to-top control retains stable dimensions and its action-oriented accessible name

### Requirement: Numeric displays survive page replacement

The shared Number Flow dependency SHALL initialize once per application load,
while numeric elements SHALL be initialized for the current page after initial
render and each Swup page replacement. A dependency load completed after page
replacement MUST NOT mutate detached elements or replay stale intermediate
values.

#### Scenario: Swup replaces numeric elements

- **WHEN** navigation replaces footer or toolbar numeric elements inside `#swup`
- **THEN** the newly rendered elements receive their current values without reloading the Number Flow module

#### Scenario: Navigation occurs during dependency loading

- **WHEN** Swup replaces the page before the Number Flow import resolves
- **THEN** only connected numeric elements on the current page are enhanced with their latest recorded values
