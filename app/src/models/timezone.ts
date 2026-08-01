import timeZoneData from './timezones.json'

export type TimeZoneDefinition = {
  id: string
  label: string
  standardOffsetMinutes: number
  daylightOffsetMinutes: number
  ianaZones: readonly string[]
}

export type TimeConversionResult =
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; formatted: string }

export const timeZones: readonly TimeZoneDefinition[] = timeZoneData

const LOCAL_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

const parseLocalDateTime = (rawValue: string): Date | null => {
  const match = LOCAL_DATE_TIME_PATTERN.exec(rawValue)

  if (!match) {
    return null
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(hour, minute, 0, 0)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  ) {
    return null
  }

  return date
}

const pad = (value: number) => value.toString().padStart(2, '0')

const formatLocalDateTime = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
  `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`

const effectiveOffset = (zone: TimeZoneDefinition, daylightSaving: boolean): number =>
  zone.standardOffsetMinutes + (daylightSaving ? zone.daylightOffsetMinutes : 0)

export const convertZonedDateTime = (
  rawValue: string,
  sourceZone: TimeZoneDefinition,
  targetZone: TimeZoneDefinition,
  sourceDaylightSaving: boolean,
  targetDaylightSaving: boolean,
): TimeConversionResult => {
  if (rawValue.trim() === '') {
    return { status: 'empty' }
  }

  const sourceDate = parseLocalDateTime(rawValue)

  if (!sourceDate) {
    return { status: 'error', message: 'Enter a valid date and time.' }
  }

  const utcMilliseconds =
    sourceDate.getTime() - effectiveOffset(sourceZone, sourceDaylightSaving) * 60_000
  const targetMilliseconds =
    utcMilliseconds + effectiveOffset(targetZone, targetDaylightSaving) * 60_000

  return { status: 'success', formatted: formatLocalDateTime(new Date(targetMilliseconds)) }
}

export const shiftLocalDateTime = (rawValue: string, hours: number): string | null => {
  const date = parseLocalDateTime(rawValue)

  if (!date) {
    return null
  }

  return formatLocalDateTime(new Date(date.getTime() + hours * 3_600_000))
}

export const formatCurrentLocalDateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}`

export const formatUtcOffset = (offsetMinutes: number): string => {
  const sign = offsetMinutes < 0 ? '−' : '+'
  const absoluteMinutes = Math.abs(offsetMinutes)
  return `UTC${sign}${pad(Math.floor(absoluteMinutes / 60))}:${pad(absoluteMinutes % 60)}`
}

export const formatTimeZoneLabel = (zone: TimeZoneDefinition): string =>
  `${formatUtcOffset(zone.standardOffsetMinutes)} — ${zone.label}`

const assertCatalogOrder = (zones: readonly TimeZoneDefinition[]) => {
  for (let index = 1; index < zones.length; index += 1) {
    if (zones[index]!.standardOffsetMinutes < zones[index - 1]!.standardOffsetMinutes) {
      throw new Error('Timezone catalog must be ordered by UTC offset.')
    }
  }
}

export const detectTimeZoneId = (
  zones: readonly TimeZoneDefinition[],
  ianaTimeZone: string,
  standardOffsetMinutes: number,
): string => {
  assertCatalogOrder(zones)

  return (
    zones.find((zone) => zone.ianaZones.includes(ianaTimeZone))?.id ??
    zones.find((zone) => zone.standardOffsetMinutes === standardOffsetMinutes)?.id ??
    zones.find((zone) => zone.id === 'utc')?.id ??
    zones[0]?.id ??
    ''
  )
}

const getIanaOffset = (ianaTimeZone: string, date: Date): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const representedTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
  )

  return Math.round((representedTime - date.getTime()) / 60_000)
}

export const detectBrowserTimeZoneId = (
  zones: readonly TimeZoneDefinition[],
  now = new Date(),
): string => {
  const ianaTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  try {
    const year = now.getFullYear()
    const januaryOffset = getIanaOffset(ianaTimeZone, new Date(Date.UTC(year, 0, 15, 12)))
    const julyOffset = getIanaOffset(ianaTimeZone, new Date(Date.UTC(year, 6, 15, 12)))
    return detectTimeZoneId(zones, ianaTimeZone, Math.min(januaryOffset, julyOffset))
  } catch {
    return detectTimeZoneId(zones, ianaTimeZone, -now.getTimezoneOffset())
  }
}
