import {
  Component,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
  Method,
  State,
} from '@stencil/core';
import { TranslationController } from '../../global/Translation';
import { debounce } from '../../utils/utils';
import { deepCloneObject } from '../form-builder/utils/form-builder-utils';

@Component({
  tag: 'fw-co-export',
  styleUrl: 'co-export.scss',
  shadow: true,
})
export class CoExport {
  @Element() host!: HTMLElement;

  private debouncedHandleInput: (event: CustomEvent) => void | null = null;
  private boolAddedClearFilterEvent = false;

  @State() allFieldsSelected = false;
  @State() arrSearchedFields = null;
  @State() searching = false;
  @State() searchText = '';
  @State() clearFilter = false;
  @State() selectedFieldCount = 0;

  /**
   * The value to show the modal or close
   */
  @Prop({ mutable: true, reflect: true }) isOpen = false;
  /**
   * The value to populate the export details in json format
   */
  @Prop({ mutable: true }) value = null;
  /**
   * Triggered whenever the export button is selected
   */
  @Event() fwExport: EventEmitter;
  /**
   * Triggered whenever the cancel/close button is selected
   */
  @Event() fwCloseExport: EventEmitter;

  @Method()
  async close(): Promise<boolean> {
    this.resetStates();
    this.isOpen = false;
    return true;
  }

  @Method()
  async open(): Promise<boolean> {
    this.initializeSearchDebounce();
    this.isOpen = true;
    return true;
  }

  componentWillLoad(): void {
    const boolApplyFilter = this.value?.filter?.value || false;
    this.clearFilter = !boolApplyFilter;
    this.updateSelectedCount();
    this.initializeSearchDebounce();
  }

  componentDidUpdate(): void {
    this.addClearFilterEvent();
  }

  disconnectedCallback(): void {
    this.resetStates();
  }

  private resetStates = () => {
    this.debouncedHandleInput = null;
    this.arrSearchedFields = null;
    this.searching = false;
    this.searchText = '';
    this.allFieldsSelected = false;
    this.clearFilter = false;
    this.selectedFieldCount = 0;
    this.value = null;
  };

  private initializeSearchDebounce = () => {
    if (!this.debouncedHandleInput) {
      this.debouncedHandleInput = debounce(this.searchChangeHandler, this);
    }
  };

  private addClearFilterEvent = () => {
    if (!this.boolAddedClearFilterEvent) {
      const linkClearFilter =
        this.host.shadowRoot?.querySelector('.clearExportFilter');

      if (linkClearFilter) {
        this.boolAddedClearFilterEvent = true;
        linkClearFilter.addEventListener('click', this.clearFiltersHandler);
      }
    }
  };

  private updateSelectedCount() {
    if (!this.value?.fields?.length) {
      this.selectedFieldCount = 0;
      this.allFieldsSelected = false;
      return;
    }

    const selectedFields = this.value.fields.filter(
      (field) => field.selected === true
    );
    this.selectedFieldCount = selectedFields.length;
    this.allFieldsSelected =
      this.selectedFieldCount === this.value.fields.length;
  }

  private clearFiltersHandler = (event: Event) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (this.value?.filter) {
      this.value.filter.value = false;
    }
    this.clearFilter = true;
  };

  private searchChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    const searchText = event?.detail?.value?.trim() || '';
    this.searchText = searchText;

    if (searchText && this.value?.fields?.length) {
      const searchableText = searchText.toLowerCase();
      const results = this.value.fields.filter((field) =>
        field.label.toLowerCase().includes(searchableText)
      );
      this.searching = true;
      this.arrSearchedFields = deepCloneObject(results);
    } else {
      this.searching = false;
      this.arrSearchedFields = null;
    }
  };

  private clearSearchHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.arrSearchedFields = null;
    this.searching = false;
    this.searchText = '';
  };

  private selectAllFieldsChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    const boolSelected = event.detail.meta.checked;
    this.allFieldsSelected = boolSelected;

    // Update search results if searching
    if (this.searching && this.arrSearchedFields) {
      this.arrSearchedFields = this.arrSearchedFields.map((field) =>
        field.disabled ? field : { ...field, selected: boolSelected }
      );
    }

    // Update main fields
    if (this.value?.fields?.length) {
      this.value.fields = this.value.fields.map((field) =>
        field.disabled ? field : { ...field, selected: boolSelected }
      );
      this.updateSelectedCount();
    }
  };

  private fieldSelectionChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (!this.value?.fields?.length) return;

    const isSelected = event.detail.checked;
    const fieldId = event.detail.value;

    const field = this.value.fields.find((field) => field.id === fieldId);
    if (field) {
      field.selected = isSelected;
      this.updateSelectedCount();
    }
  };

  private closeModalHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.fwCloseExport.emit();
  };

  private exportHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (!this.value) {
      console.warn('No export data available');
      return;
    }

    this.fwExport.emit({ value: deepCloneObject(this.value) });
  };

  private getFieldKey(field): string {
    return this.searching && this.searchText
      ? `search_${this.searchText}_${field.id}`
      : field.id;
  }

  private renderCheckboxField(dataField) {
    const key = this.getFieldKey(dataField);

    return (
      <fw-co-export-field
        key={key}
        value={dataField}
        onFwChange={this.fieldSelectionChangeHandler}
      ></fw-co-export-field>
    );
  }

  render(): Element {
    const boolOpen = this.isOpen;
    const objFilter = boolOpen ? this.value?.filter : null;
    const boolShowFilteredRecords =
      !this.clearFilter && objFilter ? true : false;
    const strFilteredData = boolShowFilteredRecords
      ? TranslationController.t('export.filterInfo', {
          filtered: objFilter.filtered,
          total: objFilter.total,
        })
      : '';

    const arrFields = this.searching
      ? this.arrSearchedFields
      : this.value?.fields || null;
    const numTotalFieldCount = arrFields ? arrFields.length : 0;
    const boolShowSearch = this.searching || numTotalFieldCount > 0;
    const boolShowEmptySearch =
      boolShowSearch && this.searching && numTotalFieldCount <= 0;
    const numFirstColumnCount =
      numTotalFieldCount <= 0
        ? numTotalFieldCount
        : Math.ceil(numTotalFieldCount / 2);
    const numSecondColumnCount = boolShowSearch
      ? numTotalFieldCount - numFirstColumnCount
      : 0;
    const boolShowSecondColumn = numSecondColumnCount > 0;

    const fieldColumn1Elements =
      numFirstColumnCount > 0
        ? arrFields
            .slice(0, numFirstColumnCount)
            .map((dataItem) => this.renderCheckboxField(dataItem))
        : null;

    const fieldColumn2Elements = boolShowSecondColumn
      ? arrFields
          .slice(numFirstColumnCount)
          .map((dataItem) => this.renderCheckboxField(dataItem))
      : null;

    const strBaseClassName = [
      'co-export-content',
      !boolShowFilteredRecords && 'co-export-content--without-filter',
    ]
      .filter(Boolean)
      .join(' ');

    const strFirstColumnClassName = [
      'co-export-field-content-fields-column1',
      !boolShowSecondColumn &&
        'co-export-field-content-fields-column1--full-width',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <fw-modal
        isOpen={this.isOpen}
        slider={true}
        icon='file-export'
        icon-size={'24'}
        titleText={TranslationController.t('export.modalTitle')}
        onFwClose={this.closeModalHandler}
      >
        <fw-modal-content class='co-export-modal-content'>
          <div class={strBaseClassName}>
            {boolShowFilteredRecords && (
              <fw-inline-message open type='info' closable={false}>
                <span innerHTML={strFilteredData} />
              </fw-inline-message>
            )}

            <div class='co-export-field-selection'>
              <div class='co-export-field-header'>
                <span class='co-export-field-header-selected-count-label'>
                  {TranslationController.t('export.fieldInformationMessage')}
                </span>
                <span class='co-export-field-header-selected-count-label'>
                  {TranslationController.t('export.selectedFields', {
                    count: `${this.selectedFieldCount}/${numTotalFieldCount}`,
                  })}
                </span>
              </div>
              <div class='co-export-field-content'>
                <div class='co-export-field-content-header'>
                  <fw-input
                    clear-input
                    icon-left='search'
                    placeholder={TranslationController.t(
                      'export.searchFieldsPrompt'
                    )}
                    onFwInput={this.debouncedHandleInput}
                    onFwInputClear={this.clearSearchHandler}
                    class='co-export-field-search'
                  ></fw-input>
                </div>
                <div class='co-export-field-select-all-container'>
                  <fw-checkbox
                    class='co-export-field-select-all'
                    checked={this.allFieldsSelected}
                    onFwChange={this.selectAllFieldsChangeHandler}
                  >
                    <span class={`co-export-field-select-all-label`}>
                      {TranslationController.t('export.selectAllFields')}
                    </span>
                  </fw-checkbox>
                </div>
                <div class='co-export-field-content-fields'>
                  {!boolShowEmptySearch && (
                    <div class={strFirstColumnClassName}>
                      {fieldColumn1Elements}
                    </div>
                  )}
                  {!boolShowEmptySearch && boolShowSecondColumn && (
                    <div class='co-export-field-content-fields-column2'>
                      {fieldColumn2Elements}
                    </div>
                  )}
                  {boolShowEmptySearch && (
                    <span class={`co-export-field-empty-search-message`}>
                      {TranslationController.t('export.noSearchResults')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </fw-modal-content>
        <fw-modal-footer>
          <span class='co-export-modal-footer'>
            <fw-button color='secondary' onFwClick={this.closeModalHandler}>
              {TranslationController.t('export.cancelButton')}
            </fw-button>
            <fw-button onFwClick={this.exportHandler}>
              {TranslationController.t('export.submitButton')}
            </fw-button>
          </span>
        </fw-modal-footer>
      </fw-modal>
    );
  }
}
