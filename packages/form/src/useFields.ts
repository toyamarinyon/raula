import { useMemo } from "react";
import { InputMethodWithComponentPropsRecord, inferInputMethodValueAsRecord } from "./Form";

export function useFields<TRecord extends InputMethodWithComponentPropsRecord>(fields: TRecord, defaultValues: inferInputMethodValueAsRecord<TRecord>) {
  return useMemo(() => {
    const newFields = Object.keys(fields).map((key) => {
      const field = fields[key];
      return [key, {
        ...field,
        defaultValue: defaultValues[key]
      }]
    })
    return Object.fromEntries(newFields) as TRecord;
  }, [fields, defaultValues])
}
