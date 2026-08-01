# MVP Validation

Validation is intentionally small and black-box focused.

| Requirement | Proof |
| --- | --- |
| Decimal data-size conversion | Table-driven model test for Bytes, KB, GB, and EB |
| Fahrenheit, Celsius, and Kelvin conversion | Table-driven model test including freezing point |
| Imperial and metric length conversion | Table-driven model test including Miles to Kilometers |
| Invalid and negative byte input handling | Model boundary tests |
| All standard outputs shown simultaneously | Browser-facing data-size component test |
| Collapsible sections and hidden advanced outputs | Browser-facing component test |
| Debounced live results | Browser-facing component test using rendered input/output fields |
| Per-result one-click swap | Browser-facing component test verifying promoted unit, input, and recalculated outputs |
| Production compilation | `npm run build` |

No task is complete unless both `npm test` and `npm run build` pass.
