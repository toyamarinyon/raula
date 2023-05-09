import { ReactNode } from "react"

export type ValueAs = 'string' | 'number' | 'boolean'
export type DefaultValueAs = 'value' | 'check'
type Component<Props> = (args: Props) => ReactNode
export type InputMethod<TValueAs extends ValueAs = any, TDefaultValueAs extends DefaultValueAs = any, TProps = never> = {
  valueAs: TValueAs
  defaultValueAs: TDefaultValueAs
  component: Component<TProps>
}

function inputMethodBuilder<TValueAs extends ValueAs, TDefaultValueAs extends DefaultValueAs, TProps = any>({ valueAs, defaultValueAs }: { valueAs: TValueAs, defaultValueAs: TDefaultValueAs }) {
  return {
    renderOption: <NewProps,>() => inputMethodBuilder<TValueAs, TDefaultValueAs, NewProps>({ valueAs, defaultValueAs }),
    render: (component: Component<TProps>) => inputMethod(valueAs, defaultValueAs, component)
  }
}
function inputMethod<TValueAs extends ValueAs, TDefaultValueAs extends DefaultValueAs, TProps>(valueAs: TValueAs, defaultValueAs: TDefaultValueAs, component: Component<TProps>): InputMethod<TValueAs, TDefaultValueAs, TProps> {
  return {
    valueAs,
    defaultValueAs,
    component
  }
}
export function string() {
  return inputMethodBuilder({
    valueAs: 'string',
    defaultValueAs: 'value'
  })
}

export function number() {
  return inputMethodBuilder({
    valueAs: 'number',
    defaultValueAs: 'value'
  })
}

export function boolean() {
  return inputMethodBuilder({
    valueAs: 'boolean',
    defaultValueAs: 'check'
  })
}
