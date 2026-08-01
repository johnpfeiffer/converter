import { describe, expect, it } from 'vitest'
import { convert, formatResult, parseConversion } from './conversion'
import { conversionCategories } from './unitCatalog'

describe('convert', () => {
  const cases = [
    ['data', 'byte', 'kilobyte', 1_000, 1],
    ['data', 'gigabyte', 'byte', 1, 1_000_000_000],
    ['data', 'exabyte', 'petabyte', 1, 1_000],
    ['temperature', 'fahrenheit', 'celsius', 32, 0],
    ['temperature', 'celsius', 'kelvin', 0, 273.15],
    ['length', 'foot', 'inch', 1, 12],
    ['length', 'mile', 'kilometer', 1, 1.609344],
    ['weight', 'pound', 'kilogram', 1, 0.45359237],
    ['weight', 'ounce', 'pound', 16, 1],
    ['volume', 'us-gallon', 'liter', 1, 3.785411784],
    ['volume', 'imperial-gallon', 'liter', 1, 4.54609],
    ['volume', 'us-fluid-ounce', 'us-gallon', 128, 1],
  ] as const

  it.each(cases)('converts %s from %s to %s', (categoryId, from, to, value, expected) => {
    const category = conversionCategories.find((item) => item.id === categoryId)!
    expect(convert(category, from, to, value)).toBeCloseTo(expected, 10)
  })
})

describe('formatResult', () => {
  it.each([
    [1 / 3, '0.33'],
    [1 / 6, '0.166'],
    [1 / 7, '0.142857'],
    [1.609344, '1.609344'],
    [0.000001, '0.000001'],
  ])('formats %s compactly', (value, expected) => {
    expect(formatResult(value)).toBe(expected)
  })
})

describe('parseConversion', () => {
  const data = conversionCategories.find((item) => item.id === 'data')!

  it('keeps empty output empty', () => {
    expect(parseConversion(data, 'byte', 'kilobyte', '')).toEqual({ status: 'empty' })
  })

  it('rejects negative data sizes', () => {
    expect(parseConversion(data, 'byte', 'kilobyte', '-1')).toEqual({
      status: 'error',
      message: 'Data size cannot be negative.',
    })
  })

  it('rejects negative weights', () => {
    const weight = conversionCategories.find((item) => item.id === 'weight')!
    expect(parseConversion(weight, 'pound', 'kilogram', '-1')).toEqual({
      status: 'error',
      message: 'Weight cannot be negative.',
    })
  })
})
