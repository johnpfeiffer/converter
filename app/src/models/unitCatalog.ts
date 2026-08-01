export type UnitDefinition = {
  id: string
  label: string
  symbol: string
  advanced?: boolean
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

export type ConversionCategory = {
  id: 'data' | 'temperature' | 'length'
  title: string
  summary: string
  units: readonly UnitDefinition[]
  defaultInputUnit: string
  allowNegative: boolean
}

const scaledUnit = (
  id: string,
  label: string,
  symbol: string,
  scale: number,
  advanced = false,
): UnitDefinition => ({
  id,
  label,
  symbol,
  advanced,
  toBase: (value) => value * scale,
  fromBase: (value) => value / scale,
})

export const conversionCategories: readonly ConversionCategory[] = [
  {
    id: 'data',
    title: 'Data size',
    summary: 'Bytes and decimal storage units',
    defaultInputUnit: 'byte',
    allowNegative: false,
    units: [
      scaledUnit('byte', 'Bytes', 'B', 1),
      scaledUnit('kilobyte', 'Kilobytes', 'KB', 1_000),
      scaledUnit('megabyte', 'Megabytes', 'MB', 1_000_000),
      scaledUnit('gigabyte', 'Gigabytes', 'GB', 1_000_000_000),
      scaledUnit('terabyte', 'Terabytes', 'TB', 1_000_000_000_000, true),
      scaledUnit('petabyte', 'Petabytes', 'PB', 1_000_000_000_000_000, true),
      scaledUnit('exabyte', 'Exabytes', 'EB', 1_000_000_000_000_000_000, true),
    ],
  },
  {
    id: 'temperature',
    title: 'Temperature',
    summary: 'Fahrenheit, Celsius, and Kelvin',
    defaultInputUnit: 'fahrenheit',
    allowNegative: true,
    units: [
      {
        id: 'fahrenheit',
        label: 'Fahrenheit',
        symbol: '°F',
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      scaledUnit('celsius', 'Celsius', '°C', 1),
      {
        id: 'kelvin',
        label: 'Kelvin',
        symbol: 'K',
        advanced: true,
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
    ],
  },
  {
    id: 'length',
    title: 'Length',
    summary: 'Imperial and metric distance units',
    defaultInputUnit: 'inch',
    allowNegative: true,
    units: [
      scaledUnit('inch', 'Inches', 'in', 0.0254),
      scaledUnit('foot', 'Feet', 'ft', 0.3048),
      scaledUnit('yard', 'Yards', 'yd', 0.9144),
      scaledUnit('mile', 'Miles', 'mi', 1_609.344),
      scaledUnit('centimeter', 'Centimeters', 'cm', 0.01, true),
      scaledUnit('meter', 'Meters', 'm', 1, true),
      scaledUnit('kilometer', 'Kilometers', 'km', 1_000, true),
    ],
  },
]
