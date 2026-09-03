/**
 * Matches `fw-form` `controlProps.selectProps` — returns the current field value
 * for a cascade level (by field name).
 */
export type CoNestedSelectPropsFn = (
  fieldName: string,
  inputType?: string
) => { value?: string | string[] };

/**
 * Minimal `fw-select` surface used to clear selection when options change.
 * Avoids depending on crayons-core's generated `HTMLFwSelectElement` type.
 */
export type CoNestedFwSelectRef = {
  setSelectedValues: (value: string | string[]) => void | Promise<void>;
};
