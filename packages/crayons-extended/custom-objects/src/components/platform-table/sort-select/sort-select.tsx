/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  Component,
  Prop,
  h,
  State,
  Listen,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';
import { TranslationController } from '../../../global/Translation';
import { handleKeyDown } from '../../../utils/utils';
@Component({
  tag: 'fw-sort-select',
  styleUrl: 'sort-select.scss',
  shadow: true,
})
export class SortSelect {
  private sortOrderData = [
    { value: 'ASC', text: TranslationController.t('sortSelect.ascending') },
    { value: 'DESC', text: TranslationController.t('sortSelect.descending') },
  ];
  private sortDropdown;

  @State() sortColumnName;
  @State() isExpanded;

  /**
   * Select options for the sortable. Array of objects of type {text: string, value: string}
   */
  @Prop({ reflect: true }) sortOptions: any[] = [];
  /**
   * The sort by column key.
   */
  @Prop({ mutable: true, reflect: true }) orderBy;
  /**
   * The sort order.
   */
  @Prop({ mutable: true, reflect: true }) order;
  /**
   * Triggered on selecting the sort option.
   */
  @Event() fwSort: EventEmitter;

  @Watch('orderBy')
  onDefaultSortChange(newValue) {
    const defaultValue = this.sortOptions.filter(
      (option) => option.value === newValue
    )[0];
    this.sortColumnName = defaultValue?.text;
  }

  @Listen('fwChange')
  onOptionSelect(e) {
    const id = e.composedPath()[0].id;
    const selectedValue = e.detail.value;
    if (id === 'sortBy') {
      this.orderBy = selectedValue;
    } else if (id === 'sortOrder') {
      this.order = selectedValue;
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    this.sortDropdown.hide();
    this.fwSort.emit({ orderBy: this.orderBy, order: this.order });
  }

  @Listen('fwShow')
  onDropdownOpen() {
    this.isExpanded = true;
  }

  @Listen('fwHide')
  onDropdownClose() {
    this.isExpanded = false;
  }

  toggleDropdown(event: Event) {
    this.sortDropdown.isOpen
      ? this.sortDropdown.hide()
      : this.sortDropdown.show();
    event.stopPropagation();
  }

  componentWillLoad() {
    this.onDefaultSortChange(this.orderBy);
  }

  render() {
    return (
      <fw-popover
        ref={(sortDropdown) => (this.sortDropdown = sortDropdown)}
        class='sort'
        same-width='false'
        placement='bottom-start'
        trigger='manual'
      >
        <div class='sort-container' slot='popover-trigger'>
          <div
            class='sort-action'
            tabIndex={0}
            role='button'
            onClick={(e) => {
              this.toggleDropdown(e);
            }}
            onKeyDown={handleKeyDown(this.toggleDropdown.bind(this))}
          >
            <span>{this.sortColumnName}</span>
            <span
              class={{
                'dropdown-status-icon': true,
                'expanded': this.isExpanded,
              }}
            >
              <fw-icon
                name='chevron-down'
                color='#264966'
                size={8}
                library='system'
              ></fw-icon>
            </span>
          </div>
        </div>
        <div slot='popover-content'>
          <fw-list-options
            id='sortBy'
            allowDeselect={false}
            value={this.orderBy}
            options={this.sortOptions}
          >
            {' '}
          </fw-list-options>
          <hr class='divider' />
          <span class='order-label'>
            {TranslationController.t('platformTable.orderby')}
          </span>
          <fw-list-options
            id='sortOrder'
            allowDeselect={false}
            value={this.order}
            options={this.sortOrderData}
          ></fw-list-options>
        </div>
      </fw-popover>
    );
  }
}
