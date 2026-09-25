# Jev Deduplication Specification

This extends the Deduplicate section described in `requirements-v02.md` using
the Decisions gateway documented by the deployment monorepo's `README-API.md`.
The kernel remains authoritative.

- Keep the existing exact Deduplicate action. Add a separate **Jev deduplicate**
  action for semantic matching.
- Send one same-origin `POST /api/decisions` request containing the entire
  nonempty line list in `state.lines`. Do not send a model name or API key from
  the browser.
- Use one `noul` question for each distinct line after the first, asking whether
  it means the same underlying concept as any earlier line. Common abbreviations
  and word-form variants qualify; merely related concepts do not. Exact repeats
  receive a local score of 1 and do not need Jev questions.
- Treat each `noul` value as an estimated duplicate score from 0 to 1. Keep the
  first line; remove subsequent lines with scores at or above 0.75. Preserve
  original order and text for kept lines.
- Show every input line, its score, and whether it was kept or removed. Reject
  missing, malformed, or out-of-range scores instead of silently deleting text.
- Show loading and error states. Input changes or a new exact deduplication
  cancel a pending Jev result. If there are no Jev questions, finish locally.

The client constructs O(n) question records and sends one request for n lines.
This avoids explicit O(n²) pair requests, but the provider may still perform
pairwise reasoning internally. Gateway and model limits still determine the
largest usable batch.
