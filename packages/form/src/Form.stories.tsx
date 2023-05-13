import { initForm } from './Form'
import { boolean, string } from './InputMethod'
import { useFields } from './useFields'
import type { Meta, StoryObj } from '@storybook/react'
import { forwardRef } from 'react'

const CustomInput = forwardRef(
  (
    {
      defaultValue,
      ...props
    }: {
      defaultValue: string
    },
    ref: React.Ref<HTMLInputElement>
  ) => (
    <>
      <input type="text" {...props} defaultValue={defaultValue} ref={ref} />
      <p>{defaultValue}</p>
    </>
  )
)

const { inputs, Form } = initForm()
  .inputMethods({
    text: string().render(({ defaultValue, ...props }) => (
      <CustomInput defaultValue={defaultValue} {...props} />
    )),
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
    checkbox: boolean().render(() => <input type="checkbox" />),
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
      isAdult: inputs.checkbox(),
    },
    {
      username: 'testHello222',
      occupations: 'b',
      isAdult: false,
    }
  )

  return (
    <Form
      fields={fields}
      onSubmit={(data) => {
        console.log(data)
      }}
    />
  )
}

const meta: Meta<typeof Component> = {
  component: Component,
}
export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {}
