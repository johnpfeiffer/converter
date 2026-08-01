# Milestone 3 Specification: Weight and Volume

This specification is derived from `KERNEL/requirements-v1.md`. The kernel
remains authoritative.

## Scope

The application adds independently collapsible Weight and Volume sections using
the existing one-input, simultaneous-output conversion interaction.

## Weight

- Common units shown by default: ounces, pounds, grams, and kilograms.
- Advanced units: milligrams, US short tons, and metric tonnes.
- The default input is pounds.
- Weight values must be non-negative.

## Volume

- Common units shown by default: US fluid ounces, US gallons, Imperial fluid
  ounces, Imperial gallons, milliliters, and liters.
- Advanced kitchen units: US teaspoons, tablespoons, cups, pints, and quarts.
- Both US and Imperial units are labeled explicitly so “gallon” and “fluid ounce”
  are never ambiguous.
- The default input is US gallons.
- Volume values must be non-negative.

## Shared Interaction

- All other visible units calculate simultaneously from the selected input.
- A swap control above each result promotes that result to the input.
- Advanced units begin hidden and calculate immediately when revealed.
- Results follow the kernel's compact repeating-decimal rule.

## Navigation and Footer

- A horizontal, wrapping table-of-contents navigation links to every tool section.
- The introductory tagline is omitted.
- The standard John Pfeiffer footer includes LinkedIn and this repository's GitHub
  source link, opens external links in a new tab, and uses safe rel attributes.
