import { useEffect, useMemo, useState } from 'react'
import {
  convertZonedDateTime,
  detectBrowserTimeZoneId,
  formatCurrentLocalDateTime,
  shiftLocalDateTime,
  timeZones,
} from '../models/timezone'

const DEBOUNCE_MS = 150

const findZone = (zoneId: string) =>
  timeZones.find((zone) => zone.id === zoneId) ?? timeZones.find((zone) => zone.id === 'utc')!

export const useTimeZoneConverter = () => {
  const [localDateTime, setLocalDateTime] = useState(() => formatCurrentLocalDateTime(new Date()))
  const [settledDateTime, setSettledDateTime] = useState(localDateTime)
  const [sourceZoneId, setSourceZoneIdState] = useState(() =>
    detectBrowserTimeZoneId(timeZones),
  )
  const [targetZoneId, setTargetZoneIdState] = useState('utc')
  const [sourceDaylightSaving, setSourceDaylightSaving] = useState(false)
  const [targetDaylightSaving, setTargetDaylightSaving] = useState(false)

  const sourceZone = findZone(sourceZoneId)
  const targetZone = findZone(targetZoneId)

  useEffect(() => {
    const timeout = window.setTimeout(() => setSettledDateTime(localDateTime), DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [localDateTime])

  const result = useMemo(
    () =>
      convertZonedDateTime(
        settledDateTime,
        sourceZone,
        targetZone,
        sourceDaylightSaving,
        targetDaylightSaving,
      ),
    [settledDateTime, sourceDaylightSaving, sourceZone, targetDaylightSaving, targetZone],
  )

  const setSourceZoneId = (zoneId: string) => {
    const zone = findZone(zoneId)
    setSourceZoneIdState(zone.id)
    if (zone.daylightOffsetMinutes === 0) setSourceDaylightSaving(false)
  }

  const setTargetZoneId = (zoneId: string) => {
    const zone = findZone(zoneId)
    setTargetZoneIdState(zone.id)
    if (zone.daylightOffsetMinutes === 0) setTargetDaylightSaving(false)
  }

  const shiftHours = (hours: number) => {
    const shifted = shiftLocalDateTime(localDateTime, hours)
    if (!shifted) return
    setLocalDateTime(shifted)
    setSettledDateTime(shifted)
  }

  const swap = () => {
    if (result.status === 'success') {
      setLocalDateTime(result.formatted)
      setSettledDateTime(result.formatted)
    }

    setSourceZoneIdState(targetZone.id)
    setTargetZoneIdState(sourceZone.id)
    setSourceDaylightSaving(targetDaylightSaving)
    setTargetDaylightSaving(sourceDaylightSaving)
  }

  return {
    localDateTime,
    result,
    setLocalDateTime,
    setSourceDaylightSaving,
    setSourceZoneId,
    setTargetDaylightSaving,
    setTargetZoneId,
    shiftHours,
    sourceDaylightSaving,
    sourceZone,
    swap,
    targetDaylightSaving,
    targetZone,
    timeZones,
  }
}
