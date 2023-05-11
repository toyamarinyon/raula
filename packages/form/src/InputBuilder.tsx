import { InputMethodRecord } from "./Form";
import { inferInput } from "./Input";
import { InputMethod } from "./InputMethod";
import { ValidationRule } from "./Validation";

type InputConfig<TProps> = TProps extends undefined
  ? ValidationRule | undefined
  : (ValidationRule | undefined) & {
    componentProps: TProps;
  }

export type OptionalInputConfig<TInputMethod> = TInputMethod extends InputMethod<any, any, infer Props>
  ? Props extends never
  ? [InputConfig<any>] | []
  : [InputConfig<Props>]
  : never


export type inferInputConfig<TInputMethod> =
  TInputMethod extends InputMethod<any, any, infer Props>
  ? InputConfig<Props>
  : InputConfig<undefined>

function hasComponentProps(inputConfig: any): inputConfig is InputConfig<Record<string, any>> {
  return inputConfig.componentProps !== undefined
}


export function buildInput<TInputMethodRecord extends InputMethodRecord, Key extends keyof TInputMethodRecord>(
  inputMethods: TInputMethodRecord,
  inputMethodKey: Key,
  config: inferInputConfig<TInputMethodRecord[Key]>
): inferInput<TInputMethodRecord[Key]> {
  const inputMethod = inputMethods[inputMethodKey]

  if (hasComponentProps(config)) {
    return {
      valueAs: inputMethod.valueAs,
      defaultValueAs: inputMethod.defaultValueAs,
      component: inputMethod.component,
      componentProps: config.componentProps,
      optional: config.optional,
      maxLength: config.maxLength,
      minLength: config.minLength,
      pattern: config.pattern,
    } as inferInput<TInputMethodRecord[Key]>;
  }
  return {
    valueAs: inputMethod.valueAs,
    defaultValueAs: inputMethod.defaultValueAs,
    component: inputMethod.component,
    optional: config?.optional,
    maxLength: config?.maxLength,
    minLength: config?.minLength,
    pattern: config?.pattern,
    defaultValue: '',
  } as inferInput<TInputMethodRecord[Key]>;
}
