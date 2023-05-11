import { useMemo } from "react";
import { InputRecord, inferDefaultValueOfInputRecord } from "./Input";

export function useFields<TRecord extends InputRecord>(fields: TRecord, defaultValues: inferDefaultValueOfInputRecord<TRecord>) {
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
