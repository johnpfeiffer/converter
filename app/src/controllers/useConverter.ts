import { useEffect, useMemo, useState } from 'react'
import { parseConversion } from '../models/conversion'
import type { ConversionCategory } from '../models/unitCatalog'

const DEBOUNCE_MS = 150

type CalculationSnapshot = {
  rawValue: string
}

export const useConverter = (category: ConversionCategory) => {
  const [rawValue, setRawValue] = useState('1')
  const [inputUnitId, setInputUnitId] = useState(category.defaultInputUnit)
  const [advanced, setAdvancedState] = useState(false)
  const [calculation, setCalculation] = useState<CalculationSnapshot>({
    rawValue: '1',
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCalculation({ rawValue })
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [rawValue])

  const availableUnits = useMemo(
    () => category.units.filter((unit) => advanced || !unit.advanced),
    [advanced, category.units],
  )

  const outputUnits = useMemo(
    () => availableUnits.filter((unit) => unit.id !== inputUnitId),
    [availableUnits, inputUnitId],
  )

  const results = useMemo(
    () =>
      outputUnits.map((unit) => ({
        unit,
        result: parseConversion(category, inputUnitId, unit.id, calculation.rawValue),
      })),
    [calculation.rawValue, category, inputUnitId, outputUnits],
  )

  const swap = (nextInputUnitId: string) => {
    const currentResult = parseConversion(category, inputUnitId, nextInputUnitId, rawValue)

    if (currentResult.status === 'success') {
      setRawValue(currentResult.formatted)
      setCalculation({ rawValue: currentResult.formatted })
    }

    setInputUnitId(nextInputUnitId)
  }

  const setAdvanced = (nextAdvanced: boolean) => {
    setAdvancedState(nextAdvanced)

    if (!nextAdvanced) {
      const inputIsAdvanced = category.units.find((unit) => unit.id === inputUnitId)?.advanced
      if (inputIsAdvanced) {
        const convertedInput = parseConversion(
          category,
          inputUnitId,
          category.defaultInputUnit,
          rawValue,
        )

        if (convertedInput.status === 'success') {
          setRawValue(convertedInput.formatted)
          setCalculation({ rawValue: convertedInput.formatted })
        }

        setInputUnitId(category.defaultInputUnit)
      }
    }
  }

  return {
    advanced,
    availableUnits,
    inputUnitId,
    rawValue,
    results,
    setAdvanced,
    setInputUnitId,
    setRawValue,
    swap,
  }
}
