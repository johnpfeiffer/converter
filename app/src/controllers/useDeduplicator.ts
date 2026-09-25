import { useEffect, useRef, useState } from 'react'
import { deduplicateLines, sortLines, splitByWhitespace } from '../models/deduplication'
import {
  buildJevDeduplicationRequest,
  readJevDeduplication,
  type JevLineScore,
} from '../models/jevDeduplication'

export const useDeduplicator = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [jevScores, setJevScores] = useState<JevLineScore[]>([])
  const [jevError, setJevError] = useState<string | null>(null)
  const [jevLoading, setJevLoading] = useState(false)
  const requestRef = useRef<AbortController | null>(null)

  useEffect(() => () => {
    requestRef.current?.abort()
    requestRef.current = null
  }, [])

  const cancelJev = () => {
    requestRef.current?.abort()
    requestRef.current = null
    setJevLoading(false)
  }

  const updateInput = (value: string) => {
    cancelJev()
    setInput(value)
    setOutput('')
    setJevScores([])
    setJevError(null)
  }

  const deduplicate = () => {
    cancelJev()
    setJevScores([])
    setJevError(null)
    setOutput(deduplicateLines(input))
  }

  const jevDeduplicate = async () => {
    cancelJev()
    setJevError(null)
    setJevScores([])
    setOutput('')

    const plan = buildJevDeduplicationRequest(input)
    if (plan.lines.length === 0) return

    if (Object.keys(plan.request.questions).length === 0) {
      const result = readJevDeduplication(plan, null)
      setOutput(result.output)
      setJevScores(result.scores)
      return
    }

    const request = new AbortController()
    requestRef.current = request
    setJevLoading(true)

    try {
      const response = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan.request),
        signal: request.signal,
      })
      if (!response.ok) {
        if (response.status === 404 || response.status === 503) {
          throw new Error('Jev is unavailable. The Decisions gateway may not be configured.')
        }
        throw new Error(`Jev request failed (${response.status}).`)
      }
      const payload: unknown = await response.json().catch(() => {
        throw new Error('Jev returned an invalid response. Check the Decisions gateway.')
      })
      const result = readJevDeduplication(plan, payload)
      if (requestRef.current !== request) return

      setOutput(result.output)
      setJevScores(result.scores)
    } catch (error) {
      if (requestRef.current !== request) return
      setJevError(error instanceof Error ? error.message : 'Jev request failed.')
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null
        setJevLoading(false)
      }
    }
  }

  return {
    input,
    output,
    jevScores,
    jevError,
    jevLoading,
    updateInput,
    splitInput: () => updateInput(splitByWhitespace(input)),
    sortInput: () => updateInput(sortLines(input)),
    deduplicate,
    jevDeduplicate,
    lowercaseOutput: () => setOutput((value) => value.toLowerCase()),
    uppercaseOutput: () => setOutput((value) => value.toUpperCase()),
  }
}
