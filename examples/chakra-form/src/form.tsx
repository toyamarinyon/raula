import {
  Button,
  Divider,
  Input,
  SimpleGrid,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { initForm, string } from '@raula/form'

export const { Form, inputs, useFields } = initForm()
  .labels({
    username: 'ユーザー名',
  })
  .inputMethods({
    text: string().render(() => <Input />),
    textarea: string().render(() => <Textarea />),
    password: string().render(() => <Input type="password" />),
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
  .submitButton(() => <Button type="submit">送信</Button>)
  .create()
