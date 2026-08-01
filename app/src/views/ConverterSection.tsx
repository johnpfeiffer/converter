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
  const outputUnitLabelId = useId()
  const output = controller.result.status === 'success' ? controller.result.formatted : ''
  const error = controller.result.status === 'error' ? controller.result.message : ' '

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
            alignItems="center"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <Stack spacing={1.5} sx={{ width: '100%' }}>
              <TextField
                error={controller.result.status === 'error'}
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

            <IconButton aria-label="Swap input and output" onClick={controller.swap}>
              <span aria-hidden="true">⇄</span>
            </IconButton>

            <Stack spacing={1.5} sx={{ width: '100%' }}>
              <TextField
                helperText=" "
                label="Result"
                slotProps={{ input: { readOnly: true } }}
                value={output}
              />
              <FormControl fullWidth>
                <InputLabel id={outputUnitLabelId}>Output unit</InputLabel>
                <Select
                  label="Output unit"
                  labelId={outputUnitLabelId}
                  onChange={(event) => controller.setOutputUnitId(event.target.value)}
                  value={controller.outputUnitId}
                >
                  {controller.availableUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.label} ({unit.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
