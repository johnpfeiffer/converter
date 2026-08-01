# Converter

A focused browser utility for common data-size, temperature, length, timezone,
weight, and volume conversions. It uses Material UI and keeps each converter in a
collapsible section.

## Features

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

Node.js 20.19+ or 22.12+ is required by the Vite toolchain.

```bash
cd app
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Validation

```bash
cd app
npm test
npm run build
```

Tests cover the conversion rules and the highest-value browser interactions.
The production build is written to `app/dist/`.

See [architecture.md](architecture.md) for the system design and user journey.
