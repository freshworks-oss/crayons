import {
  Component,
  Element,
  Prop,
  h,
  Host,
  EventEmitter,
  Event,
  State,
  Watch,
} from '@stencil/core';
import { deepCloneObject, i18nText } from '../utils/form-builder-utils';

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

@Component({
  tag: 'fw-fb-field-choice-source',
  styleUrl: 'fb-field-choice-source.scss',
  shadow: true,
})
export class FbFieldChoiceSource {
  @Element() host!: HTMLElement;

  private dataSourceOptions: { value: string; text: string }[] = [];
  // fw-select has no @Watch('value') - it only re-validates the current selection against its options
  // when the OPTIONS prop itself changes (see matchValueWithOptions). The data source list never changes
  // once loaded, so re-syncing selectedDataSource alone (e.g. once the lookup's referenceField resolves
  // asynchronously after the panel is already open) would leave this select showing blank until the field
  // is collapsed and reopened. Refs let syncFromDataResponse force a re-sync imperatively instead.
  // HTMLFwSelectElement (crayons-core) isn't visible from this package's own generated type scope.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dataSourceSelectRef?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subItemSelectRef?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dropdownFieldSelectRef?: any;

  /**
   * Selected data source and dropdown field values (controlled input from parent)
   */
  @Prop() dataResponse: ChoiceSourceDataResponse = {
    dataSource: '',
    subItem: '',
    dropdownField: '',
  };
  /**
   * property to show the errors on click of the save/add button from the parent
   */
  @Prop({ mutable: true }) showErrors = false;
  /**
   * Disables both dropdowns when set to true
   */
  @Prop() disabled = false;
  /**
   * Data sources and their field options (provided by fw-form-builder)
   */
  @Prop() choiceDataSources: ChoiceDataSourceOption[] = [];
  /**
   * Callback invoked when the data source dropdown selection changes
   */
  @Prop() choiceSourceDataSourceChangeHandler?: (
    sourceId: string
  ) => void | Promise<void>;
  /**
   * Callback invoked when the sub-item dropdown selection changes
   */
  @Prop() choiceSourceSubItemChangeHandler?: (
    sourceId: string,
    subItemId: string
  ) => void | Promise<void>;
  /**
   * Triggered on data change for error handling on parent
   */
  @Event() fwChange!: EventEmitter;

  @State() selectedDataSource = '';
  @State() selectedSubItem = '';
  @State() selectedDropdownField = '';
  @State() subItemOptions: { value: string; text: string }[] = [];
  @State() dropdownFieldOptions: { value: string; text: string }[] = [];

  @Watch('dataResponse')
  watchDataResponseHandler(): void {
    this.syncFromDataResponse();
  }

  @Watch('choiceDataSources')
  watchChoiceDataSourcesHandler(): void {
    this.dataSourceOptions = this.getLocalizedDataSources();
    this.syncFromDataResponse();
  }

  componentWillLoad(): void {
    this.dataSourceOptions = this.getLocalizedDataSources();
    this.syncFromDataResponse();
  }

  private getChoiceDataSources(): ChoiceDataSourceOption[] {
    if (!Array.isArray(this.choiceDataSources)) {
      return [];
    }
    return this.choiceDataSources;
  }

  private getLocalizedDataSources(): { value: string; text: string }[] {
    return this.getChoiceDataSources().map((source) => ({
      value: String(source.value),
      text:
        source.text && source.text.startsWith('choice')
          ? i18nText(source.text)
          : source.text,
    }));
  }

  private getSourceConfig(
    dataSourceValue: string
  ): ChoiceDataSourceOption | undefined {
    const normalizedValue = String(dataSourceValue ?? '');
    return this.getChoiceDataSources().find(
      (item) => String(item.value) === normalizedValue
    );
  }

  private sourceHasSubItems(dataSourceValue: string): boolean {
    return !!this.getSourceConfig(dataSourceValue)?.has_sub_items;
  }

  private getSubItemsForDataSource(
    dataSourceValue: string
  ): { value: string; text: string }[] {
    return this.getSourceConfig(dataSourceValue)?.subItems || [];
  }

  private getLocalizedSubItemOptions(
    subItems: { value: string; text: string }[]
  ): { value: string; text: string }[] {
    return subItems.map((item) => ({
      value: String(item.value),
      text:
        item.text && item.text.startsWith('choice')
          ? i18nText(item.text)
          : item.text,
    }));
  }

  private getFieldsForDataSource(
    dataSourceValue: string
  ): ChoiceSourceFieldOption[] {
    const normalizedValue = String(dataSourceValue ?? '');
    const source = this.getSourceConfig(normalizedValue);
    return source?.fields || [];
  }

  private getLocalizedFieldOptions(
    fields: ChoiceSourceFieldOption[]
  ): { value: string; text: string }[] {
    return fields.map((field) => ({
      value: field.value,
      text:
        field.text && field.text.startsWith('choice')
          ? i18nText(field.text)
          : field.text,
    }));
  }

  private findDataSourceForField(fieldValue: string): string {
    if (!fieldValue) {
      return '';
    }
    const sources = this.getChoiceDataSources();
    for (const source of sources) {
      const match = source.fields?.find((field) => field.value === fieldValue);
      if (match) {
        return String(source.value);
      }
    }
    return '';
  }

  private findDataSourceForColumnName(columnName: string): string {
    if (!columnName) {
      return '';
    }
    const sources = this.getChoiceDataSources();
    for (const source of sources) {
      const match = source.fields?.find(
        (field) =>
          field.column_name === columnName || field.value === columnName
      );
      if (match) {
        return String(source.value);
      }
    }
    return '';
  }

  private resolveDropdownFieldValue(
    dropdownField: string,
    dataSource: string,
    columnName: string
  ): string {
    const fields = this.getFieldsForDataSource(dataSource);
    if (
      dropdownField &&
      fields.some((field) => field.value === dropdownField)
    ) {
      return dropdownField;
    }
    if (columnName) {
      const match = fields.find(
        (field) =>
          field.column_name === columnName || field.value === columnName
      );
      if (match) {
        return match.value;
      }
    }
    return dropdownField;
  }

  private isDropdownFieldSelectionValid(
    dataSource: string,
    dropdownField: string
  ): boolean {
    if (!dataSource || !dropdownField) {
      return false;
    }
    return this.getFieldsForDataSource(dataSource).some(
      (field) => field.value === dropdownField
    );
  }

  private isSubItemSelectionValid(
    dataSource: string,
    subItem: string
  ): boolean {
    if (!dataSource || !subItem) {
      return false;
    }
    return this.getSubItemsForDataSource(dataSource).some(
      (item) => String(item.value) === String(subItem)
    );
  }

  private getDataResponse(): ChoiceSourceDataResponse {
    return (
      this.dataResponse ?? {
        dataSource: '',
        subItem: '',
        dropdownField: '',
      }
    );
  }

  private syncFromDataResponse(): void {
    const response = this.getDataResponse();
    let dataSource = String(response.dataSource ?? '');
    const columnName = String(response.column_name ?? '');
    const subItem = String(response.subItem ?? '');
    let dropdownField = String(response.dropdownField ?? '');

    if (!dataSource && dropdownField) {
      dataSource = this.findDataSourceForField(dropdownField);
    }
    if (!dataSource && columnName) {
      dataSource = this.findDataSourceForColumnName(columnName);
    }

    const boolHasSubItems = this.sourceHasSubItems(dataSource);
    const subItemOptions = boolHasSubItems
      ? this.getLocalizedSubItemOptions(
          this.getSubItemsForDataSource(dataSource)
        )
      : [];

    dropdownField = this.resolveDropdownFieldValue(
      dropdownField,
      dataSource,
      columnName
    );

    const dropdownFieldOptions = this.getLocalizedFieldOptions(
      this.getFieldsForDataSource(dataSource)
    );
    const boolSelectionValid = this.isDropdownFieldSelectionValid(
      dataSource,
      dropdownField
    );
    const boolSubItemValid = !boolHasSubItems
      ? true
      : this.isSubItemSelectionValid(dataSource, subItem);

    if (
      dataSource === this.selectedDataSource &&
      subItem === this.selectedSubItem &&
      dropdownField === this.selectedDropdownField &&
      this.dropdownFieldOptions.length > 0 &&
      boolSelectionValid &&
      boolSubItemValid
    ) {
      return;
    }

    this.selectedDataSource = dataSource;
    this.selectedSubItem = boolHasSubItems ? subItem : '';
    this.selectedDropdownField = dropdownField;
    this.subItemOptions = subItemOptions;
    this.dropdownFieldOptions = dropdownFieldOptions;

    // fw-select only re-validates its current value against options when the OPTIONS prop itself changes
    // (see the comment on the ref fields above) - force it here so a re-sync after the panel is already
    // open (e.g. once an async lookup resolution completes) doesn't leave the select showing blank.
    this.dataSourceSelectRef?.setSelectedValues(this.selectedDataSource);
    this.subItemSelectRef?.setSelectedValues(this.selectedSubItem);
    this.dropdownFieldSelectRef?.setSelectedValues(this.selectedDropdownField);
  }

  private buildDataResponse(): ChoiceSourceDataResponse {
    const fields = this.getFieldsForDataSource(this.selectedDataSource);
    const selectedField = fields.find(
      (field) => field.value === this.selectedDropdownField
    );
    const boolHasSubItems = this.sourceHasSubItems(this.selectedDataSource);

    return {
      dataSource: String(this.selectedDataSource),
      subItem: boolHasSubItems ? String(this.selectedSubItem) : '',
      dropdownField: String(this.selectedDropdownField),
      column_name: selectedField?.column_name || this.selectedDropdownField,
      option_value_path: selectedField?.option_value_path || 'id',
      option_label_path: selectedField?.option_label_path || 'value',
      has_dependents: !!selectedField?.has_dependents,
    };
  }

  private emitChange(): void {
    this.fwChange.emit({ value: deepCloneObject(this.buildDataResponse()) });
  }

  private dataSourceChangeHandler = (event: CustomEvent): void => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }

    const nextDataSource = String(event.detail?.value ?? '');
    const boolHasSubItems = this.sourceHasSubItems(nextDataSource);

    this.selectedDataSource = nextDataSource;
    this.selectedSubItem = '';
    this.selectedDropdownField = '';

    if (boolHasSubItems) {
      this.subItemOptions = this.getLocalizedSubItemOptions(
        this.getSubItemsForDataSource(nextDataSource)
      );
      this.dropdownFieldOptions = [];
    } else {
      this.subItemOptions = [];
      this.dropdownFieldOptions = this.getLocalizedFieldOptions(
        this.getFieldsForDataSource(nextDataSource)
      );
    }

    void this.choiceSourceDataSourceChangeHandler?.(nextDataSource);
    this.emitChange();
  };

  private subItemChangeHandler = (event: CustomEvent): void => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }

    const nextSubItem = String(event.detail?.value ?? '');
    this.selectedSubItem = nextSubItem;
    this.selectedDropdownField = '';
    this.dropdownFieldOptions = [];

    void this.choiceSourceSubItemChangeHandler?.(
      this.selectedDataSource,
      nextSubItem
    );
    this.emitChange();
  };

  private dropdownFieldChangeHandler = (event: CustomEvent): void => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }

    this.selectedDropdownField = String(event.detail?.value ?? '');
    this.emitChange();
  };

  render() {
    const strBaseClassName = 'fb-field-choice-source';
    const strDataSourceState =
      this.showErrors && !this.selectedDataSource ? 'error' : 'normal';
    const boolHasSubItems = this.sourceHasSubItems(this.selectedDataSource);
    const strSubItemState =
      this.showErrors && boolHasSubItems && !this.selectedSubItem
        ? 'error'
        : 'normal';
    const strDropdownFieldState =
      this.showErrors && !this.selectedDropdownField ? 'error' : 'normal';
    const boolSubItemDisabled =
      this.disabled || !this.selectedDataSource || !this.subItemOptions.length;
    const boolDropdownDisabled =
      this.disabled ||
      !this.selectedDataSource ||
      (boolHasSubItems && !this.selectedSubItem) ||
      !this.dropdownFieldOptions.length;

    return (
      <Host tabIndex='-1'>
        <div class={`${strBaseClassName}-root`}>
          <div class={strBaseClassName}>
            <div class={`${strBaseClassName}-data-source-select-container`}>
              <fw-select
                key='choice-source-data-source-select'
                ref={(el) => (this.dataSourceSelectRef = el)}
                required={true}
                state={strDataSourceState}
                class={`${strBaseClassName}-data-source-select`}
                placeholder={i18nText('choiceSourcePlaceholder')}
                label={i18nText('choiceSourceDataSourceLabel')}
                errorText={i18nText('errors.emptyDataSource')}
                disabled={this.disabled}
                value={this.selectedDataSource}
                options={this.dataSourceOptions}
                onFwChange={this.dataSourceChangeHandler}
              ></fw-select>
            </div>
            {boolHasSubItems && (
              <div class={`${strBaseClassName}-sub-item-select-container`}>
                <fw-select
                  key='choice-source-sub-item-select'
                  ref={(el) => (this.subItemSelectRef = el)}
                  required={true}
                  state={strSubItemState}
                  class={`${strBaseClassName}-sub-item-select`}
                  placeholder={i18nText('choiceSourcePlaceholder')}
                  label={i18nText('choiceSourceSubItemLabel')}
                  errorText={i18nText('errors.emptySubItem')}
                  disabled={boolSubItemDisabled}
                  value={this.selectedSubItem}
                  options={this.subItemOptions}
                  onFwChange={this.subItemChangeHandler}
                ></fw-select>
              </div>
            )}
            <div class={`${strBaseClassName}-dropdown-field-select-container`}>
              <fw-select
                key='choice-source-dropdown-field-select'
                ref={(el) => (this.dropdownFieldSelectRef = el)}
                required={true}
                state={strDropdownFieldState}
                class={`${strBaseClassName}-dropdown-field-select`}
                placeholder={i18nText('choiceSourcePlaceholder')}
                label={i18nText('choiceSourceDropdownFieldLabel')}
                errorText={i18nText('errors.emptyDropdownField')}
                disabled={boolDropdownDisabled}
                value={this.selectedDropdownField}
                options={this.dropdownFieldOptions}
                onFwChange={this.dropdownFieldChangeHandler}
              ></fw-select>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
