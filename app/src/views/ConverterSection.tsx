import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useId } from 'react'
import { useConverter } from '../controllers/useConverter'
import type { ConversionCategory } from '../models/unitCatalog'

type ConverterSectionProps = {
  category: ConversionCategory
}

export function ConverterSection({ category }: ConverterSectionProps) {
  const controller = useConverter(category)
  const inputUnitLabelId = useId()
  const errorResult = controller.results.find(({ result }) => result.status === 'error')
  const error = errorResult?.result.status === 'error' ? errorResult.result.message : ' '

  return (
    <Accordion>
      <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>}>
        <Stack>
          <Typography component="h2" variant="h6">
            {category.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {category.summary}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack
            alignItems="flex-start"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 4 }}
          >
            <Stack spacing={1.5} sx={{ flex: '1 1 0', width: '100%' }}>
              <Typography component="h3" variant="subtitle1">
                Input
              </Typography>
              <TextField
                error={Boolean(errorResult)}
                helperText={error}
                label="Value"
                onChange={(event) => controller.setRawValue(event.target.value)}
                type="number"
                value={controller.rawValue}
              />
              <FormControl fullWidth>
                <InputLabel id={inputUnitLabelId}>Input unit</InputLabel>
                <Select
                  label="Input unit"
                  labelId={inputUnitLabelId}
                  onChange={(event) => controller.setInputUnitId(event.target.value)}
                  value={controller.inputUnitId}
                >
                  {controller.availableUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.label} ({unit.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={1.5} sx={{ flex: '1 1 0', width: '100%' }}>
              <Typography component="h3" variant="subtitle1">
                Results
              </Typography>
              {controller.results.map(({ result, unit }) => (
                <Stack alignItems="center" key={unit.id} spacing={0.5}>
                  <Tooltip title={`Use ${unit.label} as input`}>
                    <IconButton
                      aria-label={`Use ${unit.label} as input`}
                      onClick={() => controller.swap(unit.id)}
                      size="small"
                    >
                      <span aria-hidden="true">⇄</span>
                    </IconButton>
                  </Tooltip>
                  <TextField
                    fullWidth
                    label={`${unit.label} (${unit.symbol})`}
                    slotProps={{ input: { readOnly: true } }}
                    value={result.status === 'success' ? result.formatted : ''}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={controller.advanced}
                onChange={(event) => controller.setAdvanced(event.target.checked)}
              />
            }
            label="Show advanced units"
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
