import type { ConversionCategory, UnitDefinition } from './unitCatalog'

export type ParsedConversion =
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; value: number; formatted: string }

const findUnit = (category: ConversionCategory, unitId: string): UnitDefinition => {
  const unit = category.units.find((candidate) => candidate.id === unitId)

  if (!unit) {
    throw new Error(`Unknown ${category.id} unit: ${unitId}`)
  }

  return unit
}

export const convert = (
  category: ConversionCategory,
  inputUnitId: string,
  outputUnitId: string,
  value: number,
): number => {
  const inputUnit = findUnit(category, inputUnitId)
  const outputUnit = findUnit(category, outputUnitId)
  return outputUnit.fromBase(inputUnit.toBase(value))
}

export const formatResult = (value: number): string => {
  if (Object.is(value, -0) || value === 0) {
    return '0'
  }

  if (!Number.isFinite(value)) {
    return value.toString()
  }

  const absoluteValue = Math.abs(value)
  if (absoluteValue < 0.000001 || absoluteValue >= 1_000_000_000_000) {
    return Number(value.toPrecision(12)).toString()
  }

  const sign = value < 0 ? '-' : ''
  const [integerPart, fixedFraction = ''] = absoluteValue.toFixed(12).split('.')
  const fraction = fixedFraction.replace(/0+$/, '')

  for (let start = 0; start < fraction.length; start += 1) {
    for (let periodLength = 1; periodLength <= 6; periodLength += 1) {
      const pattern = fraction.slice(start, start + periodLength)
      if (pattern.length < periodLength) break
      if (/^0+$/.test(pattern)) continue

      let repeats = 1
      let position = start + periodLength
      while (fraction.slice(position, position + periodLength) === pattern) {
        repeats += 1
        position += periodLength
      }

      const trailingNoiseLength = fraction.length - position
      const enoughRepeats = periodLength === 1 ? repeats >= 3 : repeats >= 2
      if (enoughRepeats && trailingNoiseLength <= 1) {
        const compactPattern = periodLength === 1 ? pattern.repeat(2) : pattern
        return `${sign}${integerPart}.${fraction.slice(0, start)}${compactPattern}`
      }
    }
  }

  return Number(value.toPrecision(12)).toString()
}

export const parseConversion = (
  category: ConversionCategory,
  inputUnitId: string,
  outputUnitId: string,
  rawValue: string,
): ParsedConversion => {
  if (rawValue.trim() === '') {
    return { status: 'empty' }
  }

  const numericValue = Number(rawValue)

  if (!Number.isFinite(numericValue)) {
    return { status: 'error', message: 'Enter a valid number.' }
  }

  if (!category.allowNegative && numericValue < 0) {
    return { status: 'error', message: `${category.title} cannot be negative.` }
  }

  const value = convert(category, inputUnitId, outputUnitId, numericValue)
  return { status: 'success', value, formatted: formatResult(value) }
}
