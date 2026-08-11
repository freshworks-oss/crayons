import {
  Component,
  Prop,
  h,
  Host,
  Event,
  EventEmitter,
  Listen,
  Watch,
  State,
} from '@stencil/core';

/**
 * Custom Objects nested dependent field: forked tree (`fw-co-nested-node`) plus
 * panel layout when `label` is set (`field_options.dependent_select_tag` with `fw-form` /
 * `fw-form-control`). Selection / emit logic matches core `fw-nested-select`.
 *
 * `fwChange` detail: `{ name: string, value: string }` — leaf option id for this field.
 */
@Component({
  tag: 'fw-co-nested-select',
  styleUrl: 'co-nested-select.scss',
  shadow: true,
})
export class CoNestedSelect {
  private selections = [];
  private selectedItems = {};
  // Captured for the root level rather than reading live `this.value` on every render —
  // every level shares the field's own name, so `value` keeps changing as deeper levels
  // are selected, and re-feeding that into the root on every render would reset it.
  private seedValue = '';
  // True after the user changes a cascade level; used to ignore form echo of the leaf value.
  private userCascadeStarted = false;

  @State() seedVersion = 0;

  @Prop() options = [];
  @Prop() name = '';
  @Prop() label = '';
  @Prop() value = '';
  /**
   * Root-to-leaf display value at every cascade depth for a previously saved selection - only the leaf
   * value is persisted on the record, so restoring the full cascade on edit needs each level's own value,
   * not just the leaf's. Example: `['hardware', 'computer', 'mac']`.
   */
  @Prop() valuePath?: string[];
  @Prop() placeholder?: string | null;
  @Prop() optionValuePath = 'id';
  @Prop() optionLabelPath = 'value';
  @Prop() required = false;
  @Prop() state: 'normal' | 'warning' | 'error' = 'normal';
  @Prop() hintText = '';
  @Prop() warningText = '';
  @Prop() errorText = '';
  /** Initial values helper from `fw-form` / `controlProps.selectProps`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors `fw-nested-select`
  @Prop() selectProps?: any;

  /**
   * Emitted when cascade selection changes.
   * Detail: `{ name: string, value: string }` — leaf option id for this field.
   */
  @Event({ bubbles: true, composed: true }) fwChange: EventEmitter;

  componentWillLoad(): void {
    this.seedValue = this.valuePath?.[0] ?? this.value ?? '';
  }

  @Watch('valuePath')
  watchValuePathHandler(
    newPath: string[] | undefined,
    oldPath: string[] | undefined
  ): void {
    if (this.arePathsEqual(newPath, oldPath)) {
      return;
    }
    this.applyExternalSeed();
  }

  @Watch('value')
  watchValueHandler(newValue: string, oldValue: string): void {
    // Prefer valuePath when present — `value` is the persisted leaf, not the root seed.
    if (this.valuePath?.length) {
      return;
    }
    if (newValue === oldValue) {
      return;
    }
    // Form echoes the leaf back after fwChange; do not remount mid-cascade.
    if (this.userCascadeStarted && newValue === this.getLeafValue()) {
      return;
    }
    this.applyExternalSeed();
  }

  @Listen('fwChange')
  changed(event) {
    const { meta, level, name } = event.detail;

    // Own leaf emits have no `meta` — ignore so we do not recurse.
    if (!meta) {
      return;
    }

    // Cascade level events share this field's name but omit `value`. If they reach
    // `fw-form`, it overwrites the leaf we emit below with `undefined`.
    event.stopPropagation();

    this.userCascadeStarted = true;
    this.selections[level] = meta.selectedOptions[0];
    this.selectedItems[name] = level;

    const itemsToRemove = this.selections.length - (level + 1);
    if (itemsToRemove > 0) {
      this.selections = this.selections.slice(0, level + 1);
    }

    this.emitLeafValueChange();
  }

  @Listen('fwPropertyChange')
  updateSelections(event) {
    const { selectedOption, level, name } = event.detail;
    this.selections[level] = selectedOption;
    this.selectedItems[name] = level;
  }

  /** Stable id for `aria-labelledby` on the root `fw-select` when `label` is set. */
  private get rootFieldLabelDomId(): string {
    return `fw-co-nested-select-label-${this.name || 'field'}`;
  }

  private getLeafValue(): string {
    const leaf = [...this.selections].reverse().find(Boolean);
    return leaf?.[this.optionValuePath] ?? '';
  }

  private arePathsEqual(
    a: string[] | undefined,
    b: string[] | undefined
  ): boolean {
    const left = a ?? [];
    const right = b ?? [];
    if (left.length !== right.length) {
      return false;
    }
    return left.every((item, index) => item === right[index]);
  }

  private applyExternalSeed(): void {
    this.seedValue = this.valuePath?.[0] ?? this.value ?? '';
    this.selections = [];
    this.selectedItems = {};
    this.userCascadeStarted = false;
    this.seedVersion += 1;
  }

  /**
   * All cascade levels share `this.name`, so the core-style nameToExclude emit would
   * never fire. Always emit the current leaf for the outer field name.
   */
  private emitLeafValueChange(): void {
    this.fwChange.emit({
      name: this.name,
      value: this.getLeafValue(),
    });
  }

  render(): Element {
    const hasFieldLabel = !!this.label?.trim();
    const rootLabelledBy = hasFieldLabel ? this.rootFieldLabelDomId : '';

    return (
      <Host>
        <div class='field-control'>
          {hasFieldLabel ? (
            <label
              id={this.rootFieldLabelDomId}
              class={{
                'field-control-label': true,
                'required': this.required,
              }}
            >
              {this.label}
            </label>
          ) : null}
          <div class='field-control-panel'>
            <fw-co-nested-node
              key={`co-nested-seed-${this.seedVersion}`}
              options={this.options}
              name={this.name}
              value={this.seedValue}
              valuePath={this.valuePath}
              label={this.label}
              rootLabelledBy={rootLabelledBy}
              placeholder={this.placeholder}
              optionValuePath={this.optionValuePath}
              optionLabelPath={this.optionLabelPath}
              selectProps={this.selectProps}
              state={this.state}
              hintText={this.hintText}
              warningText={this.warningText}
              errorText={this.errorText}
              required={this.required}
            />
          </div>
        </div>
      </Host>
    );
  }
}
