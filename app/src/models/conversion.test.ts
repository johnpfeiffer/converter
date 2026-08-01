import { describe, expect, it } from 'vitest'
import { convert, parseConversion } from './conversion'
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
  ] as const

  it.each(cases)('converts %s from %s to %s', (categoryId, from, to, value, expected) => {
    const category = conversionCategories.find((item) => item.id === categoryId)!
    expect(convert(category, from, to, value)).toBeCloseTo(expected, 10)
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
})
