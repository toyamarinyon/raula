import { initForm } from './Form'
import type { Meta, StoryObj } from '@storybook/react'
import { string } from './Input'
import { useFields } from './useFields'

const { inputs, Form } = initForm().inputMethods({
  text: string().render(() => <input type="text" />),
  select: string().renderOption<{ selectOption: { label: string, value: string }[] }>().render(({ selectOption }) => <select>{selectOption.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}</select>)
}).labels({
  username: 'ユーザー名',
  occupations: '職業'
}).create()

const Component = (): JSX.Element => {
  const fields = useFields({
    username: inputs.text(),
    occupations: inputs.select({
      selectOption: [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
      ]
    })
  }, {
    username: 'testHello',
    occupations: 'b'
  })

  return (
    <Form fields={fields} />
  )
}

const meta: Meta<typeof Component> = {
  component: Component,
};
export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {}
