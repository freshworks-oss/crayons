# fw-co-nested-select

Custom Objects nested / cascading select used by `fw-form-control` when
`type` is `DROPDOWN_LOOKUP_SECTION`. Cascade levels share the outer field
`name` so `fw-form` stores a single leaf value under that key.

## `fwChange` payload

Emits `{ name: string, value: string }` where `value` is the **leaf** option id
for this field (not an intermediate level).

## `valuePath` (edit / restore)

Only the leaf is persisted on the record. To restore the full cascade on edit,
pass every level’s value root-to-leaf:

```ts
nestedSelect.valuePath = ['hardware', 'computer', 'mac'];
```

`value` alone is treated as the root seed when `valuePath` is absent.

## Usage

```html
<fw-co-nested-select
  id="category"
  name="category_co"
  label="Category"
></fw-co-nested-select>

<script>
  const el = document.getElementById('category');
  el.options = [
    {
      id: 'hardware',
      value: 'Hardware',
      choices: [
        {
          id: 'computer',
          value: 'Computer',
          choices: [
            { id: 'mac', value: 'Mac' },
            { id: 'pc', value: 'PC' },
          ],
        },
      ],
    },
    {
      id: 'software',
      value: 'Software',
      choices: [{ id: 'crm', value: 'CRM' }],
    },
  ];
  el.addEventListener('fwChange', (e) => {
    // e.detail => { name: 'category_co', value: 'crm' }
  });
</script>
```

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                               | Type                               | Default     |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| `errorText`       | `error-text`        |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |
| `hintText`        | `hint-text`         |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |
| `label`           | `label`             |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |
| `name`            | `name`              |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |
| `optionLabelPath` | `option-label-path` |                                                                                                                                                                                                                                                                           | `string`                           | `'value'`   |
| `optionValuePath` | `option-value-path` |                                                                                                                                                                                                                                                                           | `string`                           | `'id'`      |
| `options`         | --                  |                                                                                                                                                                                                                                                                           | `any[]`                            | `[]`        |
| `placeholder`     | `placeholder`       |                                                                                                                                                                                                                                                                           | `string`                           | `undefined` |
| `required`        | `required`          |                                                                                                                                                                                                                                                                           | `boolean`                          | `false`     |
| `selectProps`     | `select-props`      | Initial values helper from `fw-form` / `controlProps.selectProps`.                                                                                                                                                                                                        | `any`                              | `undefined` |
| `state`           | `state`             |                                                                                                                                                                                                                                                                           | `"error" \| "normal" \| "warning"` | `'normal'`  |
| `value`           | `value`             |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |
| `valuePath`       | --                  | Root-to-leaf display value at every cascade depth for a previously saved selection - only the leaf value is persisted on the record, so restoring the full cascade on edit needs each level's own value, not just the leaf's. Example: `['hardware', 'computer', 'mac']`. | `string[]`                         | `undefined` |
| `warningText`     | `warning-text`      |                                                                                                                                                                                                                                                                           | `string`                           | `''`        |


## Events

| Event      | Description                                                                                                        | Type               |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `fwChange` | Emitted when cascade selection changes. Detail: `{ name: string, value: string }` — leaf option id for this field. | `CustomEvent<any>` |


----------------------------------------------


# fw-co-nested-node

Internal cascade level used by `fw-co-nested-select`. Every level shares the
outer field `name` so `fw-form` receives updates under a known schema key.

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `errorText` | `error-text` | | `string` | `''` |
| `hintText` | `hint-text` | | `string` | `''` |
| `label` | `label` | | `string` | `''` |
| `level` | `level` | Cascade depth (0 = root) | `number` | `0` |
| `name` | `name` | Shared outer field name | `string` | `''` |
| `optionLabelPath` | `option-label-path` | | `string` | `'value'` |
| `optionValuePath` | `option-value-path` | | `string` | `'id'` |
| `options` | -- | Choices for this level | `any[]` | `[]` |
| `placeholder` | `placeholder` | | `string` | `undefined` |
| `required` | `required` | | `boolean` | `false` |
| `rootLabelledBy` | `root-labelled-by` | When set on level 0, omit select label and use `labelledBy` | `string` | `''` |
| `selectProps` | -- | Optional initial-values helper | `any` | `undefined` |
| `state` | `state` | | `"error" \| "normal" \| "warning"` | `'normal'` |
| `value` | `value` | Seeded value for this level | `string` | `''` |
| `valuePath` | -- | Full cascade path for child seeding | `string[]` | `undefined` |
| `warningText` | `warning-text` | | `string` | `''` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `fwPropertyChange` | Notifies parent of hydrated selection during edit restore | `CustomEvent<any>` |

----------------------------------------------


# fw-fb-field-choice-source

Choice-source picker for DROPDOWN fields when `fw-form-builder` has
`useChoiceSourceDropdown` enabled. Replaces manual choice editing with data-source
/ optional sub-item / dropdown-field selects.

## Host contract (`has_sub_items`)

When a data source has `has_sub_items: true` and the user selects a sub-item,
`choiceSourceSubItemChangeHandler(sourceId, subItemId)` fires. The host **must**
update `choiceDataSources` so that source’s `fields` list matches the selected
sub-item before the dropdown-field select is usable.

```ts
formBuilder.choiceSourceSubItemChangeHandler = async (sourceId, subItemId) => {
  const fields = await fetchFieldsForSubItem(sourceId, subItemId);
  formBuilder.choiceDataSources = formBuilder.choiceDataSources.map((source) =>
    String(source.value) === String(sourceId)
      ? { ...source, fields }
      : source
  );
};
```

Save payloads include `sub_item_id` when a sub-item was selected.

## `choiceDataSources` shape

```ts
{
  value: string;
  text: string;
  has_sub_items?: boolean;
  fields: Array<{
    value: string;
    text: string;
    column_name?: string;
    option_value_path?: string;
    option_label_path?: string;
    has_dependents?: boolean;
  }>;
  subItems?: Array<{ value: string; text: string }>;
}
```

## Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `choiceDataSources` | Data sources and field options | `ChoiceDataSourceOption[]` | `[]` |
| `choiceSourceDataSourceChangeHandler` | Fired when data source changes | `(sourceId: string) => void \| Promise<void>` | `undefined` |
| `choiceSourceSubItemChangeHandler` | Fired when sub-item changes; host refreshes fields | `(sourceId: string, subItemId: string) => void \| Promise<void>` | `undefined` |
| `dataResponse` | Controlled selection from parent | `ChoiceSourceDataResponse` | `{ dataSource: '', subItem: '', dropdownField: '' }` |
| `disabled` | Disables all selects | `boolean` | `false` |
| `showErrors` | Shows validation state on empty required selects | `boolean` | `false` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `fwChange` | Emitted with `{ value: ChoiceSourceDataResponse }` on selection change | `CustomEvent<any>` |

----------------------------------------------

Built with ❤ at Freshworks
