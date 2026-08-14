## MODIFIED Requirements

### Requirement: Vendor bootstrap and page initialization are separated

The theme SHALL use `scripts.ejs` to emit the application entry and separately
referenced vendor globals, while dependencies owned by application features
SHALL be bundled through the application build. Page behavior SHALL be
initialized by the browser application lifecycle after the DOM and its required
dependencies are available. Inline template scripts SHALL NOT initialize a
vendor before its asset is loaded.

#### Scenario: Numeric animation is enabled

- **WHEN** a generated page enables footer runtime or toolbar reading percentage
- **THEN** the application requests the bundled Number Flow feature chunk and initializes current numeric elements without loading a classic Odometer script or stylesheet

#### Scenario: Numeric animation is disabled

- **WHEN** both footer runtime and toolbar reading percentage are disabled
- **THEN** the generated page does not emit Odometer assets and the application does not request the Number Flow feature chunk

#### Scenario: Footer runtime updates across navigation

- **WHEN** the application renders or refreshes a page with footer runtime elements
- **THEN** the current Number Flow elements are initialized without duplicating the shared dependency and their displayed values continue to update through the application lifecycle

#### Scenario: Globally emitted Moment is present

- **WHEN** the essays feature is initialized after a Swup page transition
- **THEN** the existing Moment global is available without re-evaluating its vendor script solely because the page changed
