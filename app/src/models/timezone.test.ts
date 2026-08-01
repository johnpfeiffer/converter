import { describe, expect, it } from 'vitest'
import {
  convertZonedDateTime,
  detectTimeZoneId,
  shiftLocalDateTime,
  type TimeZoneDefinition,
} from './timezone'

const pacific: TimeZoneDefinition = {
  id: 'pacific',
  label: 'Pacific Time',
  standardOffsetMinutes: -480,
  daylightOffsetMinutes: 60,
  ianaZones: ['America/Los_Angeles'],
}

const eastern: TimeZoneDefinition = {
  id: 'eastern',
  label: 'Eastern Time',
  standardOffsetMinutes: -300,
  daylightOffsetMinutes: 60,
  ianaZones: ['America/New_York'],
}

const utc: TimeZoneDefinition = {
  id: 'utc',
  label: 'UTC',
  standardOffsetMinutes: 0,
  daylightOffsetMinutes: 0,
  ianaZones: ['UTC'],
}

describe('convertZonedDateTime', () => {
  const cases = [
    ['standard time', false, false, '2026-01-15T15:00'],
    ['source daylight time', true, false, '2026-01-15T14:00'],
    ['destination daylight time', false, true, '2026-01-15T16:00'],
  ] as const

  it.each(cases)('%s', (_name, sourceDaylight, targetDaylight, expected) => {
    expect(
      convertZonedDateTime(
        '2026-01-15T12:00',
        pacific,
        eastern,
        sourceDaylight,
        targetDaylight,
      ),
    ).toEqual({ status: 'success', formatted: expected })
  })

  it('crosses the International Date Line', () => {
    const hawaii = { ...utc, id: 'hawaii', standardOffsetMinutes: -600 }
    const tokyo = { ...utc, id: 'tokyo', standardOffsetMinutes: 540 }

    expect(convertZonedDateTime('2026-01-01T23:00', hawaii, tokyo, false, false)).toEqual({
      status: 'success',
      formatted: '2026-01-02T18:00',
    })
  })
})

describe('timezone interactions', () => {
  it('shifts local time across a date boundary', () => {
    expect(shiftLocalDateTime('2026-01-01T00:30', -1)).toBe('2025-12-31T23:30')
  })

  it('detects an exact IANA zone and falls back to a matching offset', () => {
    const zones = [pacific, eastern, utc]
    expect(detectTimeZoneId(zones, 'America/Los_Angeles', -480)).toBe('pacific')
    expect(detectTimeZoneId(zones, 'Unlisted/Zone', -300)).toBe('eastern')
  })

  it('rejects a catalog that is not ordered by UTC offset', () => {
    expect(() => detectTimeZoneId([utc, pacific], 'UTC', 0)).toThrow(
      'Timezone catalog must be ordered by UTC offset.',
    )
  })
})
