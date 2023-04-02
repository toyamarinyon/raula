import * as Form from '@radix-ui/react-form'

type FieldScalar = 'string' | 'number' | 'boolean'
interface Field<Scalar extends FieldScalar = FieldScalar> {
  scala: Scalar
}

export class FormBuilder<Scalar extends FieldScalar = FieldScalar> {
  createFields<T extends Record<string, Field<Scalar>>>(fields: T) {
    return fields
  }
  private defaultScalarInputRender: Record<FieldScalar, () => JSX.Element> = {
    string: () => <input type="text" />,
    number: () => <input type="number" />,
    boolean: () => <input type="checkbox" />,
  }
  private scalarInputRender: Record<FieldScalar, () => JSX.Element> | undefined

  renderFields(fields: Record<string, Field<Scalar>>) {
    return (
      <>
        {Object.keys(fields).map((field, i) => (
          <Form.FormField key={i} name={field}>
            <Form.Label>{field}</Form.Label> {/** i18n */}
            {this.renderField(fields[field])}
          </Form.FormField>
        ))}
      </>
    )
  }
  renderField(field: Field<Scalar>) {
    return (
      <Form.Control asChild>
        {this.scalarInputRender?.[field.scala]() ??
          this.defaultScalarInputRender[field.scala]()}
      </Form.Control>
    )
  }
}
export function createForm() {
  return new FormBuilder()
}
