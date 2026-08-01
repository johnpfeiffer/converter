# Milestone 2 Specification: Time Zones

This specification is derived from `KERNEL/requirements-v1.md` and the user's
request to implement Milestone 2. The kernel remains authoritative.

## Scope

The application adds a fourth independently collapsible Time zones section. It
converts one local date and time between two fixed-offset timezone selections.

## Timezone Catalog

- Options are stored in a hardcoded JSON file and ordered consecutively by UTC
  offset from UTC−12:00 through UTC+14:00.
- Labels combine an explicit UTC offset with a recognizable place or region.
- The browser's IANA timezone identifies the initial source option. If there is
  no exact catalog mapping, its standard UTC offset selects the closest exact
  offset entry.
- UTC is the initial destination.

## Interaction Rules

- The source begins at the browser's current local date and time.
- −1 hour and +1 hour buttons adjust the source, including date rollover.
- Source and destination each default to Standard Time. Each has an independent
  Daylight Saving switch because the two locations may observe it differently.
- A Daylight Saving switch is disabled for a catalog entry that does not observe
  daylight saving time.
- The converted destination date and time updates 150 ms after typing and
  immediately after timezone or daylight-saving changes.
- A centered swap control promotes the current destination date/time and zone to
  the source while exchanging the daylight-saving settings.
- Date changes remain explicit in the full destination date/time value.

## Calculation Rules

Timezone conversion uses the catalog's standard offset plus its manual daylight
saving adjustment. It does not infer historical or future daylight-saving rules.
This makes the kernel's explicit Standard/Daylight Saving selection deterministic.
