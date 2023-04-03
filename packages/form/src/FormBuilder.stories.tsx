import { createForm } from '.'
import * as Form from '@radix-ui/react-form'
import type { Meta, StoryObj } from '@storybook/react'

const f = createForm()

const TestForm = ({ onSubmit }: { onSubmit: () => void }): JSX.Element => {
  const fields = f.createFields({
    username: { scala: 'string' },
  })

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {f.renderFields(fields)}
      <Form.Submit asChild>
        <button>Submit</button>
      </Form.Submit>
    </Form.Root>
  )
}

const meta: Meta<typeof TestForm> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'TestForm',
  component: TestForm,
}

export default meta
type Story = StoryObj<typeof TestForm>

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  argTypes: {
    onSubmit: {
      action: 'onSubmit',
    },
  },
  args: {
    // primary: true,
  },
}
