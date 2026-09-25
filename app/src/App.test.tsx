import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => vi.restoreAllMocks())

describe('converter app', () => {
  it('deduplicates pasted text and offers input and output transformations', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: /converter tools/i })
    expect(within(navigation).getByRole('link', { name: 'Deduplicate' })).toHaveAttribute(
      'href',
      '#deduplicate',
    )

    const section = screen
      .getByRole('button', { name: /deduplicate/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    expect(section.previousElementSibling).toBeNull()
    await user.click(within(section).getByRole('button', { name: /deduplicate/i }))

    const input = within(section).getByRole('textbox', { name: 'Input text' })
    const output = within(section).getByRole('textbox', { name: 'Output text' })
    expect(output).toHaveAttribute('readonly')

    await user.type(input, 'Pear apple Pear{enter}banana apple')
    await user.click(within(section).getByRole('button', { name: 'Split by whitespace' }))
    expect(input).toHaveValue('Pear\napple\nPear\nbanana\napple')

    await user.click(within(section).getByRole('button', { name: 'Sort lines' }))
    expect(input).toHaveValue('Pear\nPear\napple\napple\nbanana')
    await user.click(within(section).getByRole('button', { name: 'Deduplicate' }))
    expect(output).toHaveValue('Pear\napple\nbanana')

    await user.click(within(section).getByRole('button', { name: 'Lowercase output' }))
    expect(output).toHaveValue('pear\napple\nbanana')
    await user.click(within(section).getByRole('button', { name: 'Uppercase output' }))
    expect(output).toHaveValue('PEAR\nAPPLE\nBANANA')

    await user.clear(input)
    expect(output).toHaveValue('')
  })

  it('uses one Jev Decisions request and shows semantic duplicate scores', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          answers: {
            duplicate_line_2: { type: 'noul', noul: 0.91 },
            duplicate_line_3: { type: 'noul', noul: 0.08 },
            duplicate_line_4: { type: 'noul', noul: 0.96 },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    const user = userEvent.setup()
    render(<App />)

    const section = screen
      .getByRole('button', { name: /deduplicate/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(section).getByRole('button', { name: /deduplicate/i }))
    await user.type(
      within(section).getByRole('textbox', { name: 'Input text' }),
      'storm{enter}stormy{enter}Engineering Manager{enter}Eng Manager{enter}storm',
    )
    await user.click(within(section).getByRole('button', { name: 'Jev deduplicate' }))

    expect(await within(section).findByRole('list', { name: 'Jev scores' })).toBeInTheDocument()
    expect(within(section).getByRole('textbox', { name: 'Output text' })).toHaveValue(
      'storm\nEngineering Manager',
    )
    expect(within(section).getByText(/stormy.*91%.*duplicate/i)).toBeInTheDocument()
    expect(within(section).getByText(/Eng Manager.*96%.*duplicate/i)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/decisions')
    expect(options).toMatchObject({ method: 'POST' })
    const request = JSON.parse(String(options?.body))
    expect(request).not.toHaveProperty('model')
    expect(request.state.lines).toHaveLength(5)
    expect(Object.keys(request.questions)).toHaveLength(3)
  })

  it('reports a Jev gateway error and keeps exact deduplication usable', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 503 }))
    const user = userEvent.setup()
    render(<App />)

    const section = screen
      .getByRole('button', { name: /deduplicate/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(section).getByRole('button', { name: /deduplicate/i }))
    await user.type(
      within(section).getByRole('textbox', { name: 'Input text' }),
      'storm{enter}stormy{enter}storm',
    )
    await user.click(within(section).getByRole('button', { name: 'Jev deduplicate' }))
    expect(await within(section).findByRole('alert')).toHaveTextContent(/Jev.*unavailable/i)
    expect(within(section).getByRole('textbox', { name: 'Output text' })).toHaveValue('')

    await user.click(within(section).getByRole('button', { name: 'Deduplicate' }))
    expect(within(section).getByRole('textbox', { name: 'Output text' })).toHaveValue(
      'storm\nstormy',
    )
  })

  it('ignores a Jev result after the input changes', async () => {
    let resolveFetch!: (response: Response) => void
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise<Response>((resolve) => { resolveFetch = resolve }),
    )
    const user = userEvent.setup()
    render(<App />)

    const section = screen
      .getByRole('button', { name: /deduplicate/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(section).getByRole('button', { name: /deduplicate/i }))
    const input = within(section).getByRole('textbox', { name: 'Input text' })
    await user.type(input, 'storm{enter}stormy')
    await user.click(within(section).getByRole('button', { name: 'Jev deduplicate' }))
    expect(within(section).getByRole('status')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'new list')
    await act(async () => {
      resolveFetch(new Response(JSON.stringify({
        answers: { duplicate_line_2: { type: 'noul', noul: 0.99 } },
      }), { status: 200 }))
    })

    expect(within(section).getByRole('textbox', { name: 'Output text' })).toHaveValue('')
    expect(within(section).queryByRole('list', { name: 'Jev scores' })).not.toBeInTheDocument()
  })

  it('provides a tool index and the standard footer without an extraneous tagline', () => {
    render(<App />)

    expect(screen.queryByText('Common conversions without the clutter.')).not.toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: /converter tools/i })
    for (const tool of ['Data size', 'Temperature', 'Length', 'Time zones', 'Weight', 'Volume']) {
      expect(within(navigation).getByRole('link', { name: tool })).toHaveAttribute(
        'href',
        `#${tool.toLowerCase().replaceAll(' ', '-')}`,
      )
    }

    expect(screen.getByText(/Built by John Pfeiffer/i)).toBeInTheDocument()
    const linkedIn = screen.getByRole('link', { name: /John Pfeiffer on LinkedIn/i })
    const github = screen.getByRole('link', { name: /Source code on GitHub/i })
    expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/foupfeiffer')
    expect(github).toHaveAttribute('href', 'https://github.com/johnpfeiffer/converter')
    for (const externalLink of [linkedIn, github]) {
      expect(externalLink).toHaveAttribute('target', '_blank')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('calculates all standard outputs and reveals advanced results', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /data size/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /data size/i }))

    expect(within(accordion).getByLabelText('Kilobytes (KB)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Megabytes (MB)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Gigabytes (GB)')).toBeInTheDocument()
    expect(within(accordion).queryByLabelText('Terabytes (TB)')).not.toBeInTheDocument()

    await user.click(within(accordion).getByRole('switch', { name: /show advanced units/i }))
    expect(within(accordion).getByLabelText('Terabytes (TB)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Petabytes (PB)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Exabytes (EB)')).toBeInTheDocument()

    await user.clear(within(accordion).getByLabelText('Value'))
    await user.type(within(accordion).getByLabelText('Value'), '1000')
    expect(await within(accordion).findByDisplayValue('1')).toBe(
      within(accordion).getByLabelText('Kilobytes (KB)'),
    )
    expect(within(accordion).getByLabelText('Megabytes (MB)')).toHaveValue('0.001')
    expect(within(accordion).getByLabelText('Gigabytes (GB)')).toHaveValue('0.000001')
  })

  it('promotes a selected result to the input and recalculates the other outputs', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /temperature/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /temperature/i }))
    await user.clear(within(accordion).getByLabelText('Value'))
    await user.type(within(accordion).getByLabelText('Value'), '32')
    expect(await within(accordion).findByDisplayValue('0')).toBe(
      within(accordion).getByLabelText('Celsius (°C)'),
    )

    await user.click(within(accordion).getByRole('button', { name: /use celsius as input/i }))

    expect(within(accordion).getByLabelText('Value')).toHaveValue(0)
    expect(within(accordion).getByRole('combobox', { name: /input unit/i })).toHaveTextContent(
      'Celsius (°C)',
    )
    expect(await within(accordion).findByDisplayValue('32')).toBe(
      within(accordion).getByLabelText('Fahrenheit (°F)'),
    )
  })

  it('adjusts and converts timezones with Standard Time as the default', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /time zones/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /time zones/i }))

    const sourceTime = within(accordion).getByLabelText('Source date and time')
    fireEvent.change(sourceTime, { target: { value: '2026-01-15T12:00' } })

    const daylightSwitches = within(accordion).getAllByRole('switch')
    expect(daylightSwitches).toHaveLength(2)
    expect(daylightSwitches[0]).not.toBeChecked()
    expect(daylightSwitches[1]).not.toBeChecked()

    await user.click(within(accordion).getByRole('combobox', { name: /source timezone/i }))
    await user.click(await screen.findByRole('option', { name: /Pacific Time/i }))
    expect(await within(accordion).findByDisplayValue('2026-01-15T20:00')).toBe(
      within(accordion).getByLabelText('Converted date and time'),
    )

    await user.click(within(accordion).getByRole('button', { name: /add one hour/i }))
    expect(sourceTime).toHaveValue('2026-01-15T13:00')
    expect(await within(accordion).findByDisplayValue('2026-01-15T21:00')).toBeInTheDocument()

    await user.click(
      within(accordion).getByRole('switch', { name: /source daylight saving time/i }),
    )
    expect(await within(accordion).findByDisplayValue('2026-01-15T20:00')).toBeInTheDocument()
  })

  it('calculates common weights and reveals advanced sizes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /weight/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /weight/i }))

    expect(within(accordion).getByLabelText('Ounces (oz)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Grams (g)')).toBeInTheDocument()
    expect(within(accordion).getByLabelText('Kilograms (kg)')).toBeInTheDocument()
    expect(within(accordion).queryByLabelText('US short tons (ton)')).not.toBeInTheDocument()

    await user.click(within(accordion).getByRole('switch', { name: /show advanced units/i }))
    expect(within(accordion).getByLabelText('US short tons (ton)')).toBeInTheDocument()
  })
})
