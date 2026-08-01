# MVP Validation

Validation is intentionally small and black-box focused.

| Requirement | Proof |
| --- | --- |
| Decimal data-size conversion | Table-driven model test for Bytes, KB, GB, and EB |
| Fahrenheit, Celsius, and Kelvin conversion | Table-driven model test including freezing point |
| Imperial and metric length conversion | Table-driven model test including Miles to Kilometers |
| Invalid and negative byte input handling | Model boundary tests |
| Collapsible sections and hidden advanced units | Browser-facing component test |
| Debounced live result | Browser-facing component test using the rendered input/output fields |
| One-click swap | Browser-facing component test verifying units, input, and result |
| Production compilation | `npm run build` |

No task is complete unless both `npm test` and `npm run build` pass.
