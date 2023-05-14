import { inferInput, InputRecord } from './Input'
import { OptionalInputConfig, buildInput } from './InputBuilder'
import {
  AnyValueAs,
  DefaultValueAs,
  InputMethod,
  inferValueAs,
} from './InputMethod'
import { useFields } from './useFields'
import * as RadixForm from '@radix-ui/react-form'
import { ReactNode } from 'react'

export type InputMethodRecord = Record<string, InputMethod>
function isInputMethodDefaultValueAs<TDefaultValueAs extends DefaultValueAs>(
  inputMethod: InputMethod,
  defaultValueAs: TDefaultValueAs
): inputMethod is InputMethod<AnyValueAs, TDefaultValueAs> {
  return inputMethod.defaultValueAs === defaultValueAs
}
type inferInputMethodValueAs<T> = T extends InputMethod<infer V>
  ? inferValueAs<V>
  : never
export type inferInputMethodValueAsRecord<T extends InputMethodRecord> = {
  [K in keyof T]: inferInputMethodValueAs<T[K]>
}

function createForm<TInputMethodRecord extends InputMethodRecord>(
  inputs?: TInputMethodRecord,
  labels?: Record<string, string>,
  fieldLayoutComponent?: FieldLayoutComponent,
  formLayoutComponent?: FormLayoutComponent
) {
  if (inputs == null) {
    throw new Error('No inputs registered')
  }
  return {
    inputs: new Proxy(
      {},
      {
        get: (_, props) => {
          return function (args: any) {
            return buildInput(inputs, props as string, args)
          }
        },
      }
    ) as {
      [K in keyof TInputMethodRecord]: (
        ...config: OptionalInputConfig<TInputMethodRecord[K]>
      ) => inferInput<TInputMethodRecord[K]>
    },
    Form: <TRecord extends InputRecord>({
      fields,
      onSubmit,
    }: {
      fields: TRecord
      onSubmit: (data: inferInputMethodValueAsRecord<TRecord>) => void
    }) => (
      <Form
        fields={fields}
        labels={labels}
        onSubmit={onSubmit}
        fieldLayoutComponent={fieldLayoutComponent}
        formLayoutComponent={formLayoutComponent}
      />
    ),
    useFields,
  }
}

interface FormBuilder<TInputMethodRecord extends InputMethodRecord> {
  inputMethods: <TInputMethodRecord extends InputMethodRecord>(
    inputs: TInputMethodRecord
  ) => FormBuilder<TInputMethodRecord>
  labels: (labels: Record<string, string>) => FormBuilder<TInputMethodRecord>
  create: () => ReturnType<typeof createForm<TInputMethodRecord>>
  fieldLayout: (props: FieldLayoutComponent) => FormBuilder<TInputMethodRecord>
  formLayout: (props: FormLayoutComponent) => FormBuilder<TInputMethodRecord>
}

export function initForm<TInputMethodRecord extends InputMethodRecord>(
  inputs?: TInputMethodRecord,
  labels?: Record<string, string>,
  fieldLayoutComponent?: FieldLayoutComponent,
  formLayoutComponent?: FormLayoutComponent
): FormBuilder<TInputMethodRecord> {
  return {
    inputMethods: <TInputMethodRecord extends InputMethodRecord>(
      inputs: TInputMethodRecord
    ) => initForm(inputs),
    labels: (labels: Record<string, string>) =>
      initForm(inputs, labels, fieldLayoutComponent, formLayoutComponent),
    create: () =>
      createForm(inputs, labels, fieldLayoutComponent, formLayoutComponent),
    fieldLayout: (newLayoutComponent) =>
      initForm(inputs, labels, newLayoutComponent, formLayoutComponent),
    formLayout: (newFormLayoutComponent) =>
      initForm(inputs, labels, fieldLayoutComponent, newFormLayoutComponent),
  }
}

interface FormProps<TRecord extends InputRecord> {
  fields: TRecord
  labels?: Record<string, string>
  onSubmit?: (data: inferInputMethodValueAsRecord<TRecord>) => void
  fieldLayoutComponent?: FieldLayoutComponent
  formLayoutComponent?: FormLayoutComponent
}

interface FormLayoutComponentProps {
  fieldComponent: ReactNode
  submitButtonComponent: ReactNode
}
type FormLayoutComponent = (props: FormLayoutComponentProps) => JSX.Element

const DefaultFormLayoutComponent: FormLayoutComponent = ({
  fieldComponent,
  submitButtonComponent,
}) => {
  return (
    <>
      {fieldComponent}
      {submitButtonComponent}
    </>
  )
}

interface FieldLayoutComponentProps {
  labelComponent: ReactNode
  controlComponent: ReactNode
  messageComponent: ReactNode
}
type FieldLayoutComponent = (props: FieldLayoutComponentProps) => JSX.Element

const DefaultFieldLayoutComponent: FieldLayoutComponent = ({
  labelComponent,
  controlComponent,
  messageComponent,
}) => {
  return (
    <section>
      <div>{labelComponent}</div>
      <div>{controlComponent}</div>
      <div>{messageComponent}</div>
    </section>
  )
}

export function Form<TRecord extends InputRecord>({
  fields,
  labels,
  onSubmit,
  formLayoutComponent: FormLayoutComponent = DefaultFormLayoutComponent,
  fieldLayoutComponent: FieldLayoutComponent = DefaultFieldLayoutComponent,
}: FormProps<TRecord>) {
  return (
    <RadixForm.Root
      onSubmit={(event) => {
        event.preventDefault()
        const rawData = Object.fromEntries(new FormData(event.currentTarget))
        const data = Object.fromEntries(
          Object.keys(fields).map((key) => {
            const field = fields[key]
            const value = isInputMethodDefaultValueAs(field, 'check')
              ? Boolean(rawData[key])
              : rawData[key]
            return [key, value]
          })
        )
        onSubmit?.(data as inferInputMethodValueAsRecord<TRecord>)
      }}
    >
      <FormLayoutComponent
        fieldComponent={Object.entries(fields).map(([name, field]) => {
          return (
            <RadixForm.Field key={name} name={name}>
              <FieldLayoutComponent
                labelComponent={
                  <RadixForm.Label>{labels?.[name] ?? name}</RadixForm.Label>
                }
                controlComponent={
                  <>
                    {isInputMethodDefaultValueAs(field, 'check') && (
                      <RadixForm.Control
                        asChild
                        defaultChecked={Boolean(field.defaultValue)}
                        required={!field.optional}
                      >
                        {field.component({
                          ...field.componentProps,
                          defaultValue: field.defaultValue,
                        })}
                      </RadixForm.Control>
                    )}
                    {isInputMethodDefaultValueAs(field, 'value') && (
                      <RadixForm.Control
                        asChild
                        defaultValue={String(field.defaultValue)}
                        required={!field.optional}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        pattern={field.pattern}
                      >
                        {field.component({
                          ...field.componentProps,
                          defaultValue: field.defaultValue,
                        })}
                      </RadixForm.Control>
                    )}
                  </>
                }
                messageComponent={
                  <>
                    <RadixForm.Message match={'valueMissing'}>
                      Required
                    </RadixForm.Message>
                    <RadixForm.Message match={'tooShort'}>
                      Too short
                    </RadixForm.Message>
                    <RadixForm.Message match={'tooLong'}>
                      Too long
                    </RadixForm.Message>
                    <RadixForm.Message match={'patternMismatch'}>
                      Pattern mismatch
                    </RadixForm.Message>
                  </>
                }
              />
            </RadixForm.Field>
          )
        })}
        submitButtonComponent={<RadixForm.Submit>Submit</RadixForm.Submit>}
      />
    </RadixForm.Root>
  )
}
