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
    return { status: 'error', message: 'Data size cannot be negative.' }
  }

  const value = convert(category, inputUnitId, outputUnitId, numericValue)
  return { status: 'success', value, formatted: formatResult(value) }
}
