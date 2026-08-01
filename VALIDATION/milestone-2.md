# Milestone 2 Validation: Time Zones

| Requirement | Proof |
| --- | --- |
| Conversion between fixed offsets | Table-driven model tests |
| Independent Standard/Daylight Saving handling | Model tests for source and destination adjustments |
| Date rollover | Model conversion and ±1 hour tests |
| Browser timezone detection | Model test for IANA mapping and offset fallback |
| Hardcoded consecutive dropdown | JSON catalog ordering model test |
| ±1 hour controls and live output | Browser-facing component test |
| Standard Time defaults and DST toggle | Browser-facing component test |
| Production compilation | `npm run build` |

No task is complete unless both `npm test` and `npm run build` pass.
