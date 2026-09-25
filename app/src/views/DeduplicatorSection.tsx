import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useDeduplicator } from '../controllers/useDeduplicator'

export function DeduplicatorSection() {
  const controller = useDeduplicator()

  return (
    <Accordion id="deduplicate">
      <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>}>
        <Stack>
          <Typography component="h2" variant="h6">
            Deduplicate
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Remove repeated lines from pasted text.
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3 }}
            sx={{ alignItems: 'flex-start' }}
          >
            <Stack spacing={1.5} sx={{ flex: '1 1 0', minWidth: 0, width: '100%' }}>
              <Typography component="h3" variant="subtitle1">
                Input
              </Typography>
              <TextField
                fullWidth
                label="Input text"
                maxRows={14}
                minRows={8}
                multiline
                onChange={(event) => controller.updateInput(event.target.value)}
                value={controller.input}
              />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                <Button onClick={controller.splitInput} size="small" variant="outlined">
                  Split by whitespace
                </Button>
                <Button onClick={controller.sortInput} size="small" variant="outlined">
                  Sort lines
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={1.5} sx={{ flex: '1 1 0', minWidth: 0, width: '100%' }}>
              <Typography component="h3" variant="subtitle1">
                Output
              </Typography>
              <TextField
                fullWidth
                label="Output text"
                maxRows={14}
                minRows={8}
                multiline
                slotProps={{ input: { readOnly: true } }}
                value={controller.output}
              />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                <Button onClick={controller.lowercaseOutput} size="small" variant="outlined">
                  Lowercase output
                </Button>
                <Button onClick={controller.uppercaseOutput} size="small" variant="outlined">
                  Uppercase output
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
            <Button onClick={controller.deduplicate} variant="contained">
              Deduplicate
            </Button>
            <Button
              disabled={controller.jevLoading}
              onClick={() => void controller.jevDeduplicate()}
              variant="outlined"
            >
              Jev deduplicate
            </Button>
          </Stack>
          {controller.jevLoading && (
            <Stack direction="row" role="status" spacing={1} sx={{ alignItems: 'center' }}>
              <CircularProgress size={18} />
              <Typography variant="body2">Jev is checking the lines…</Typography>
            </Stack>
          )}
          {controller.jevError && <Alert severity="error">{controller.jevError}</Alert>}
          {controller.jevScores.length > 0 && (
            <Stack spacing={1}>
              <Typography component="h3" variant="subtitle1">
                Jev scores
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Estimated duplicate score; lines at 75% or higher are removed.
              </Typography>
              <Box aria-label="Jev scores" component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {controller.jevScores.map(({ line, probability, duplicate }, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{ borderBottom: 1, borderColor: 'divider', py: 0.75 }}
                  >
                    <Typography sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }} variant="body2">
                      {line} — {Math.round(probability * 100)}% — {duplicate ? 'Duplicate' : 'Keep'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
