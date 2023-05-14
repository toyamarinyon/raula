import { initForm } from './Form'
import { boolean, string } from './InputMethod'
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

const { inputs, Form, useFields } = initForm()
  .inputMethods({
    text: string().render(() => <input type="text" />),
    customtext: string().render(({ defaultValue, ...props }) => (
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
  .formLayout(({ fieldComponent, submitButtonComponent }) => (
    <div>
      {fieldComponent}
      <hr />
      {submitButtonComponent}
    </div>
  ))
  .fieldLayout(({ labelComponent, controlComponent, messageComponent }) => (
    <div>
      <div>
        {labelComponent}
        {messageComponent}
      </div>
      {controlComponent}
    </div>
  ))
  .create()

const Component = (): JSX.Element => {
  const fields = useFields(
    {
      username: inputs.text({
        maxLength: 100,
      }),
      username2: inputs.customtext({
        maxLength: 100,
        pattern: '[\\sァ-ヿー–—―ｰ゠＝]+',
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
      username2: '',
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
