/**
 * Shared types for choice-source dropdown fields (`fw-fb-field-choice-source`).
 */

export interface ChoiceSourceFieldOption {
  value: string;
  text: string;
  column_name?: string;
  option_value_path?: string;
  option_label_path?: string;
  has_dependents?: boolean;
}

export interface ChoiceDataSourceOption {
  value: string;
  text: string;
  has_sub_items?: boolean;
  fields: ChoiceSourceFieldOption[];
  subItems?: { value: string; text: string }[];
}

export interface ChoiceSourceDataResponse {
  dataSource: string;
  subItem?: string;
  dropdownField: string;
  column_name?: string;
  option_value_path?: string;
  option_label_path?: string;
  has_dependents?: boolean;
}

/**
 * Default `data_source` id for new choice-source DROPDOWN fields.
 * Hosts map `'0'` → Ticket (matches custom-objects-ui LEGO / datasourceMapper fixtures).
 */
export const DEFAULT_CHOICE_SOURCE_DATA_SOURCE_ID = '0';

export function findChoiceDataSource(
  sources: ChoiceDataSourceOption[] | null | undefined,
  dataSourceId: string
): ChoiceDataSourceOption | undefined {
  if (!Array.isArray(sources) || !dataSourceId) {
    return undefined;
  }
  const normalized = String(dataSourceId);
  return sources.find((item) => String(item.value) === normalized);
}

export function isChoiceSourceDataSourceValid(
  sources: ChoiceDataSourceOption[] | null | undefined,
  dataSourceId: string
): boolean {
  return !!findChoiceDataSource(sources, dataSourceId);
}

export function isChoiceSourceDropdownFieldValid(
  sources: ChoiceDataSourceOption[] | null | undefined,
  dataSourceId: string,
  dropdownField: string
): boolean {
  if (!dataSourceId || !dropdownField) {
    return false;
  }
  const source = findChoiceDataSource(sources, dataSourceId);
  return !!source?.fields?.some((field) => field.value === dropdownField);
}

export function isChoiceSourceSubItemValid(
  sources: ChoiceDataSourceOption[] | null | undefined,
  dataSourceId: string,
  subItemId: string
): boolean {
  if (!dataSourceId || !subItemId) {
    return false;
  }
  const source = findChoiceDataSource(sources, dataSourceId);
  return !!source?.subItems?.some(
    (item) => String(item.value) === String(subItemId)
  );
}

/**
 * Resolve `has_dependents` for save/edit.
 * Prefer the selected field’s metadata when present; otherwise keep the response
 * or existing field value so edit-save without reselection does not wipe it.
 */
export function resolveChoiceSourceHasDependents(
  sources: ChoiceDataSourceOption[] | null | undefined,
  response:
    | Pick<
        ChoiceSourceDataResponse,
        'dataSource' | 'dropdownField' | 'has_dependents'
      >
    | null
    | undefined,
  fallbackHasDependents?: boolean
): boolean {
  if (response?.dataSource && response?.dropdownField) {
    const source = findChoiceDataSource(sources, response.dataSource);
    const field = source?.fields?.find(
      (item) => item.value === response.dropdownField
    );
    if (field && typeof field.has_dependents === 'boolean') {
      return field.has_dependents;
    }
  }
  if (typeof response?.has_dependents === 'boolean') {
    return response.has_dependents;
  }
  return !!fallbackHasDependents;
}
