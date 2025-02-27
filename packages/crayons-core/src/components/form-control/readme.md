# Form Control (fw-form-control)

`Form Control` component used with `fw-form` component. Please refer [fw-form](../form/#demo-static-form) for usage 


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                               | Type                                                                                                                                                                                                                                           | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `choices`      | `choices`       |                                                                                                                                                           | `any`                                                                                                                                                                                                                                          | `[]`        |
| `controlProps` | `control-props` | Contains values for crayons components. Useful when rendering crayons components implicitly via form-control. Not required when using controls via slots. | `any`                                                                                                                                                                                                                                          | `undefined` |
| `disabled`     | `disabled`      | Disable the field from being editable                                                                                                                     | `boolean`                                                                                                                                                                                                                                      | `false`     |
| `error`        | `error`         |                                                                                                                                                           | `string`                                                                                                                                                                                                                                       | `''`        |
| `fieldProps`   | `field-props`   | Additional props can be passed here for crayons components. Useful when rendering crayons components implicitly via form-control.                         | `any`                                                                                                                                                                                                                                          | `{}`        |
| `hidden`       | `hidden`        |                                                                                                                                                           | `boolean`                                                                                                                                                                                                                                      | `false`     |
| `hint`         | `hint`          |                                                                                                                                                           | `string`                                                                                                                                                                                                                                       | `''`        |
| `label`        | `label`         |                                                                                                                                                           | `any`                                                                                                                                                                                                                                          | `undefined` |
| `name`         | `name`          |                                                                                                                                                           | `any`                                                                                                                                                                                                                                          | `undefined` |
| `placeholder`  | `placeholder`   |                                                                                                                                                           | `string`                                                                                                                                                                                                                                       | `''`        |
| `required`     | `required`      |                                                                                                                                                           | `boolean`                                                                                                                                                                                                                                      | `false`     |
| `shouldRender` | `should-render` | Prop to determine whether to render the form-control or not. Default to true.                                                                             | `boolean`                                                                                                                                                                                                                                      | `true`      |
| `touched`      | `touched`       |                                                                                                                                                           | `boolean`                                                                                                                                                                                                                                      | `false`     |
| `type`         | `type`          |                                                                                                                                                           | `"AUTO_COMPLETE" \| "CHECKBOX" \| "DATE" \| "DATE_TIME" \| "DECIMAL" \| "DEPENDENT_FIELD" \| "DROPDOWN" \| "EMAIL" \| "FILES" \| "MULTI_SELECT" \| "NUMBER" \| "PARAGRAPH" \| "RADIO" \| "RELATIONSHIP" \| "TEL" \| "TEXT" \| "TIME" \| "URL"` | `'TEXT'`    |
| `value`        | `value`         | Value of the slotted custom field on fw-form-control                                                                                                      | `any`                                                                                                                                                                                                                                          | `undefined` |


## Methods

### `setFocus() => Promise<void>`

Set Focus on the child

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [fw-form](../form)

### Depends on

- [fw-input](../input)
- [fw-textarea](../textarea)
- [fw-datepicker](../datepicker)
- [fw-checkbox](../checkbox)
- [fw-radio-group](../radio-group)
- [fw-radio](../radio)
- [fw-nested-select](../nested-select)
- [fw-select](../select)
- [fw-timepicker](../timepicker)
- [fw-file-uploader-2](../file-uploader-2)

### Graph
```mermaid
graph TD;
  fw-form-control --> fw-input
  fw-form-control --> fw-textarea
  fw-form-control --> fw-datepicker
  fw-form-control --> fw-checkbox
  fw-form-control --> fw-radio-group
  fw-form-control --> fw-radio
  fw-form-control --> fw-nested-select
  fw-form-control --> fw-select
  fw-form-control --> fw-timepicker
  fw-form-control --> fw-file-uploader-2
  fw-input --> fw-icon
  fw-input --> fw-tooltip
  fw-tooltip --> fw-popover
  fw-textarea --> fw-tooltip
  fw-datepicker --> fw-tooltip
  fw-datepicker --> fw-icon
  fw-datepicker --> fw-button
  fw-datepicker --> fw-input
  fw-datepicker --> fw-timepicker
  fw-datepicker --> fw-popover
  fw-datepicker --> fw-select
  fw-button --> fw-spinner
  fw-button --> fw-icon
  fw-timepicker --> fw-select
  fw-timepicker --> fw-select-option
  fw-select --> fw-tag
  fw-select --> fw-popover
  fw-select --> fw-button
  fw-select --> fw-spinner
  fw-select --> fw-icon
  fw-select --> fw-list-options
  fw-select --> fw-tooltip
  fw-tag --> fw-tooltip
  fw-tag --> fw-avatar
  fw-tag --> fw-icon
  fw-list-options --> fw-select-option
  fw-list-options --> fw-input
  fw-select-option --> fw-icon
  fw-select-option --> fw-checkbox
  fw-select-option --> fw-avatar
  fw-checkbox --> fw-icon
  fw-nested-select --> fw-nested-node
  fw-nested-node --> fw-nested-node
  fw-nested-node --> fw-select
  fw-file-uploader-2 --> fw-file-2
  fw-file-uploader-2 --> fw-inline-message
  fw-file-2 --> fw-icon
  fw-file-2 --> fw-tooltip
  fw-file-2 --> fw-spinner
  fw-inline-message --> fw-icon
  fw-form --> fw-form-control
  style fw-form-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

Built with ❤ at Freshworks
