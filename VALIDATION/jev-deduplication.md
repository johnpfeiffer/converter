# Jev Deduplication Validation

| Requirement | Proof |
| --- | --- |
| One batch contains all lines and one question per distinct later line | Model request test and browser-facing fetch assertion |
| Exact repeats are scored locally; semantic scores decide removal | Model result test |
| Invalid or missing scores cannot remove text | Model rejection tests |
| Semantic output and per-line scores appear in the UI | Browser-facing interaction test |
| Gateway failure is visible and exact deduplication remains usable | Browser-facing error test |
| TypeScript and production bundle compile | `npm run build` |

Run `npm test` and `npm run build` before completion. A live Jev result is not
part of the local test suite; the gateway requires deployment configuration.
