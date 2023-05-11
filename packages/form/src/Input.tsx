import { DefaultValueAs, InputMethod, ValueAs, inferValueAs } from "./InputMethod"
import { ValidationRule } from "./Validation"

export type Input<TValueAs extends ValueAs = any, TDefaultAs extends DefaultValueAs = any, TProps = any> =
  InputMethod<TValueAs, TDefaultAs, TProps>
  & ValidationRule
  & {
    componentProps: TProps,
    defaultValue: inferValueAs<TValueAs>
  }
export type inferInput<TInputMethod> =
  TInputMethod extends InputMethod<infer V, infer D, infer P>
  ? Input<V, D, P>
  : never

type inferDefaultValueOfInput<T> =
  T extends InputMethod<infer V, any, any> ? inferValueAs<V> : never
export type InputRecord = Record<string, Input>
export type inferDefaultValueOfInputRecord<T extends InputRecord> = {
  [K in keyof T]: inferDefaultValueOfInput<T[K]>
}

// type inferInputMethodWithComponentProps<T> = T extends InputMethod<infer V, infer D, infer P> ? P extends never ? InputMethodWithComponentProps<V, D> : InputMethodWithComponentProps<V, D, P> : never
