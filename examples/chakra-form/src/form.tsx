import { Input, SimpleGrid } from '@chakra-ui/react'
import { initForm, string } from '@raula/form'

export const { Form, inputs, useFields } = initForm()
  .labels({
    username: 'ユーザー名',
  })
  .inputMethods({
    text: string().render(() => <Input />),
  })
  .layout(({ labelComponent, controlComponent, messageComponent }) => (
    <SimpleGrid spacingY={8} columns={2}>
      {labelComponent}
      <SimpleGrid>
        {controlComponent}
        {messageComponent}
      </SimpleGrid>
    </SimpleGrid>
  ))
  .create()
