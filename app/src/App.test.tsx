import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('converter MVP', () => {
  it('reveals advanced units and calculates a debounced data result', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /data size/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /data size/i }))

    await user.click(within(accordion).getAllByRole('combobox')[1])
    expect(screen.queryByRole('option', { name: /terabytes/i })).not.toBeInTheDocument()
    await user.keyboard('{Escape}')

    await user.click(within(accordion).getByRole('switch', { name: /show advanced units/i }))
    await user.click(within(accordion).getAllByRole('combobox')[1])
    expect(await screen.findByRole('option', { name: /terabytes \(tb\)/i })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    await user.clear(within(accordion).getByLabelText('Value'))
    await user.type(within(accordion).getByLabelText('Value'), '1000')
    expect(await within(accordion).findByDisplayValue('1')).toHaveAttribute('readonly')
  })

  it('swaps units and carries the current result into the input', async () => {
    const user = userEvent.setup()
    render(<App />)

    const accordion = screen
      .getByRole('button', { name: /temperature/i })
      .closest<HTMLElement>('.MuiAccordion-root')!
    await user.click(within(accordion).getByRole('button', { name: /temperature/i }))
    await user.clear(within(accordion).getByLabelText('Value'))
    await user.type(within(accordion).getByLabelText('Value'), '32')
    expect(await within(accordion).findByDisplayValue('0')).toBeInTheDocument()

    await user.click(within(accordion).getByRole('button', { name: /swap input and output/i }))

    expect(within(accordion).getByLabelText('Value')).toHaveValue(0)
    expect(await within(accordion).findByDisplayValue('32')).toHaveAttribute('readonly')
  })
})
