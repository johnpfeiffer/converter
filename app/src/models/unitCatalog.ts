export type UnitDefinition = {
  id: string
  label: string
  symbol: string
  advanced?: boolean
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

export type ConversionCategory = {
  id: 'data' | 'temperature' | 'length' | 'weight' | 'volume'
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
  {
    id: 'weight',
    title: 'Weight',
    summary: 'Imperial and metric weight units',
    defaultInputUnit: 'pound',
    allowNegative: false,
    units: [
      scaledUnit('ounce', 'Ounces', 'oz', 0.028349523125),
      scaledUnit('pound', 'Pounds', 'lb', 0.45359237),
      scaledUnit('gram', 'Grams', 'g', 0.001),
      scaledUnit('kilogram', 'Kilograms', 'kg', 1),
      scaledUnit('milligram', 'Milligrams', 'mg', 0.000001, true),
      scaledUnit('us-short-ton', 'US short tons', 'ton', 907.18474, true),
      scaledUnit('metric-tonne', 'Metric tonnes', 't', 1_000, true),
    ],
  },
  {
    id: 'volume',
    title: 'Volume',
    summary: 'US, Imperial, and metric liquid volumes',
    defaultInputUnit: 'us-gallon',
    allowNegative: false,
    units: [
      scaledUnit('us-fluid-ounce', 'US fluid ounces', 'US fl oz', 0.0295735295625),
      scaledUnit('us-gallon', 'US gallons', 'US gal', 3.785411784),
      scaledUnit('imperial-fluid-ounce', 'Imperial fluid ounces', 'Imp fl oz', 0.0284130625),
      scaledUnit('imperial-gallon', 'Imperial gallons', 'Imp gal', 4.54609),
      scaledUnit('milliliter', 'Milliliters', 'mL', 0.001),
      scaledUnit('liter', 'Liters', 'L', 1),
      scaledUnit('us-teaspoon', 'US teaspoons', 'tsp', 0.00492892159375, true),
      scaledUnit('us-tablespoon', 'US tablespoons', 'tbsp', 0.01478676478125, true),
      scaledUnit('us-cup', 'US cups', 'cup', 0.2365882365, true),
      scaledUnit('us-pint', 'US pints', 'pt', 0.473176473, true),
      scaledUnit('us-quart', 'US quarts', 'qt', 0.946352946, true),
    ],
  },
]
