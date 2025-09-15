import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  Watch,
  h,
  Method,
} from '@stencil/core';
import { createPopper, Instance } from '@popperjs/core';
import { TranslationController } from '../../global/Translation';
import {
  WidthStyles,
  DataTableColumn,
  DataTableRow,
  DataTableAction,
  DataTableActionWithGraphics,
} from '../../utils/types';
import { popperModifierRTL } from '../../utils';

const PREDEFINED_VARIANTS_META: any = {
  anchor: {
    componentName: 'fw-custom-cell-anchor',
    isFocusable: true,
  },
  user: {
    componentName: 'fw-custom-cell-user',
    isFocusable: false,
    skipTextAlign: true,
  },
  icon: {
    componentName: 'fw-custom-cell-icon',
    isFocusable: false,
  },
  paragraph: {
    componentName: 'fw-custom-cell-paragraph',
    isFocusable: true,
  },
};

const TABLE_POPPER_CONFIG: any = {
  strategy: 'fixed',
  placement: 'bottom-end',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 2],
      },
    },
    popperModifierRTL,
  ],
};

let localStorage = null;
try {
  if (window.localStorage) {
    localStorage = window.localStorage;
  }
} catch (error) {
  console.warn('Cannot save table settings to localStorage');
}

@Component({
  tag: 'fw-data-table',
  styleUrl: 'data-table.scss',
  shadow: true,
})
export class DataTable {
  /**
   * To get access to the host element
   */
  @Element() el: HTMLFwDataTableElement;

  /**
   * Label attribute is not visible on screen. There for accessibility purposes.
   */
  @Prop({ mutable: true, reflect: false }) label = '';

  /**
   * To enable bulk actions on the table.
   */
  @Prop({ mutable: false }) rowActions:
    | DataTableAction[]
    | DataTableActionWithGraphics[] = [];

  /**
   * To show row actions as a kebab menu
   */
  @Prop() showRowActionsAsMenu = false;

  /**
   * Header label for row actions column
   */
  @Prop() rowActionsHeaderLabel;

  /**
   * Standard is the default option without any graphics other option is icon which places the icon at the beginning of the row.
   * The props for the icon are passed as iconName and iconLibrary via the rowActions prop.
   */
  @Prop() rowActionsMenuVariant: 'standard' | 'icon' = 'standard';

  /**
   * Ability to add width related properties to rowActions.
   * Helps solve settings icon overlap with actions label.
   */
  @Prop() rowActionsWidthProperties: null | WidthStyles = null;

  /**
   * Rows Array of objects to be displayed in the table.
   */
  @Prop({ mutable: true, reflect: false }) rows: DataTableRow[] = [];

  /**
   * Columns Array of objects that provides information regarding the columns in the table.
   */
  @Prop({ mutable: true, reflect: false }) columns: DataTableColumn[] = [];

  /**
   * isSelectable Boolean based on which selectable options appears for rows in the table.
   */
  @Prop() isSelectable = false;

  /**
   * isAllSelectable Boolean based on which select all option appears in the table header
   */
  @Prop() isAllSelectable = false;

  /**
   * showSettings is used to show the settings button on the table.
   */
  @Prop() showSettings = false;

  /**
   * autoSaveSettings to enable auto saving of table settings to `localstorage`.
   * If set to `true`, make sure `id` attribute is also set to the `data-table`
   */
  @Prop() autoSaveSettings = false;

  /**
   * To disable table during async operations
   */
  @Prop({ mutable: true, reflect: true }) isLoading = false;

  /**
   * shimmerCount number of shimmer rows to show during initial loading
   */
  @Prop() shimmerCount = 4;

  /**
   * orderedColumns Maintains a collection of ordered columns.
   */
  @State() orderedColumns: DataTableColumn[] = [];

  /**
   * selected Array of selected row id.
   */
  @State() selected: string[] = [];

  /**
   * Collection of rows loading
   */
  @State() rowsLoading = {};

  /**
   * Temporary setting for table column drag/drop configuration
   */
  @State() columnsDragSetting = [];

  /**
   * Temporary settings for table column hide/show configuration
   */
  @State() columnsHideSetting = [];

  /**
   * isSettingsOpen when true shows table settings container.
   */
  @State() isSettingsOpen = false;

  /**
   * text to search for columns in settings.
   */
  @State() settingSearchText = '';

  /**
   * disable column hide options when only one column is visible.
   */
  @State() disabledColumnHide = false;

  /**
   * show shimmer on set to false after intial table load.
   */
  @State() showShimmer = true;

  /**
   * width of the columns is auto calculated as table width is lesser than container width.
   */
  @State() ifAutoCalculatedWidth = false;

  /**
   * fwSelectionChange Emits this event when row is selected/unselected.
   */
  @Event() fwSelectionChange: EventEmitter;

  /**
   * fwSelectAllChange Emits this event when select all is checked.
   */
  @Event() fwSelectAllChange: EventEmitter;

  /**
   * Private
   * To perform actions after a render
   * WorkAround for stencil wait for next render
   * https://github.com/ionic-team/stencil/issues/2744
   */
  renderPromiseResolve = null;

  popperInstance: Instance = null;

  settingsButton: HTMLElement = null;

  settingsUpdateButton: HTMLFwButtonElement = null;

  settingsResetButton: HTMLElement = null;

  settingsInput: HTMLFwInputElement = null;

  settingsDragContainer: HTMLFwDragContainerElement = null;

  settings: HTMLElement = null;

  tableContainer: HTMLElement = null;

  selectColumnHeader: HTMLElement = null;

  lastColumnHeader: HTMLElement = null;

  /**
   * componentWillLoad lifecycle event
   */
  componentWillLoad() {
    this.columnOrdering(this.columns);
    if (localStorage && this.autoSaveSettings) {
      const tableId = this.el.id ? `-${this.el.id}` : '';
      const tableSettings = localStorage.getItem(`fw-table${tableId}`);
      tableSettings && this.setTableSettings(JSON.parse(tableSettings));
    }
    this.rows.length && this.hideShimmer();
  }

  /**
   * componentDidLoad lifecycle event
   */
  componentDidLoad() {
    if (this.showSettings) {
      if (this.settingsButton) {
        this.settingsButton.style.height =
          this.el.shadowRoot.querySelector('thead').offsetHeight + 'px';
      }
      this.popperInstance = createPopper(
        this.settingsButton,
        this.settings,
        TABLE_POPPER_CONFIG
      );
    }
  }

  /**
   * componentDidRender lifecycle event
   */
  componentDidRender() {
    if (this.renderPromiseResolve) {
      this.renderPromiseResolve();
      this.renderPromiseResolve = null;
    }
    /**
     * Hack to override table behaviour of expanding columns when total column with lesser than container width.
     * Idea is to remove the width on the last column so that it occupies the rest of the space.
     */
    if (this.selectColumnHeader) {
      if (
        parseInt(window.getComputedStyle(this.selectColumnHeader).width) > 40 &&
        !this.ifAutoCalculatedWidth
      ) {
        this.ifAutoCalculatedWidth = true;
      }
    }
  }

  disconnectedCallback() {
    this.popperInstance?.destroy();
  }

  /**
   * keyDownHandler
   * @param event
   */
  @Listen('keydown')
  keyDownHandler(event) {
    if (event.key === 'Escape') {
      this.toggleSettings(false);
    } else {
      this.arrowNavigate(event);
    }
  }

  /**
   * showSettingsHandler
   * @param showSettings
   */
  @Watch('showSettings')
  showSettingsHandler(showSettings) {
    if (showSettings) {
      this.waitForNextRender().then(() => {
        this.settingsButton.style.height =
          this.el.shadowRoot.querySelector('thead').offsetHeight + 'px';
        if (!this.popperInstance) {
          this.popperInstance = createPopper(
            this.settingsButton,
            this.settings,
            TABLE_POPPER_CONFIG
          );
        }
      });
    }
  }

  /**
   * columnsChangeHandler
   * @param newColumns recent datatable columns value
   */
  @Watch('columns')
  async columnsChangeHandler(newColumns: DataTableColumn[]) {
    let hasStructuralChanges = false;
    const existingColumnSettings = await this.getTableSettings();
    this.columnOrdering(newColumns);
    const currentColumnSettings = await this.getTableSettings();

    // Observe for structural changes
    for (const currentColumn in currentColumnSettings) {
      if (
        Object.prototype.hasOwnProperty.call(
          currentColumnSettings,
          currentColumn
        )
      ) {
        const currentColumnSetting = currentColumnSettings[currentColumn];
        const oldColumnSetting = existingColumnSettings[currentColumn];

        if (currentColumnSetting && oldColumnSetting) {
          if (oldColumnSetting.lock !== currentColumnSetting.lock) {
            hasStructuralChanges = true;
          }
        } else {
          hasStructuralChanges = true;
        }
      }
    }

    if (!hasStructuralChanges) {
      await this.setTableSettings(existingColumnSettings);
    } else {
      if (localStorage && this.autoSaveSettings) {
        try {
          const tableId = this.el.id ? `-${this.el.id}` : null;
          if (tableId) {
            localStorage.setItem(
              `fw-table${tableId}`,
              JSON.stringify(currentColumnSettings)
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      console.warn(
        'Table structural change. Old table settings removed, saved new settings.'
      );
    }
  }

  /**
   * watchChangeHandler
   * @param newRows recent datatable columns value
   */
  @Watch('rows')
  rowsChangeHandler(newRows: DataTableRow[]) {
    newRows.length && this.hideShimmer();
  }

  @Watch('isLoading')
  loadingHandler() {
    if (this.isSettingsOpen) {
      this.toggleSettings(false);
    }
  }

  /**
   * Private
   * selectRow
   * @param rowId Id of row to select/unselect in the table
   * @param checked option to select/unselct
   * @returns currently selected rows
   */
  selectRow(rowId: string, checked = true) {
    if (checked) {
      if (this.selected.indexOf(rowId) < 0) {
        this.selected = [...this.selected, rowId];
      }
    } else {
      const selected = this.selected.filter((selected) => selected !== rowId);
      this.selected = [...selected];
    }
    this.fwSelectionChange.emit({
      rowId: rowId,
      checked: checked,
      selected: this.selected,
    });
    return this.selected;
  }

  /**
   * selectAllRows method we can use to select/unselect rows in the table
   * @param checked denotes if we want to check or uncheck the rows
   */
  @Method()
  async selectAllRows(checked = true) {
    if (checked === true) {
      let selectedRowCount = 0;
      const newlySelected = this.rows
        .filter((row: DataTableRow) => !this.selected.includes(row.id))
        .map((filteredRow) => {
          selectedRowCount = selectedRowCount + 1;
          return filteredRow.id;
        });
      this.selected = [...this.selected, ...newlySelected];
    } else {
      this.selected = [];
    }
    this.fwSelectAllChange.emit({
      checked: checked,
      selected: this.selected,
    });
    return this.selected;
  }

  /**
   * getSelectedRows
   * @returns selected rows from the data table
   */
  @Method()
  async getSelectedRows() {
    return this.rows.filter((row) => this.selected.includes(row.id));
  }

  /**
   * getSelectedIds
   * @returns an array of selected row IDs
   */
  @Method()
  async getSelectedIds() {
    return this.selected;
  }

  /**
   * getTableSettings
   * @returns columnConfig object
   */
  @Method()
  async getTableSettings() {
    const columnConfig = {};
    this.orderedColumns.map((column) => {
      if (!columnConfig[column.key]) {
        columnConfig[column.key] = {};
      }
      columnConfig[column.key].position = column.position;
      columnConfig[column.key].hide = column.hide || false;
      columnConfig[column.key].lock = column.lock || false;
    });
    return columnConfig;
  }

  /**
   * setTableSettings
   * @param columnConfig columnConfig object
   */
  @Method()
  async setTableSettings(columnConfig) {
    try {
      let orderedColumns = [...this.orderedColumns];
      for (const key in columnConfig) {
        if (Object.prototype.hasOwnProperty.call(columnConfig, key)) {
          const config = columnConfig[key];
          const modifiedOrderColumn = this.getColumnsState(
            orderedColumns,
            key,
            config
          );
          orderedColumns = modifiedOrderColumn;
        }
      }
      this.orderedColumns = [...orderedColumns];
    } catch (error) {
      console.warn('Save table settings was not applied');
    }
    return this.orderedColumns;
  }

  /**
   * loadTable - Method to call when we want to change table loading state
   * @param state to load table or not
   * @returns isLoading current state
   */
  @Method()
  async loadTable(state = true) {
    this.isLoading = state;
    return this.isLoading;
  }

  /**
   * hideShimmer
   */
  hideShimmer() {
    if (this.showShimmer) {
      this.showShimmer = false;
    }
  }

  /**
   * Private
   * getColumnsState function to call when updating a column state.
   * Updating state using this function can help update the UI easily.
   * @param state current state to modify
   * @param stateKey key that can help identify what object in state to identify
   * @param keyValuePairs key value pair to modify the object
   * @returns modifies state object
   */
  getColumnsState(state, stateKey, keyValuePairs) {
    const currentElementIndex = state.findIndex(
      (stateElement) => stateElement.key === stateKey
    );
    const currentElement = state[currentElementIndex];
    const modifiedCurrentElement = { ...currentElement, ...keyValuePairs };
    const otherElements = state.filter(
      (stateElement) => stateElement.key !== stateKey
    );
    const preElements = otherElements.slice(0, currentElementIndex);
    const postElements = otherElements.slice(
      currentElementIndex,
      otherElements.length
    );
    if (modifiedCurrentElement.position !== currentElement.position) {
      for (let index = 0; index < preElements.length; index++) {
        const preElement = preElements[index];
        if (
          preElement.position >= modifiedCurrentElement.position &&
          preElement.position <= currentElement.position
        ) {
          preElement.position = preElement.position + 1;
        }
      }
      for (let index = 0; index < postElements.length; index++) {
        const postElement = postElements[index];
        if (
          postElement.position <= modifiedCurrentElement.position &&
          postElement.position >= currentElement.position
        ) {
          postElement.position = postElement.position - 1;
        }
      }
    }
    const newStateOrder = [
      ...preElements,
      modifiedCurrentElement,
      ...postElements,
    ].sort((a, b) => a.position - b.position);
    return newStateOrder;
  }

  /**
   * Private
   * lockFocusInside lock the focus inside modal overlay
   */
  lockFocusInsideSettings() {
    const resetFocus = (event) => {
      event.stopPropagation();
      if (event.shiftKey === false && event.key === 'Tab') {
        this.settingsResetButton.focus();
      }
    };
    const updateFocus = (event) => {
      event.stopPropagation();
      if (event.shiftKey === true && event.key === 'Tab') {
        this.settingsUpdateButton.setFocus();
      }
    };
    this.settingsUpdateButton.addEventListener('keydown', resetFocus);
    this.settingsResetButton.addEventListener('keydown', updateFocus);
  }

  /**
   * Private
   * toggleSettings
   * @param isOpen opens/closes the table
   * @return isOpen current open/close state
   */
  async toggleSettings(isOpen = true) {
    await this.resetSettings();
    this.isSettingsOpen = isOpen;
    await this.waitForNextRender();
    this.popperInstance.update();
    if (isOpen) {
      this.settingsInput.setFocus();
      this.lockFocusInsideSettings();
    }
    return isOpen;
  }

  /**
   * resetSettings function to reset the temporary column state in settings using table column state.
   */
  async resetSettings() {
    this.settingSearchText = '';
    this.settingsInput.value = '';
    this.columnsDragSetting = [];
    this.columnsHideSetting = [];
    this.disabledColumnHide = false;
    const modifiedColumnsDragSettings = this.orderedColumns.map((column) => {
      const columnInfo: any = {};
      columnInfo.key = column.key;
      columnInfo.text = column.text;
      columnInfo.position = column.position;
      columnInfo.hide = column.hide || false;
      columnInfo.lock = column.lock;
      return columnInfo;
    });
    this.columnsDragSetting = modifiedColumnsDragSettings;
    const modifiedColumnsHideSettings = this.columns.map((column) => {
      const columnInfo: any = {};
      const orderedColumn = this.orderedColumns.filter(
        (orderedColumn) => orderedColumn.key === column.key
      )[0];
      columnInfo.key = column.key;
      columnInfo.text = column.text;
      columnInfo.hide = orderedColumn.hide;
      columnInfo.lock = orderedColumn.lock;
      return columnInfo;
    });
    this.columnsHideSetting = modifiedColumnsHideSettings;
  }

  /**
   * applySettings function to apply temporary column state in settings to tables column state
   */
  async applySettings() {
    this.columnsDragSetting.forEach((currentSetting) => {
      const newColumnState = this.getColumnsState(
        this.orderedColumns,
        currentSetting.key,
        {
          hide: currentSetting.hide,
          position: currentSetting.position,
        }
      );
      this.orderedColumns = [...newColumnState];
    });
    if (localStorage && this.autoSaveSettings) {
      try {
        const tableId = this.el.id ? `-${this.el.id}` : null;
        if (tableId) {
          const columnConfig = await this.getTableSettings();
          localStorage.setItem(
            `fw-table${tableId}`,
            JSON.stringify(columnConfig)
          );
        } else {
          throw new Error(
            "Table must have an 'id' attribute to autosave settings"
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    this.toggleSettings(false);
    this.ifAutoCalculatedWidth = false;
  }

  /**
   * arrowNavigation function that helps with table navigation
   * @param event event that triggers navigation inside table
   */
  arrowNavigate(event: KeyboardEvent) {
    const currentElement: HTMLElement = this.getEventPath(event)[0];
    const currentCell: HTMLElement = this.closestTableCell(
      this.getEventPath(event)
    );
    if (currentCell) {
      let cellFocusChange = false;
      // Switch focus between components inside a cell
      if (currentElement !== currentCell) {
        cellFocusChange = this.arrowNavigateCellComponents(
          event.code,
          currentElement
        );
      } else {
        cellFocusChange = true;
      }

      // Switch focus between cells
      if (cellFocusChange) {
        this.arrowNavigateCell(event.code, currentCell);
      }
    }
  }

  /**
   * arrowNavigateCellComponents Navigate between components in a cell
   * @param eventCode code for the keyboard event
   * @param currentElement current element the focus is on
   * @returns cellFocusChange boolean tells if this a navigation between cells
   */
  arrowNavigateCellComponents(eventCode, currentElement) {
    let cellFocusChange = false;
    let nextFocusElement = null;
    switch (eventCode) {
      case 'ArrowRight':
        if (currentElement.parentElement.nodeName === 'FW-TOOLTIP') {
          if (currentElement.parentElement.nextElementSibling) {
            if (
              currentElement.parentElement.nextElementSibling.children[0]?.getAttribute(
                'tabindex'
              )
            ) {
              nextFocusElement =
                currentElement.parentElement.nextElementSibling.children[0];
            }
          } else {
            cellFocusChange = true;
          }
        } else if (
          currentElement.nextElementSibling?.getAttribute('tabIndex')
        ) {
          nextFocusElement = currentElement.nextElementSibling as any;
        } else {
          cellFocusChange = true;
        }
        break;
      case 'ArrowLeft':
        if (currentElement.parentElement.nodeName === 'FW-TOOLTIP') {
          if (
            currentElement.parentElement.previousElementSibling?.getAttribute(
              'tabIndex'
            )
          ) {
            if (
              currentElement.parentElement.previousElementSibling.children[0]?.getAttribute(
                'tabindex'
              )
            ) {
              nextFocusElement =
                currentElement.parentElement.previousElementSibling.children[0];
            }
          } else {
            cellFocusChange = true;
          }
        } else if (
          currentElement.previousElementSibling?.getAttribute('tabIndex')
        ) {
          nextFocusElement = currentElement.previousElementSibling as any;
        } else {
          cellFocusChange = true;
        }
        break;
      default:
        cellFocusChange = true;
        break;
    }
    if (nextFocusElement) {
      nextFocusElement.setAttribute('tabIndex', '0');
      nextFocusElement.focus();
    }
    return cellFocusChange;
  }

  /**
   * arrowNavigateCell navigate between table cells
   * @param eventCode code for the keyboard event
   * @param currentCell current cell the focus is on
   */
  arrowNavigateCell(eventCode, currentCell) {
    let currentRowIndex: number =
      +currentCell.parentElement.getAttribute('aria-rowIndex');
    let currentColIndex: number = +currentCell.getAttribute('aria-colIndex');
    let nextRowIndex: number;
    let nextColIndex: number;
    let columnLength: number = this.orderedColumns.length;
    columnLength = this.isSelectable ? columnLength + 1 : columnLength;
    columnLength = this.rowActions.length ? columnLength + 1 : columnLength;
    switch (eventCode) {
      case 'ArrowDown':
        nextRowIndex = currentRowIndex + 1;
        nextColIndex = currentColIndex;
        break;
      case 'ArrowUp':
        nextRowIndex = currentRowIndex - 1;
        nextColIndex = currentColIndex;
        break;
      case 'ArrowRight':
        {
          const getNextCellIndex = (currentRowIndex, currentColIndex) => {
            if (currentColIndex !== columnLength) {
              nextRowIndex = currentRowIndex;
              nextColIndex = currentColIndex + 1;
            } else {
              nextRowIndex = currentRowIndex + 1;
              nextColIndex = 1;
            }
            return { nextRowIndex, nextColIndex };
          };
          let currentColumnHidden = false;
          do {
            const nextCellIndex = getNextCellIndex(
              currentRowIndex,
              currentColIndex
            );
            const currentColumn = this.tableContainer.querySelector(
              `th[aria-colIndex="${nextColIndex}"]`
            );
            currentColumnHidden = currentColumn.classList.contains('hidden');
            if (currentColumnHidden) {
              currentRowIndex = nextCellIndex.nextRowIndex;
              currentColIndex = nextCellIndex.nextColIndex;
            } else {
              nextRowIndex = nextCellIndex.nextRowIndex;
              nextColIndex = nextCellIndex.nextColIndex;
            }
          } while (currentColumnHidden); // Loop till next visible column
        }
        break;
      case 'ArrowLeft':
        {
          const getPreviousCellIndex = (currentRowIndex, currentColIndex) => {
            if (currentColIndex !== 1) {
              nextRowIndex = currentRowIndex;
              nextColIndex = currentColIndex - 1;
            } else {
              nextRowIndex = currentRowIndex - 1;
              nextColIndex = columnLength;
            }
            return { nextRowIndex, nextColIndex };
          };
          let currentColumnHidden = false;
          do {
            const previousCellIndex = getPreviousCellIndex(
              currentRowIndex,
              currentColIndex
            );
            const currentColumn = this.tableContainer.querySelector(
              `th[aria-colIndex="${nextColIndex}"]`
            );
            currentColumnHidden = currentColumn.classList.contains('hidden');
            if (currentColumnHidden) {
              currentRowIndex = previousCellIndex.nextRowIndex;
              currentColIndex = previousCellIndex.nextColIndex;
            } else {
              nextRowIndex = previousCellIndex.nextRowIndex;
              nextColIndex = previousCellIndex.nextColIndex;
            }
          } while (currentColumnHidden); // Loop till next visible column
        }
        break;
      default:
        break;
    }
    const nextCell: any = this.tableContainer.querySelector(
      `[aria-rowIndex="${nextRowIndex}"] > [aria-colIndex="${nextColIndex}"]`
    );
    if (nextCell) {
      this.removeFocusCell(currentCell);
      this.focusCell(nextCell, eventCode);
    }
  }

  /**
   * get event's path which is an array of the objects
   * event.path unsupported in safari
   */
  getEventPath(event) {
    return event.path ? event.path : event.composedPath();
  }

  /**
   * Function to check if a row action contains graphicsProps or not
   * @param action data table row action
   */
  isActionWithGraphics(
    action: DataTableAction | DataTableActionWithGraphics
  ): action is DataTableActionWithGraphics {
    if ('graphicsProps' in action) {
      return true;
    }
    return false;
  }

  /**
   * WorkAround for wait until next render in stenciljs
   * https://github.com/ionic-team/stencil/issues/2744
   */
  waitForNextRender() {
    return new Promise((resolve) => (this.renderPromiseResolve = resolve));
  }

  /**
   * Function to call when removing the focus of a table cell
   * @param cell table cell
   */
  removeFocusCell(cell: HTMLElement) {
    cell.setAttribute('tabIndex', '-1');
  }

  /**
   * Function to call when focusing a table cell
   * @param cell table cell
   * @param direction key direction when focus comes into cell
   */
  focusCell(cell: HTMLElement, direction = 'ArrowRight') {
    if (
      cell.dataset.hasFocusableChild &&
      cell.dataset.hasFocusableChild === 'true'
    ) {
      cell.removeAttribute('tabIndex');
      let childElement = null;
      switch (direction) {
        case 'ArrowLeft':
          childElement = cell.children[cell.children.length - 1];
          break;
        default:
          childElement = cell.children[0];
          break;
      }
      if (childElement.nodeName === 'FW-TOOLTIP') {
        childElement = childElement.children[0];
      }
      childElement.setAttribute('tabIndex', '0');
      childElement.focus();
    } else {
      cell.setAttribute('tabIndex', '0');
      cell.focus();
    }
  }

  /**
   * hasFocusableComponent - determines if a cell has focusable component
   * @param column column information
   * @returns {boolean} hasFocusableComponent
   */
  hasFocusableComponent(column: DataTableColumn) {
    let hasFocusableComponent = false;
    if (column.hasFocusableComponent) {
      hasFocusableComponent = true;
    } else if (
      column.variant &&
      PREDEFINED_VARIANTS_META[column.variant].isFocusable
    ) {
      hasFocusableComponent = true;
    }
    return hasFocusableComponent;
  }

  /**
   * private
   * closestTableCell Find the closest table cell from the path of the event
   * @param eventPath Event path from the emitted event
   * @returns closest table cell
   */
  closestTableCell(eventPath: any) {
    let closestCell: any;
    for (let i = 0; i < eventPath.length; i++) {
      const element = eventPath[i];
      if (element.nodeName === 'TD') {
        closestCell = element;
        break;
      }
    }
    return closestCell;
  }

  /**
   * columnOrdering Sorting columns based on position to show columns in the right order visually.
   * @param columns
   */
  columnOrdering(columns: DataTableColumn[]) {
    this.orderedColumns = [...columns].sort((column1, column2) => {
      let result = 0;
      if (column1.lock && !column2.lock) {
        result = -1;
      } else if (!column1.lock && column2.lock) {
        result = 1;
      } else if (
        (!column1.lock && !column2.lock) ||
        (column1.lock && column2.lock)
      ) {
        if (column1.position && column2.position) {
          result = column1.position - column2.position;
        } else if (column1.position && !column2.position) {
          result = -1;
        } else if (!column1.position && column2.position) {
          result = 1;
        }
      }
      return result;
    });
    // To add correct position to ordered columns array
    this.orderedColumns.map((column, index) => {
      column.position = index + 1;
    });
  }

  /**
   * performRowAction
   * @param action action object - has information related to the action to be performed
   * @param rowData rowData - complete data of the current row
   */
  async performRowAction(
    action: DataTableAction | DataTableActionWithGraphics,
    rowData: DataTableRow
  ) {
    const selectAll: any = this.el.shadowRoot.querySelector(
      'fw-checkbox#select-all'
    );
    if (selectAll && !selectAll.disabled) {
      selectAll.disabled = true;
    }
    this.rowsLoading = { ...this.rowsLoading, [rowData.id]: true };
    try {
      await action.handler(rowData);
    } catch (error) {
      console.log(error.message);
    }
    delete this.rowsLoading[rowData.id];
    this.rowsLoading = { ...this.rowsLoading };
    if (selectAll && Object.keys(this.rowsLoading).length === 0) {
      selectAll.disabled = false;
    }
  }

  /**
   * getRowActionMenuProps
   * @param rowData rowData - complete data of the current row
   * @returns props for kebab menu
   */
  getRowActionMenuProps(rowData: DataTableRow) {
    const options = [];
    let handlers;
    this.rowActions.forEach((action: DataTableActionWithGraphics) => {
      if (
        !action.hideForRowIds ||
        (action.hideForRowIds && !action.hideForRowIds.includes(rowData.id))
      ) {
        const actionId = action.name.toLowerCase();
        options.push({
          text: action.name,
          value: actionId,
          ...(action?.graphicsProps
            ? {
                graphicsProps: action.graphicsProps,
              }
            : {}),
        });
        handlers = {
          ...handlers,
          [actionId]: action,
        };
      }
    });
    return options.length
      ? {
          options,
          onFwSelect: async (event) => {
            if (event?.detail?.value) {
              await this.performRowAction(
                handlers[event.detail.value],
                rowData
              );
            }
          },
        }
      : null;
  }

  /**
   * renderKebabMenu
   * @param rowData rowData - complete data of the current row
   * @returns kebab menu component
   */
  renderKebabMenu(rowData: DataTableRow) {
    const kebabMenuProps = this.getRowActionMenuProps(rowData);
    if (kebabMenuProps) {
      return (
        <fw-kebab-menu
          variant={this.rowActionsMenuVariant}
          {...kebabMenuProps}
        ></fw-kebab-menu>
      );
    }
    return null;
  }

  /**
   * Settings search handler
   * @param searchText text to search for in columns list
   */
  settingsSearch(searchText: string) {
    this.settingSearchText = searchText.toLowerCase();
  }

  /**
   * Settings checkbox handler
   * @param columnKey table column key
   * @param checked value for checked
   * @param event event that is triggering this action
   */
  async settingsColumnToggle(columnKey: string, checked: boolean, event?: any) {
    let changePair;
    if (checked) {
      let lastCheckedPosition = 1;
      this.columnsDragSetting.forEach(
        (column, columnIndex) =>
          !column.hide && (lastCheckedPosition = columnIndex + 1)
      );
      changePair = { hide: !checked, position: lastCheckedPosition + 1 };
    } else {
      if (this.disabledColumnHide) {
        if (event) {
          event.currentTarget.checked = true;
        }
        return;
      }
      const position = this.columnsDragSetting.length;
      changePair = { hide: !checked, position: position };
    }
    const newColumnDragState = this.getColumnsState(
      this.columnsDragSetting,
      columnKey,
      changePair
    );
    const newColumnHideState = this.getColumnsState(
      this.columnsHideSetting,
      columnKey,
      { hide: !checked }
    );
    this.columnsDragSetting = [...newColumnDragState];
    this.columnsHideSetting = [...newColumnHideState];

    if (event) {
      if (
        (event.currentTarget as HTMLElement).classList.contains(
          'table-settings-drag-item-close'
        ) &&
        event.key === 'Enter'
      ) {
        const previousDragItem = (event.currentTarget as HTMLElement)
          .parentElement.previousSibling;
        const nextDragItem = (event.currentTarget as HTMLElement).parentElement
          .nextSibling;
        await this.waitForNextRender();
        if (previousDragItem || nextDragItem) {
          const focusItem = (
            (previousDragItem || nextDragItem) as HTMLElement
          ).querySelector('.table-settings-drag-item-close');
          (focusItem as HTMLElement).focus();
        } else {
          const focusItem = this.tableContainer.querySelector(
            '.table-settings-content-checkboxes div:last-child fw-checkbox'
          );
          (focusItem as HTMLElement).focus();
        }
      }
    }

    this.disabledColumnHide =
      this.columnsHideSetting.filter((column) => !column.hide).length === 1;
    return this.columnsDragSetting;
  }

  /**
   * settingsColumnDrop
   * @param columnKey table column key
   * @param droppedIndex value for position
   */
  async settingsColumnDrop(columnKey: string, droppedIndex: number) {
    const lockedColumnsLength = this.columnsDragSetting.filter(
      (column) => column.lock
    ).length;
    const newColumnState = this.getColumnsState(
      this.columnsDragSetting,
      columnKey,
      {
        position: droppedIndex + 1 + lockedColumnsLength,
      }
    );
    this.columnsDragSetting = [...newColumnState];
    return newColumnState;
  }

  /**
   * private
   * @returns {JSX.Element} returns jsx for a webcomponent
   */
  renderWebComponent(componentName: string, props: any) {
    let template: JSX.Element;
    if (window.customElements.get(componentName)) {
      const WebComponentTag = `${componentName}`;
      let slotText: JSX.Element;
      if (props.slotText) {
        slotText = props.slotText;
        delete props.slotText;
      }
      template = <WebComponentTag {...props}>{slotText}</WebComponentTag>;
    } else {
      template = null;
    }
    return template;
  }

  /**
   * private
   * @returns {JSX.Element} returns jsx for a custom HTML template
   */
  renderCustomTemplate(
    customTemplate: DataTableColumn['customTemplate'],
    cellValue: any
  ) {
    return customTemplate(h, cellValue);
  }

  /**
   * private
   * @returns {JSX.Element} returns jsx from a predefined set of components
   */
  renderPredefinedVariant(columnVariant: string, cellValue: any) {
    let template: JSX.Element;
    if (columnVariant === 'anchor') {
      template = <fw-custom-cell-anchor {...cellValue}></fw-custom-cell-anchor>;
    } else if (columnVariant === 'user') {
      template = <fw-custom-cell-user {...cellValue}></fw-custom-cell-user>;
    } else if (columnVariant === 'icon') {
      template = <fw-custom-cell-icon {...cellValue}></fw-custom-cell-icon>;
    } else if (columnVariant === 'paragraph') {
      template = (
        <fw-custom-cell-paragraph {...cellValue}></fw-custom-cell-paragraph>
      );
    } else {
      template = null;
    }
    return template;
  }

  /**
   * private
   * @returns {JSX.Element} table body cell
   */
  renderTableCell(column: DataTableColumn, cellValue: any) {
    let template: JSX.Element;
    if (column.variant) {
      template = this.renderPredefinedVariant(column.variant, cellValue);
    } else if (column.customTemplate) {
      template = this.renderCustomTemplate(column.customTemplate, cellValue);
    } else {
      template = column.formatData ? column.formatData(cellValue) : cellValue;
    }
    return template;
  }

  /**
   * private
   * @returns {JSX.Element} table header row
   */
  renderTableHeader() {
    const selectAllChecked =
      this.rows.length &&
      this.rows.every((row) => this.selected.includes(row.id));
    const visibleColumns = this.orderedColumns.filter(
      (column) => !column.hide && column.variant !== 'paragraph'
    );
    const lastVisibleColumnKey = visibleColumns[visibleColumns.length - 1]?.key;
    return this.orderedColumns.filter((column) => !column.hide).length ? (
      <tr role='row'>
        {this.orderedColumns.length && this.isSelectable && (
          <th
            ref={(el) => (this.selectColumnHeader = el)}
            key='isSelectable'
            aria-colindex={1}
            style={{ width: '40px' }}
          >
            {this.isAllSelectable && (
              <fw-checkbox
                id='select-all'
                value={'select-all'}
                checked={selectAllChecked}
                onFwChange={(event) =>
                  this.selectAllRows(event.detail?.meta?.checked)
                }
              ></fw-checkbox>
            )}
          </th>
        )}
        {this.orderedColumns.map((column, columnIndex) => {
          let textAlign = null;
          if (
            column.textAlign &&
            !(
              column.variant &&
              PREDEFINED_VARIANTS_META[column.variant].skipTextAlign
            )
          ) {
            textAlign = column.textAlign;
          }
          const headerStyles = Object.assign(
            {},
            column.widthProperties &&
              !(
                column.key === lastVisibleColumnKey &&
                this.ifAutoCalculatedWidth
              )
              ? column.widthProperties
              : {},
            textAlign ? { textAlign } : {}
          );
          const optionalAttrs: any = {};
          if (column.key === lastVisibleColumnKey) {
            optionalAttrs.ref = (el) => (this.lastColumnHeader = el);
          }
          return (
            <th
              role='columnheader'
              key={column.key}
              aria-colindex={
                this.isSelectable ? columnIndex + 2 : columnIndex + 1
              }
              class={{ hidden: column.hide }}
              style={headerStyles}
              {...optionalAttrs}
            >
              {column.customHeader
                ? this.renderCustomTemplate(column.customHeader, column.text)
                : column.text}
            </th>
          );
        })}
        {this.rowActions.length !== 0 && (
          <th
            class='row-actions'
            role='columnheader'
            aria-colindex={
              this.isSelectable
                ? this.orderedColumns.length + 2
                : this.orderedColumns.length + 1
            }
            style={this.rowActionsWidthProperties}
          >
            {!this.rowActionsHeaderLabel && this.rowActionsHeaderLabel !== ''
              ? TranslationController.t('datatable.actions')
              : this.rowActionsHeaderLabel}
          </th>
        )}
      </tr>
    ) : null;
  }

  /**
   * private
   * @returns table body rows
   */
  renderTableBody() {
    return this.orderedColumns.filter((column) => !column.hide).length
      ? this.rows.map((row, rowIndex) => {
          return (
            <tr
              key={row.id}
              role='row'
              class={{
                active: this.selected.includes(row.id),
                loading: this.rowsLoading[row.id] ? true : false,
              }}
              aria-rowindex={rowIndex + 1}
            >
              {this.orderedColumns.length && this.isSelectable && (
                <td
                  class='data-table-checkbox'
                  aria-colindex={1}
                  data-has-focusable-child='true'
                >
                  <fw-checkbox
                    value={row.id ? row.id : ''}
                    checked={this.selected.includes(row.id)}
                    onFwChange={(event) =>
                      this.selectRow(
                        event.detail.value,
                        event.detail?.meta?.checked
                      )
                    }
                  ></fw-checkbox>
                </td>
              )}
              {this.orderedColumns.map((orderedColumn, columnIndex) => {
                const attrs: any = {};
                const isFocusable = this.hasFocusableComponent(orderedColumn)
                  ? true
                  : false;
                if (!isFocusable) {
                  attrs.tabindex =
                    !this.isSelectable && rowIndex === 0 && columnIndex === 0
                      ? '0'
                      : '-2';
                }
                attrs['aria-colindex'] = this.isSelectable
                  ? columnIndex + 2
                  : columnIndex + 1;
                attrs['data-has-focusable-child'] = isFocusable
                  ? 'true'
                  : 'false';
                let textAlign = null;
                if (
                  orderedColumn.textAlign &&
                  !(
                    orderedColumn.variant &&
                    PREDEFINED_VARIANTS_META[orderedColumn.variant]
                      .skipTextAlign
                  )
                ) {
                  textAlign = orderedColumn.textAlign;
                }
                const cellStyle: any = Object.assign(
                  {},
                  textAlign ? { textAlign } : {}
                );
                return (
                  <td
                    role='gridcell'
                    class={{ hidden: orderedColumn.hide }}
                    style={cellStyle}
                    {...attrs}
                  >
                    {this.renderTableCell(
                      orderedColumn,
                      row[orderedColumn.key]
                    )}
                  </td>
                );
              })}
              {this.rowActions.length !== 0 && (
                <td
                  class='row-actions'
                  data-has-focusable-child='true'
                  aria-colindex={
                    this.isSelectable
                      ? this.orderedColumns.length + 2
                      : this.orderedColumns.length + 1
                  }
                >
                  {this.showRowActionsAsMenu
                    ? this.renderKebabMenu(row)
                    : this.rowActions.map(
                        (
                          action: DataTableAction | DataTableActionWithGraphics
                        ) => {
                          let actionTemplate = null;
                          if (
                            !action.hideForRowIds ||
                            (action.hideForRowIds &&
                              !action.hideForRowIds.includes(row.id))
                          ) {
                            const iconProps = this.isActionWithGraphics(action)
                              ? action.graphicsProps
                              : action.iconName
                              ? {
                                  name: action.iconName,
                                  library: action.iconLibrary
                                    ? action.iconLibrary
                                    : 'crayons',
                                  size: 10,
                                }
                              : null;
                            const buttonSize: 'icon-small' | 'small' = iconProps
                              ? 'icon-small'
                              : 'small';
                            actionTemplate = (
                              <fw-tooltip content={action.name} distance='5'>
                                <fw-button
                                  tabIndex={0}
                                  size={buttonSize}
                                  color='secondary'
                                  onKeyUp={(event) =>
                                    (event.code === 'Space' ||
                                      event.code === 'Enter') &&
                                    this.performRowAction(action, row)
                                  }
                                  onClick={() =>
                                    this.performRowAction(action, row)
                                  }
                                  aria-label={action.name}
                                >
                                  {iconProps ? (
                                    <fw-icon {...iconProps}></fw-icon>
                                  ) : (
                                    action.name
                                  )}
                                </fw-button>
                              </fw-tooltip>
                            );
                          }
                          return actionTemplate;
                        }
                      )}
                </td>
              )}
            </tr>
          );
        })
      : null;
  }

  /**
   * renderTableSettings
   * @returns table settings
   */
  renderTableSettings() {
    return (
      <div class='table-settings'>
        <div class='table-settings-container'>
          <button
            class='table-settings-button'
            tabIndex={0}
            ref={(el) => (this.settingsButton = el)}
            onClick={() => this.toggleSettings(!this.isSettingsOpen)}
            onKeyDown={(ev) =>
              ev.key === 'Enter' && this.toggleSettings(!this.isSettingsOpen)
            }
            disabled={this.isLoading}
          >
            <fw-icon name='settings' library='system' size={16}></fw-icon>
          </button>
          <div
            ref={(el) => (this.settings = el)}
            class={{
              'table-settings-options': true,
              'show': this.isSettingsOpen,
            }}
          >
            <div class='table-settings-header'>
              <span class='title'>
                {TranslationController.t('datatable.customizeColumns')}
              </span>
              <button
                class='reset'
                tabIndex={0}
                ref={(el) => (this.settingsResetButton = el)}
                onClick={() => {
                  this.resetSettings();
                }}
              >
                Reset
              </button>
            </div>
            <div class='table-settings-content'>
              <div class='table-settings-content-left'>
                <div class='table-settings-content-search'>
                  <fw-input
                    icon-left='search'
                    placeholder='Search'
                    ref={(el) => (this.settingsInput = el)}
                    onFwInput={(event: CustomEvent) =>
                      this.settingsSearch(event.detail.value)
                    }
                    onFwInputClear={(event: CustomEvent) =>
                      this.settingsSearch(event.detail.value)
                    }
                    clear-input
                  ></fw-input>
                </div>
                <div class='table-settings-content-choose'>
                  <div class='table-settings-content-title'>
                    {TranslationController.t('datatable.chooseColumns')}
                  </div>
                  <div class='table-settings-content-checkboxes'>
                    {this.columnsHideSetting.map((column: any) => {
                      let dragItemTemplate = null;
                      let showColumn = true;
                      if (this.settingSearchText.trim() !== '') {
                        showColumn = column.text
                          .toLowerCase()
                          .includes(this.settingSearchText);
                      }
                      if (showColumn) {
                        dragItemTemplate = (
                          <div key={column.key}>
                            <fw-checkbox
                              value={column.key}
                              onFwChange={(event) =>
                                this.settingsColumnToggle(
                                  column.key,
                                  event.detail?.meta?.checked,
                                  event
                                )
                              }
                              checked={!column.hide}
                              disabled={column.lock}
                            >
                              {column.text}
                            </fw-checkbox>
                          </div>
                        );
                      }
                      return dragItemTemplate;
                    })}
                  </div>
                </div>
              </div>
              <div class='table-settings-content-right'>
                <div class='table-settings-content-title'>
                  <span>Selected columns </span>
                  <span>
                    (
                    {
                      this.columnsDragSetting.filter((setting) => !setting.hide)
                        .length
                    }
                    )
                  </span>
                </div>
                <div class='table-settings-content-draggable'>
                  {this.columnsDragSetting
                    .filter((column) => column.lock)
                    .map((column: any) => {
                      let lockTemplate = null;
                      lockTemplate = (
                        <div
                          key={column.key}
                          class='table-settings-drag-item'
                          data-column-key={column.key}
                        >
                          <div class='table-settings-drag-item-icon non-drag'>
                            <fw-icon name='lock' size={11}></fw-icon>
                          </div>
                          <div
                            class='table-settings-drag-item-text'
                            title={column.text}
                          >
                            {column.text}
                          </div>
                        </div>
                      );
                      return lockTemplate;
                    })}
                  <fw-drag-container
                    ref={(el) => (this.settingsDragContainer = el)}
                    onFwDrop={(event: any) =>
                      this.settingsColumnDrop(
                        event.detail.droppedElement.dataset.columnKey,
                        event.detail.droppedIndex
                      )
                    }
                  >
                    {this.columnsDragSetting
                      .filter((column) => !column.lock)
                      .map((column: any) => {
                        let dragTemplate = null;
                        if (!column.hide) {
                          dragTemplate = (
                            <div
                              key={column.key}
                              class='table-settings-drag-item'
                              data-column-key={column.key}
                              draggable={true}
                            >
                              <div class='table-settings-drag-item-icon'>
                                <fw-icon
                                  library='system'
                                  name='drag'
                                  size={11}
                                ></fw-icon>
                              </div>
                              <div
                                class='table-settings-drag-item-text'
                                title={column.text}
                              >
                                {column.text}
                              </div>
                              <button
                                class='table-settings-drag-item-close'
                                tabIndex={0}
                                onKeyDown={(event) =>
                                  event.key === 'Enter' &&
                                  this.settingsColumnToggle(
                                    column.key,
                                    false,
                                    event
                                  )
                                }
                                onClick={() =>
                                  this.settingsColumnToggle(column.key, false)
                                }
                              >
                                <fw-icon
                                  library='system'
                                  name='cross-big'
                                  size={7}
                                ></fw-icon>
                              </button>
                            </div>
                          );
                        }
                        return dragTemplate;
                      })}
                  </fw-drag-container>
                </div>
              </div>
            </div>
            <div class='table-settings-footer'>
              <fw-button
                color='secondary'
                tabIndex={0}
                id='close-settings'
                onClick={() => {
                  this.resetSettings();
                  this.toggleSettings(false);
                }}
              >
                Cancel
              </fw-button>
              <fw-button
                color='primary'
                tabIndex={0}
                id='apply-settings'
                ref={(el) => (this.settingsUpdateButton = el)}
                onClick={() => this.applySettings()}
              >
                Update
              </fw-button>
            </div>
          </div>
        </div>
        {this.isSettingsOpen && (
          <div
            role='presentation'
            class='table-settings-overlay'
            onClick={() => this.toggleSettings(false)}
          ></div>
        )}
      </div>
    );
  }

  /**
   * private
   * @returns table shimmer
   */
  renderTableShimmer() {
    const shimmerTemplate = [];
    const shimmerCount = this.rows.length || this.shimmerCount;
    let columnsLength = this.orderedColumns.filter(
      (column) => !column.hide
    ).length;
    if (columnsLength) {
      columnsLength = this.isSelectable ? columnsLength + 1 : columnsLength;
      if (this.rowActions && this.rowActions.length) {
        columnsLength = columnsLength + 1;
      }
      for (let index = 1; index <= shimmerCount; index++) {
        shimmerTemplate.push(
          <tr>
            {Array(columnsLength)
              .fill(1)
              .map(() => {
                return (
                  <td>
                    <fw-skeleton height='12px'></fw-skeleton>
                  </td>
                );
              })}
          </tr>
        );
      }
    }
    return shimmerTemplate;
  }

  /**
   * render method
   */
  render() {
    return (
      <div class='fw-data-table-container'>
        <div
          class={{
            'fw-data-table-scrollable': true,
            'loading': this.isLoading || this.showShimmer,
            'shimmer': this.showShimmer,
          }}
          ref={(el) => (this.tableContainer = el)}
        >
          <table
            class={{
              'fw-data-table': true,
              'is-selectable': this.isSelectable,
            }}
            role='grid'
            aria-colcount={this.orderedColumns.length}
            aria-label={this.label}
          >
            <thead>{this.renderTableHeader()}</thead>
            <tbody>
              {this.showShimmer
                ? this.renderTableShimmer()
                : this.renderTableBody()}
            </tbody>
          </table>
        </div>
        {this.showSettings && this.renderTableSettings()}
        {(this.isLoading || this.showShimmer) && (
          <div class='fw-data-table--loading'></div>
        )}
      </div>
    );
  }
}
