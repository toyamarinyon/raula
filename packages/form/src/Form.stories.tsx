import { initForm } from './Form'
import { string } from './InputMethod'
import { useFields } from './useFields'
import type { Meta, StoryObj } from '@storybook/react'

const { inputs, Form } = initForm()
  .inputMethods({
    text: string().render(() => <input type="text" />),
    select: string()
      .renderOption<{ selectOption: { label: string; value: string }[] }>()
      .render(({ selectOption }) => (
        <select>
          {selectOption.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      )),
  })
  .labels({
    username: 'ユーザー名',
    occupations: '職業',
  })
  .create()

const Component = (): JSX.Element => {
  const fields = useFields(
    {
      username: inputs.text({
        maxLength: 100,
        optional: false,
      }),
      occupations: inputs.select({
        componentProps: {
          selectOption: [
            { label: 'a', value: 'a' },
            { label: 'hello', value: 'b' },
          ],
        },
      }),
    },
    {
      username: 'testHello222',
      occupations: 'b',
    }
  )

  return <Form fields={fields} />
}

const meta: Meta<typeof Component> = {
  component: Component,
}
export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {}
