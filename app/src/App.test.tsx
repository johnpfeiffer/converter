import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('converter app', () => {
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
