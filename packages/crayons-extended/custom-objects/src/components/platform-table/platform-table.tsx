import {
  Component,
  Element,
  Watch,
  Prop,
  h,
  Method,
  Fragment,
  State,
  Listen,
  Event,
  EventEmitter,
} from '@stencil/core';
import { TranslationController } from '../../global/Translation';
@Component({
  tag: 'fw-platform-table',
  styleUrl: 'platform-table.scss',
  shadow: true,
})
export class PlatformTable {
  @State() orderByData = [];
  @State() showDelete = false;
  @State() checkAll = false;

  @Element() host: HTMLElement;
  private table;
  private defaultProps;
  private selectedRows = [];

  /**
   * Props for the fw-pagination component
   */
  @Prop() tableProps = {};

  /**
   * Props for the fw-pagination component
   */
  @Prop() paginationProps = {};

  /**
   * Custom css styles (background/margins/width/height etc.)
   *
   * @type {({[k: string]: string} | string)}
   */
  @Prop() customStyles: { [key: string]: string } | string = {};

  /**
   * Width of the data-table ex. 100vh, 100%, auto etc.
   */
  @Prop() tableWidth: string = null;

  /**
   * Height of the data-table ex. 100vh, 100%, auto etc.
   */
  @Prop() tableHeight: string = null;

  /**
   * The sort by column key.
   */
  @Prop({ mutable: true, reflect: true }) orderBy;
  /**
   * The sort order.
   */
  @Prop({ mutable: true, reflect: true }) order;
  /**
   * The sort order.
   */
  @Prop({ reflect: true }) loading = false;
  /**
   * When set true the error state slot will be shown.
   */
  @Prop({ reflect: true }) showError = false;
  /**
   * The sortable columns object.
   */
  @Prop() sortableColumns = {};
  /**
   * Whether the checkbox should be visible.
   */
  @Prop() isSelectable = true;
  /**
   * Triggered on selecting the sort option.
   */
  @Event() fwDelete: EventEmitter;
  /**
   * Triggered on page navigation button click.
   */
  @Event() fwPagination: EventEmitter;

  @Watch('loading')
  onLoadingChange(newValue) {
    if (this.showError) return;
    this.table.loadTable(newValue);
  }

  @Listen('fwSelectionChange')
  onTableSelectionChange(e) {
    const selected = e.detail.selected;
    this.setSelectedRow(selected);
  }

  @Listen('fwChange')
  onChange(e) {
    if (e.composedPath()[0].tagName === 'FW-PAGINATION') {
      this.clearTableSelection();
      this.fwPagination.emit(e.detail);
    } else if (e.composedPath()[0].id === 'selectAll') {
      this.table.selectAllRows(e.detail?.meta?.checked).then((selectedIds) => {
        this.checkAll = true;
        this.setSelectedRow(selectedIds, true);
      });
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }

  get style(): any {
    const dimensionsStyles: {
      width?: string;
      height?: string;
    } = {
      width: null,
      height: null,
    };

    if (this.tableWidth) {
      dimensionsStyles.width = this.tableWidth;
    }

    if (this.tableHeight) {
      dimensionsStyles.height = this.tableHeight;
    }

    const styles =
      typeof this.customStyles === 'object' ? this.customStyles : {};
    return { ...dimensionsStyles, ...styles };
  }

  /**
   * clears the selected rows in the table.
   */
  @Method()
  async clearTableSelection() {
    if (this.showError) return;
    this.table.selectAllRows(false);
    this.setSelectedRow([]);
  }

  setSelectedRow(selectedIds, skipCheck = false) {
    this.selectedRows = selectedIds.length > 0 ? selectedIds : [];
    this.showDelete = this.selectedRows.length > 0 ? true : false;
    if (!skipCheck) {
      this.checkAll =
        this.tableProps['rows'].length > 0 &&
        this.tableProps['rows'].length === this.selectedRows.length &&
        this.tableProps['rows'].every((row) =>
          this.selectedRows.includes(row.id)
        );
    }
  }

  setSortableColumns(sortableColumns) {
    this.orderByData = Object.keys(sortableColumns).map((columnKey) => {
      return { ...sortableColumns[columnKey], value: columnKey };
    });
  }

  onDelete() {
    this.fwDelete.emit({ selectedRows: this.selectedRows });
  }

  renderDeleteButton() {
    return (
      <fw-button
        class='action-items'
        color='secondary'
        onClick={this.onDelete.bind(this)}
      >
        <fw-icon slot='before-label' name='delete'></fw-icon>
        <span>{TranslationController.t('platformTable.delete')}</span>
      </fw-button>
    );
  }

  renderSort() {
    return (
      <Fragment>
        <label class='sort-label'>
          {TranslationController.t('platformTable.sortby')}:
        </label>
        <fw-sort-select
          class='sort'
          orderBy={this.orderBy}
          order={this.order}
          sortOptions={this.orderByData}
        ></fw-sort-select>
      </Fragment>
    );
  }

  componentWillLoad() {
    this.defaultProps = this.host.id ? { id: `platform-${this.host.id}` } : {};
    this.setSortableColumns(this.sortableColumns);
  }

  componentDidLoad() {
    this.loading && this.onLoadingChange(this.loading);
  }

  render() {
    return (
      <Fragment>
        <div class='toolbar'>
          <span class='toolbar-prefix'>
            {this.isSelectable && (
              <fw-checkbox
                id='selectAll'
                disabled={this.showError}
                checked={this.checkAll}
              ></fw-checkbox>
            )}
            {this.showDelete ? this.renderDeleteButton() : this.renderSort()}
          </span>
          <span class='toolbar-suffix'>
            <slot name='toolbar-before'></slot>
            <fw-pagination {...this.paginationProps}></fw-pagination>
            <slot name='toolbar-after'></slot>
          </span>
        </div>
        {this.showError ? (
          <slot name='error-state'></slot>
        ) : (
          <fw-data-table
            style={this.style}
            {...this.defaultProps}
            {...this.tableProps}
            class='table'
            ref={(table) => {
              this.table = table;
            }}
            isSelectable={this.isSelectable}
          ></fw-data-table>
        )}
      </Fragment>
    );
  }
}
