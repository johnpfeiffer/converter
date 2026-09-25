import { nonemptyLines } from './deduplication'

export const JEV_DUPLICATE_THRESHOLD = 0.75

type JevQuestion = {
  type: 'noul'
  instructions: string
  criteria: { true: string; false: string }
}

export type JevDeduplicationPlan = {
  lines: string[]
  request: {
    state: { lines: { id: string; text: string }[] }
    questions: Record<string, JevQuestion>
  }
}

export type JevLineScore = {
  line: string
  probability: number
  duplicate: boolean
  source: 'first' | 'exact' | 'jev'
}

export type JevDeduplicationResult = { output: string; scores: JevLineScore[] }

const questionId = (index: number) => `duplicate_line_${index + 1}`

export function buildJevDeduplicationRequest(input: string): JevDeduplicationPlan {
  const lines = nonemptyLines(input)
  const seen = new Set<string>()
  const questions: Record<string, JevQuestion> = {}

  lines.forEach((line, index) => {
    if (seen.has(line)) return
    seen.add(line)
    if (index === 0) return

    questions[questionId(index)] = {
      type: 'noul',
      instructions: `Is line_${index + 1} a semantic duplicate of any earlier line in state.lines? Compare only with earlier lines.`,
      criteria: {
        true: 'It names the same underlying concept as an earlier line, including abbreviations or word-form variants such as Engineering Manager / Eng Manager and storm / stormy.',
        false: 'It names a distinct concept. Mere topical relatedness, or a broader or narrower category, is not enough.',
      },
    }
  })

  return {
    lines,
    request: {
      state: { lines: lines.map((text, index) => ({ id: `line_${index + 1}`, text })) },
      questions,
    },
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export function readJevDeduplication(
  plan: JevDeduplicationPlan,
  payload: unknown,
): JevDeduplicationResult {
  const needsJev = Object.keys(plan.request.questions).length > 0
  const answers = isRecord(payload) && isRecord(payload.answers) ? payload.answers : null
  if (needsJev && !answers) throw new Error('Invalid Jev response: answers are missing.')

  const seen = new Set<string>()
  const scores = plan.lines.map((line, index): JevLineScore => {
    if (seen.has(line)) {
      return { line, probability: 1, duplicate: true, source: 'exact' }
    }
    seen.add(line)

    if (index === 0) {
      return { line, probability: 0, duplicate: false, source: 'first' }
    }

    const answer = answers?.[questionId(index)]
    if (
      !isRecord(answer) ||
      answer.type !== 'noul' ||
      typeof answer.noul !== 'number' ||
      !Number.isFinite(answer.noul) ||
      answer.noul < 0 ||
      answer.noul > 1
    ) {
      throw new Error(`Invalid Jev response: score for line ${index + 1} is missing.`)
    }

    return {
      line,
      probability: answer.noul,
      duplicate: answer.noul >= JEV_DUPLICATE_THRESHOLD,
      source: 'jev',
    }
  })

  return {
    output: scores.filter(({ duplicate }) => !duplicate).map(({ line }) => line).join('\n'),
    scores,
  }
}
