# Architecture

The converter is a client-only React and TypeScript application under `app/`.
The immutable requirements and design inputs remain under `KERNEL/`; derived
behavior and validation contracts live under `SPEC/` and `VALIDATION/`.

## System design

```mermaid
flowchart LR
    Browser[Browser route] --> Router[React Router]
    Router --> Page[HomePage]
    Page --> View[ConverterSection view]
    View --> Controller[useConverter controller]
    Controller --> Model[Conversion model]
    Model --> Catalog[Unit catalog]
    Controller -->|state and result| View
    Page --> TimeView[TimeZoneSection view]
    TimeView --> TimeController[useTimeZoneConverter controller]
    TimeController --> TimeModel[Timezone model]
    TimeModel --> TimeCatalog[Ordered timezone JSON]
```

- `models/` owns the unit catalog, parsing, validation, conversion, and result
  formatting. It has no React or Material UI dependency.
- `controllers/` owns per-section input state, the 150 ms debounce, the derived
  result collection, advanced-unit visibility, and per-result promotion.
- `views/` owns Material UI presentation and delegates all conversion decisions.
- `App.tsx` preserves the scaffold's `/` and `/:app` routes so later milestones
  can add route-specific behavior without replacing the application shell.
- `App.tsx` also owns the horizontal tool index and milestone ordering. The shared
  footer remains a presentation component without domain behavior.
- The timezone domain uses a separate controller and model because date rollover,
  two independently configured endpoints, and fixed UTC offsets do not fit the
  unit-conversion abstraction.

All categories use a canonical base unit. Scaled units convert to and from that
base; temperature uses affine conversion functions because it has an offset. The
controller calculates every visible unit other than the selected input, so one
source produces a consistent result list without duplicating conversion logic.
Weight uses kilograms and volume uses liters as their canonical bases. The result
formatter detects compact repeating patterns while retaining exact small values.

## User journey

```mermaid
flowchart TD
    Start[Open converter] --> Index[Choose a tool from the horizontal index]
    Index --> Summary[See its collapsed summary]
    Summary --> Expand[Expand a section]
    Expand --> Enter[Enter one value and choose its unit]
    Enter --> Debounce[Wait 150 ms]
    Debounce --> Result[Read all standard-unit results]
    Expand --> Advanced{Need advanced units?}
    Advanced -->|Yes| Reveal[Reveal and calculate advanced results]
    Reveal --> Result
    Result --> Promote{Use a result as input?}
    Promote -->|Yes| Carry[Promote its unit and value to the source]
    Carry --> Result
```

## Milestone 3 journey

```mermaid
flowchart TD
    Choose[Choose Weight or Volume] --> Expand[Expand the section]
    Expand --> Input[Enter one value and select its unit]
    Input --> Common[Read all common Imperial and metric results]
    Common --> Advanced{Need related sizes?}
    Advanced -->|Yes| Reveal[Reveal rare or kitchen units]
    Reveal --> Common
    Common --> Promote[Optionally promote any result to input]
    Promote --> Common
```

US and Imperial liquid measures are labeled separately because their gallons and
fluid ounces have different sizes. Common cross-system results remain visible;
advanced mode limits the longer tail of kitchen and extreme weight units.

## Extension points

Milestone 4's calculator has history state and should remain a separate domain
model rather than being forced into the unit- or timezone-conversion abstractions.

## Timezone journey

```mermaid
flowchart TD
    Open[Expand Time zones] --> Detect[Use browser timezone as source]
    Detect --> Pick[Choose source and destination by ordered UTC offset]
    Pick --> Enter[Enter local date and time]
    Enter --> Adjust[Optionally adjust by plus or minus one hour]
    Adjust --> Mode[Choose Standard or Daylight Saving per endpoint]
    Mode --> Read[Read converted date, time, and day rollover]
    Read --> Swap[Optionally swap source and destination]
    Swap --> Read
```

The picker is offset-first rather than alphabetic so users can scan the direction
and magnitude of a conversion. Recognizable region labels remain in each option.
Daylight Saving controls are independent because source and destination may enter
or leave daylight time on different dates. The catalog is deterministic and
offline; it intentionally does not claim historical IANA-rule accuracy.

## Validation and operational notes

Vitest model tests are table-driven. React Testing Library verifies simultaneous
standard outputs, advanced-result disclosure, debounced live calculation,
per-result promotion, timezone selection, Standard Time defaults, hour
adjustments, tool navigation, Weight disclosure, and footer links through
accessible controls.
`npm run build` performs strict TypeScript compilation before creating the Vite
bundle.

As of July 31, 2026, `npm audit` reports an advisory in React Router's React
Server Components mode. This application is a client-only Vite SPA and does not
enable that mode. The current router version is retained because npm's suggested
downgrade is affected by older router advisories; update when a patched release
is available.
