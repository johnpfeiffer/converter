Convert things

# MVP Goal

Common number conversions: 

- Bytes to KB, MB, GB (an "advanced" mode allows TB, PB, EB)
- temperature Fahrenheit to Celsius (an "advanced" mode does Kelvin)
- Inches, Feet, Yards, Miles (an "advanced" mode to convert that to CM, M, KM)



## Milestone 2

- Provide +/ Hour

- Default to Standard Time, with a toggle to make it "Daylight Savings"

- 2 Timezones: detect the user's current timezone from the browser as the default start
- Dropdown (consecutive timezones - hardcoded in JSON) to select both the start and end

## Milestone 3

Calculator for add/subtract/multiply/divide

- shows a history of each previous calculation and result


## Design

All features are separate sections are delineated - and can be collapsed

A single click on the top center should allow swapping the input and output (e.g. if the user wants to input celsius on the left and see fahrenheit as a result on the right)

"advanced" modes are hidden by default and it takes a click to see the extra fields (on expand - auto calculate these results)

Live updates based on each selection (with a reasonable de-bounce)

