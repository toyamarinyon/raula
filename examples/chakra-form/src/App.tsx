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
