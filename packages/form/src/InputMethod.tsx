import { ReactNode } from 'react'

export type ValueAs = 'string' | 'number' | 'boolean'
export type inferValueAs<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never
export type DefaultValueAs = 'value' | 'check'

type InputComponentArgs<TValueAs extends ValueAs, TProps> = {
  defaultValue: TValueAs
} & TProps
type InputComponent<TValueAs extends ValueAs, TProps> = (
  args: InputComponentArgs<TValueAs, TProps>
) => ReactNode
export type InputMethod<
  TValueAs extends ValueAs = any,
  TDefaultValueAs extends DefaultValueAs = any,
  TProps = any
> = {
  valueAs: TValueAs
  defaultValueAs: TDefaultValueAs
  component: InputComponent<TValueAs, TProps>
}
export type inferInputMethod<T> = T extends InputMethod<
  infer TValueAs,
  infer TDefaultValueAs,
  infer TProps
>
  ? InputMethod<TValueAs, TDefaultValueAs, TProps>
  : InputMethod

interface InputMethodBuilder<
  TValueAs extends ValueAs,
  TDefaultValueAs extends DefaultValueAs,
  TProps = unknown
> {
  renderOption: <NewProps>() => InputMethodBuilder<
    TValueAs,
    TDefaultValueAs,
    NewProps
  >
  render: (
    component: InputComponent<TValueAs, TProps>
  ) => InputMethod<TValueAs, TDefaultValueAs, TProps>
}
function inputMethodBuilder<
  TValueAs extends ValueAs,
  TDefaultValueAs extends DefaultValueAs,
  TProps = unknown
>({
  valueAs,
  defaultValueAs,
}: {
  valueAs: TValueAs
  defaultValueAs: TDefaultValueAs
}): InputMethodBuilder<TValueAs, TDefaultValueAs, TProps> {
  return {
    renderOption: <NewProps,>() =>
      inputMethodBuilder<TValueAs, TDefaultValueAs, NewProps>({
        valueAs,
        defaultValueAs,
      }),
    render: (component: InputComponent<TValueAs, TProps>) =>
      inputMethod(valueAs, defaultValueAs, component),
  }
}
function inputMethod<
  TValueAs extends ValueAs,
  TDefaultValueAs extends DefaultValueAs,
  TProps = unknown
>(
  valueAs: TValueAs,
  defaultValueAs: TDefaultValueAs,
  component: InputComponent<TValueAs, TProps>
): InputMethod<TValueAs, TDefaultValueAs, TProps> {
  return {
    valueAs,
    defaultValueAs,
    component,
  }
}
export function string() {
  return inputMethodBuilder({
    valueAs: 'string',
    defaultValueAs: 'value',
  })
}

export function number() {
  return inputMethodBuilder({
    valueAs: 'number',
    defaultValueAs: 'value',
  })
}

export function boolean() {
  return inputMethodBuilder({
    valueAs: 'boolean',
    defaultValueAs: 'check',
  })
}
