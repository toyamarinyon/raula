import { inferInput, InputRecord } from './Input'
import { OptionalInputConfig, buildInput } from './InputBuilder'
import {
  DefaultValueAs,
  InputMethod,
  ValueAs,
  inferValueAs,
} from './InputMethod'
import * as RadixForm from '@radix-ui/react-form'

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

export function initForm<TInputMethodRecord extends InputMethodRecord>(
  inputs?: TInputMethodRecord,
  labels?: Record<string, string>
) {
  return {
    inputMethods: <TInputMethodRecord extends InputMethodRecord>(
      inputs: TInputMethodRecord
    ) => initForm(inputs),
    labels: (labels: Record<string, string>) => initForm(inputs, labels),
    create: () => {
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
        }: {
          fields: TRecord
        }) => <Form fields={fields} labels={labels} />,
      }
    },
  }
}

interface FormProps<TRecord extends InputRecord> {
  fields: TRecord
  labels?: Record<string, string>
}
export function Form<TRecord extends InputRecord>({
  fields,
  labels,
}: FormProps<TRecord>) {
  return (
    <RadixForm.Root>
      {Object.entries(fields).map(([name, field]) => {
        return (
          <RadixForm.Field key={name} name={name}>
            <RadixForm.Label>{labels?.[name] ?? name}</RadixForm.Label>
            {isInputMethodDefaultValueAs(field, 'check') && (
              <RadixForm.Control
                asChild
                defaultChecked={Boolean(field.defaultValue)}
              >
                {field.component(field.componentProps)}
              </RadixForm.Control>
            )}
            {isInputMethodDefaultValueAs(field, 'value') && (
              <RadixForm.Control
                asChild
                defaultValue={String(field.defaultValue)}
              >
                {field.component(field.componentProps)}
              </RadixForm.Control>
            )}
            <RadixForm.Message />
          </RadixForm.Field>
        )
      })}
    </RadixForm.Root>
  )
}
