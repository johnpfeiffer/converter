import { useEffect, useMemo, useState } from 'react'
import { parseConversion } from '../models/conversion'
import type { ConversionCategory } from '../models/unitCatalog'

const DEBOUNCE_MS = 150

type CalculationSnapshot = {
  rawValue: string
  inputUnitId: string
  outputUnitId: string
}

export const useConverter = (category: ConversionCategory) => {
  const [rawValue, setRawValue] = useState('1')
  const [inputUnitId, setInputUnitId] = useState(category.defaultInputUnit)
  const [outputUnitId, setOutputUnitId] = useState(category.defaultOutputUnit)
  const [advanced, setAdvancedState] = useState(false)
  const [calculation, setCalculation] = useState<CalculationSnapshot>({
    rawValue: '1',
    inputUnitId: category.defaultInputUnit,
    outputUnitId: category.defaultOutputUnit,
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCalculation({ rawValue, inputUnitId, outputUnitId })
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [inputUnitId, outputUnitId, rawValue])

  const result = useMemo(
    () =>
      parseConversion(
        category,
        calculation.inputUnitId,
        calculation.outputUnitId,
        calculation.rawValue,
      ),
    [calculation, category],
  )

  const availableUnits = useMemo(
    () => category.units.filter((unit) => advanced || !unit.advanced),
    [advanced, category.units],
  )

  const swap = () => {
    const currentResult = parseConversion(category, inputUnitId, outputUnitId, rawValue)

    if (currentResult.status === 'success') {
      setRawValue(currentResult.formatted)
    }

    setInputUnitId(outputUnitId)
    setOutputUnitId(inputUnitId)
  }

  const setAdvanced = (nextAdvanced: boolean) => {
    setAdvancedState(nextAdvanced)

    if (!nextAdvanced) {
      const inputIsAdvanced = category.units.find((unit) => unit.id === inputUnitId)?.advanced
      const outputIsAdvanced = category.units.find((unit) => unit.id === outputUnitId)?.advanced

      if (inputIsAdvanced || outputIsAdvanced) {
        setInputUnitId(category.defaultInputUnit)
        setOutputUnitId(category.defaultOutputUnit)
      }
    }
  }

  return {
    advanced,
    availableUnits,
    inputUnitId,
    outputUnitId,
    rawValue,
    result,
    setAdvanced,
    setInputUnitId,
    setOutputUnitId,
    setRawValue,
    swap,
  }
}
