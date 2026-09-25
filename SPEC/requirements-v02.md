# Deduplicator Specification

Derived from `KERNEL/requirements-v02.md` under the invariant that each
conversion has an input and an output.

- Add a collapsible Deduplicate section above the existing converters and a
  matching link in the tool index.
- Provide a multiline input on the left and a read-only multiline output on
  the right. On narrow screens, stack them in that order.
- The Deduplicate button removes exact, case-sensitive duplicate lines while
  preserving the first occurrence and its order. Whitespace within a line is
  significant. Empty lines are omitted. CRLF and LF line endings are treated
  alike.
- Split by whitespace replaces the input with one nonempty token per line.
- Sort lines sorts the input lexicographically while retaining duplicates.
- Lowercase and Uppercase transform the current output only. A new input edit
  or input transformation clears the previous output until Deduplicate is run.
- The deduplication implementation uses string operations and a Set, without
  regular expressions.
