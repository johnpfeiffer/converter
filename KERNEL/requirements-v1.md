Convert things

# MVP Goal

Common number conversions: 

- Bytes to KB, MB, GB (an "advanced" mode allows TB, PB, EB)
- temperature Fahrenheit to Celsius (an "advanced" mode does Kelvin)
- Inches, Feet, Yards, Miles (an "advanced" mode to convert that to CM, M, KM)


Conversion input will show multiple outputs on the right: so input of a byte shows you simultaneously KB, MB, GB
thus the "swap" is above every possible output to make it the input field instead. 

## Milestone 2

- Provide +/ Hour

- Default to Standard Time, with a toggle to make it "Daylight Savings"

- 2 Timezones: detect the user's current timezone from the browser as the default start
- Dropdown (consecutive timezones - hardcoded in JSON) to select both the start and end

*My UX recommendation is an offset-first timezone picker—ordered UTC−12 through UTC+14 with recognizable city labels—plus compact −1 hour / +1 hour controls around a local date-time input.*
*That is easier to scan than a long alphabetical timezone list while remaining deterministic and offline.*

## Milestone 3

Imperial to Metric for weight and volumes. Pounds to kilograms (and the attendant related sizes). Gallons (Fluid Ounces) to Liters.  

## Milestone 4

Calculator for add/subtract/multiply/divide

- shows a history of each previous calculation and result


## Design

All features are separate sections are delineated - and can be collapsed

A single click on the top center should allow swapping the input and output (e.g. if the user wants to input celsius on the left and see fahrenheit as a result on the right)

"advanced" modes are hidden by default and it takes a click to see the extra fields (on expand - auto calculate these results)

Live updates based on each selection (with a reasonable de-bounce)

Round off at reasonable decimals - if the digit repeats twice that's enough, or if it's a repeating pattern only a single iteration.

Have a "table of contents" style header (maybe it's horizontal rather than vertical) so that each of the tools is quickly accessible

