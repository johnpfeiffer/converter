# MVP Specification

This specification is derived from `KERNEL/requirements-v1.md`, `KERNEL/DESIGN.md`,
and the implementation decisions confirmed by the user. The kernel remains the
authority if this document ever conflicts with it.

## Scope

The MVP is a browser-based React application with three independently collapsible
conversion sections: Data size, Temperature, and Length. Milestones 2 and 3 are
out of scope.

Each section has one input value and unit on the left and all calculated output
values on the right. The current input unit is omitted from the output list. A
swap control above each output promotes that output unit and value to the input.

## Conversion Rules

- Data size uses decimal SI factors: 1 KB = 1,000 bytes.
- Standard data units are Bytes, KB, MB, and GB. Advanced units are TB, PB, and EB.
- Standard temperature units are Fahrenheit and Celsius. Kelvin is advanced.
- Standard length units are Inches, Feet, Yards, and Miles. Advanced units are
  Centimeters, Meters, and Kilometers.
- Every visible unit in a section can be selected as the input. Every other
  visible unit is calculated simultaneously as an output.
- Calculations retain JavaScript numeric precision. Display values are compacted
  to at most 12 significant digits.

## Interaction Rules

- All sections begin collapsed and can be expanded independently.
- Advanced units begin hidden. Enabling advanced mode adds them to the input
  selector and output list, immediately calculating the additional results.
- Disabling advanced mode while an advanced unit is the input converts its value
  to the section's standard default input unit before hiding advanced units.
- Results update 150 ms after input changes and immediately after unit changes.
- Empty input produces an empty output. Non-numeric input produces an error.
- Data size values must be non-negative.
- The existing React Router structure and both `/` and `/:app` entry paths remain.

## Presentation

The interface uses Material UI defaults in light mode. Layout overrides are
limited to spacing, sizing, and responsive source/result positioning. Text is at
least 14 px and interactive/field boundaries use Material UI's default borders.
