# Converter

A focused browser utility for deduplicating pasted text and converting common
data sizes, temperatures, lengths, timezones, weights, and volumes. It uses
Material UI and keeps each tool in a collapsible section.

## Features

- Exact, case-sensitive deduplication of newline-delimited text
- Optional whitespace splitting and line sorting before deduplication
- Lowercase and uppercase transformations for deduplicated output
- Optional Jev semantic deduplication with a score for every line
- Decimal data sizes from Bytes through EB
- Fahrenheit, Celsius, and Kelvin
- Imperial and metric lengths
- Simultaneous outputs with debounced updates and per-result swapping
- Browser-detected source timezone with an ordered UTC-offset picker
- Independent Standard/Daylight Saving controls and ±1 hour adjustments
- Imperial and metric weight conversions from ounces through metric tonnes
- Explicit US, Imperial, and metric liquid-volume conversions
- Compact repeating-decimal formatting and a horizontal tool index
- Responsive Material UI layout at both `/` and `/:app`

## Local development

Node.js 24.20.0 or later is required by the Vite/Vitest toolchain (see
`app/package.json` `engines`).

```bash
cd app
npm ci
npm run dev
```

Open the local URL printed by Vite.

The exact Deduplicate button works in standalone development. **Jev
deduplicate** calls the same-origin `POST /api/decisions` gateway provided by
the deployment monorepo. Run through that monorepo with its `DECISIONS_API_BASE`,
`DECISIONS_API_KEY`, and `DECISIONS_MODEL` settings to use Jev. The browser sends
no provider key or model name. Jev sees the pasted lines; use exact deduplication
for text you do not want sent to the configured provider.

Jev keeps a line when its estimated duplicate score is below 75%. Scores and
keep/remove decisions appear below the text areas. Semantic judgments can be
ambiguous, so review them before using the output.

## Validation

```bash
cd app
npm test
npm run build
```

Tests cover the conversion rules and the highest-value browser interactions.
The production build is written to `app/dist/`.

See [architecture.md](architecture.md) for the system design and user journey.
