import { ReactNode } from "react"
import * as Form from '@radix-ui/react-form'


type FieldComponentType = {
  render: () => ReactNode
  valueAs: 'string' | 'number' | 'boolean'
}
type ValueFieldComponentType = FieldComponentType & {
  showAs: 'value'
  valueAs: 'string' | 'number'
}
type CheckFieldComponentType = FieldComponentType & {
  showAs: 'check'
  valueAs: 'boolean'
}
type FieldComponentTypes = Record<string, ValueFieldComponentType | CheckFieldComponentType>

type inferValueAs<T> = T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never


interface RenderField<TFieldComponentTypes extends FieldComponentTypes> {
  type: keyof TFieldComponentTypes
}
type RenderFields<TFieldComponentTypes extends FieldComponentTypes> = Record<string, RenderField<TFieldComponentTypes>>
type inferRenderFieldValues<TFieldComponentTypes extends FieldComponentTypes, TRenderFields extends RenderFields<TFieldComponentTypes>> = {
  [K in keyof TRenderFields]: inferValueAs<TFieldComponentTypes[TRenderFields[K]['type']]['valueAs']>
}


export function initForm<TFieldComponentTypes extends FieldComponentTypes>(fieldTypes?: TFieldComponentTypes, labels?: Record<string, string>) {
  return {
    declareFieldComponents: <TFieldComponentTypes extends FieldComponentTypes>(newFields: TFieldComponentTypes) => initForm<TFieldComponentTypes>(newFields),
    declareLabels: (labels: Record<string, string>) => initForm<TFieldComponentTypes>(fieldTypes, labels),
    create: () => {
      if (fieldTypes == null) {
        throw new Error('fieldTypes is not declared. Please declare fieldTypes by calling declareFields method.')
      }
      return initRenderer(fieldTypes, labels ?? {})
    }
  }
}


interface RenderFieldsOption<TFieldComponentTypes extends FieldComponentTypes, TRenderFields extends RenderFields<TFieldComponentTypes>> {
  defaultValues: inferRenderFieldValues<TFieldComponentTypes, TRenderFields>
}
interface RenderProps<TFieldComponentTypes extends FieldComponentTypes, TRenderFields extends RenderFields<TFieldComponentTypes>> {
  fields: TRenderFields,
  defaultValues: inferRenderFieldValues<TFieldComponentTypes, TRenderFields>
  onSubmit: (data: inferRenderFieldValues<TFieldComponentTypes, TRenderFields>) => void
}
function initRenderer<TFieldComponentTypes extends FieldComponentTypes>(fieldComponentTypes: TFieldComponentTypes, labels: Record<string, string>) {
  return {
    render: function <TRenderFields extends RenderFields<TFieldComponentTypes>>({ fields, defaultValues, onSubmit }: RenderProps<TFieldComponentTypes, TRenderFields>) {
      return (
        <Form.Root
          onSubmit={(e) => {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.currentTarget))
            const values = Object.fromEntries(Object.keys(fields).map((field) => {
              const fieldComponentType = fieldComponentTypes[fields[field].type]
              if (fieldComponentType.valueAs === 'boolean') {
                return [field, data[field] === 'on']
              }
              return [field, data[field]]
            }))
            onSubmit(values as inferRenderFieldValues<TFieldComponentTypes, TRenderFields>)
          }}

        >
          {fieldsRender(fieldComponentTypes, fields, labels, { defaultValues })}
          <Form.Submit asChild>
            <button>Submit</button>
          </Form.Submit>
        </Form.Root>
      )
    },
    fields: function <TRenderFields extends RenderFields<TFieldComponentTypes>>(renderFields: TRenderFields) {
      return renderFields
    }
  }
}

function fieldsRender<TFieldComponentTypes extends FieldComponentTypes, TRenderFields extends RenderFields<TFieldComponentTypes>>(fieldComponentTypes: TFieldComponentTypes, renderFields: TRenderFields, labels: Record<string, string>, option: RenderFieldsOption<TFieldComponentTypes, TRenderFields>) {
  return Object.keys(renderFields).map((field) => {
    const fieldComponentType = fieldComponentTypes[renderFields[field].type]
    return (
      <Form.FormField key={field} name={field}>
        <Form.Label>{labels[field] ?? field}</Form.Label>
        {fieldComponentType.showAs === 'value' && (
          <Form.Control asChild defaultValue={option.defaultValues[field] as inferValueAs<typeof fieldComponentType.valueAs>}>
            {fieldComponentTypes[renderFields[field].type].render()}
          </Form.Control>
        )}
        {fieldComponentType.showAs === 'check' && (
          <Form.Control asChild defaultChecked={option.defaultValues[field] as inferValueAs<typeof fieldComponentType.valueAs>}>
            {fieldComponentTypes[renderFields[field].type].render()}
          </Form.Control>
        )}
      </Form.FormField>

    )
  })
}
