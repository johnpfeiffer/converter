import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useId } from 'react'
import { useTimeZoneConverter } from '../controllers/useTimeZoneConverter'
import { formatTimeZoneLabel } from '../models/timezone'

export function TimeZoneSection() {
  const controller = useTimeZoneConverter()
  const sourceLabelId = useId()
  const targetLabelId = useId()
  const output = controller.result.status === 'success' ? controller.result.formatted : ''
  const error = controller.result.status === 'error' ? controller.result.message : ' '
  const dateRelation =
    output === ''
      ? ' '
      : controller.localDateTime.slice(0, 10) === output.slice(0, 10)
        ? 'Same calendar day'
      : output.slice(0, 10) > controller.localDateTime.slice(0, 10)
        ? 'Next calendar day'
        : 'Previous calendar day'

  return (
    <Accordion>
      <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>}>
        <Stack>
          <Typography component="h2" variant="h6">
            Time zones
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Compare local times across UTC offsets
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack alignItems="flex-start" direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack spacing={1.5} sx={{ flex: '1 1 0', width: '100%' }}>
            <Typography component="h3" variant="subtitle1">
              From
            </Typography>
            <TextField
              error={controller.result.status === 'error'}
              helperText={error}
              label="Source date and time"
              onChange={(event) => controller.setLocalDateTime(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type="datetime-local"
              value={controller.localDateTime}
            />
            <ButtonGroup fullWidth variant="outlined">
              <Button aria-label="Subtract one hour" onClick={() => controller.shiftHours(-1)}>
                −1 hour
              </Button>
              <Button aria-label="Add one hour" onClick={() => controller.shiftHours(1)}>
                +1 hour
              </Button>
            </ButtonGroup>
            <FormControl fullWidth>
              <InputLabel id={sourceLabelId}>Source timezone</InputLabel>
              <Select
                label="Source timezone"
                labelId={sourceLabelId}
                onChange={(event) => controller.setSourceZoneId(event.target.value)}
                value={controller.sourceZone.id}
              >
                {controller.timeZones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {formatTimeZoneLabel(zone)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack spacing={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={controller.sourceDaylightSaving}
                    disabled={controller.sourceZone.daylightOffsetMinutes === 0}
                    onChange={(event) => controller.setSourceDaylightSaving(event.target.checked)}
                  />
                }
                label="Source daylight saving time"
              />
              <Typography color="text.secondary" variant="caption">
                Currently using {controller.sourceDaylightSaving ? 'Daylight Saving Time' : 'Standard Time'}
              </Typography>
            </Stack>
          </Stack>

          <IconButton aria-label="Swap source and destination timezones" onClick={controller.swap}>
            <span aria-hidden="true">⇄</span>
          </IconButton>

          <Stack spacing={1.5} sx={{ flex: '1 1 0', width: '100%' }}>
            <Typography component="h3" variant="subtitle1">
              To
            </Typography>
            <TextField
              helperText={dateRelation}
              label="Converted date and time"
              slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }}
              type="datetime-local"
              value={output}
            />
            <FormControl fullWidth>
              <InputLabel id={targetLabelId}>Destination timezone</InputLabel>
              <Select
                label="Destination timezone"
                labelId={targetLabelId}
                onChange={(event) => controller.setTargetZoneId(event.target.value)}
                value={controller.targetZone.id}
              >
                {controller.timeZones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {formatTimeZoneLabel(zone)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack spacing={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={controller.targetDaylightSaving}
                    disabled={controller.targetZone.daylightOffsetMinutes === 0}
                    onChange={(event) => controller.setTargetDaylightSaving(event.target.checked)}
                  />
                }
                label="Destination daylight saving time"
              />
              <Typography color="text.secondary" variant="caption">
                Currently using {controller.targetDaylightSaving ? 'Daylight Saving Time' : 'Standard Time'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
