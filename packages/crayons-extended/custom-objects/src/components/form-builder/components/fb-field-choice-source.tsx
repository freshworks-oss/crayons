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
  fields: ChoiceSourceFieldOption[];
}

export interface ChoiceSourceDataResponse {
  dataSource: string;
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

  /**
   * Selected data source and dropdown field values (controlled input from parent)
   */
  @Prop() dataResponse: ChoiceSourceDataResponse = {
    dataSource: '',
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
   * Triggered on data change for error handling on parent
   */
  @Event() fwChange!: EventEmitter;

  @State() selectedDataSource = '';
  @State() selectedDropdownField = '';
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

  private getFieldsForDataSource(
    dataSourceValue: string
  ): ChoiceSourceFieldOption[] {
    const normalizedValue = String(dataSourceValue ?? '');
    const source = this.getChoiceDataSources().find(
      (item) => String(item.value) === normalizedValue
    );
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

  private getDataResponse(): ChoiceSourceDataResponse {
    return (
      this.dataResponse ?? {
        dataSource: '',
        dropdownField: '',
      }
    );
  }

  private syncFromDataResponse(): void {
    const response = this.getDataResponse();
    let dataSource = String(response.dataSource ?? '');
    const columnName = String(response.column_name ?? '');
    let dropdownField = String(response.dropdownField ?? '');

    if (!dataSource && dropdownField) {
      dataSource = this.findDataSourceForField(dropdownField);
    }
    if (!dataSource && columnName) {
      dataSource = this.findDataSourceForColumnName(columnName);
    }

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

    if (
      dataSource === this.selectedDataSource &&
      dropdownField === this.selectedDropdownField &&
      dropdownFieldOptions.length > 0 &&
      boolSelectionValid
    ) {
      return;
    }

    this.selectedDataSource = dataSource;
    this.selectedDropdownField = dropdownField;
    this.dropdownFieldOptions = dropdownFieldOptions;
  }

  private buildDataResponse(): ChoiceSourceDataResponse {
    const fields = this.getFieldsForDataSource(this.selectedDataSource);
    const selectedField = fields.find(
      (field) => field.value === this.selectedDropdownField
    );

    return {
      dataSource: String(this.selectedDataSource),
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
    this.selectedDataSource = nextDataSource;
    this.selectedDropdownField = '';
    this.dropdownFieldOptions = this.getLocalizedFieldOptions(
      this.getFieldsForDataSource(nextDataSource)
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
    const strDropdownFieldState =
      this.showErrors && !this.selectedDropdownField ? 'error' : 'normal';
    const boolDropdownDisabled =
      this.disabled ||
      !this.selectedDataSource ||
      !this.dropdownFieldOptions.length;

    return (
      <Host tabIndex='-1'>
        <div class={`${strBaseClassName}-root`}>
          <div class={strBaseClassName}>
            <div class={`${strBaseClassName}-data-source-select-container`}>
              <fw-select
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
            <div class={`${strBaseClassName}-dropdown-field-select-container`}>
              <fw-select
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
