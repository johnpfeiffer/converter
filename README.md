# Converter

A focused browser utility for common data-size, temperature, and length
conversions. The MVP uses Material UI and keeps each converter in a collapsible
section with optional advanced units.

## Features

- Decimal data sizes from Bytes through EB
- Fahrenheit, Celsius, and Kelvin
- Imperial and metric lengths
- Debounced live results and one-click direction swapping
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
