# Deduplicator Validation

| Requirement | Proof |
| --- | --- |
| Exact, case-sensitive deduplication and first-occurrence order | Table-driven model test |
| LF/CRLF input, blank lines, and significant in-line whitespace | Table-driven model test |
| Whitespace splitting and lexicographic sorting | Model tests and browser-facing controls test |
| Two text areas, button-driven output, and case transforms | Browser-facing interaction test |
| Positioned above existing converters and linked in navigation | Browser-facing interaction test |
| Production compilation | `npm run build` |

Run `npm test` and `npm run build` before completion.
