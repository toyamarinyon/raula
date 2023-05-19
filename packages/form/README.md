# @raula/form

**A JavaScript library allows you to write the form more declarative.**

```tsx
// form.ts
import { Button, Divider, Input, SimpleGrid, VStack } from '@chakra-ui/react'
import { initForm, string } from '@raula/form'

export const { Form, inputs, useFields } = initForm()
  .inputMethods({
    text: string().render(() => <Input />),
  })
  .formLayout(({ fieldComponent, submitButtonComponent }) => (
    <VStack>
      <VStack divider={<Divider />}>{fieldComponent}</VStack>
      {submitButtonComponent}
    </VStack>
  ))
  .fieldLayout(({ labelComponent, controlComponent, messageComponent }) => (
    <SimpleGrid spacingY={8} columns={2}>
      {labelComponent}
      <SimpleGrid>
        {controlComponent}
        {messageComponent}
      </SimpleGrid>
    </SimpleGrid>
  ))
  .submitButton(() => <Button type="submit">Submit</Button>)
  .create()

// App.tsx
import { Form, inputs, useFields } from './form'
import { Container } from '@chakra-ui/react'

function App() {
  const fields = useFields(
    {
      username: inputs.text(),
    },
    {
      username: '',
    }
  )
  return (
    <Container>
      <Form
        fields={fields}
        onSubmit={(data) => {
          console.log(data)
        }}
      />
    </Container>
  )
}

export default App

```
