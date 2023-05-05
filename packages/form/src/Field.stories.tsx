import { initForm } from './Field'
// import * as Form from '@radix-ui/react-form'
import type { Meta, StoryObj } from '@storybook/react'

const form = initForm().declareFieldComponents({
  text: {
    showAs: 'value',
    render: () => <input type="text" />,
    valueAs: 'string'
  },
  checkbox: {
    showAs: 'check',
    render: () => <input type="checkbox" />,
    valueAs: 'boolean'
  }
}).declareLabels({
  username: 'ユーザー名',
  agreed: '同意する'
})
  .create()

const fields = form.fields({
  username: {
    type: 'text'
  },
  agreed: {
    type: 'checkbox'
  }
})

const Form = form.render

const Component = (): JSX.Element => {
  return (
    <Form fields={fields} defaultValues={{
      username: 'test',
      agreed: false
    }}
      onSubmit={(values) => {
        console.log(values)
      }}
    />
  )
}

const meta: Meta<typeof Component> = {
  title: 'Fields',
  component: Component,
};
export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {}
