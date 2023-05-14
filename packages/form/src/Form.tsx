import { inferInput, InputRecord } from './Input'
import { OptionalInputConfig, buildInput } from './InputBuilder'
import {
  DefaultValueAs,
  InputMethod,
  ValueAs,
  inferValueAs,
} from './InputMethod'
import { useFields } from './useFields'
import * as RadixForm from '@radix-ui/react-form'
import { ReactNode } from 'react'

export type InputMethodRecord = Record<string, InputMethod>
type InputMethodWithComponentProps<
  TValueAs extends ValueAs = any,
  TDefaultAs extends DefaultValueAs = any,
  TProps = any
> = InputMethod<TValueAs, TDefaultAs, TProps> & {
  componentProps: TProps
  defaultValue: inferValueAs<TValueAs>
}
export type InputMethodWithComponentPropsRecord = Record<
  string,
  InputMethodWithComponentProps
>
function isInputMethodDefaultValueAs<TDefaultValueAs extends DefaultValueAs>(
  inputMethod: InputMethodWithComponentProps<any, any>,
  defaultValueAs: TDefaultValueAs
): inputMethod is InputMethodWithComponentProps<any, TDefaultValueAs> {
  return inputMethod.defaultValueAs === defaultValueAs
}
type inferInputMethodValueAs<T> = T extends InputMethod<infer V, any, any>
  ? inferValueAs<V>
  : never
export type inferInputMethodValueAsRecord<T extends InputMethodRecord> = {
  [K in keyof T]: inferInputMethodValueAs<T[K]>
}

function createForm<TInputMethodRecord extends InputMethodRecord>(
  inputs?: TInputMethodRecord,
  labels?: Record<string, string>,
  layoutComponent?: LayoutComponent
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
    Form: <TRecord extends InputMethodWithComponentPropsRecord>({
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
        layoutComponent={layoutComponent}
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
  layout: (props: LayoutComponent) => FormBuilder<TInputMethodRecord>
}

export function initForm<TInputMethodRecord extends InputMethodRecord>(
  inputs?: TInputMethodRecord,
  labels?: Record<string, string>,
  layoutComponent?: LayoutComponent
): FormBuilder<TInputMethodRecord> {
  return {
    inputMethods: <TInputMethodRecord extends InputMethodRecord>(
      inputs: TInputMethodRecord
    ) => initForm(inputs),
    labels: (labels: Record<string, string>) =>
      initForm(inputs, labels, layoutComponent),
    create: () => createForm(inputs, labels, layoutComponent),
    layout: (newLayoutComponent) =>
      initForm(inputs, labels, newLayoutComponent),
  }
}

interface FormProps<TRecord extends InputRecord> {
  fields: TRecord
  labels?: Record<string, string>
  onSubmit?: (data: inferInputMethodValueAsRecord<TRecord>) => void
  layoutComponent?: LayoutComponent
}

interface FieldProps {
  labelComponent: ReactNode
  controlComponent: ReactNode
  messageComponent: ReactNode
}
type LayoutComponent = (props: FieldProps) => JSX.Element

const DefaultLayoutComponent: LayoutComponent = ({
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
  layoutComponent: LayoutComponent = DefaultLayoutComponent,
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
      {Object.entries(fields).map(([name, field]) => {
        return (
          <RadixForm.Field key={name} name={name}>
            <LayoutComponent
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
      <RadixForm.Submit>Submit</RadixForm.Submit>
    </RadixForm.Root>
  )
}
