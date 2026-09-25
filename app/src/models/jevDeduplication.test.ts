import { describe, expect, it } from 'vitest'
import { buildJevDeduplicationRequest, readJevDeduplication } from './jevDeduplication'

describe('Jev deduplication', () => {
  it('sends all lines once and asks about each non-exact line after the first', () => {
    const plan = buildJevDeduplicationRequest(
      'storm\nstormy\nEngineering Manager\nEng Manager\nstorm',
    )

    expect(plan.request.state.lines).toEqual([
      { id: 'line_1', text: 'storm' },
      { id: 'line_2', text: 'stormy' },
      { id: 'line_3', text: 'Engineering Manager' },
      { id: 'line_4', text: 'Eng Manager' },
      { id: 'line_5', text: 'storm' },
    ])
    expect(Object.keys(plan.request.questions)).toEqual([
      'duplicate_line_2',
      'duplicate_line_3',
      'duplicate_line_4',
    ])
    expect(plan.request.questions.duplicate_line_2).toMatchObject({
      type: 'noul',
      criteria: { true: expect.any(String), false: expect.any(String) },
    })
    expect(plan.request).not.toHaveProperty('model')
  })

  it('keeps the first occurrence and exposes every score', () => {
    const plan = buildJevDeduplicationRequest(
      'storm\nstormy\nEngineering Manager\nEng Manager\nstorm',
    )
    const result = readJevDeduplication(plan, {
      answers: {
        duplicate_line_2: { type: 'noul', noul: 0.91 },
        duplicate_line_3: { type: 'noul', noul: 0.08 },
        duplicate_line_4: { type: 'noul', noul: 0.96 },
      },
    })

    expect(result.output).toBe('storm\nEngineering Manager')
    expect(result.scores).toEqual([
      { line: 'storm', probability: 0, duplicate: false, source: 'first' },
      { line: 'stormy', probability: 0.91, duplicate: true, source: 'jev' },
      { line: 'Engineering Manager', probability: 0.08, duplicate: false, source: 'jev' },
      { line: 'Eng Manager', probability: 0.96, duplicate: true, source: 'jev' },
      { line: 'storm', probability: 1, duplicate: true, source: 'exact' },
    ])
  })

  it.each([
    {},
    { answers: {} },
    { answers: { duplicate_line_2: { type: 'score', score: 0.9 } } },
    { answers: { duplicate_line_2: { type: 'noul', noul: 1.5 } } },
  ])('rejects an incomplete or invalid decision response', (payload) => {
    const plan = buildJevDeduplicationRequest('storm\nstormy')
    expect(() => readJevDeduplication(plan, payload)).toThrow(/invalid Jev response/i)
  })
})
