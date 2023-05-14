import { Divider, Input, SimpleGrid, VStack } from '@chakra-ui/react'
import { initForm, string } from '@raula/form'

export const { Form, inputs, useFields } = initForm()
  .labels({
    username: 'ユーザー名',
  })
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
  .create()
