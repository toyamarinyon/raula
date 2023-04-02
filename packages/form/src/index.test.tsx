import { createForm } from './FormBuilder'
import * as Form from '@radix-ui/react-form'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'

const f = createForm()
const TestComponent = (): JSX.Element => {
  const fields = f.createFields({
    username: { scala: 'string' },
  })

  return <Form.Root>{f.renderFields(fields)}</Form.Root>
}

test('render', () => {
  render(<TestComponent />)
  expect(screen.getByRole('textbox', { name: 'username' })).toBeInTheDocument()
})
